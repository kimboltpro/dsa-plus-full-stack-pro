import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { 
  Code, 
  ExternalLink, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  Search, 
  LoaderCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LeetCodeStats {
  id?: string;
  username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  ranking: number;
  acceptance_rate: number;
  submission_calendar?: Record<string, number>;
  last_fetched_at?: string;
}

const LeetCodeWidget = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchExistingStats();

    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('leetcode-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leetcode_stats',
        filter: user ? `user_id=eq.${user.id}` : undefined 
      }, (payload) => {
        // Update state when data changes
        if (payload.new) {
          setStats(payload.new as LeetCodeStats);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchExistingStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to fetch existing stats first
      const { data, error: fetchError } = await supabase
        .from('leetcode_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Error fetching LeetCode stats: ${fetchError.message}`);
      }

      if (data) {
        setStats(data);
        setUsername(data.username);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeetCodeStats = async () => {
    if (!username.trim()) {
      toast.error('Please enter a LeetCode username');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch LeetCode stats from public API
      const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch LeetCode stats: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error' || !data.totalSolved) {
        throw new Error(data.message || 'Invalid username or API error');
      }
      
      // Store in Supabase - using snake_case column names to match database schema
      const { error: upsertError } = await supabase
        .from('leetcode_stats')
        .upsert({
          user_id: user?.id,
          username: username,
          total_solved: data.totalSolved,
          easy_solved: data.easySolved,
          medium_solved: data.mediumSolved,
          hard_solved: data.hardSolved,
          ranking: data.ranking,
          acceptance_rate: data.acceptanceRate,
          submission_calendar: data.submissionCalendar || {},
          last_fetched_at: new Date().toISOString()
        });

      if (upsertError) {
        throw new Error(`Error saving LeetCode data: ${upsertError.message}`);
      }

      // Fetch the updated data
      await fetchExistingStats();
      
      toast.success('LeetCode stats synced successfully!');
      setSettingsOpen(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Failed to fetch LeetCode stats');
    } finally {
      setLoading(false);
    }
  };

  // Prepare difficulty distribution data for pie chart
  const getDifficultyData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Easy', value: stats.easy_solved, color: '#00B8A3' },
      { name: 'Medium', value: stats.medium_solved, color: '#FFC01E' },
      { name: 'Hard', value: stats.hard_solved, color: '#FF375F' }
    ];
  };
  
  // Parse submission calendar for recent activity
  const getSubmissionData = () => {
    if (!stats?.submission_calendar) return [];
    
    const calendar = stats.submission_calendar;
    return Object.entries(calendar)
      // Convert Unix timestamp (in seconds) to date
      .map(([timestamp, count]) => ({ 
        date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
        submissions: count 
      }))
      // Sort by date, most recent first
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // Take most recent 10 days
      .slice(0, 10)
      // Reverse to show oldest first
      .reverse();
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            LeetCode Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-500">Please sign in to view your LeetCode stats</p>
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
            LeetCode Stats
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
                <Search className="h-4 w-4 mr-2 text-blue-600" />
                Connect Your LeetCode Profile
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Enter your LeetCode username to sync your coding stats and track your progress.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your LeetCode username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  onClick={fetchLeetCodeStats} 
                  disabled={loading || !username.trim()}
                >
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-2">What is LeetCode?</h4>
              <p className="text-xs text-gray-600 mb-2">
                LeetCode is a platform for preparing technical coding interviews with a vast 
                library of algorithmic problems and real-world examples.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs w-full" 
                onClick={() => window.open('https://leetcode.com', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Visit LeetCode
              </Button>
            </div>
          </div>
        ) : stats ? (
          <motion.div 
            className="space-y-4" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with username and last updated */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{stats.username}'s Stats</h3>
                <a 
                  href={`https://leetcode.com/${stats.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  View on LeetCode
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-gray-700">
                  Rank: {stats.ranking.toLocaleString()}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={fetchLeetCodeStats}
                  disabled={loading}
                  className="h-8 w-8 p-0"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Total</div>
                <div className="text-xl font-bold">{stats.total_solved}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-xs text-green-600 mb-1">Easy</div>
                <div className="text-xl font-bold text-green-700">{stats.easy_solved}</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-xs text-yellow-600 mb-1">Medium</div>
                <div className="text-xl font-bold text-yellow-700">{stats.medium_solved}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-xs text-red-600 mb-1">Hard</div>
                <div className="text-xl font-bold text-red-700">{stats.hard_solved}</div>
              </div>
            </div>

            {/* Tabs for different charts */}
            <Tabs defaultValue="distribution" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="distribution">Difficulty</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              {/* Difficulty Distribution Tab */}
              <TabsContent value="distribution" className="pt-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getDifficultyData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getDifficultyData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} problems`, 'Solved']}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-center">
                  <Badge variant="outline">
                    Acceptance Rate: {stats.acceptance_rate.toFixed(1)}%
                  </Badge>
                </div>
              </TabsContent>
              
              {/* Recent Activity Tab */}
              <TabsContent value="activity" className="pt-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getSubmissionData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(date) => date.split('-').slice(1).join('-')}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} submissions`, 'Count']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                      />
                      <Bar dataKey="submissions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Recent submission activity
                </div>
              </TabsContent>
            </Tabs>

            {/* Quick stats and analysis */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <div className="flex items-center text-blue-800 mb-1">
                <Zap className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">Insights</span>
              </div>
              <p className="text-xs text-blue-700">
                {stats.hard_solved > 20 
                  ? "Impressive hard problem count! You're well-prepared for challenging interviews." 
                  : stats.medium_solved > stats.easy_solved 
                    ? "Great progress on medium difficulty problems! Try tackling more hard problems next." 
                    : "Focus on increasing your medium and hard problem count to prepare for interviews."}
              </p>
            </div>
            
            <div className="text-right text-xs text-gray-500">
              Last updated: {new Date(stats.last_fetched_at || '').toLocaleString()}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg mb-2">Connect Your LeetCode Profile</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Link your LeetCode username to track your progress and see detailed analytics.
            </p>
            <Button onClick={() => setSettingsOpen(true)}>
              Connect LeetCode
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeetCodeWidget;