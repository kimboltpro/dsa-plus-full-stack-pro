
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const RecentActivity = () => {
  // Sample data - in real app, this would come from the database
  const activities = [
    {
      id: 1,
      problem: 'Two Sum',
      difficulty: 'Easy',
      status: 'solved',
      timeAgo: '2 hours ago',
      sheet: 'TUF Sheet'
    },
    {
      id: 2,
      problem: 'Valid Parentheses',
      difficulty: 'Easy',
      status: 'attempted',
      timeAgo: '5 hours ago',
      sheet: 'Striver Sheet'
    },
    {
      id: 3,
      problem: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      status: 'solved',
      timeAgo: '1 day ago',
      sheet: 'Love Babbar 450'
    },
    {
      id: 4,
      problem: 'Binary Tree Inorder Traversal',
      difficulty: 'Medium',
      status: 'attempted',
      timeAgo: '2 days ago',
      sheet: 'TUF Sheet'
    }
  ];

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
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="font-medium text-gray-900">{activity.problem}</p>
                  <p className="text-sm text-gray-500">{activity.sheet}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(activity.difficulty)}>
                  {activity.difficulty}
                </Badge>
                <span className="text-sm text-gray-500">{activity.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
