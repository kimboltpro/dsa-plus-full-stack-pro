import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Map, Users, Play, Calendar, Book, Bookmark, Rocket, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Practice Now',
      description: 'Random problem match',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/playground')
    },
    {
      title: 'Problem Sheets',
      description: 'Browse curated problem collections',
      icon: BookOpen,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/sheets')
    },
    {
      title: 'Roadmap',
      description: 'Follow structured learning path',
      icon: Map,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/roadmap')
    },
    {
      title: 'Mock Interview',
      description: 'Timed interview simulation',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/interview')
    },
    {
      title: 'Bookmarked',
      description: 'Your saved problems',
      icon: Bookmark,
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => navigate('/bookmarks')
    },
    {
      title: 'Full Stack',
      description: 'Explore web dev resources',
      icon: Rocket,
      color: 'bg-teal-500 hover:bg-teal-600',
      onClick: () => navigate('/fullstack')
    }
  ];

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center text-lg">
          <Book className="h-5 w-5 mr-2 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button
              key={`action-${index}`}
              variant="outline"
              className="w-full justify-start p-3 h-auto border hover:bg-gray-50 transition-colors"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg mr-3 text-white ${action.color}`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;