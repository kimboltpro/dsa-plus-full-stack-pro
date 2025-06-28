import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock, AlertCircle, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';

interface RecentActivityProps {
  activities?: any[];
  isLoading: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [], isLoading }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'attempted':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    if (!timestamp) return '';
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2 text-blue-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusText = (status: string) => {
    switch(status) {
      case 'solved': return 'Solved';
      case 'attempted': return 'Attempted';
      case 'review': return 'Marked for review';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {activities.length > 0 ? (
            activities.map((activity) => (
              <motion.div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border group hover:shadow-md transition-all cursor-pointer"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => activity.problems?.problem_url && window.open(activity.problems.problem_url, '_blank')}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.problems?.title || 'Unknown Problem'}
                      </p>
                      <Badge className={`ml-2 ${getDifficultyColor(activity.problems?.difficulty || '')}`}>
                        {activity.problems?.difficulty || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">{statusText(activity.status)}</span>
                      {activity.problems?.sheets?.name && (
                        <Badge variant="outline" className="text-xs">
                          {activity.problems.sheets.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {getTimeAgo(activity.solved_at || activity.attempted_at)}
                  </div>
                  {activity.time_complexity && (
                    <div className="text-xs text-gray-600">
                      Time: {activity.time_complexity}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="mb-1">No recent activity yet</p>
                <p className="text-sm">Start solving problems to track your progress!</p>
              </motion.div>
            </div>
          )}

          {activities.length > 0 && (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => window.location.href = '/progress-history'}
              >
                View All Activity
              </Button>
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;