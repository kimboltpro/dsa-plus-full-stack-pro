
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, Clock, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

const difficultyData = [
  { name: 'Easy', value: 45, color: '#10B981' },
  { name: 'Medium', value: 30, color: '#F59E0B' },
  { name: 'Hard', value: 15, color: '#EF4444' }
];

const topicData = [
  { topic: 'Arrays', solved: 25, total: 30 },
  { topic: 'Trees', solved: 18, total: 25 },
  { topic: 'DP', solved: 12, total: 20 },
  { topic: 'Graphs', solved: 8, total: 15 },
  { topic: 'Strings', solved: 22, total: 28 }
];

const weeklyProgress = [
  { day: 'Mon', problems: 3 },
  { day: 'Tue', problems: 5 },
  { day: 'Wed', problems: 2 },
  { day: 'Thu', problems: 7 },
  { day: 'Fri', problems: 4 },
  { day: 'Sat', problems: 6 },
  { day: 'Sun', problems: 3 }
];

const AnalyticsDashboard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">247</div>
            <div className="text-sm text-blue-700">Problems Solved</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">15</div>
            <div className="text-sm text-green-700">Day Streak</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">42h</div>
            <div className="text-sm text-purple-700">Time Spent</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-900">1,250</div>
            <div className="text-sm text-yellow-700">XP Points</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-4">Problems by Difficulty</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              {difficultyData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-4">This Week's Progress</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="problems" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Topic Progress */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-4">Progress by Topic</h4>
          <div className="space-y-3">
            {topicData.map((topic) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium w-16">{topic.topic}</span>
                  <Progress value={(topic.solved / topic.total) * 100} className="w-32" />
                </div>
                <Badge variant="outline">
                  {topic.solved}/{topic.total}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Recent Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-100 text-yellow-800">🏆 100 Problems Solved</Badge>
            <Badge className="bg-blue-100 text-blue-800">🔥 15 Day Streak</Badge>
            <Badge className="bg-purple-100 text-purple-800">🧠 First DP Problem</Badge>
            <Badge className="bg-green-100 text-green-800">⚡ Speed Demon (5 problems in 1 day)</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
