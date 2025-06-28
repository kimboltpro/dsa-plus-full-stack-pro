import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

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

  useEffect(() => {
    if (user) {
      fetchChartData();
    }
  }, [user]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch topic data
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('id, name');

      if (topicsError) {
        throw new Error(`Error fetching topics: ${topicsError.message}`);
      }

      // Fetch user progress data by problem
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'solved');

      if (progressError) {
        throw new Error(`Error fetching progress: ${progressError.message}`);
      }

      // Fetch problems to get their topics
      const { data: problems, error: problemsError } = await supabase
        .from('problems')
        .select('id, topic_id');

      if (problemsError) {
        throw new Error(`Error fetching problems: ${problemsError.message}`);
      }

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

      // Count solved problems by topic
      progress.forEach(item => {
        const problem = problems.find(p => p.id === item.problem_id);
        if (problem && problem.topic_id) {
          const topicData = topicCounts.get(problem.topic_id);
          if (topicData) {
            topicData.count += 1;
          }
        }
      });

      // Convert to array and sort by count (descending)
      const chartData = Array.from(topicCounts.values())
        .map(item => ({
          topic_id: item.id,
          topic_name: item.name,
          count: item.count
        }))
        .sort((a, b) => b.count - a.count);

      setData(chartData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(`Error fetching topic progress: ${err.message}`);
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
      <CardHeader>
        <CardTitle>Topic-wise Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading progress data..." />
          </div>
        ) : error ? (
          <ErrorDisplay 
            error={error} 
            onRetry={fetchChartData} 
            variant="card"
          />
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center flex-col">
            <p className="text-gray-500 mb-4">No problem-solving data yet</p>
            <p className="text-sm text-gray-400">
              Start solving problems to see your progress by topic
            </p>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={35}
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
                  labelFormatter={(label) => `Topic: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  name="Solved Problems"
                  radius={[4, 4, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(index)} />
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