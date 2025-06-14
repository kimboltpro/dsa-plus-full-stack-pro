
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, Book, Code, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Topic {
  id: string;
  name: string;
  description: string;
  order_index: number;
}

const RoadmapPage = () => {
  const { user, loading } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error fetching topics:', error);
          return;
        }

        setTopics(data || []);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getTopicProgress = (topicName: string) => {
    // Mock progress data - in real app, this would come from user progress
    const progressMap: { [key: string]: number } = {
      'Basics': 80,
      'Arrays': 60,
      'Strings': 40,
      'Linked Lists': 30,
      'Stacks & Queues': 20,
      'Trees': 10,
      'Graphs': 5,
      'Dynamic Programming': 0,
      'Greedy Algorithms': 0,
      'Backtracking': 0,
      'Advanced Topics': 0
    };
    return progressMap[topicName] || 0;
  };

  const getTopicIcon = (topicName: string, progress: number) => {
    if (progress >= 80) {
      return <CheckCircle className="h-6 w-6 text-green-600" />;
    } else if (progress > 0) {
      return <Circle className="h-6 w-6 text-blue-600 fill-blue-100" />;
    } else {
      return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            DSA Learning Roadmap
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow this structured path to master Data Structures and Algorithms. 
            Each topic builds upon the previous ones for optimal learning.
          </p>
        </div>

        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <Badge variant="outline">25% Complete</Badge>
              </div>
              <Progress value={25} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>3 of 11 topics mastered</span>
                <span>Keep going! 🚀</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {topicsLoading ? (
          <div className="space-y-4">
            {[...Array(11)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic, index) => {
              const progress = getTopicProgress(topic.name);
              const isCompleted = progress >= 80;
              const isInProgress = progress > 0 && progress < 80;
              const isLocked = index > 0 && getTopicProgress(topics[index - 1].name) < 50;

              return (
                <Card 
                  key={topic.id} 
                  className={`hover:shadow-lg transition-all ${
                    isCompleted ? 'border-green-200 bg-green-50' : 
                    isInProgress ? 'border-blue-200 bg-blue-50' : 
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTopicIcon(topic.name, progress)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {topic.order_index}. {topic.name}
                            </h3>
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-800">
                                Mastered
                              </Badge>
                            )}
                            {isInProgress && (
                              <Badge className="bg-blue-100 text-blue-800">
                                In Progress
                              </Badge>
                            )}
                            {isLocked && (
                              <Badge variant="outline">
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {topic.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <Progress 
                                value={progress} 
                                className={`h-2 ${getProgressColor(progress)}`}
                              />
                            </div>
                            <span className="text-sm text-gray-500 min-w-[3rem]">
                              {progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={isInProgress ? "default" : "outline"}
                          size="sm"
                          disabled={isLocked}
                          onClick={() => {/* Navigate to topic problems */}}
                        >
                          {isCompleted ? (
                            <>
                              <Book className="h-4 w-4 mr-1" />
                              Review
                            </>
                          ) : isInProgress ? (
                            <>
                              <Code className="h-4 w-4 mr-1" />
                              Continue
                            </>
                          ) : (
                            <>
                              <Target className="h-4 w-4 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                        {index < topics.length - 1 && !isLocked && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                💡 Learning Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="text-left">
                  <p className="font-medium mb-1">📚 Master the Basics</p>
                  <p>Spend extra time on fundamentals - they're the foundation for everything else.</p>
                </div>
                <div className="text-left">
                  <p className="font-medium mb-1">🎯 Practice Regularly</p>
                  <p>Consistency beats intensity. Solve problems daily to build muscle memory.</p>
                </div>
                <div className="text-left">
                  <p className="font-medium mb-1">🔄 Review Often</p>
                  <p>Come back to previous topics regularly to reinforce your understanding.</p>
                </div>
                <div className="text-left">
                  <p className="font-medium mb-1">🤝 Learn Together</p>
                  <p>Discuss problems with others and explain solutions to deepen understanding.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RoadmapPage;
