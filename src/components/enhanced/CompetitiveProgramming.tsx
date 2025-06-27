import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Target, 
  Clock, 
  Users, 
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Award,
  Crown,
  Flame,
  Activity,
  BarChart3,
  Timer,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Contest {
  id: string;
  name: string;
  platform: string;
  startTime: string;
  duration: number; // minutes
  participants: number;
  difficulty: 'div1' | 'div2' | 'div3' | 'div4';
  status: 'upcoming' | 'live' | 'ended';
  problems: number;
  rating?: number;
}

interface Rating {
  platform: string;
  current: number;
  max: number;
  rank: string;
  color: string;
  contests: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt: string;
}

const contests: Contest[] = [
  {
    id: '1',
    name: 'Codeforces Round #912 (Div. 2)',
    platform: 'Codeforces',
    startTime: '2024-01-20T14:35:00Z',
    duration: 120,
    participants: 15420,
    difficulty: 'div2',
    status: 'upcoming',
    problems: 6
  },
  {
    id: '2',
    name: 'AtCoder Beginner Contest 335',
    platform: 'AtCoder',
    startTime: '2024-01-21T12:00:00Z',
    duration: 100,
    participants: 8500,
    difficulty: 'div3',
    status: 'upcoming',
    problems: 7
  },
  {
    id: '3',
    name: 'LeetCode Weekly Contest 380',
    platform: 'LeetCode',
    startTime: '2024-01-21T02:30:00Z',
    duration: 90,
    participants: 25000,
    difficulty: 'div2',
    status: 'live',
    problems: 4
  }
];

const ratings: Rating[] = [
  {
    platform: 'Codeforces',
    current: 1547,
    max: 1623,
    rank: 'Expert',
    color: '#0066ff',
    contests: 45
  },
  {
    platform: 'AtCoder',
    current: 1234,
    max: 1298,
    rank: 'Brown',
    color: '#804000',
    contests: 23
  },
  {
    platform: 'LeetCode',
    current: 2156,
    max: 2234,
    rank: 'Knight',
    color: '#ffa500',
    contests: 67
  },
  {
    platform: 'CodeChef',
    current: 1876,
    max: 1945,
    rank: '4 Star',
    color: '#6666ff',
    contests: 34
  }
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Contest',
    description: 'Participated in your first competitive programming contest',
    icon: '🎯',
    rarity: 'bronze',
    unlockedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Speed Demon',
    description: 'Solved a problem in under 5 minutes',
    icon: '⚡',
    rarity: 'silver',
    unlockedAt: '2024-01-05'
  },
  {
    id: '3',
    title: 'Rating Climber',
    description: 'Increased rating by 200+ points',
    icon: '📈',
    rarity: 'gold',
    unlockedAt: '2024-01-15'
  },
  {
    id: '4',
    title: 'Perfect Score',
    description: 'Solved all problems in a contest',
    icon: '💯',
    rarity: 'platinum',
    unlockedAt: '2024-01-18'
  }
];

export const CompetitiveProgramming: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('contests');
  const [contestTimer, setContestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setContestTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeUntilContest = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'div1': return 'bg-red-100 text-red-800';
      case 'div2': return 'bg-yellow-100 text-yellow-800';
      case 'div3': return 'bg-green-100 text-green-800';
      case 'div4': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Competitive Programming</h1>
            <p className="text-gray-600">Track your contests, ratings, and achievements</p>
          </div>
          
          {/* Contest Timer */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTime(contestTimer)}
                </div>
                <div className="text-xs text-gray-500">Contest Timer</div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={isTimerActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsTimerActive(!isTimerActive)}
                >
                  {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContestTimer(0)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {ratings.map((rating) => (
            <motion.div
              key={rating.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{rating.platform}</h3>
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${rating.color}20` }}>
                      <Trophy className="w-5 h-5" style={{ color: rating.color }} />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Rating</span>
                      <span className="font-bold" style={{ color: rating.color }}>{rating.current}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Max Rating</span>
                      <span className="text-sm">{rating.max}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rank</span>
                      <span className="font-medium" style={{ color: rating.color }}>{rating.rank}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Contests</span>
                      <span className="text-sm">{rating.contests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="ratings">Rating History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
          </TabsList>

          <TabsContent value="contests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming & Live Contests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contests.map((contest) => (
                    <Card key={contest.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{contest.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{contest.platform}</span>
                            <span>•</span>
                            <span>{new Date(contest.startTime).toLocaleString()}</span>
                            <span>•</span>
                            <span>{contest.duration} min</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(contest.difficulty)}>
                            {contest.difficulty.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(contest.status)}>
                            {contest.status === 'upcoming' ? getTimeUntilContest(contest.startTime) : contest.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            {contest.participants.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-gray-500" />
                            {contest.problems} problems
                          </div>
                        </div>
                        
                        <Button size="sm">
                          {contest.status === 'live' ? 'Join Now' : 'Register'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Rating History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* Placeholder for rating chart */}
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Rating history chart will appear here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Contests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Codeforces Round #911', platform: 'Codeforces', rating: '+45', solved: '4/6', rank: '1250/15000' },
                      { name: 'LeetCode Weekly 379', platform: 'LeetCode', rating: '-12', solved: '2/4', rank: '3500/20000' },
                      { name: 'AtCoder Beginner 334', platform: 'AtCoder', rating: '+78', solved: '5/7', rank: '890/9000' }
                    ].map((contest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{contest.name}</div>
                          <div className="text-sm text-gray-600">{contest.platform}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${contest.rating.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {contest.rating}
                          </div>
                          <div className="text-sm text-gray-600">{contest.solved} • {contest.rank}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Problem Solving Rate</span>
                        <span className="text-sm">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Average Rank Percentile</span>
                        <span className="text-sm">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Contest Participation</span>
                        <span className="text-sm">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">45</div>
                        <div className="text-sm text-gray-600">Total Contests</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">+356</div>
                        <div className="text-sm text-gray-600">Net Rating Gain</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-4">{achievement.icon}</div>
                      <h3 className="font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-2">Unlocked: {achievement.unlockedAt}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'tourist', platform: 'Codeforces', rating: 3800, country: '🇷🇺' },
                    { rank: 2, name: 'Benq', platform: 'Codeforces', rating: 3750, country: '🇺🇸' },
                    { rank: 3, name: 'Um_nik', platform: 'Codeforces', rating: 3700, country: '🇷🇺' },
                    { rank: 4, name: 'ecnerwala', platform: 'Codeforces', rating: 3650, country: '🇺🇸' },
                    { rank: 5, name: 'Petr', platform: 'Codeforces', rating: 3600, country: '🇷🇺' }
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium">{user.name} {user.country}</div>
                          <div className="text-sm text-gray-600">{user.platform}</div>
                        </div>
                      </div>
                      <div className="font-bold text-red-600">{user.rating}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Practice Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Focus Area: Dynamic Programming</h4>
                        <p className="text-sm text-blue-700 mb-3">Based on your recent contest performance, we recommend focusing on DP problems.</p>
                        <Button size="sm">View DP Problems</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Daily Challenge</h4>
                      <p className="text-sm text-gray-600 mb-3">Solve one problem daily to maintain your streak</p>
                      <Button size="sm" className="w-full">Start Today's Challenge</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Topic of the Week</h4>
                      <p className="text-sm text-gray-600 mb-3">Graph Algorithms - DFS, BFS, Shortest Path</p>
                      <Button size="sm" className="w-full">Practice Graphs</Button>
                    </Card>
                    
                    <Card className="p-4">
                      <h4 className="font-medium mb-2">Virtual Contest</h4>
                      <p className="text-sm text-gray-600 mb-3">Simulate a real contest environment</p>
                      <Button size="sm" className="w-full">Start Virtual Contest</Button>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Problem Sets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Top 100 Liked', count: 100, difficulty: 'Mixed', completion: 45 },
                    { title: 'DP Patterns', count: 50, difficulty: 'Medium-Hard', completion: 30 },
                    { title: 'Graph Algorithms', count: 75, difficulty: 'Medium', completion: 60 },
                    { title: 'Binary Search', count: 40, difficulty: 'Easy-Medium', completion: 80 },
                    { title: 'Greedy Algorithms', count: 60, difficulty: 'Medium', completion: 50 },
                    { title: 'String Algorithms', count: 45, difficulty: 'Medium', completion: 35 }
                  ].map((set, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium mb-1">{set.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{set.count} problems</span>
                        <span>{set.difficulty}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Completion</span>
                          <span>{set.completion}%</span>
                        </div>
                        <Progress value={set.completion} className="h-1" />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompetitiveProgramming;