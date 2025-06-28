import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface LearningCalendarProps {
  isLoading: boolean;
}

interface ActivityDay {
  date: string;
  count: number;
}

const LearningCalendar: React.FC<LearningCalendarProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month function
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  useEffect(() => {
    if (!user) return;

    const fetchCalendarData = async () => {
      try {
        setDataLoading(true);
        
        // Get the start and end dates for the month
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        // Format dates for Supabase query
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Query for user progress in this date range
        const { data, error } = await supabase
          .from('user_progress')
          .select('solved_at, attempted_at')
          .eq('user_id', user.id)
          .gte('solved_at', startDateStr)
          .lte('solved_at', endDateStr);
        
        if (error) {
          console.error('Error fetching calendar data:', error);
          return;
        }
        
        // Process the data by day
        const activityByDay: Record<string, number> = {};
        
        data?.forEach(item => {
          if (item.solved_at) {
            const date = item.solved_at.split('T')[0];
            activityByDay[date] = (activityByDay[date] || 0) + 1;
          }
        });
        
        // Convert to array format
        const formattedData = Object.entries(activityByDay).map(([date, count]) => ({
          date,
          count
        }));
        
        setActivityData(formattedData);
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
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    
    // Create days array including empty cells for proper alignment
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const activity = activityData.find(d => d.date === dateStr);
      const problemCount = activity?.count || 0;
      
      let bgColor = 'bg-gray-50';
      if (problemCount > 0) {
        if (problemCount >= 5) bgColor = 'bg-green-500';
        else if (problemCount >= 3) bgColor = 'bg-green-400';
        else if (problemCount >= 1) bgColor = 'bg-green-300';
      }
      
      // Check if this is today
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      
      days.push(
        <motion.div 
          key={day}
          whileHover={{ scale: 1.1 }}
          className={`h-10 w-10 rounded-md flex items-center justify-center ${bgColor} ${isToday ? 'ring-2 ring-blue-500' : ''} cursor-pointer relative group`}
        >
          <span className="text-sm">{day}</span>
          {problemCount > 0 && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {problemCount} problem{problemCount > 1 ? 's' : ''} solved
            </div>
          )}
        </motion.div>
      );
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{monthName} {year}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
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
          {days}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {renderCalendar()}
      
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Activity Level:</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-50 rounded"></div>
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <div className="w-4 h-4 bg-green-500 rounded"></div>
          </div>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-xs text-gray-500">
            {activityData.reduce((sum, day) => sum + day.count, 0)} problems solved this month
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningCalendar;