
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, CheckCircle, Bookmark, Clock, Filter, Search } from 'lucide-react';

const problemsData = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    status: "solved",
    lastAttempt: "2024-01-15",
    timeSpent: "12 mins",
    platform: "LeetCode",
    tags: ["Array", "Hash Table"]
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    status: "attempted",
    lastAttempt: "2024-01-14",
    timeSpent: "45 mins",
    platform: "LeetCode",
    tags: ["Linked List", "Math"]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    status: "bookmarked",
    lastAttempt: null,
    timeSpent: null,
    platform: "LeetCode",
    tags: ["String", "Sliding Window"]
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    status: "review",
    lastAttempt: "2024-01-13",
    timeSpent: "90 mins",
    platform: "LeetCode",
    tags: ["Array", "Binary Search"]
  }
];

const ProblemTracker = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredProblems = problemsData.filter(problem => {
    if (filter === 'all') return true;
    return problem.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'attempted':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'bookmarked':
        return <Bookmark className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'solved': return 'bg-green-100 text-green-800';
      case 'attempted': return 'bg-yellow-100 text-yellow-800';
      case 'bookmarked': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statsData = [
    { label: 'Solved', count: problemsData.filter(p => p.status === 'solved').length, color: 'text-green-600' },
    { label: 'Attempted', count: problemsData.filter(p => p.status === 'attempted').length, color: 'text-yellow-600' },
    { label: 'Bookmarked', count: problemsData.filter(p => p.status === 'bookmarked').length, color: 'text-blue-600' },
    { label: 'Review', count: problemsData.filter(p => p.status === 'review').length, color: 'text-purple-600' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Problem Attempt Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cloud Sync Status */}
        <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-700">Synced across all devices</span>
          </div>
          <Badge variant="outline" className="text-green-600">
            Last sync: 2 mins ago
          </Badge>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="attempted">Attempted</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(problem.status)}
                    <div>
                      <h4 className="font-medium">{problem.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="outline">{problem.platform}</Badge>
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getStatusColor(problem.status)}>
                      {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                    </Badge>
                    {problem.timeSpent && (
                      <div className="text-xs text-gray-500 mt-1">
                        {problem.timeSpent}
                      </div>
                    )}
                    {problem.lastAttempt && (
                      <div className="text-xs text-gray-500">
                        {problem.lastAttempt}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Daily Streak */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-medium mb-2 flex items-center">
            🔥 Daily Streak: 15 Days
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            You're on fire! Keep solving problems to maintain your streak.
          </p>
          <div className="flex space-x-1 mb-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className={`w-6 h-6 rounded ${i < 5 ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
            ))}
          </div>
          <div className="text-xs text-gray-500">Last 7 days activity</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemTracker;
