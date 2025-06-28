import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatsOverview from './StatsOverview';
import QuickActions from './QuickActions';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import { PageLoading } from '../common/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import TopicBreakdown from './TopicBreakdown';
import LearningCalendar from './LearningCalendar';
import NextProblemSuggestion from './NextProblemSuggestion';
import CodingStreak from './CodingStreak';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface UserStats {
  total_problems_solved: number;
  current_streak: number;
  longest_streak: number;
  daily_goal: number;
  last_activity_date: string | null;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [topicProgress, setTopicProgress] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // If user is not authenticated after loading, redirect to home
    if (!loading && !user) {
      navigate('/', { replace: true });
      return;
    }

    // If user is authenticated, update the last activity date to today
    if (!loading && user) {
      updateLastActivityDate();
    }
  }, [user, loading, navigate]);

  // Function to update user's last activity date (for streak tracking)
  const updateLastActivityDate = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Get current user stats
      const { data: existingStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
        return;
      }
      
      // If this is the user's first visit or they haven't logged in today
      if (!existingStats || existingStats.last_activity_date !== today) {
        // Calculate streak
        let newStreak = 1; // Default to 1 (today)
        let longestStreak = existingStats?.longest_streak || 1;
        
        if (existingStats) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (existingStats.last_activity_date === yesterdayStr) {
            // User was active yesterday, increment streak
            newStreak = (existingStats.current_streak || 0) + 1;
          } else if (existingStats.last_activity_date !== today) {
            // User wasn't active yesterday and hasn't been active today yet, reset streak
            newStreak = 1;
          } else {
            // User was already active today, keep current streak
            newStreak = existingStats.current_streak || 1;
          }
          
          // Update longest streak if needed
          longestStreak = Math.max(longestStreak, newStreak);
        }
        
        // Update user stats
        const { error: updateError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_activity_date: today,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
          
        if (updateError) {
          console.error('Error updating user stats:', updateError);
        } else if (newStreak > 1) {
          toast.success(`🔥 You're on a ${newStreak}-day streak!`);
        }
      }
    } catch (err) {
      console.error('Error updating last activity date:', err);
    }
  };

  // Fetch user stats when component mounts
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        
        // Fetch user stats
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user stats:', error);
        }

        if (data) {
          setUserStats(data);
        } else {
          // Create default user stats if none exist
          const { data: newStats, error: createError } = await supabase
            .from('user_stats')
            .upsert({ 
              user_id: user.id,
              total_problems_solved: 0,
              current_streak: 0,
              longest_streak: 0,
              daily_goal: 3,
              last_activity_date: new Date().toISOString().split('T')[0] // Today
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user stats:', createError);
          } else {
            setUserStats(newStats);
          }
        }

        // Fetch topic progress data using RPC function
        try {
          const { data: topicData, error: topicError } = await supabase
            .rpc('get_solved_problems_by_topic', { 
              user_id_param: user.id 
            });

          if (topicError) {
            console.error('Error fetching topic progress:', topicError);
            throw topicError;
          }
          
          if (topicData) {
            setTopicProgress(topicData);
          }
        } catch (topicErr) {
          console.error('Error in topic progress RPC call:', topicErr);
          
          // Fallback: fetch topic information manually
          try {
            const { data: topics } = await supabase
              .from('topics')
              .select('id, name')
              .order('order_index');

            const { data: userProgress } = await supabase
              .from('user_progress')
              .select(`
                id,
                problem_id,
                problems!inner(
                  topic_id
                )
              `)
              .eq('user_id', user.id)
              .eq('status', 'solved');

            if (topics && userProgress) {
              // Create a map to count problems by topic
              const topicCounts = new Map();
              
              // Initialize all topics with 0 count
              topics.forEach(topic => {
                topicCounts.set(topic.id, {
                  topic_id: topic.id,
                  topic_name: topic.name,
                  count: 0
                });
              });
              
              // Count problems by topic
              userProgress.forEach(progress => {
                const topicId = progress.problems?.topic_id;
                if (topicId && topicCounts.has(topicId)) {
                  const topicData = topicCounts.get(topicId);
                  topicData.count += 1;
                }
              });
              
              // Convert map to array for the state
              setTopicProgress(Array.from(topicCounts.values()));
            }
          } catch (fallbackErr) {
            console.error('Error in fallback topic data fetch:', fallbackErr);
          }
        }
      } catch (err) {
        console.error('Error in fetchUserStats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();

    // Set up subscription for real-time updates to user_stats
    const userStatsSubscription = supabase
      .channel('user-stats-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setUserStats(payload.new as UserStats);
      })
      .subscribe();

    // Set up subscription for real-time updates to user_progress
    const progressSubscription = supabase
      .channel('user-progress-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // Refresh data when user progress changes
        fetchUserStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userStatsSubscription);
      supabase.removeChannel(progressSubscription);
    };
  }, [user]);

  if (loading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Continue your DSA mastery journey
          </p>
        </motion.div>

        <StatsOverview userStats={userStats} isLoading={statsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="progress">
              <TabsList className="mb-6">
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="topics">Topic Breakdown</TabsTrigger>
                <TabsTrigger value="activity">Activity Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="progress">
                <ProgressChart />
              </TabsContent>
              
              <TabsContent value="topics">
                <Card className="p-6">
                  <TopicBreakdown 
                    topicProgress={topicProgress.map(tp => ({
                      name: tp.topic_name,
                      solved: tp.count || 0,
                      total: 20 // This would ideally come from the database
                    }))} 
                    isLoading={statsLoading} 
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card className="p-6">
                  <LearningCalendar isLoading={statsLoading} />
                </Card>
              </TabsContent>
            </Tabs>
            
            <RecentActivity />
          </div>
          
          <div className="space-y-8">
            <CodingStreak userStats={userStats} isLoading={statsLoading} />
            <NextProblemSuggestion isLoading={statsLoading} />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;