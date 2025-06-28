import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { username?: string, full_name?: string, avatar_url?: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility function to retry failed requests
const retryRequest = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error('Max retries reached');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create or update user profile on login/signup
        if (event === 'SIGNED_IN' && session?.user) {
          createOrUpdateUserProfile(session.user);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        createOrUpdateUserProfile(session.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to create or update user profile with improved error handling
  const createOrUpdateUserProfile = async (user: User) => {
    try {
      console.log('Creating/updating user profile for:', user.id);
      
      // Update user profile with retry logic
      await retryRequest(async () => {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.user_metadata.name,
            avatar_url: user.user_metadata.avatar_url,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Profile upsert error:', error);
          throw error;
        }
      });

      console.log('Profile updated successfully');
      
      // Also ensure user_stats record exists with retry logic
      await retryRequest(async () => {
        const { error: statsError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (statsError) {
          console.error('User stats upsert error:', statsError);
          throw statsError;
        }
      });

      console.log('User stats updated successfully');
      
    } catch (error) {
      console.error('Error updating user profile:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Network error detected. Please check your internet connection and ensure you are accessing the site via HTTP (not HTTPS) for local development.');
        toast.error('Network connection error. Please check your internet connection.');
      } else {
        console.error('Database error:', error);
        toast.error('Failed to update user profile. Please try again.');
      }
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign up for:', email);
      
      const redirectUrl = `${window.location.protocol}//${window.location.host}/`;
      
      const { data, error } = await retryRequest(() => 
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        })
      );
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign up successful:', data);
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up exception:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network connection error. Please check your internet connection and try again.');
      } else {
        toast.error('An unexpected error occurred');
      }
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await retryRequest(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign in successful:', data);
        toast.success('Welcome back!');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network connection error. Please check your internet connection and try again.');
      } else {
        toast.error('An unexpected error occurred');
      }
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.protocol}//${window.location.host}/auth/callback`;
      
      const { error } = await retryRequest(() =>
        supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectUrl,
          }
        })
      );
      
      if (error) {
        console.error(`Sign in with ${provider} error:`, error);
        toast.error(error.message);
      }
    } catch (err) {
      console.error(`Sign in with ${provider} exception:`, err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network connection error. Please check your internet connection and try again.');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await retryRequest(() => supabase.auth.signOut());
      if (error) {
        console.error('Sign out error:', error);
        toast.error(error.message);
      } else {
        console.log('Sign out successful');
        toast.success('Signed out successfully');
      }
    } catch (err) {
      console.error('Sign out exception:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network connection error. Please try again.');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const updateProfile = async (data: { username?: string, full_name?: string, avatar_url?: string }) => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await retryRequest(() =>
        supabase
          .from('profiles')
          .update({
            username: data.username,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
      );

      if (!error) {
        toast.success('Profile updated successfully');
      }

      return { error };
    } catch (err) {
      console.error('Update profile error:', err);
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        toast.error('Network connection error. Please check your internet connection and try again.');
      }
      return { error: err };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};