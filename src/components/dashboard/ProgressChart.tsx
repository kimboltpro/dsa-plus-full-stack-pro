import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProgressChartProps {
  isLoading?: boolean;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ isLoading = false }) => {
  const { user } = useAuth();
  const [data, setData] = React.useState([
    { name: 'Arrays', solved: 12, total: 15 },
    { name: 'Strings', solved: 8, total: 12 },
    { name: 'LinkedLists', solved: 6, total: 10 },
    { name: 'Trees', solved: 4, total: 14 },
    { name: 'Graphs', solved: 2, total: 12 },
    { name: 'DP', solved: 1, total: 16 },
  ]);
  
  const [chartLoading, setChartLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const fetchChartData = async () => {
      try {
        setChartLoading(true);
        
        // Get topic progress data using the RPC function
        const { data: topicData, error: topicError } = await supabase.rpc('get_solved_problems_by_topic', {
          user_id: user.id
        });
        
        if (topicError) {
          console.error('Error fetching topic progress:', topicError);
          return;
        }
        
        if (topicData && Array.isArray(topicData)) {
          // Get total problems by topic
          const { data: topicTotals, error: totalsError } = await supabase
            .from('topics')
            .select(`
              id,
              name,
              problems:problems(count)
            `);
          
          if (totalsError) {
            console.error('Error fetching topic totals:', totalsError);
            return;
          }
          
          // Combine the data
          const mappedData = topicTotals?.map(topic => {
            const solvedCount = topicData.find(t => t.topic_id === topic.id)?.count || 0;
            return {
              name: topic.name,
              solved: Number(solvedCount),
              total: topic.problems[0].count || 0
            };
          }) || [];
          
          // Filter out topics with zero total problems and sort by total problems
          const filteredData = mappedData
            .filter(item => item.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 6); // Limit to 6 topics for better visualization
          
          setData(filteredData.length > 0 ? filteredData : data);
        }
      } catch (err) {
        console.error('Error in fetchChartData:', err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [user]);

  if (isLoading || chartLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Topic Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Topic Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, name === 'solved' ? 'Solved' : 'Total']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <Bar dataKey="solved" name="Solved" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-solved-${index}`} fill="#3b82f6" />
                ))}
              </Bar>
              <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-total-${index}`} fill="#e5e7eb" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;