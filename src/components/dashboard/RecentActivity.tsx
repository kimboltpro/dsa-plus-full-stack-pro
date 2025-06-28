import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface Activity {
  id: string;
  problem: {
    id: string;
    title: string;
    difficulty: string;
    sheets?: {
      name: string;
    };
  };
  status: string;
  timeAgo: string;
  solved_at?: string;
  attempted_at?: string;
}

const RecentActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            problems(
              id,
              title,
              difficulty,
              sheet_id,
              sheets(name)
            )
          `)
          .eq('user_id', user.id)
          .order('solved_at', { ascending: false, nullsLast: true })
          .order('attempted_at', { ascending: false, nullsLast: true })
          .limit(5);
        
        if (error) throw new Error(`Error fetching recent activity: ${error.message}`);
        
        const formattedActivities = data.map(activity => {
          // Calculate time ago
          const date = activity.solved_at || activity.attempted_at;
          let timeAgo = 'recently';
          
          if (date) {
            const now = new Date();
            const activityDate = new Date(date);
            const diffMs = now.getTime() - activityDate.getTime();
            const diffHrs = diffMs / (1000 * 60 * 60);
            
            if (diffHrs < 1) {
              timeAgo = `${Math.floor(diffMs / (1000 * 60))} mins ago`;
            } else if (diffHrs < 24) {
              timeAgo = `${Math.floor(diffHrs)} hours ago`;
            } else {
              timeAgo = `${Math.floor(diffHrs / 24)} days ago`;
            }
          }
          
          return {
            id: activity.id,
            problem: {
              id: activity.problems.id,
              title: activity.problems.title,
              difficulty: activity.problems.difficulty,
              sheets: activity.problems.sheets
            },
            status: activity.status,
            timeAgo,
            solved_at: activity.solved_at,
            attempted_at: activity.attempted_at
          };
        });
        
        setActivities(formattedActivities);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
    
    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('user-progress-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_progress',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, () => {
        fetchRecentActivity();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'attempted':
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading activities..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p>{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity found.</p>
            <p className="text-sm mt-2">Solve some problems to see your activity here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="font-medium text-gray-900">{activity.problem.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.problem.sheets ? activity.problem.sheets.name : 'Unassigned'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(activity.problem.difficulty)}>
                    {activity.problem.difficulty}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;