
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitBranch, CheckCircle, Circle, ArrowRight } from 'lucide-react';

const roadmapData = [
  { id: 1, title: "Arrays & Strings", progress: 85, status: "completed", topics: ["Two Pointers", "Sliding Window", "Prefix Sum"] },
  { id: 2, title: "Linked Lists", progress: 60, status: "in-progress", topics: ["Reversal", "Fast/Slow Pointers", "Merging"] },
  { id: 3, title: "Stacks & Queues", progress: 0, status: "locked", topics: ["Monotonic Stack", "Deque", "Priority Queue"] },
  { id: 4, title: "Trees & Graphs", progress: 0, status: "locked", topics: ["DFS", "BFS", "Tree Traversal"] },
  { id: 5, title: "Dynamic Programming", progress: 0, status: "locked", topics: ["1D DP", "2D DP", "State Machines"] }
];

const InteractiveRoadmap = () => {
  const [viewMode, setViewMode] = useState<'roadmap' | 'sheet'>('roadmap');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <GitBranch className="w-5 h-5 mr-2 text-blue-600" />
            Interactive Learning Roadmap
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'roadmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('roadmap')}
            >
              Roadmap Mode
            </Button>
            <Button 
              variant={viewMode === 'sheet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('sheet')}
            >
              Sheet Mode
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roadmapData.map((topic, index) => (
            <div key={topic.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-gray-50/50">
              <div className="flex-shrink-0">
                {topic.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : topic.status === 'in-progress' ? (
                  <Circle className="w-6 h-6 text-blue-500 fill-blue-100" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                  <Badge variant={topic.status === 'completed' ? 'default' : topic.status === 'in-progress' ? 'secondary' : 'outline'}>
                    {topic.progress}% Complete
                  </Badge>
                </div>
                
                <Progress value={topic.progress} className="mb-2" />
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {topic.topics.map((subtopic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {subtopic}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {index < roadmapData.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Learning Path</h4>
          <p className="text-sm text-blue-700">
            Complete Arrays & Strings to unlock Linked Lists. Focus on mastering patterns before moving to advanced topics.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveRoadmap;
