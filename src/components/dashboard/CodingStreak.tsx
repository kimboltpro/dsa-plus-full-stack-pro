import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

interface CodingStreakProps {
  userStats: any;
  isLoading: boolean;
}

const CodingStreak: React.FC<CodingStreakProps> = ({ userStats, isLoading }) => {
  const renderDayCircle = (active: boolean, current: boolean = false) => (
    <motion.div 
      className={`w-7 h-7 rounded-full flex items-center justify-center ${
        active 
          ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md' 
          : 'bg-gray-200 text-gray-400'
      } ${
        current ? 'ring-2 ring-blue-400' : ''
      }`}
      whileHover={{ scale: 1.1 }}
    >
      <Flame className={`h-4 w-4 ${active ? 'text-white' : 'text-gray-500'}`} />
    </motion.div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Get last 7 days for streak visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  // If no streak data yet, show default
  if (!userStats?.current_streak && !userStats?.longest_streak) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            Daily Coding Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2"
            >
              <Flame className="h-8 w-8 text-gray-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Streak Yet</h3>
            <p className="text-gray-600 text-sm mb-4">Solve a problem today to start your streak!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {last7Days.map((_, i) => renderDayCircle(false, i === 6))}
            </div>
            <p className="text-xs text-gray-500">
              <Calendar className="h-3 w-3 inline mr-1" />
              Keep solving problems daily to build your streak
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Flame className="h-5 w-5 mr-2 text-orange-500" />
          Daily Coding Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
          >
            <span className="text-2xl font-bold text-white">{userStats?.current_streak || 0}</span>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {userStats?.current_streak ? `${userStats.current_streak}-Day Streak` : 'No Active Streak'}
          </h3>
          <p className="text-gray-600 text-sm">
            {userStats?.longest_streak > 0 && `Longest: ${userStats.longest_streak} days`}
          </p>
        </div>

        <div className="flex justify-between space-x-1 mb-4">
          {last7Days.map((day, i) => {
            // This is a placeholder - in a real app, we would check if the user solved problems on these dates
            const isActive = i < userStats?.current_streak % 7;
            const isCurrent = i === 6; // Today is the last circle
            return (
              <div key={i} className="flex flex-col items-center">
                {renderDayCircle(isActive, isCurrent)}
                <span className="text-xs mt-1 text-gray-500">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(day).getDay()]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
          <div className="flex items-center text-orange-800 text-sm">
            <Flame className="h-4 w-4 mr-2 text-orange-500" />
            <span>
              {userStats?.current_streak > 0
                ? `Don't break your streak! Solve at least one problem today.`
                : 'Start your streak today by solving a problem!'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodingStreak;