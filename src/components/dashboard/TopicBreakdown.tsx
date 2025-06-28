import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopicProgress {
  name: string;
  solved: number;
  total: number;
}

interface TopicBreakdownProps {
  topicProgress: TopicProgress[];
  isLoading: boolean;
}

const TopicBreakdown: React.FC<TopicBreakdownProps> = ({ topicProgress, isLoading }) => {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Calculate percentage for each topic
  const chartData = topicProgress.map(topic => ({
    ...topic,
    percentage: Math.round((topic.solved / topic.total) * 100) || 0
  }));

  // Filter data if filter is active
  const filteredData = filter 
    ? chartData.filter(topic => topic.percentage < (filter === 'weak' ? 30 : 70)) 
    : chartData;
  
  // Sort data from highest to lowest percentage
  const sortedData = [...filteredData].sort((a, b) => b.percentage - a.percentage);
  
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 70) return '#10B981'; // green
    if (percentage >= 30) return '#3B82F6'; // blue
    return '#F59E0B'; // yellow
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-60 w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="flex-1 h-6" />
              <Skeleton className="w-12 h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topicProgress.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3">No progress data available yet.</p>
          <p>Start solving problems to see your topic breakdown!</p>
          <Button className="mt-4" onClick={() => window.location.href = '/sheets'}>
            Browse Problem Sheets
          </Button>
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
      {/* Filters */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter(null)}
          >
            All Topics
          </Button>
          <Button 
            variant={filter === 'weak' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('weak')}
            className="text-yellow-600 border-yellow-200 hover:text-yellow-700"
          >
            <Filter className="h-4 w-4 mr-1" />
            Weak Areas
          </Button>
          <Button 
            variant={filter === 'strong' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('strong')}
            className="text-green-600 border-green-200 hover:text-green-700"
          >
            <Filter className="h-4 w-4 mr-1" />
            Strong Areas
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {topicProgress.reduce((sum, topic) => sum + topic.solved, 0)} solved / {topicProgress.reduce((sum, topic) => sum + topic.total, 0)} total
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Progress']}
              labelFormatter={(value) => `${value}`}
              contentStyle={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}
            />
            <Bar dataKey="percentage" barSize={40} radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByPercentage(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-3 mt-4">
        {sortedData.map((topic) => (
          <div key={topic.name} className="flex items-center justify-between group">
            <div className="w-28 font-medium text-sm text-gray-900">{topic.name}</div>
            <div className="flex-1 mx-4">
              <Progress 
                value={topic.percentage} 
                className="h-3 group-hover:h-4 transition-all" 
                style={{ backgroundColor: '#f1f5f9' }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {topic.solved}/{topic.total}
              </Badge>
              <Badge className="text-xs" style={{ backgroundColor: getColorByPercentage(topic.percentage), color: 'white' }}>
                {topic.percentage}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopicBreakdown;