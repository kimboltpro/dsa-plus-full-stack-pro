
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Code, Zap, Target, Github } from 'lucide-react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, Engine } from '@tsparticles/engine';
import CodingTerminal from './CodingTerminal';

const AuthPage = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (user && !loading) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    console.log('Sign in form submitted');
    setIsSubmitting(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      console.log('Sign in successful, navigating to dashboard');
      navigate('/dashboard', { replace: true });
    }
    
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    console.log('Sign up form submitted');
    setIsSubmitting(true);
    
    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      console.log('Sign up successful');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: ["#00ff88", "#0088ff", "#ff0088", "#ffff00"],
            },
            links: {
              color: "#00ff88",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Live Coding Terminal Background */}
      <CodingTerminal />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Code className="h-10 w-10 text-cyan-400 mr-2 drop-shadow-lg" />
                <div className="absolute inset-0 h-10 w-10 bg-cyan-400 blur-lg opacity-50 mr-2"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                DSA Mastery Hub
              </h1>
            </div>
            <p className="text-cyan-200 text-lg font-medium">Master DSA with structured learning</p>
          </div>

          {/* Glassmorphism Card */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-cyan-500/10 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-cyan-200">
                  Sign in to unlock your coding potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10">
                    <TabsTrigger 
                      value="signin" 
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-white/70"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup"
                      className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-white/70"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-cyan-200 font-medium">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-cyan-200 font-medium">Password</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-cyan-200 font-medium">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-cyan-200 font-medium">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-cyan-200 font-medium">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/50 backdrop-blur-sm"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Social Login Buttons */}
                <div className="mt-6 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/60">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/20 to-gray-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Github className="mr-2 h-4 w-4" />
                    Continue with GitHub
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/20 to-orange-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Code className="mr-2 h-4 w-4" />
                    Continue with LeetCode
                  </Button>
                </div>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center group cursor-pointer">
                      <div className="relative">
                        <Target className="h-6 w-6 text-cyan-400 mb-2 transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 h-6 w-6 bg-cyan-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs text-cyan-200 group-hover:text-cyan-100 transition-colors">Track Progress</span>
                    </div>
                    <div className="flex flex-col items-center group cursor-pointer">
                      <div className="relative">
                        <Code className="h-6 w-6 text-green-400 mb-2 transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 h-6 w-6 bg-green-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs text-green-200 group-hover:text-green-100 transition-colors">Code Practice</span>
                    </div>
                    <div className="flex flex-col items-center group cursor-pointer">
                      <div className="relative">
                        <Zap className="h-6 w-6 text-purple-400 mb-2 transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 h-6 w-6 bg-purple-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs text-purple-200 group-hover:text-purple-100 transition-colors">Fast Learning</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
