import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Link as LinkIcon, BarChart as BarChartIcon, RefreshCw, Flame, Check, X, LoaderCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CodolioWidget = () => {
  const { user } = useAuth();
  const [codolioStats, setCodolioStats] = useState<any>(null);
  const [codolioUsername, setCodolioUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

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
      setIsEditing(false);
      
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
      }
    } catch (err: any) {
      console.error('Error fetching Codolio data:', err);
      toast.error(err.message || 'Failed to sync Codolio profile');
    } finally {
      setIsFetching(false);
    }
  };

  // Helper to format the topic data for the chart
  const formatTopicData = (topicCounts: Record<string, number> = {}) => {
    return Object.entries(topicCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Helper to format the ratings data for the chart
  const formatRatingsData = (ratingsTimeline: any[] = []) => {
    return ratingsTimeline.map((item) => ({
      date: item.date,
      rating: item.rating
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no Codolio stats yet, show connect UI
  if (!codolioStats || isEditing) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            {isEditing ? 'Update Codolio Profile' : 'Connect Codolio Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            {isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => setIsEditing(false)}
                disabled={isFetching}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 flex items-center mb-2">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              Why connect Codolio?
            </h3>
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
        </CardContent>
      </Card>
    );
  }

  // Format the data for charts
  const topicData = formatTopicData(codolioStats.topic_counts);
  const ratingsData = formatRatingsData(codolioStats.ratings_timeline);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Codolio Integration
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile summary */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-lg">{codolioStats.username}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800">
                  {codolioStats.total_solved} Problems
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 flex items-center">
                  <Flame className="w-3 h-3 mr-1" />
                  {codolioStats.streak} Streak
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Update
            </Button>
          </div>

          {/* Tabs for different charts */}
          <Tabs defaultValue="topics">
            <TabsList className="w-full mb-3">
              <TabsTrigger value="topics">
                <BarChartIcon className="w-4 h-4 mr-1" />
                Topics
              </TabsTrigger>
              <TabsTrigger value="ratings">
                <TrendingUp className="w-4 h-4 mr-1" />
                Ratings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="topics" className="space-y-2">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicData} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${value} problems`, 'Solved']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" barSize={20} radius={[0, 4, 4, 0]}>
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 15}, 80%, 55%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="ratings" className="space-y-2">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ratingsData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
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
          </Tabs>
        </motion.div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => window.open(codolioStats.profile_url, '_blank')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodolioWidget;