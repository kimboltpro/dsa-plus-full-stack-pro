import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { 
  Trophy, 
  TrendingUp, 
  BookOpen, 
  Flame, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  Code,
  UserCircle,
  ExternalLink
} from 'lucide-react';

interface LeetCodeStats {
  id?: string;
  username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  acceptance_rate: number;
  ranking: number;
  submission_calendar?: Record<string, number>;
  last_fetched_at?: string;
}

interface CalendarDay {
  date: string;
  count: number;
}

const LeetCodeWidget: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<CalendarDay[]>([]);

  useEffect(() => {
    if (user) {
      fetchExistingStats();
    }
  }, [user]);

  // Set up realtime subscription to LeetCode stats updates
  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('leetcode_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'leetcode_stats',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('LeetCode stats updated:', payload);
            setStats(payload.new as LeetCodeStats);
            processCalendarData(payload.new.submission_calendar);
            setIsRefreshing(false);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchExistingStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('leetcode_stats')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error fetching LeetCode stats: ${error.message}`);
      }

      if (data) {
        setStats(data);
        setUsername(data.username);
        processCalendarData(data.submission_calendar);
      }
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeetCodeStats = async () => {
    if (!username.trim()) {
      toast.error('Please enter your LeetCode username');
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call the Edge Function to fetch LeetCode stats
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-leetcode-stats?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch LeetCode stats');
      }

      const result = await response.json();
      toast.success('LeetCode stats updated successfully!');
      
      // The database will be updated via the edge function
      // We'll receive the update via the realtime subscription
      
    } catch (err) {
      console.error('Error fetching LeetCode stats:', err);
      setError(err.message);
      setIsRefreshing(false);
      toast.error('Failed to fetch LeetCode stats');
    }
  };

  const processCalendarData = (calendar?: Record<string, number>) => {
    if (!calendar) {
      setRecentActivity([]);
      return;
    }

    try {
      // Convert calendar data to array of objects with date and count
      const activityData = Object.entries(calendar)
        .map(([timestamp, count]) => ({
          date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
          count: count as number,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 14); // Get last 14 days

      setRecentActivity(activityData);
    } catch (err) {
      console.error('Error processing calendar data:', err);
    }
  };

  const getLastUpdated = () => {
    if (!stats?.last_fetched_at) return 'Never';
    
    const lastFetched = new Date(stats.last_fetched_at);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastFetched.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden border-2 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">LeetCode Stats</CardTitle>
              {stats && (
                <p className="text-xs text-muted-foreground">
                  Updated: {getLastUpdated()}
                </p>
              )}
            </div>
          </div>
          
          {stats && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchLeetCodeStats} 
              disabled={isRefreshing}
              className="text-xs"
            >
              {isRefreshing ? (
                <LoadingSpinner size="sm" className="mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" text="Loading LeetCode stats..." />
          </div>
        ) : error ? (
          <div className="py-4">
            <ErrorDisplay 
              error={error} 
              onRetry={fetchExistingStats} 
              variant="card"
            />
            <div className="mt-6 border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
                Connect Your LeetCode Account
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">LeetCode Username</label>
                  <div className="flex gap-2">
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Enter your LeetCode username"
                      className="flex-1"
                    />
                    <Button 
                      onClick={fetchLeetCodeStats} 
                      disabled={isRefreshing || !username.trim()}
                    >
                      {isRefreshing ? (
                        <LoadingSpinner size="sm" className="mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Connect
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  We'll fetch and display your LeetCode stats for tracking progress.
                </p>
              </div>
            </div>
          </div>
        ) : !stats ? (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
              Connect Your LeetCode Account
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">LeetCode Username</label>
                <div className="flex gap-2">
                  <Input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Enter your LeetCode username"
                    className="flex-1"
                  />
                  <Button 
                    onClick={fetchLeetCodeStats} 
                    disabled={isRefreshing || !username.trim()}
                  >
                    {isRefreshing ? (
                      <LoadingSpinner size="sm" className="mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Connect
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                We'll fetch and display your LeetCode stats for tracking progress.
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in-50 duration-300">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Left Column - User Summary */}
              <div className="md:w-1/3">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {username.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{username}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Trophy className="w-3 h-3 mr-1 text-yellow-500" />
                        Rank: {stats.ranking?.toLocaleString() || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">Acceptance Rate</span>
                      <span className="font-medium">{stats.acceptance_rate?.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.acceptance_rate} className="h-2" />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between text-sm border-t pt-3">
                      <span className="text-gray-600">Total Solved</span>
                      <span className="font-medium">{stats.total_solved}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className={getDifficultyColor('easy')}>Easy</Badge>
                      </div>
                      <span className="font-medium">{stats.easy_solved}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className={getDifficultyColor('medium')}>Medium</Badge>
                      </div>
                      <span className="font-medium">{stats.medium_solved}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className={getDifficultyColor('hard')}>Hard</Badge>
                      </div>
                      <span className="font-medium">{stats.hard_solved}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Statistics & Activity */}
              <div className="md:w-2/3">
                <div className="bg-white rounded-lg p-4 border mb-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                    Completion Progress
                  </h3>
                  
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          Overall Completion
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {((stats.total_solved / 2500) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                      <div 
                        style={{ width: `${Math.min(100, (stats.total_solved / 2500) * 100)}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Easy</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-green-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (stats.easy_solved / 700) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{stats.easy_solved}/~700</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Medium</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-yellow-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (stats.medium_solved / 1450) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{stats.medium_solved}/~1450</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Hard</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="bg-red-500 h-full rounded-full" 
                          style={{ width: `${Math.min(100, (stats.hard_solved / 350) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1">{stats.hard_solved}/~350</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Recent Activity
                  </h3>
                  
                  {recentActivity.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div className="flex min-w-max">
                        {recentActivity.map((day) => (
                          <div key={day.date} className="text-center mx-1 w-10">
                            <div 
                              className={`h-10 rounded-md flex items-center justify-center ${
                                day.count > 0 
                                  ? day.count > 3 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-green-200 text-green-800'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {day.count > 0 ? day.count : ''}
                            </div>
                            <div className="text-xs mt-1 text-gray-500">
                              {new Date(day.date).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No recent activity data available</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      {recentActivity.filter(day => day.count > 0).length} active days in the last 14 days
                    </div>
                    <a 
                      href={`https://leetcode.com/${username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      View Profile
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeetCodeWidget;