import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Link as LinkIcon, 
  RefreshCw, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  Calendar, 
  Flame, 
  Check, 
  LoaderCircle,
  Info,
  ExternalLink,
  Award,
  Code,
  History
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

const CodolioPage = () => {
  const { user, loading } = useAuth();
  const [codolioStats, setCodolioStats] = useState<any>(null);
  const [codolioUsername, setCodolioUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch Codolio stats when component mounts
  useEffect(() => {
    if (!user) return;

    const fetchCodolioStats = async () => {
      try {
        setIsLoading(true);
        
        // Check if user has already connected Codolio
        const { data, error } = await supabase
          .from('codolio_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching Codolio stats:', error);
        }
        
        if (data) {
          setCodolioStats(data);
          setCodolioUsername(data.username);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error in fetchCodolioStats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCodolioStats();
    
    // Set up real-time subscription for Codolio stats
    const codolioSubscription = supabase
      .channel('codolio_changes')
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
          setCodolioStats(payload.new);
          setIsConnected(true);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(codolioSubscription);
    };
  }, [user]);

  // Function to fetch Codolio data via Supabase Edge Function
  const fetchCodolioData = async () => {
    if (!codolioUsername) {
      toast.error('Please enter a Codolio username');
      return;
    }
    
    try {
      setIsFetching(true);
      
      // Get the user's JWT token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Authentication required');
        return;
      }
      
      // Call the Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-codolio-stats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: codolioUsername })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Codolio data');
      }
      
      const result = await response.json();
      
      // Success! The function handles storing the data in Supabase
      toast.success('Codolio profile synced successfully!');
      
      // Refresh data from Supabase
      const { data, error } = await supabase
        .from('codolio_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();
        
      if (error) {
        console.error('Error fetching updated Codolio stats:', error);
      } else {
        setCodolioStats(data);
        setIsConnected(true);
      }
    } catch (err: any) {
      console.error('Error fetching Codolio data:', err);
      toast.error(err.message || 'Failed to sync Codolio profile');
    } finally {
      setIsFetching(false);
    }
  };

  // Helper to format the topic data for the charts
  const formatTopicData = (topicCounts: Record<string, number> = {}) => {
    return Object.entries(topicCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Helper to format the ratings data for the chart
  const formatRatingsData = (ratingsTimeline: any[] = []) => {
    return ratingsTimeline.map((item) => ({
      date: item.date,
      rating: item.rating
    }));
  };

  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Codolio Integration
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Connect your Codolio profile to track your progress across multiple platforms and get insights on your coding journey.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-3" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        ) : !isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Connect Your Codolio Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="codolio-username" className="text-sm font-medium">
                    Codolio Username
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="codolio-username"
                      placeholder="Enter your Codolio username"
                      value={codolioUsername}
                      onChange={(e) => setCodolioUsername(e.target.value)}
                      disabled={isFetching}
                    />
                    <Button 
                      onClick={fetchCodolioData} 
                      disabled={!codolioUsername || isFetching}
                    >
                      {isFetching ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-blue-600" />
                    What is Codolio?
                  </h3>
                  <p className="text-sm text-blue-700 mb-2">
                    Codolio is a platform that aggregates your coding profiles from different platforms like LeetCode, Codeforces, HackerRank, and more, providing a unified view of your coding journey.
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 flex-shrink-0 text-blue-600" />
                      <span>Track your progress across multiple platforms</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 flex-shrink-0 text-blue-600" />
                      <span>Get insights on your strengths and weaknesses</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-1 flex-shrink-0 text-blue-600" />
                      <span>Share your progress with friends and potential employers</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://codolio.io', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Codolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile overview card */}
            <Card className="border-t-4 border-t-indigo-500 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <Award className="w-6 h-6 mr-2 text-indigo-600" />
                      {codolioStats.username}'s Codolio Profile
                    </CardTitle>
                    <p className="text-gray-500 mt-1">Last synced: {format(new Date(codolioStats.last_fetched_at), 'PPpp')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {codolioStats.total_solved} Problems
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800 flex items-center">
                      <Flame className="w-3 h-3 mr-1" />
                      {codolioStats.streak} Streak
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={fetchCodolioData}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">Sync Now</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 w-full justify-start">
                    <TabsTrigger value="overview">
                      <Code className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="topics">
                      <BarChartIcon className="h-4 w-4 mr-2" />
                      Topics
                    </TabsTrigger>
                    <TabsTrigger value="ratings">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ratings
                    </TabsTrigger>
                    <TabsTrigger value="history">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Summary stats */}
                      <Card className="md:col-span-1">
                        <CardHeader>
                          <CardTitle className="text-lg">Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <p className="text-xs text-blue-600 mb-1">Total Solved</p>
                              <p className="text-xl font-bold text-blue-800">{codolioStats.total_solved}</p>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                              <p className="text-xs text-orange-600 mb-1">Current Streak</p>
                              <p className="text-xl font-bold text-orange-800">{codolioStats.streak}</p>
                            </div>
                          </div>

                          {/* Platform breakdown */}
                          <div className="pt-2 space-y-2">
                            <h4 className="text-sm font-medium">Platforms</h4>
                            {codolioStats.platform_stats && Object.entries(codolioStats.platform_stats).map(([platform, stats]: [string, any]) => (
                              <div key={platform} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium capitalize">{platform}</span>
                                <div className="text-right">
                                  <span className="text-sm">{stats.solved || stats.rating || '-'} {stats.solved ? 'solved' : (stats.rating ? 'rating' : '')}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Topic distribution */}
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-lg">Topic Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={formatTopicData(codolioStats.topic_counts)}
                                  dataKey="count"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {formatTopicData(codolioStats.topic_counts).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [`${value} problems`, 'Solved']}
                                  contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="topics">
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={formatTopicData(codolioStats.topic_counts)} 
                          layout="vertical" 
                          margin={{ top: 10, right: 30, bottom: 10, left: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            width={80}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value} problems`, 'Solved']}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                          />
                          <Bar dataKey="count" barSize={20} radius={[0, 4, 4, 0]}>
                            {formatTopicData(codolioStats.topic_counts).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="ratings">
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={formatRatingsData(codolioStats.ratings_timeline)}
                          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`${value}`, 'Rating']}
                            contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#8884d8" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="space-y-4">
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h3 className="font-medium text-indigo-800 mb-2">History Insights</h3>
                        <p className="text-sm text-indigo-700">
                          Your coding journey shows consistent improvement over time. 
                          You've been most active in solving Array and String problems.
                          Consider focusing more on Graph and Dynamic Programming to round out your skills.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Recent Achievements</h4>
                        <div className="space-y-2">
                          {[
                            { title: 'Reached 1500+ rating', date: '2 weeks ago' },
                            { title: 'Solved 100+ problems', date: '1 month ago' },
                            { title: 'Achieved 20+ day streak', date: '2 months ago' }
                          ].map((achievement, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                              <div className="flex items-center">
                                <Award className="w-5 h-5 text-yellow-500 mr-2" />
                                <span className="font-medium">{achievement.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">{achievement.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open(codolioStats.profile_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Codolio Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default CodolioPage;