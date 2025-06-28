import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Map, Users, Target, Play, Calendar, Book, Bookmark, Rocket, Brain, Trophy } from 'lucide-react';
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
      title: 'Pomodoro Timer',
      description: 'Focus sessions with breaks',
      icon: Calendar,
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => window.open('https://pomofocus.io/', '_blank')
    },
    {
      title: 'Full Stack',
      description: 'Explore web dev resources',
      icon: Rocket,
      color: 'bg-teal-500 hover:bg-teal-600',
      onClick: () => navigate('/fullstack')
    },
    {
      title: 'AI Assistant',
      description: 'Get help with problems',
      icon: Brain,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/pro')
    }
  ];

  return (
    <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center text-lg">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
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
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center text-blue-800">
            <Trophy className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium">Daily Challenge</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Complete today's challenge to maintain your streak!
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-100"
            onClick={() => window.open('https://leetcode.com/problemset/all/', '_blank')}
          >
            <Play className="h-3 w-3 mr-1" />
            View Challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;