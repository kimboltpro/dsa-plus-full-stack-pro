import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Code, ExternalLink, Check, AlertCircle, BookOpen, Zap, Target, Trophy, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CodolioStats {
  id: string;
  user_id: string;
  username: string;
  profile_url?: string;
  total_solved?: number;
  streak?: number;
  topic_counts?: Record<string, number>;
  ratings_timeline?: Record<string, number>;
  platform_stats?: Record<string, any>;
  last_fetched_at?: string;
}

const CodolioWidget = () => {
  const { user } = useAuth();
  const [codolioUsername, setCodolioUsername] = useState('');
  const [codolioStats, setCodolioStats] = useState<CodolioStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const fetchCodolioStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to fetch existing stats first
      const { data: existingData, error: fetchError } = await supabase
        .from('codolio_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Error fetching Codolio stats: ${fetchError.message}`);
      }

      if (existingData) {
        setCodolioStats(existingData);
        setCodolioUsername(existingData.username);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCodolioData = async () => {
    if (!codolioUsername || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Call the Supabase Edge Function
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-codolio-stats`;
      
      // Get the user's session token for auth
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ username: codolioUsername }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching Codolio data: ${response.statusText}`);
      }

      const data = await response.json();

      // Store the data in Supabase
      const { error: upsertError } = await supabase
        .from('codolio_stats')
        .upsert({
          user_id: user.id,
          username: codolioUsername,
          profile_url: `https://codolio.com/profile/${codolioUsername}`,
          total_solved: data.totalSolved || 0,
          streak: data.streak || 0,
          topic_counts: data.topicCounts || {},
          ratings_timeline: data.ratingsTimeline || {},
          platform_stats: data.platformStats || {},
        });

      if (upsertError) {
        throw new Error(`Error saving Codolio data: ${upsertError.message}`);
      }

      // Fetch the updated data
      await fetchCodolioStats();
      
      toast.success('Codolio profile linked successfully!');
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodolioStats();

    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('codolio-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'codolio_stats',
        filter: user ? `user_id=eq.${user.id}` : undefined 
      }, (payload) => {
        setCodolioStats(payload.new as CodolioStats);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getTopicData = () => {
    if (!codolioStats?.topic_counts) return [];
    
    return Object.entries(codolioStats.topic_counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getRatingsData = () => {
    if (!codolioStats?.ratings_timeline) return [];
    
    return Object.entries(codolioStats.ratings_timeline)
      .map(([date, rating]) => ({ date, rating }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Codolio Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Please sign in to view your Codolio stats</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Codolio Integration
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSettingsOpen(!settingsOpen)}
          >
            {settingsOpen ? 'Cancel' : 'Configure'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {settingsOpen ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                Link Your Codolio Profile
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Enter your Codolio username to sync your coding stats from multiple platforms.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your Codolio username"
                  value={codolioUsername}
                  onChange={(e) => setCodolioUsername(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  onClick={fetchCodolioData} 
                  disabled={loading || !codolioUsername}
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-2">What is Codolio?</h4>
              <p className="text-xs text-gray-600 mb-2">
                Codolio is a platform that aggregates your coding stats from LeetCode, Codeforces, 
                HackerRank, and other competitive programming platforms.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs w-full" 
                onClick={() => window.open('https://codolio.com', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit Codolio
              </Button>
            </div>
          </div>
        ) : codolioStats ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">
                  {codolioStats.username}'s Profile
                </h3>
                <a 
                  href={codolioStats.profile_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  View on Codolio
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">Connected</span>
                </div>
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(codolioStats.last_fetched_at || '').toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="text-xs text-blue-700 mb-1">Total Solved</div>
                <div className="text-xl font-bold text-blue-900 flex items-center">
                  {codolioStats.total_solved || 0}
                  <BookOpen className="h-4 w-4 ml-2 text-blue-600" />
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                <div className="text-xs text-orange-700 mb-1">Current Streak</div>
                <div className="text-xl font-bold text-orange-900 flex items-center">
                  {codolioStats.streak || 0} days
                  <Zap className="h-4 w-4 ml-2 text-orange-600" />
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <div className="text-xs text-green-700 mb-1">Top Platform</div>
                <div className="text-xl font-bold text-green-900 flex items-center">
                  {Object.keys(codolioStats.platform_stats || {}).length > 0 
                    ? Object.entries(codolioStats.platform_stats || {})
                        .sort((a, b) => b[1].solved - a[1].solved)[0][0]
                    : 'N/A'}
                  <Target className="h-4 w-4 ml-2 text-green-600" />
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="text-xs text-purple-700 mb-1">Mastery Score</div>
                <div className="text-xl font-bold text-purple-900 flex items-center">
                  {Math.floor(((codolioStats.total_solved || 0) * 10) + ((codolioStats.streak || 0) * 5))}
                  <Trophy className="h-4 w-4 ml-2 text-purple-600" />
                </div>
              </div>
            </div>

            <Tabs defaultValue="topics">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="topics">Topic Breakdown</TabsTrigger>
                <TabsTrigger value="ratings">Ratings Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="topics" className="py-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getTopicData()}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center text-xs text-gray-500">
                  {getTopicData().length === 0 ? (
                    "No topic data available"
                  ) : (
                    "Problems solved by topic"
                  )}
                </div>
              </TabsContent>
              <TabsContent value="ratings" className="py-4">
                {getRatingsData().length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getRatingsData()}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="rating" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">No ratings data available</p>
                  </div>
                )}
                <div className="mt-2 text-center text-xs text-gray-500">
                  Rating progression over time
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={fetchCodolioStats}
                disabled={loading}
              >
                <Clock className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button 
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => window.open(codolioStats.profile_url, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Full Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Connect Your Codolio Profile</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Link your Codolio profile to see your coding stats from LeetCode, Codeforces, and more, all in one place.
            </p>
            <Button onClick={() => setSettingsOpen(true)}>
              Connect Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodolioWidget;