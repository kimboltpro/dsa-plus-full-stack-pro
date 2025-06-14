
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Map, Users, Target, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start Coding',
      description: 'Open the code playground',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/playground')
    },
    {
      title: 'Browse Sheets',
      description: 'Explore problem collections',
      icon: BookOpen,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/sheets')
    },
    {
      title: 'View Roadmap',
      description: 'Follow structured learning path',
      icon: Map,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/roadmap')
    },
    {
      title: 'Interview Prep',
      description: 'Practice interview questions',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/interview')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start p-4 h-auto"
            onClick={action.onClick}
          >
            <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-gray-500">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
