import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DifficultyDistributionProps {
  isLoading: boolean;
}

const DifficultyDistribution: React.FC<DifficultyDistributionProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [data, setData] = useState([
    { name: 'Easy', value: 0, color: '#10B981' },
    { name: 'Medium', value: 0, color: '#F59E0B' },
    { name: 'Hard', value: 0, color: '#EF4444' }
  ]);
  
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDifficultyData = async () => {
      try {
        setIsDataLoading(true);
        
        // Manual query
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select(`
            problem_id,
            problems!inner(
              difficulty
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'solved');
        
        if (progressError) {
          throw progressError;
        }
        
        // Count problems by difficulty
        const difficultyCounts = {
          Easy: 0,
          Medium: 0,
          Hard: 0
        };
        
        progressData.forEach(item => {
          const difficulty = item.problems.difficulty;
          if (difficulty in difficultyCounts) {
            difficultyCounts[difficulty]++;
          }
        });
        
        // Map to chart data format
        const mappedData = [
          { name: 'Easy', value: difficultyCounts.Easy, color: '#10B981' },
          { name: 'Medium', value: difficultyCounts.Medium, color: '#F59E0B' },
          { name: 'Hard', value: difficultyCounts.Hard, color: '#EF4444' }
        ];
        
        setData(mappedData);
        
      } catch (err) {
        console.error('Error in fetchDifficultyData:', err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDifficultyData();
  }, [user]);

  if (isLoading || isDataLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-64 w-64 rounded-full" />
        </div>
        <div className="flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-20 h-8" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3">No solved problems yet.</p>
          <p>Start solving problems to see your difficulty distribution!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="h-64 w-full flex justify-center">
        <ResponsiveContainer width="80%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} problems`, 'Solved']}
              contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-4">
        {data.map((item, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <Badge className="mb-2" style={{ backgroundColor: item.color, color: 'white' }}>
              {item.name}
            </Badge>
            <div className="text-xl font-bold">{item.value}</div>
            <div className="text-xs text-gray-500">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-800 mb-2">Distribution Analysis</h4>
          <p className="text-sm text-blue-700">
            {data[0].value > data[1].value && data[0].value > data[2].value ? (
              'You\'re focusing on easy problems. Consider challenging yourself with more medium difficulty problems.'
            ) : data[1].value > data[0].value && data[1].value > data[2].value ? (
              'Great balance with medium difficulty problems. Keep it up!'
            ) : (
              'Impressive work on hard problems! Make sure to practice fundamentals with some easier ones too.'
            )}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DifficultyDistribution;