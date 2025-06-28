import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, CheckCircle, Clock, Flame, Brain, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsOverviewProps {
  userStats: any;
  isLoading: boolean;
}

const statsItemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      damping: 12
    } 
  }
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ userStats, isLoading }) => {
  const statsData = [
    {
      title: 'Problems Solved',
      value: userStats?.total_problems_solved || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12 this week'
    },
    {
      title: 'Current Streak',
      value: `${userStats?.current_streak || 0} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: userStats?.current_streak > 0 ? 'Keep it up!' : 'Start today!'
    },
    {
      title: 'Best Streak',
      value: `${userStats?.longest_streak || 0} days`,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: userStats?.longest_streak === userStats?.current_streak && userStats?.longest_streak > 0 ? 'On fire! 🔥' : ''
    },
    {
      title: 'Topics Mastered',
      value: '3 / 11',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Trees up next'
    },
    {
      title: 'Daily Goal',
      value: `${userStats?.daily_goal || 3} problems`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 'Adjust in settings'
    },
    {
      title: 'Time Invested',
      value: '42 hours',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+5h this week'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-16 bg-gray-200 rounded"/>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={index}
          variants={statsItemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500 overflow-hidden group">
            <CardContent className="p-6 relative">
              <div className="absolute -right-8 -top-8 w-16 h-16 rounded-full bg-blue-50 group-hover:scale-150 transition-all duration-500"></div>
              <div className="flex flex-col relative">
                <div className={`p-3 rounded-lg ${stat.bgColor} mb-3 w-fit z-10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                {stat.change && (
                  <p className="text-xs text-gray-500">
                    {stat.change}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;