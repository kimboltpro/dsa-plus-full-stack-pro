import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import StatsOverview from './StatsOverview';
import QuickActions from './QuickActions';
import ProgressChart from './ProgressChart';
import RecentActivity from './RecentActivity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, Calendar, Code, Star, Target, TrendingUp, Users, Zap, Activity, Brain, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import TopicBreakdown from './TopicBreakdown';
import LearningCalendar from './LearningCalendar';
import NextProblemSuggestion from './NextProblemSuggestion';
import CodingStreak from './CodingStreak';
import FriendsActivity from './FriendsActivity';
import DifficultyDistribution from './DifficultyDistribution';
import CodolioWidget from './CodolioWidget';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<any>(null);
  const [topicProgress, setTopicProgress] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Setup real-time subscription for user stats
  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        setIsLoadingStats(true);
        
        // Fetch user stats
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching user stats:', statsError);
          return;
        }
        
        setUserStats(stats || {
          total_problems_solved: 0,
          current_streak: 0,
          longest_streak: 0,
          daily_goal: 3
        });
        
        // Fetch topic progress
        const { data: problems, error: problemsError } = await supabase
          .from('user_progress')
          .select(`
            *,
            problems(
              id,
              title,
              difficulty,
              topic_id,
              topics(name)
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'solved');
        
        if (problemsError) {
          console.error('Error fetching solved problems:', problemsError);
        } else {
          // Process data for topic breakdown
          const topicMap = new Map();
          problems?.forEach(item => {
            const topicName = item.problems?.topics?.name;
            if (topicName) {
              if (!topicMap.has(topicName)) {
                topicMap.set(topicName, { solved: 0, total: 0 });
              }
              topicMap.get(topicName).solved += 1;
            }
          });
          
          // Fetch total problems per topic
          const { data: topicsData, error: topicsError } = await supabase
            .from('topics')
            .select(`
              name,
              problems(count)
            `);
          
          if (topicsError) {
            console.error('Error fetching topics:', topicsError);
          } else {
            topicsData?.forEach(topic => {
              if (topicMap.has(topic.name)) {
                topicMap.get(topic.name).total = topic.problems[0].count;
              }
            });
            
            const processedTopics = Array.from(topicMap.entries()).map(([name, data]) => ({
              name,
              solved: data.solved,
              total: data.total || 10 // Fallback total if no data
            }));
            
            setTopicProgress(processedTopics);
          }
        }
        
        // Fetch recent activity - Using solved_at instead of updated_at
        const { data: activity, error: activityError } = await supabase
          .from('user_progress')
          .select(`
            *,
            problems(
              id,
              title,
              difficulty,
              sheet_id,
              sheets(name)
            )
          `)
          .eq('user_id', user.id)
          .order('solved_at', { ascending: false })
          .limit(5);
        
        if (activityError) {
          console.error('Error fetching recent activity:', activityError);
        } else {
          setRecentActivity(activity || []);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchInitialData();

    // Set up real-time subscriptions
    const userStatsSubscription = supabase
      .channel('user_stats_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User stats changed:', payload);
          setUserStats(payload.new);
        }
      )
      .subscribe();
    
    const userProgressSubscription = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('User progress changed:', payload);
          // Refresh data on changes
          fetchInitialData();
        }
      )
      .subscribe();

    // Subscribe to Codolio stats changes
    const codolioStatsSubscription = supabase
      .channel('codolio_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'codolio_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Codolio stats changed:', payload);
          // You can update state here if needed
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userStatsSubscription);
      supabase.removeChannel(userProgressSubscription);
      supabase.removeChannel(codolioStatsSubscription);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-b-4 border-t-4 border-blue-600"
        ></motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-600">
                Continue your DSA mastery journey. {userStats?.daily_goal ? `Today's goal: ${userStats.daily_goal} problems` : ''}
              </p>
            </div>
            
            {/* Date and streak badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                {userStats?.current_streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-600 font-medium">
                    <Flame className="h-4 w-4" />
                    <span>{userStats.current_streak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsOverview userStats={userStats} isLoading={isLoadingStats} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            {/* Activity Tabs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Your Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="topics">
                  <TabsList className="mb-4">
                    <TabsTrigger value="topics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      By Topic
                    </TabsTrigger>
                    <TabsTrigger value="difficulty">
                      <Target className="h-4 w-4 mr-2" />
                      By Difficulty
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="topics">
                    <TopicBreakdown topicProgress={topicProgress} isLoading={isLoadingStats} />
                  </TabsContent>
                  
                  <TabsContent value="difficulty">
                    <DifficultyDistribution isLoading={isLoadingStats} />
                  </TabsContent>
                  
                  <TabsContent value="calendar">
                    <LearningCalendar isLoading={isLoadingStats} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <RecentActivity activities={recentActivity} isLoading={isLoadingStats} />
            
            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <CodingStreak userStats={userStats} isLoading={isLoadingStats} />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-600" />
                      XP & Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* XP Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Level 4 - DSA Explorer</span>
                          <span>2,345 XP</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 w-[65%]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0</span>
                          <span>Next level: 3,000 XP</span>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-100 text-blue-800">10-Day Streak</Badge>
                          <Badge className="bg-green-100 text-green-800">Array Master</Badge>
                          <Badge className="bg-purple-100 text-purple-800">50 Problems</Badge>
                          <Badge className="bg-orange-100 text-orange-800">Early Adopter</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div className="space-y-8" variants={itemVariants}>
            <QuickActions />
            
            {/* Codolio Integration */}
            <CodolioWidget />
            
            <NextProblemSuggestion isLoading={isLoadingStats} />
            <FriendsActivity isLoading={isLoadingStats} />
            
            {/* Integrations Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-600" />
                  Coding Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <img 
                    src="https://leetcode.com/static/images/LeetCode_logo.png" 
                    alt="LeetCode" 
                    className="h-4 mr-2" 
                  />
                  Connect LeetCode
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <img 
                    src="https://codeforces.org/s/57874/images/codeforces-logo-with-telegram.png" 
                    alt="Codeforces" 
                    className="h-4 mr-2" 
                  />
                  Connect Codeforces
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/codolio')}>
                  <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
                  Manage Codolio Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;