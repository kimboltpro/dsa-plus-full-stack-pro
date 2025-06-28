import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Flame, Calendar, Medal, Target, Zap } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

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
  
  // Calculate how many of the last 7 days are part of the streak
  const daysInStreak = Math.min(7, userStats?.current_streak || 0);
  
  // If no streak data yet, show default
  if (!userStats?.current_streak && !userStats?.longest_streak) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Flame className="h-5 w-5 mr-2 text-orange-500" />
            Daily Login Streak
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
            <p className="text-gray-600 text-sm mb-4">Keep visiting daily to build your streak!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {last7Days.map((_, i) => renderDayCircle(false, i === 6))}
            </div>
            <p className="text-xs text-gray-500">
              <Calendar className="h-3 w-3 inline mr-1" />
              Come back tomorrow to start your streak
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate streak rewards based on current streak
  const getStreakRewards = () => {
    const rewards = [];
    const streak = userStats?.current_streak || 0;
    
    if (streak >= 3) rewards.push('3-Day Badge');
    if (streak >= 7) rewards.push('7-Day Medal');
    if (streak >= 14) rewards.push('2-Week Trophy');
    if (streak >= 30) rewards.push('Monthly Champion');
    if (streak >= 100) rewards.push('Consistency Master');
    
    return rewards;
  };
  
  const streakRewards = getStreakRewards();
  const lastActivityDate = userStats?.last_activity_date ? parseISO(userStats.last_activity_date) : null;
  const isActiveToday = lastActivityDate ? isToday(lastActivityDate) : false;
  const wasActiveYesterday = lastActivityDate ? isYesterday(lastActivityDate) : false;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Flame className="h-5 w-5 mr-2 text-orange-500" />
          Daily Login Streak
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
            {userStats?.longest_streak > 0 && `Longest streak: ${userStats.longest_streak} days`}
          </p>
        </div>

        <div className="flex justify-between space-x-1 mb-4">
          {last7Days.map((day, i) => {
            // Calculate if this day is part of the streak
            // For example, if we have a 3-day streak, the last 3 circles should be active
            const isActive = i >= 7 - daysInStreak;
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

        {streakRewards.length > 0 && (
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
            <h4 className="text-sm font-medium text-amber-800 flex items-center mb-2">
              <Medal className="h-4 w-4 mr-1 text-amber-600" />
              Streak Rewards
            </h4>
            <div className="flex flex-wrap gap-2">
              {streakRewards.map((reward, index) => (
                <div 
                  key={index} 
                  className="px-2 py-1 bg-amber-100 rounded text-xs font-medium text-amber-800 flex items-center"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {reward}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
          <div className="flex items-center text-orange-800 text-sm">
            <Flame className="h-4 w-4 mr-2 text-orange-500" />
            <span>
              {isActiveToday
                ? "You're active today! Come back tomorrow to continue your streak."
                : wasActiveYesterday
                ? "You were active yesterday. Login today to continue your streak!"
                : userStats?.current_streak > 0
                ? "Don't break your streak! Visit today to maintain it."
                : "Start your streak today by solving a problem!"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodingStreak;