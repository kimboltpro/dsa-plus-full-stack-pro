import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Button } from '@/components/ui/button';

interface TopicProgress {
  topic_id: string;
  topic_name: string;
  count: number;
}

const ProgressChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'topics' | 'weekly'>('topics');

  useEffect(() => {
    if (user) {
      if (view === 'topics') {
        fetchTopicData();
      } else {
        fetchWeeklyData();
      }
    }
  }, [user, view]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to use the RPC function first
      try {
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_solved_problems_by_topic', { user_id_param: user?.id });
        
        if (!rpcError && rpcData) {
          setData(rpcData);
          return;
        }
      } catch (rpcErr) {
        console.error('RPC function error:', rpcErr);
      }

      // Fallback to manual query
      const { data: topics } = await supabase
        .from('topics')
        .select('id, name');

      const { data: progress } = await supabase
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'solved');

      const { data: problems } = await supabase
        .from('problems')
        .select('id, topic_id');

      if (!topics) throw new Error('Failed to fetch topics');

      // Calculate solved problems by topic
      const topicCounts = new Map<string, { id: string, name: string, count: number }>();
      
      // Initialize with all topics having 0 solved problems
      topics.forEach(topic => {
        topicCounts.set(topic.id, { 
          id: topic.id, 
          name: topic.name, 
          count: 0 
        });
      });

      // Count solved problems by topic if progress exists
      if (progress && problems) {
        progress.forEach(item => {
          const problem = problems.find(p => p.id === item.problem_id);
          if (problem && problem.topic_id) {
            const topicData = topicCounts.get(problem.topic_id);
            if (topicData) {
              topicData.count += 1;
            }
          }
        });
      }

      // Convert to array and sort by count (descending)
      const chartData = Array.from(topicCounts.values())
        .map(item => ({
          topic_id: item.id,
          topic_name: item.name,
          count: item.count
        }))
        .sort((a, b) => b.count - a.count);

      setData(chartData);
    } catch (err: any) {
      console.error('Error fetching chart data:', err);
      setError(`Failed to load progress data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the dates for the last 7 days
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      // Fetch problems solved on each date
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('solved_at')
        .eq('user_id', user?.id)
        .eq('status', 'solved');

      if (progressError) {
        throw new Error(`Error fetching progress: ${progressError.message}`);
      }

      // Count problems solved on each date
      const dailyProgress = dates.map(date => {
        const solvedCount = progress?.filter(item => 
          item.solved_at && item.solved_at.startsWith(date)
        ).length || 0;

        return {
          topic_id: date, // reuse the same data structure
          topic_name: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
          count: solvedCount
        };
      });

      setData(dailyProgress);
    } catch (err: any) {
      console.error('Error fetching weekly data:', err);
      setError(`Failed to load weekly progress: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate colors for bars
  const getBarColor = (index: number) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{view === 'topics' ? 'Topic-wise Progress' : 'Weekly Progress'}</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={view === 'topics' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('topics')}
          >
            Topics
          </Button>
          <Button 
            variant={view === 'weekly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('weekly')}
          >
            Weekly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading data..." />
          </div>
        ) : error ? (
          <ErrorDisplay 
            error={error} 
            onRetry={view === 'topics' ? fetchTopicData : fetchWeeklyData} 
            variant="card"
          />
        ) : data.length === 0 || data.every(item => item.count === 0) ? (
          <div className="h-80 flex items-center justify-center flex-col">
            <p className="text-gray-500 mb-4">No problem-solving data yet</p>
            <p className="text-sm text-gray-400">
              Start solving problems to see your progress
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={view === 'topics' ? 35 : 25}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="topic_name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                  tickMargin={20}
                  tick={{ fontSize: 12 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => [`${value} Problems`, 'Solved']}
                  labelFormatter={(label) => view === 'topics' ? `Topic: ${label}` : `Day: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Solved Problems"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(index)} 
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;