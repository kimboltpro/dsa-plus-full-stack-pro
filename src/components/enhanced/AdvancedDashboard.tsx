import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Trophy, 
  Flame, 
  Calendar,
  BookOpen,
  Code,
  Users,
  Award,
  Zap,
  Brain,
  Star,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface UserStats {
  totalSolved: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  weeklyGoal: number;
  monthlyGoal: number;
  totalTimeSpent: number;
  averageTimePerProblem: number;
  accuracy: number;
  rank: number;
  totalUsers: number;
  xp: number;
  level: number;
  nextLevelXP: number;
}

interface ActivityData {
  date: string;
  problems: number;
  timeSpent: number;
}

interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
  accuracy: number;
  averageTime: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const sampleStats: UserStats = {
  totalSolved: 247,
  currentStreak: 15,
  longestStreak: 32,
  dailyGoal: 3,
  weeklyGoal: 20,
  monthlyGoal: 80,
  totalTimeSpent: 12480, // minutes
  averageTimePerProblem: 45,
  accuracy: 87.5,
  rank: 1250,
  totalUsers: 50000,
  xp: 12450,
  level: 8,
  nextLevelXP: 15000
};

const activityData: ActivityData[] = [
  { date: '2024-01-01', problems: 3, timeSpent: 120 },
  { date: '2024-01-02', problems: 5, timeSpent: 180 },
  { date: '2024-01-03', problems: 2, timeSpent: 90 },
  { date: '2024-01-04', problems: 4, timeSpent: 150 },
  { date: '2024-01-05', problems: 6, timeSpent: 200 },
  { date: '2024-01-06', problems: 3, timeSpent: 110 },
  { date: '2024-01-07', problems: 7, timeSpent: 240 }
];

const topicProgress: TopicProgress[] = [
  { topic: 'Arrays', solved: 45, total: 60, accuracy: 92, averageTime: 35 },
  { topic: 'Strings', solved: 32, total: 45, accuracy: 88, averageTime: 42 },
  { topic: 'Trees', solved: 28, total: 50, accuracy: 85, averageTime: 55 },
  { topic: 'Graphs', solved: 18, total: 40, accuracy: 78, averageTime: 75 },
  { topic: 'Dynamic Programming', solved: 15, total: 35, accuracy: 72, averageTime: 90 },
  { topic: 'Greedy', solved: 22, total: 30, accuracy: 89, averageTime: 38 }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Solved your first problem',
    icon: '🎯',
    unlockedAt: '2024-01-01',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Speed Demon',
    description: 'Solved 5 problems in one day',
    icon: '⚡',
    unlockedAt: '2024-01-05',
    rarity: 'rare'
  },
  {
    id: '3',
    title: 'Streak Master',
    description: 'Maintained a 15-day streak',
    icon: '🔥',
    unlockedAt: '2024-01-15',
    rarity: 'epic'
  }
];

const difficultyData = [
  { name: 'Easy', value: 120, color: '#10B981' },
  { name: 'Medium', value: 95, color: '#F59E0B' },
  { name: 'Hard', value: 32, color: '#EF4444' }
];

export const AdvancedDashboard: React.FC = () => {
  const [stats] = useState<UserStats>(sampleStats);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isStudyTimerActive, setIsStudyTimerActive] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(2);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudyTimerActive) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudyTimerActive]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const xpProgress = (stats.xp / stats.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Track your DSA mastery journey</p>
          </div>
          
          {/* Study Timer */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatStudyTime(studyTime)}
                </div>
                <div className="text-xs text-gray-500">Study Time</div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={isStudyTimerActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsStudyTimerActive(!isStudyTimerActive)}
                >
                  {isStudyTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudyTime(0)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalSolved}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12 this week
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Streak</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.currentStreak}</p>
                    <p className="text-sm text-orange-600 flex items-center mt-1">
                      <Flame className="w-4 h-4 mr-1" />
                      {stats.longestStreak} best
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Flame className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Global Rank</p>
                    <p className="text-3xl font-bold text-gray-900">#{stats.rank.toLocaleString()}</p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <Users className="w-4 h-4 mr-1" />
                      Top {((stats.rank / stats.totalUsers) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Trophy className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accuracy</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.accuracy}%</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <Target className="w-4 h-4 mr-1" />
                      Excellent
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Level {stats.level}</h3>
                    <p className="text-sm text-gray-600">{stats.xp.toLocaleString()} / {stats.nextLevelXP.toLocaleString()} XP</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  {stats.nextLevelXP - stats.xp} XP to next level
                </Badge>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Problems Solved</span>
                    <span className="text-sm text-gray-600">{dailyProgress}/{stats.dailyGoal}</span>
                  </div>
                  <Progress value={(dailyProgress / stats.dailyGoal) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Study Time</span>
                    <span className="text-sm text-gray-600">{Math.floor(studyTime / 60)}/60 min</span>
                  </div>
                  <Progress value={(studyTime / 3600) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Goal</span>
                    <span className="text-sm text-gray-600">12/{stats.weeklyGoal}</span>
                  </div>
                  <Progress value={(12 / stats.weeklyGoal) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="problems" stroke="#3B82F6" strokeWidth={2} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Problems by Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={difficultyData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {difficultyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {difficultyData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(stats.totalTimeSpent)}</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.averageTimePerProblem}m</div>
                    <div className="text-sm text-gray-600">Avg per Problem</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatTime(studyTime / 60)}</div>
                    <div className="text-sm text-gray-600">Today's Session</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4.2h</div>
                    <div className="text-sm text-gray-600">Daily Average</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Topic-wise Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicProgress.map((topic) => (
                    <div key={topic.topic} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{topic.topic}</span>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{topic.solved}/{topic.total}</span>
                          <span>{topic.accuracy}% accuracy</span>
                          <span>{topic.averageTime}m avg</span>
                        </div>
                      </div>
                      <Progress value={(topic.solved / topic.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            <span className="text-xs text-gray-500">{achievement.unlockedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Solved', problem: 'Two Sum', difficulty: 'Easy', time: '2 hours ago' },
                    { action: 'Attempted', problem: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', time: '4 hours ago' },
                    { action: 'Solved', problem: 'Valid Parentheses', difficulty: 'Easy', time: '6 hours ago' },
                    { action: 'Bookmarked', problem: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', time: '1 day ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.action === 'Solved' ? 'bg-green-500' : 
                          activity.action === 'Attempted' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <span className="font-medium">{activity.action}</span> {activity.problem}
                          <Badge className={`ml-2 ${
                            activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            activity.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {activity.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Strength: Array Problems</h4>
                        <p className="text-sm text-blue-700">You excel at array-based problems with 92% accuracy. Consider tackling more advanced array algorithms.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Improvement Area: Dynamic Programming</h4>
                        <p className="text-sm text-yellow-700">Focus on DP patterns. Your current accuracy is 72%. Practice more basic DP problems first.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Recommendation</h4>
                        <p className="text-sm text-green-700">You're ready for medium-level tree problems. Your foundation is solid!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Solving Speed</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+15% faster</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Accuracy Rate</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">+3% improvement</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Daily Consistency</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600">15-day streak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedDashboard;