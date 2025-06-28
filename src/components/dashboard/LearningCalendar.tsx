import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, ChevronLeft, ChevronRight, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface LearningCalendarProps {
  isLoading: boolean;
}

interface ActivityDay {
  date: string;
  count: number;
}

const LearningCalendar: React.FC<LearningCalendarProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streakInfo, setStreakInfo] = useState({ current: 0, longest: 0 });
  
  // Helper functions to manage dates
  const goToPreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date);
  };
  
  const goToNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date);
  };

  useEffect(() => {
    if (!user) return;

    const fetchCalendarData = async () => {
      try {
        setDataLoading(true);
        
        // Get the start and end dates for the month
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);
        
        // Format dates for Supabase query
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Query for user progress in this date range
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('solved_at')
          .eq('user_id', user.id)
          .gte('solved_at', startDateStr)
          .lte('solved_at', endDateStr);
        
        if (progressError) {
          console.error('Error fetching calendar data:', progressError);
          return;
        }
        
        // Query user stats for streak information
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Error fetching user stats:', statsError);
        } else if (statsData) {
          setStreakInfo({
            current: statsData.current_streak || 0,
            longest: statsData.longest_streak || 0
          });
        }
        
        // Process the data by day
        const activityByDay: Record<string, number> = {};
        
        progressData?.forEach(item => {
          if (item.solved_at) {
            const date = item.solved_at.split('T')[0];
            activityByDay[date] = (activityByDay[date] || 0) + 1;
          }
        });
        
        setActivityData(activityByDay);
      } catch (err) {
        console.error('Error in fetchCalendarData:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchCalendarData();
  }, [user, currentMonth]);

  if (isLoading || dataLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Generate calendar grid
  const renderCalendar = () => {
    const monthName = format(currentMonth, 'MMMM yyyy');
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth)
    });
    
    // Get the day of week of the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = getDay(startOfMonth(currentMonth));
    
    // Create days array including empty cells for proper alignment
    const calendarDays = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const activityCount = activityData[dateStr] || 0;
      const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
      
      // Determine color based on activity count
      let bgColor = 'bg-gray-50';
      if (activityCount > 0) {
        if (activityCount >= 5) bgColor = 'bg-green-500';
        else if (activityCount >= 3) bgColor = 'bg-green-400';
        else if (activityCount >= 1) bgColor = 'bg-green-300';
      }
      
      calendarDays.push(
        <motion.div 
          key={dateStr}
          whileHover={{ scale: 1.1 }}
          className={`h-10 w-10 rounded-md flex items-center justify-center ${bgColor} ${isToday ? 'ring-2 ring-blue-500' : ''} cursor-pointer relative group`}
        >
          <span className="text-sm">{date.getDate()}</span>
          {activityCount > 0 && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {activityCount} problem{activityCount > 1 ? 's' : ''} solved
            </div>
          )}
        </motion.div>
      );
    });
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{monthName}</h3>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              onClick={goToPreviousMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={goToNextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>
    );
  };

  // Calculate month statistics
  const getTotalProblemsThisMonth = () => {
    return Object.values(activityData).reduce((sum, count) => sum + count, 0);
  };
  
  const getActiveDaysCount = () => {
    return Object.keys(activityData).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {renderCalendar()}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Activity Level:</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-50 rounded"></div>
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-xs text-gray-500">
              {getTotalProblemsThisMonth()} problems solved
            </span>
          </div>
          
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center text-xs">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {getActiveDaysCount()} active days
            </Badge>
          </div>
          
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center text-xs">
              <InfoIcon className="h-3 w-3 mr-1" />
              {streakInfo.current}-day streak
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Streak info card */}
      {streakInfo.current > 0 && (
        <Card className="bg-orange-50 border-orange-200 mt-4">
          <CardContent className="p-3">
            <div className="text-sm text-orange-800">
              <p className="flex items-center font-medium">
                <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
                Your Streak Journey
              </p>
              <p className="mt-1 text-xs">
                You're on a {streakInfo.current}-day streak! Your longest streak is {streakInfo.longest} days.
                Keep coming back daily to extend your streak.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default LearningCalendar;