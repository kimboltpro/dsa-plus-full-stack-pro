import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, BookOpen, Map, Users, Target, Play, Timer, BookMarked, BarChart3, Brain, Puzzle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Practice Now',
      description: 'Random problem matching your level',
      icon: Play,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/playground'),
      tooltip: 'Get a random problem matching your skill level'
    },
    {
      title: 'Problem Sheets',
      description: 'Browse curated problem collections',
      icon: BookOpen,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/sheets'),
      tooltip: 'Access TUF, Striver, Love Babbar 450 sheets and more'
    },
    {
      title: 'Roadmap',
      description: 'Follow structured learning path',
      icon: Map,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/roadmap'),
      tooltip: 'Follow our step-by-step DSA mastery roadmap'
    },
    {
      title: 'Pomodoro Timer',
      description: 'Focus sessions with breaks',
      icon: Timer,
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => navigate('/timer'),
      tooltip: 'Use the Pomodoro technique for focused practice'
    },
    {
      title: 'Bookmarked',
      description: 'Your saved problems',
      icon: BookMarked,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => navigate('/bookmarks'),
      tooltip: 'Access your bookmarked problems'
    },
    {
      title: 'Mock Interview',
      description: 'Timed interview simulation',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/mock-interview'),
      tooltip: 'Practice with company-specific mock interviews'
    },
    {
      title: 'Interactive Puzzles',
      description: 'Fun algorithmic challenges',
      icon: Puzzle,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/puzzles'),
      tooltip: 'Solve fun algorithmic puzzles'
    },
    {
      title: 'AI Assistant',
      description: 'Get hints and explanations',
      icon: Brain,
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => navigate('/assistant'),
      tooltip: 'AI-powered hints and problem explanations'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <TooltipProvider>
          <div className="grid grid-cols-2 gap-3">
            {actions.slice(0, 6).map((action, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start p-4 h-auto transition-all hover:shadow-md"
                      onClick={action.onClick}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${action.color} text-white`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>

        {/* More actions in a horizontal scroll for mobile */}
        <div className="pt-1">
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide -mx-1 px-1">
            {actions.slice(6).map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 6) * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="flex-shrink-0"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-shrink-0 justify-start py-2 px-3 h-auto hover:shadow-md"
                        onClick={action.onClick}
                      >
                        <div className={`p-1.5 rounded-md mr-2 ${action.color} text-white`}>
                          <action.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="text-sm font-medium">{action.title}</div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;