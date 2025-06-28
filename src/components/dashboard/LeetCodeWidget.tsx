import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Code, RefreshCcw, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const LeetCodeWidget = () => {
  const { user } = useAuth();
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [leetcodeStats, setLeetcodeStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchExistingStats();
    }
  }, [user]);

  const fetchExistingStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('leetcode_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        // Only set error if it's not a "no rows returned" error
        if (error.code !== 'PGRST116') {
          console.error("Error fetching LeetCode stats:", error);
          setError(`Error fetching LeetCode stats: ${error.message}`);
        }
      } else if (data) {
        console.log("Found existing LeetCode stats:", data);
        setLeetcodeStats(data);
        setLeetcodeUsername(data.username);
        setIsConnected(true);
      }
    } catch (err: any) {
      console.error("Exception fetching LeetCode stats:", err);
      setError(`Exception fetching LeetCode stats: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const connectLeetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leetcodeUsername.trim()) {
      toast.error("Please enter a LeetCode username");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user JWT
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Not authenticated. Please login again.");
        return;
      }

      // Call our Supabase Edge Function to fetch LeetCode data
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-leetcode-stats?username=${encodeURIComponent(leetcodeUsername)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch LeetCode data");
      }

      const data = await response.json();
      setLeetcodeStats(data);
      setIsConnected(true);
      toast.success("LeetCode account connected successfully!");
      
    } catch (err: any) {
      console.error("Error connecting LeetCode account:", err);
      setError(`Failed to connect LeetCode account: ${err.message}`);
      toast.error(`Failed to connect LeetCode account: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    if (!isConnected || !leetcodeUsername) {
      return;
    }

    try {
      setRefreshing(true);
      setError(null);

      // Get user JWT
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Not authenticated. Please login again.");
        return;
      }

      // Call our Supabase Edge Function to refresh LeetCode data
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-leetcode-stats?username=${encodeURIComponent(leetcodeUsername)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to refresh LeetCode data");
      }

      const data = await response.json();
      setLeetcodeStats(data);
      toast.success("LeetCode stats refreshed!");
      
    } catch (err: any) {
      console.error("Error refreshing LeetCode stats:", err);
      setError(`Failed to refresh LeetCode stats: ${err.message}`);
      toast.error(`Failed to refresh LeetCode stats: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const renderCalendar = () => {
    if (!leetcodeStats?.submission_calendar) {
      return null;
    }

    try {
      const calendar = leetcodeStats.submission_calendar;
      
      // Get recent dates (last 7 days)
      const now = new Date();
      const dates = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(Math.floor(date.getTime() / 1000));
      }
      
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
          <div className="flex space-x-1">
            {dates.map((timestamp, index) => {
              // Convert to string for object key lookup
              const timestampStr = timestamp.toString();
              const count = calendar[timestampStr] || 0;
              
              // Determine color based on activity
              let bgColor = "bg-gray-200";
              if (count > 0) {
                if (count > 5) bgColor = "bg-green-500";
                else if (count > 3) bgColor = "bg-green-400";
                else bgColor = "bg-green-300";
              }
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 ${bgColor} rounded-sm flex items-center justify-center text-xs text-white font-semibold`}
                    title={`${count} submissions on ${formatDate(timestamp)}`}
                  >
                    {count}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {["S", "M", "T", "W", "T", "F", "S"][new Date(timestamp * 1000).getDay()]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } catch (err) {
      console.error("Error rendering calendar:", err);
      return null;
    }
  };

  const getTotalProblems = () => {
    // Current rough approximation of total problems on LeetCode
    return 3000; 
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 text-blue-600 mr-2" />
          LeetCode Progress
          {isConnected && !refreshing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto" 
              onClick={refreshStats}
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          {refreshing && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading && !isConnected ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !isConnected ? (
          <form onSubmit={connectLeetCode} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Connect your LeetCode account
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="LeetCode username"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !leetcodeUsername.trim()}>
                  {loading ? "Connecting..." : "Connect"}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your LeetCode profile must be public.
              </p>
            </div>
          </form>
        ) : leetcodeStats ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{leetcodeStats.username}</h3>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="text-xs">
                    Rank: {leetcodeStats.ranking > 0 ? `#${leetcodeStats.ranking.toLocaleString()}` : 'N/A'}
                  </Badge>
                  <span className="mx-2 text-gray-300">•</span>
                  <Badge variant="outline" className="text-xs">
                    {leetcodeStats.acceptance_rate.toFixed(1)}% acceptance
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => window.open(`https://leetcode.com/${leetcodeStats.username}`, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                <span className="text-xs">Profile</span>
              </Button>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total solved</span>
                <span className="font-medium">{leetcodeStats.total_solved} / {getTotalProblems()}</span>
              </div>
              <Progress 
                value={(leetcodeStats.total_solved / getTotalProblems()) * 100} 
                className="h-2" 
              />
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="text-xs text-green-600">Easy</div>
                  <div className="font-semibold text-green-700">{leetcodeStats.easy_solved}</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <div className="text-xs text-yellow-600">Medium</div>
                  <div className="font-semibold text-yellow-700">{leetcodeStats.medium_solved}</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="text-xs text-red-600">Hard</div>
                  <div className="font-semibold text-red-700">{leetcodeStats.hard_solved}</div>
                </div>
              </div>

              {renderCalendar()}
              
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Last updated: {new Date(leetcodeStats.last_fetched_at).toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Failed to load LeetCode stats.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={fetchExistingStats}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeetCodeWidget;