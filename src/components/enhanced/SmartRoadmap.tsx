import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Lock, 
  Star, 
  Clock, 
  Target, 
  Brain,
  Zap,
  BookOpen,
  Code,
  Trophy,
  Users,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // hours
  prerequisites: string[];
  skills: string[];
  problems: number;
  solvedProblems: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  importance: number; // 1-5
  category: 'fundamentals' | 'data-structures' | 'algorithms' | 'advanced';
  resources: Array<{
    type: 'video' | 'article' | 'practice';
    title: string;
    url: string;
    duration?: number;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
  }>;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  popularity: number;
  completionRate: number;
}

const topics: Topic[] = [
  {
    id: '1',
    name: 'Programming Fundamentals',
    description: 'Basic programming concepts, syntax, and problem-solving approaches',
    difficulty: 'beginner',
    estimatedTime: 20,
    prerequisites: [],
    skills: ['Variables', 'Loops', 'Functions', 'Basic I/O'],
    problems: 25,
    solvedProblems: 25,
    status: 'completed',
    progress: 100,
    importance: 5,
    category: 'fundamentals',
    resources: [
      { type: 'video', title: 'Programming Basics', url: '#', duration: 120 },
      { type: 'article', title: 'Best Practices Guide', url: '#' },
      { type: 'practice', title: 'Basic Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'First Program', description: 'Write your first Hello World program', completed: true },
      { id: '2', title: 'Control Structures', description: 'Master if-else and loops', completed: true },
      { id: '3', title: 'Functions', description: 'Create and use functions effectively', completed: true }
    ]
  },
  {
    id: '2',
    name: 'Arrays & Strings',
    description: 'Master array manipulation, string processing, and related algorithms',
    difficulty: 'beginner',
    estimatedTime: 30,
    prerequisites: ['1'],
    skills: ['Array Traversal', 'Two Pointers', 'Sliding Window', 'String Manipulation'],
    problems: 45,
    solvedProblems: 38,
    status: 'in-progress',
    progress: 84,
    importance: 5,
    category: 'data-structures',
    resources: [
      { type: 'video', title: 'Array Algorithms', url: '#', duration: 180 },
      { type: 'article', title: 'String Processing Techniques', url: '#' },
      { type: 'practice', title: 'Array & String Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Basic Operations', description: 'Master basic array operations', completed: true },
      { id: '2', title: 'Two Pointers', description: 'Solve problems using two pointers technique', completed: true },
      { id: '3', title: 'Advanced Patterns', description: 'Master sliding window and other patterns', completed: false }
    ]
  },
  {
    id: '3',
    name: 'Linked Lists',
    description: 'Understand pointer manipulation and linked list operations',
    difficulty: 'intermediate',
    estimatedTime: 25,
    prerequisites: ['2'],
    skills: ['Pointer Manipulation', 'List Traversal', 'Reversal', 'Cycle Detection'],
    problems: 30,
    solvedProblems: 12,
    status: 'available',
    progress: 40,
    importance: 4,
    category: 'data-structures',
    resources: [
      { type: 'video', title: 'Linked List Fundamentals', url: '#', duration: 150 },
      { type: 'article', title: 'Pointer Techniques', url: '#' },
      { type: 'practice', title: 'Linked List Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Basic Operations', description: 'Insert, delete, and traverse', completed: true },
      { id: '2', title: 'Reversal', description: 'Reverse linked lists', completed: false },
      { id: '3', title: 'Advanced Techniques', description: 'Cycle detection and complex operations', completed: false }
    ]
  },
  {
    id: '4',
    name: 'Stacks & Queues',
    description: 'Master LIFO and FIFO data structures and their applications',
    difficulty: 'intermediate',
    estimatedTime: 20,
    prerequisites: ['3'],
    skills: ['Stack Operations', 'Queue Operations', 'Monotonic Stack', 'Deque'],
    problems: 25,
    solvedProblems: 0,
    status: 'locked',
    progress: 0,
    importance: 4,
    category: 'data-structures',
    resources: [
      { type: 'video', title: 'Stacks and Queues', url: '#', duration: 120 },
      { type: 'article', title: 'Applications Guide', url: '#' },
      { type: 'practice', title: 'Stack & Queue Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Basic Operations', description: 'Implement stack and queue', completed: false },
      { id: '2', title: 'Applications', description: 'Solve real-world problems', completed: false },
      { id: '3', title: 'Advanced Patterns', description: 'Monotonic stack and deque', completed: false }
    ]
  },
  {
    id: '5',
    name: 'Trees',
    description: 'Binary trees, BST, and tree traversal algorithms',
    difficulty: 'intermediate',
    estimatedTime: 40,
    prerequisites: ['4'],
    skills: ['Tree Traversal', 'BST Operations', 'Tree Construction', 'Path Problems'],
    problems: 50,
    solvedProblems: 0,
    status: 'locked',
    progress: 0,
    importance: 5,
    category: 'data-structures',
    resources: [
      { type: 'video', title: 'Tree Data Structures', url: '#', duration: 240 },
      { type: 'article', title: 'Tree Algorithms Guide', url: '#' },
      { type: 'practice', title: 'Tree Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Traversals', description: 'Master all traversal methods', completed: false },
      { id: '2', title: 'BST Operations', description: 'Insert, delete, search in BST', completed: false },
      { id: '3', title: 'Advanced Problems', description: 'Path sum, LCA, and more', completed: false }
    ]
  },
  {
    id: '6',
    name: 'Graphs',
    description: 'Graph representation, traversal, and shortest path algorithms',
    difficulty: 'advanced',
    estimatedTime: 50,
    prerequisites: ['5'],
    skills: ['DFS', 'BFS', 'Shortest Path', 'Topological Sort', 'Union Find'],
    problems: 60,
    solvedProblems: 0,
    status: 'locked',
    progress: 0,
    importance: 5,
    category: 'algorithms',
    resources: [
      { type: 'video', title: 'Graph Algorithms', url: '#', duration: 300 },
      { type: 'article', title: 'Graph Theory Basics', url: '#' },
      { type: 'practice', title: 'Graph Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Traversals', description: 'Master DFS and BFS', completed: false },
      { id: '2', title: 'Shortest Path', description: 'Dijkstra and Floyd-Warshall', completed: false },
      { id: '3', title: 'Advanced Algorithms', description: 'MST, topological sort', completed: false }
    ]
  },
  {
    id: '7',
    name: 'Dynamic Programming',
    description: 'Optimization problems and memoization techniques',
    difficulty: 'advanced',
    estimatedTime: 60,
    prerequisites: ['6'],
    skills: ['Memoization', 'Tabulation', '1D DP', '2D DP', 'State Machines'],
    problems: 70,
    solvedProblems: 0,
    status: 'locked',
    progress: 0,
    importance: 5,
    category: 'algorithms',
    resources: [
      { type: 'video', title: 'Dynamic Programming Mastery', url: '#', duration: 360 },
      { type: 'article', title: 'DP Patterns Guide', url: '#' },
      { type: 'practice', title: 'DP Problems', url: '#' }
    ],
    milestones: [
      { id: '1', title: 'Basic DP', description: 'Fibonacci and basic problems', completed: false },
      { id: '2', title: 'Classic Problems', description: 'Knapsack, LIS, LCS', completed: false },
      { id: '3', title: 'Advanced DP', description: 'State machines and optimization', completed: false }
    ]
  }
];

const learningPaths: LearningPath[] = [
  {
    id: '1',
    name: 'Complete Beginner',
    description: 'Perfect for those starting their programming journey',
    duration: '3-4 months',
    difficulty: 'beginner',
    topics: ['1', '2', '3'],
    popularity: 95,
    completionRate: 78
  },
  {
    id: '2',
    name: 'Interview Preparation',
    description: 'Focused path for technical interviews',
    duration: '2-3 months',
    difficulty: 'intermediate',
    topics: ['2', '3', '4', '5', '7'],
    popularity: 88,
    completionRate: 65
  },
  {
    id: '3',
    name: 'Competitive Programming',
    description: 'Advanced algorithms for competitive programming',
    duration: '4-6 months',
    difficulty: 'advanced',
    topics: ['5', '6', '7'],
    popularity: 72,
    completionRate: 45
  },
  {
    id: '4',
    name: 'Full Mastery',
    description: 'Complete DSA mastery from basics to advanced',
    duration: '6-8 months',
    difficulty: 'advanced',
    topics: ['1', '2', '3', '4', '5', '6', '7'],
    popularity: 85,
    completionRate: 42
  }
];

export const SmartRoadmap: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>('4');
  const [viewMode, setViewMode] = useState<'roadmap' | 'list'>('roadmap');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [studyTime, setStudyTime] = useState(0);
  const [isStudyTimerActive, setIsStudyTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudyTimerActive) {
      interval = setInterval(() => {
        setStudyTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudyTimerActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in-progress':
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-100" />;
      case 'available':
        return <Circle className="w-6 h-6 text-gray-400" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-300" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fundamentals': return <BookOpen className="w-4 h-4" />;
      case 'data-structures': return <GitBranch className="w-4 h-4" />;
      case 'algorithms': return <Brain className="w-4 h-4" />;
      case 'advanced': return <Zap className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || topic.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const selectedPathData = learningPaths.find(path => path.id === selectedPath);
  const pathTopics = selectedPathData ? topics.filter(topic => selectedPathData.topics.includes(topic.id)) : topics;

  const overallProgress = pathTopics.reduce((acc, topic) => acc + topic.progress, 0) / pathTopics.length;
  const completedTopics = pathTopics.filter(topic => topic.status === 'completed').length;
  const totalEstimatedTime = pathTopics.reduce((acc, topic) => acc + topic.estimatedTime, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Learning Roadmap</h1>
            <p className="text-gray-600">AI-powered personalized learning path</p>
          </div>
          
          {/* Study Timer */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {formatTime(studyTime)}
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

        {/* Learning Path Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Choose Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {learningPaths.map((path) => (
                <motion.div
                  key={path.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedPath === path.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPath(path.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{path.name}</h3>
                          <Badge className={getDifficultyColor(path.difficulty)}>
                            {path.difficulty}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{path.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {path.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {path.popularity}% popular
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Completion Rate</span>
                            <span className="font-medium">{path.completionRate}%</span>
                          </div>
                          <Progress value={path.completionRate} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{Math.round(overallProgress)}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Topics Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedTopics}/{pathTopics.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Time</p>
                  <p className="text-3xl font-bold text-gray-900">{totalEstimatedTime}h</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Streak</p>
                  <p className="text-3xl font-bold text-gray-900">15 days</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'roadmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('roadmap')}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Roadmap
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Content */}
        {viewMode === 'roadmap' ? (
          <div className="space-y-4">
            {pathTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-all ${
                  topic.status === 'completed' ? 'border-green-200 bg-green-50' :
                  topic.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
                  topic.status === 'available' ? 'border-gray-200' :
                  'border-gray-100 opacity-60'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(topic.status)}
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-gray-900">{topic.name}</h3>
                              <Badge className={getDifficultyColor(topic.difficulty)}>
                                {topic.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                {getCategoryIcon(topic.category)}
                                {topic.category}
                              </div>
                            </div>
                            <p className="text-gray-600">{topic.description}</p>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className="text-sm text-gray-600">
                              {topic.solvedProblems}/{topic.problems} problems
                            </div>
                            <div className="text-sm text-gray-600">
                              ~{topic.estimatedTime}h
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: topic.importance }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{topic.progress}%</span>
                          </div>
                          <Progress value={topic.progress} className="h-2" />
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {topic.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Milestones */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                          <div className="space-y-1">
                            {topic.milestones.map((milestone) => (
                              <div key={milestone.id} className="flex items-center gap-2 text-sm">
                                {milestone.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={milestone.completed ? 'text-green-700' : 'text-gray-600'}>
                                  {milestone.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button 
                            disabled={topic.status === 'locked'}
                            className={
                              topic.status === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                              topic.status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700' :
                              'bg-gray-600 hover:bg-gray-700'
                            }
                          >
                            {topic.status === 'completed' ? 'Review' :
                             topic.status === 'in-progress' ? 'Continue' :
                             topic.status === 'available' ? 'Start Learning' : 'Locked'}
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Resources
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Code className="w-4 h-4 mr-2" />
                            Practice
                          </Button>
                        </div>
                      </div>
                      
                      {index < pathTopics.length - 1 && (
                        <div className="flex-shrink-0 ml-4">
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{topic.name}</CardTitle>
                      {getStatusIcon(topic.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: topic.importance }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{topic.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{topic.solvedProblems}/{topic.problems} problems</span>
                      <span>~{topic.estimatedTime}h</span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={topic.status === 'locked'}
                    >
                      {topic.status === 'completed' ? 'Review' :
                       topic.status === 'in-progress' ? 'Continue' :
                       topic.status === 'available' ? 'Start' : 'Locked'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartRoadmap;