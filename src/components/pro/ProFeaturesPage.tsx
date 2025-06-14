import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, ExternalLink, BookOpen, Video, FileText, Code, Search, Trophy, Brain, Globe, Smartphone, Star, GitBranch, Target, Monitor, BarChart3, Play, Filter, MessageSquare, Calendar, Users, CheckCircle, Zap, Link, TrendingUp, Clock, Award, User, Eye, Wrench } from 'lucide-react';

// Import the new feature components
import InteractiveRoadmap from './features/InteractiveRoadmap';
import CodeEditor from './features/CodeEditor';
import AnalyticsDashboard from './features/AnalyticsDashboard';
import ProblemTracker from './features/ProblemTracker';
import AdvancedSearch from './features/AdvancedSearch';
import DSAToolkit from './features/DSAToolkit';

const dsaSheets = [
  { 
    name: "Striver's SDE Sheet", 
    author: "Take U Forward", 
    highlights: "79 handpicked problems for interviews", 
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    problems: "79 problems",
    difficulty: "Medium-Hard",
    category: "Interview Prep",
    rating: 4.9,
    users: "500K+",
    timeToComplete: "2-3 months",
    tags: ["FAANG", "System Design", "Algorithms"]
  },
  { 
    name: "Fraz Sheet", 
    author: "Fraz (GitHub)", 
    highlights: "Topic-wise + difficulty-wise curation", 
    url: "https://github.com/godugushruthi/fraz-dsa-sheet",
    problems: "Topic-wise",
    difficulty: "Easy-Hard",
    category: "Comprehensive",
    rating: 4.7,
    users: "200K+",
    timeToComplete: "3-4 months",
    tags: ["Beginner Friendly", "Topic-wise", "GitHub"]
  },
  { 
    name: "Love Babbar 450 DSA Sheet", 
    author: "Love Babbar / GFG", 
    highlights: "One of the most followed sheets for placement", 
    url: "https://github.com/sakshamceo/DSA-450-Quest-LOVE-BABBAR/blob/main/LOVE%20BABBAR%20450%20DSA%20Questions.md",
    problems: "450 problems",
    difficulty: "Easy-Hard",
    category: "Placement",
    rating: 4.8,
    users: "1M+",
    timeToComplete: "4-6 months",
    tags: ["Placement", "Comprehensive", "Hindi Support"]
  },
  { 
    name: "TUF Sheet (Take U Forward)", 
    author: "Raj Vikramaditya", 
    highlights: "Covers patterns & intuition with YouTube links", 
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    problems: "A2Z Course",
    difficulty: "Beginner-Advanced",
    category: "Learning Path",
    rating: 4.9,
    users: "300K+",
    timeToComplete: "6-8 months",
    tags: ["Video Tutorials", "A2Z Learning", "Patterns"]
  },
  { 
    name: "GFG Top 100 Interview Questions", 
    author: "GeeksforGeeks", 
    highlights: "Company-tagged questions", 
    url: "https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/",
    problems: "100 problems",
    difficulty: "Medium",
    category: "Interview Focus",
    rating: 4.6,
    users: "800K+",
    timeToComplete: "1-2 months",
    tags: ["Company Tagged", "Quick Prep", "Interview"]
  },
  { 
    name: "GFG Must-Do 75/150", 
    author: "GeeksforGeeks", 
    highlights: "Very popular for quick revision", 
    url: "https://www.geeksforgeeks.org/most-asked-75-coding-problems/",
    problems: "75 problems",
    difficulty: "Medium",
    category: "Quick Revision",
    rating: 4.5,
    users: "600K+",
    timeToComplete: "3-4 weeks",
    tags: ["Quick Revision", "Must-Do", "Popular"]
  },
  { 
    name: "NeetCode Blind 75 / 150", 
    author: "Neetcode.io", 
    highlights: "Leetcode-style structured sheet", 
    url: "https://neetcode.io/practice?tab=blind75",
    problems: "75/150 problems",
    difficulty: "Medium-Hard",
    category: "Pattern Based",
    rating: 4.8,
    users: "400K+",
    timeToComplete: "2-3 months",
    tags: ["LeetCode", "Patterns", "Video Solutions"]
  },
  { 
    name: "Coding Ninjas Problem List", 
    author: "CN Studio", 
    highlights: "Structured by course modules", 
    url: "https://www.naukri.com/code360/problem-lists/ninjas-sde-sheet",
    problems: "SDE Sheet",
    difficulty: "Easy-Hard",
    category: "Course Based",
    rating: 4.4,
    users: "150K+",
    timeToComplete: "3-4 months",
    tags: ["Course Module", "Structured", "SDE"]
  },
  { 
    name: "Leetcode Top Interview Questions", 
    author: "Leetcode", 
    highlights: "Actual curated problems asked by FAANG", 
    url: "https://leetcode.com/studyplan/leetcode-75/",
    problems: "75 problems",
    difficulty: "Medium-Hard",
    category: "FAANG Prep",
    rating: 4.9,
    users: "2M+",
    timeToComplete: "2-3 months",
    tags: ["FAANG", "Official", "High Quality"]
  },
  { 
    name: "Microsoft, Amazon, Google tagged sets", 
    author: "GFG/Leetcode", 
    highlights: "Company-specific sets", 
    url: "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/",
    problems: "Company-wise",
    difficulty: "Medium-Hard",
    category: "Company Specific",
    rating: 4.7,
    users: "350K+",
    timeToComplete: "2-4 weeks",
    tags: ["Company Specific", "Targeted", "Recent"]
  },
  { 
    name: "All-DSA-Sheets (GitHub)", 
    author: "GFGSC-RTU", 
    highlights: "Includes Striver, Love Babbar, Fraz, Arsh Goyal, etc.", 
    url: "https://github.com/GFGSC-RTU/All-DSA-Sheets",
    problems: "Multiple sheets",
    difficulty: "All Levels",
    category: "Collection",
    rating: 4.6,
    users: "180K+",
    timeToComplete: "6+ months",
    tags: ["Collection", "Multiple Sheets", "Comprehensive"]
  },
  { 
    name: "450-DSA Platform", 
    author: "Love Babbar Tracker", 
    highlights: "Live tracker for Love Babbar sheet", 
    url: "https://github.com/AsishRaju/450-DSA",
    problems: "450 problems",
    difficulty: "Easy-Hard",
    category: "Tracker",
    rating: 4.5,
    users: "120K+",
    timeToComplete: "4-6 months",
    tags: ["Progress Tracker", "Love Babbar", "Live Updates"]
  }
];

const additionalResources = [
  { type: "📘 Theory & Articles", sources: "GeeksforGeeks, W3Schools (C/C++/Java/Recursion), Javatpoint", icon: BookOpen },
  { type: "📹 Video Explanations", sources: "Striver (YT), CodeHelp (Babbar), Apna College, Jenny's Lectures", icon: Video },
  { type: "📜 Cheat Sheets", sources: "GitHub repos of DSA one-page notes, Techie Delight PDFs, Python/C++ STL notes", icon: FileText },
  { type: "🔄 Practice Platforms", sources: "Leetcode, GFG, HackerRank, Codeforces (via links)", icon: Code },
  { type: "🧑‍💻 Live Problems", sources: "APIs to Leetcode daily challenge, GFG problem of day, etc.", icon: Code },
  { type: "📄 PDF Downloads", sources: "All sheets should have a PDF version for offline use", icon: FileText },
  { type: "🧠 Interactive Courses", sources: "GFG self-paced, Coursera, Udemy links embedded", icon: Brain },
  { type: "📊 DSA Trackers", sources: "Custom Notion / Excel Templates users can export", icon: Search }
];

const mustHaveFeatures = [
  { 
    category: "🧭 ROADMAP & STRUCTURE", 
    icon: GitBranch,
    features: [
      "Beginner to Advanced interactive roadmap with visual progress tracking",
      "Visual dependency tree showing concept relationships and prerequisites", 
      "Toggle switch between 'Sheet mode' and 'Roadmap mode' for different learning paths",
      "Personalized learning path recommendations based on skill assessment"
    ]
  },
  { 
    category: "🧩 SHEET INTEGRATION", 
    icon: FileText,
    features: [
      "All sheets organized with smart filters: Easy, Medium, Hard, Topic, Platform",
      "Custom sheet creation tool - 'Add your own sheet' with crowdsourced validation",
      "Cross-sheet problem mapping to avoid duplicates and track coverage",
      "Import/export functionality for personal sheet collections"
    ]
  },
  { 
    category: "🎯 PROBLEM ATTEMPT TRACKER", 
    icon: Target,
    features: [
      "Comprehensive status tracking: Solved, Attempted, Bookmarked, Review Required",
      "Cloud synchronization across all devices with real-time updates",
      "Daily streak tracking with XP points and achievement system",
      "Time-based analytics showing problem-solving patterns and improvement areas"
    ]
  },
  { 
    category: "💻 IN-BUILT CODE EDITOR", 
    icon: Monitor,
    features: [
      "Multi-language support: C++, Java, Python with syntax highlighting",
      "Custom test case creation and execution with performance metrics",
      "Monaco/Ace editor integration with intelligent code completion",
      "Auto-save functionality with version history and code backup system"
    ]
  },
  { 
    category: "📊 ANALYTICS DASHBOARD", 
    icon: BarChart3,
    features: [
      "Comprehensive progress tracking: Total solved, daily/weekly goal completion",
      "Time analytics: Hours spent per topic with productivity insights",
      "Visual charts: Pie charts by sheet/topic/difficulty with trend analysis",
      "Gamified achievements: Certificates and badges for milestone completion"
    ]
  },
  { 
    category: "📹 VIDEO TUTORIAL EMBED", 
    icon: Play,
    features: [
      "Auto-embedded tutorials from top educators (Striver, Babbar, Apna College)",
      "Smart filtering: 'Show only problems with video explanations'",
      "Multiple solution approaches with video explanations for each method",
      "Interactive timestamps linking video segments to specific problem parts"
    ]
  },
  { 
    category: "🔍 ADVANCED SEARCH & FILTER", 
    icon: Filter,
    features: [
      "Multi-dimensional filtering: Topic, Tag, Difficulty, Company, Platform, Sheet",
      "Full-text search capabilities including problem descriptions and solutions",
      "AI-powered search suggestions and related problem recommendations",
      "Saved search queries and custom filter presets for quick access"
    ]
  },
  { 
    category: "📚 COMPREHENSIVE THEORY", 
    icon: BookOpen,
    features: [
      "Integrated theory sections with markdown support and LaTeX equations",
      "AI-powered explanations and hints with step-by-step problem breakdown",
      "Interactive examples with live code execution and visualization",
      "Community-contributed explanations with rating and verification system"
    ]
  },
  { 
    category: "💡 GAMIFIED CHALLENGES", 
    icon: Trophy,
    features: [
      "Daily problem recommendations based on learning curve and weak areas",
      "Community leaderboards with weekly/monthly competitions",
      "Friend challenge system with head-to-head problem-solving duels",
      "Seasonal contests and special events with exclusive rewards"
    ]
  },
  { 
    category: "🧑‍💻 INTERVIEW SIMULATION", 
    icon: Users,
    features: [
      "Timed mock interviews with company-specific question sets",
      "Real-time performance analysis with detailed feedback reports",
      "Interview recording and playback for self-assessment",
      "Peer review system for collaborative improvement"
    ]
  },
  { 
    category: "🧠 COLLABORATIVE LEARNING", 
    icon: MessageSquare,
    features: [
      "Personal notes system with rich text formatting and code snippets",
      "Public discussion forums with upvoting and expert validation",
      "Study groups and collaborative problem-solving sessions",
      "Mentor matching system connecting beginners with experienced developers"
    ]
  },
  { 
    category: "🌐 ACCESSIBILITY & LOCALIZATION", 
    icon: Globe,
    features: [
      "Multi-language support starting with Hindi/English toggle",
      "Regional language expansion with community translations",
      "Accessibility compliance with screen reader support",
      "Customizable UI themes and font size adjustments"
    ]
  },
  { 
    category: "📲 MOBILE & OFFLINE EXPERIENCE", 
    icon: Smartphone,
    features: [
      "Progressive Web App with 'Add to Home Screen' functionality",
      "Comprehensive offline mode for sheets, notes, and completed solutions",
      "Smart push notifications for challenges, streaks, and personalized reminders",
      "Mobile-optimized code editor with gesture-based navigation"
    ]
  },
  { 
    category: "🎁 AI-POWERED UNIQUENESS", 
    icon: Zap,
    features: [
      "OpenRouter integration for dynamic hints and partial solution generation",
      "Smart badge system: Milestone achievements (50Q, 100Q, First DP, etc.)",
      "Intelligent link previews with hover-based content snippets",
      "AI-powered code review and optimization suggestions"
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    case 'Easy-Medium': return 'bg-blue-100 text-blue-800';
    case 'Medium-Hard': return 'bg-purple-100 text-purple-800';
    case 'Easy-Hard': return 'bg-gray-100 text-gray-800';
    case 'Beginner-Advanced': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Interview Prep': 'bg-red-50 border-red-200',
    'Comprehensive': 'bg-blue-50 border-blue-200',
    'Placement': 'bg-green-50 border-green-200',
    'Learning Path': 'bg-purple-50 border-purple-200',
    'Interview Focus': 'bg-orange-50 border-orange-200',
    'Quick Revision': 'bg-yellow-50 border-yellow-200',
    'Pattern Based': 'bg-pink-50 border-pink-200',
    'Course Based': 'bg-teal-50 border-teal-200',
    'FAANG Prep': 'bg-indigo-50 border-indigo-200',
    'Company Specific': 'bg-cyan-50 border-cyan-200',
    'Collection': 'bg-emerald-50 border-emerald-200',
    'Tracker': 'bg-violet-50 border-violet-200'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-50 border-gray-200';
};

const ProFeaturesPage = () => {
  const { user, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pro Features
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the complete DSA mastery experience with premium features, curated sheets, and world-class resources
          </p>
        </div>

        <Tabs defaultValue="interactive-features" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="interactive-features">Interactive Features</TabsTrigger>
            <TabsTrigger value="dsa-toolkit">DSA Toolkit</TabsTrigger>
            <TabsTrigger value="sheets">Top DSA Sheets</TabsTrigger>
            <TabsTrigger value="resources">Additional Resources</TabsTrigger>
            <TabsTrigger value="feature-specs">Feature Specifications</TabsTrigger>
          </TabsList>

          {/* Interactive Features Tab */}
          <TabsContent value="interactive-features">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🚀 Interactive Pro Features</h2>
              <p className="text-gray-600">Experience the power of our premium features with these interactive demos</p>
            </div>
            
            <div className="space-y-8">
              <InteractiveRoadmap />
              <CodeEditor />
              <AnalyticsDashboard />
              <ProblemTracker />
              <AdvancedSearch />
              
              {/* Additional Interactive Features Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Tutorial Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="w-5 h-5 mr-2 text-blue-600" />
                      Video Tutorial Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center h-32 text-white">
                        <Play className="w-12 h-12 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Two Sum - Striver Explanation</span>
                        <Badge variant="outline">12:45</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Binary Search - CodeHelp</span>
                        <Badge variant="outline">18:30</Badge>
                      </div>
                      <Button className="w-full mt-4">
                        View All Video Solutions
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Simulation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Interview Simulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Mock Interview - Google</span>
                          <Badge variant="secondary">45 mins</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Medium difficulty • 3 coding problems</p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Last Performance</span>
                          <Badge className="bg-green-100 text-green-800">85%</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Completed 2/3 problems • Strong performance</p>
                      </div>

                      <Button className="w-full">
                        Start New Interview
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Collaborative Learning */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                      Collaborative Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Study Group: FAANG Prep</span>
                          <Badge variant="outline">12 members</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Currently discussing: DP patterns</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Mentor: Sarah (Google SWE)</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Available</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Specializes in system design & algorithms</p>
                      </div>

                      <Button className="w-full">
                        Join Study Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Gamified Challenges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                      Gamified Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Weekly Challenge</span>
                          <Badge className="bg-purple-100 text-purple-800">2 days left</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Solve 5 tree problems to earn 500 XP</p>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Progress: 3/5 completed</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Friend Challenge</span>
                          <Badge className="bg-orange-100 text-orange-800">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Race against Alex to solve 10 problems first!</p>
                        <div className="mt-2 text-sm">
                          <div className="flex justify-between">
                            <span>You: 7 problems</span>
                            <span>Alex: 5 problems</span>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        View All Challenges
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* DSA Toolkit Tab */}
          <TabsContent value="dsa-toolkit">
            <DSAToolkit />
          </TabsContent>

          {/* Top DSA Sheets Tab - Enhanced Design */}
          <TabsContent value="sheets">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">📋 Premium DSA Sheet Collection</h2>
                  <p className="text-lg text-gray-600">Curated collection of the most effective DSA problem sheets from industry experts</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    12 Premium Sheets
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Users className="w-4 h-4 mr-1" />
                    5M+ Users
                  </Badge>
                </div>
              </div>
              
              {/* Filter/Sort Section */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Quick Filters:</span>
                  <Button variant="outline" size="sm" className="text-xs">All Sheets</Button>
                  <Button variant="outline" size="sm" className="text-xs">Beginner Friendly</Button>
                  <Button variant="outline" size="sm" className="text-xs">Interview Prep</Button>
                  <Button variant="outline" size="sm" className="text-xs">FAANG Focus</Button>
                  <Button variant="outline" size="sm" className="text-xs">Quick Revision</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dsaSheets.map((sheet, index) => (
                <Card key={index} className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${getCategoryColor(sheet.category)} overflow-hidden`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {sheet.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {sheet.author}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold ml-1">{sheet.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-xs px-2">
                          <Eye className="w-3 h-3 mr-1" />
                          {sheet.users}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed">{sheet.highlights}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Problems</div>
                          <div className="font-semibold text-gray-900">{sheet.problems}</div>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg border">
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                          <div className="font-semibold text-gray-900 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {sheet.timeToComplete}
                          </div>
                        </div>
                      </div>

                      {/*difficulty and Category */}
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(sheet.difficulty)} variant="secondary">
                          {sheet.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300">
                          <Award className="w-3 h-3 mr-1" />
                          {sheet.category}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {sheet.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Button */}
                      <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 group-hover:shadow-lg transition-all duration-300">
                        <a href={sheet.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                          Start Practicing
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Usage Guide Section */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Target className="w-6 h-6 mr-2" />
                    🎯 Strategic Sheet Selection Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-blue-800">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Beginners:</strong> Start with Striver's SDE Sheet or TUF A2Z Course for structured learning
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Interview Prep:</strong> Focus on NeetCode Blind 75 and LeetCode Top Interview Questions
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Comprehensive Study:</strong> Love Babbar 450 provides the most thorough coverage
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Quick Revision:</strong> GFG Must-Do 75 for last-minute preparation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    📈 Success Metrics & Progress Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white/60 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">Average Success Rate</div>
                      <div className="text-2xl font-bold text-green-900">87%</div>
                      <div className="text-xs text-green-600">Users who complete any sheet get placed</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">Most Popular Path</div>
                      <div className="text-sm font-semibold text-green-900">Striver → NeetCode → Company Specific</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800 mb-1">Recommended Timeline</div>
                      <div className="text-sm text-green-900">3-6 months of consistent daily practice</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional Resources Tab */}
          <TabsContent value="resources">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Additional Resources</h2>
              <p className="text-gray-600">Comprehensive learning materials to complement your DSA journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalResources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <IconComponent className="w-6 h-6 mr-3 text-blue-600" />
                        {resource.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{resource.sources}</p>
                      <Button variant="outline" className="w-full">
                        Explore Resources
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 space-y-6">
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="w-6 h-6 mr-2 text-green-600" />
                    Featured Video Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold mb-2">Striver's A2Z DSA Course</h4>
                      <p className="text-sm text-gray-600 mb-3">Complete DSA course with 450+ problems</p>
                      <Button size="sm" variant="outline">
                        Watch Now
                      </Button>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold mb-2">CodeHelp by Love Babbar</h4>
                      <p className="text-sm text-gray-600 mb-3">Hindi explanation with practical examples</p>
                      <Button size="sm" variant="outline">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-purple-600" />
                    Downloadable Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <FileText className="w-8 h-8 mb-2 text-blue-600" />
                      <span className="font-medium">DSA Cheat Sheet</span>
                      <span className="text-xs text-gray-500">PDF Download</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Code className="w-8 h-8 mb-2 text-green-600" />
                      <span className="font-medium">Algorithm Templates</span>
                      <span className="text-xs text-gray-500">Code Snippets</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                      <Brain className="w-8 h-8 mb-2 text-purple-600" />
                      <span className="font-medium">Study Planner</span>
                      <span className="text-xs text-gray-500">Excel Template</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feature Specifications Tab */}
          <TabsContent value="feature-specs">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🛠️ Feature Specifications</h2>
              <p className="text-gray-600">Detailed breakdown of all premium features and capabilities</p>
            </div>
            
            <div className="space-y-6">
              {mustHaveFeatures.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <IconComponent className="w-6 h-6 mr-3 text-blue-600" />
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">🚀 Coming Soon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="text-blue-800">AI-powered code review and suggestions</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-blue-800">Multi-language support (Hindi, Spanish, etc.)</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-purple-500 mr-3" />
                  <span className="text-blue-800">Native mobile app for iOS and Android</span>
                </div>
                <div className="flex items-center">
                  <Link className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-blue-800">API integration with popular IDEs</span>
                </div>
                <div className="flex items-center">
                  <Wrench className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-blue-800">Customizable UI and theme options</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="p-8">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Unlock Pro Features?
              </h3>
              <p className="text-gray-600 mb-6">
                Get access to all premium sheets, advanced features, and exclusive content to accelerate your DSA mastery journey.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProFeaturesPage;
