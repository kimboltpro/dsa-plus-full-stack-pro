import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatsOverview from './StatsOverview';
import QuickActions from './QuickActions';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import LeetCodeWidget from './LeetCodeWidget';
import CodolioWidget from './CodolioWidget';
import { PageLoading } from '../common/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import DifficultyDistribution from './DifficultyDistribution';
import LearningCalendar from './LearningCalendar';
import NextProblemSuggestion from './NextProblemSuggestion';
import CodingStreak from './CodingStreak';
import TopicBreakdown from './TopicBreakdown';
import FriendsActivity from './FriendsActivity';
import { motion } from 'framer-motion';

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
    }
  }, [user, loading, navigate]);

  // Fetch user stats when component mounts
  useEffect(() => {
    if (!user) return;

    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
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
              daily_goal: 3
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user stats:', createError);
          } else {
            setUserStats(newStats);
          }
        }

        // Fetch topic progress data
        const { data: topicData, error: topicError } = await supabase
          .rpc('get_solved_problems_by_topic', { user_id_param: user.id });

        if (topicError) {
          console.error('Error fetching topic progress:', topicError);
        } else {
          setTopicProgress(topicData || []);
        }

      } catch (err) {
        console.error('Error in fetchUserStats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();

    // Set up subscription for real-time updates to user_stats
    const statsSubscription = supabase
      .channel('user_stats_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        setUserStats(payload.new as UserStats);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statsSubscription);
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
                <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
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
              
              <TabsContent value="difficulty">
                <Card className="p-6">
                  <DifficultyDistribution isLoading={statsLoading} />
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
            <LeetCodeWidget />
            <CodolioWidget />
            <CodingStreak userStats={userStats} isLoading={statsLoading} />
            <NextProblemSuggestion isLoading={statsLoading} />
            <QuickActions />
          </div>
        </div>

        <div className="mt-8">
          <FriendsActivity />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;