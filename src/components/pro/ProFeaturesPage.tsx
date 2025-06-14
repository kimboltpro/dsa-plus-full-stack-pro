
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, ExternalLink, BookOpen, Video, FileText, Code, Search, Trophy, Brain, Globe, Smartphone, Star, GitBranch, Target, Monitor, BarChart3, Play, Filter, MessageSquare, Calendar, Users, CheckCircle, Zap, Link } from 'lucide-react';

const dsaSheets = [
  { 
    name: "Striver's SDE Sheet", 
    author: "Take U Forward", 
    highlights: "79 handpicked problems for interviews", 
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    problems: "79 problems"
  },
  { 
    name: "Fraz Sheet", 
    author: "Fraz (GitHub)", 
    highlights: "Topic-wise + difficulty-wise curation", 
    url: "https://github.com/godugushruthi/fraz-dsa-sheet",
    problems: "Topic-wise"
  },
  { 
    name: "Love Babbar 450 DSA Sheet", 
    author: "Love Babbar / GFG", 
    highlights: "One of the most followed sheets for placement", 
    url: "https://github.com/sakshamceo/DSA-450-Quest-LOVE-BABBAR/blob/main/LOVE%20BABBAR%20450%20DSA%20Questions.md",
    problems: "450 problems"
  },
  { 
    name: "TUF Sheet (Take U Forward)", 
    author: "Raj Vikramaditya", 
    highlights: "Covers patterns & intuition with YouTube links", 
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    problems: "A2Z Course"
  },
  { 
    name: "GFG Top 100 Interview Questions", 
    author: "GeeksforGeeks", 
    highlights: "Company-tagged questions", 
    url: "https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/",
    problems: "100 problems"
  },
  { 
    name: "GFG Must-Do 75/150", 
    author: "GeeksforGeeks", 
    highlights: "Very popular for quick revision", 
    url: "https://www.geeksforgeeks.org/most-asked-75-coding-problems/",
    problems: "75 problems"
  },
  { 
    name: "NeetCode Blind 75 / 150", 
    author: "Neetcode.io", 
    highlights: "Leetcode-style structured sheet", 
    url: "https://neetcode.io/practice?tab=blind75",
    problems: "75/150 problems"
  },
  { 
    name: "Coding Ninjas Problem List", 
    author: "CN Studio", 
    highlights: "Structured by course modules", 
    url: "https://www.naukri.com/code360/problem-lists/ninjas-sde-sheet",
    problems: "SDE Sheet"
  },
  { 
    name: "Leetcode Top Interview Questions", 
    author: "Leetcode", 
    highlights: "Actual curated problems asked by FAANG", 
    url: "https://leetcode.com/studyplan/leetcode-75/",
    problems: "75 problems"
  },
  { 
    name: "Microsoft, Amazon, Google tagged sets", 
    author: "GFG/Leetcode", 
    highlights: "Company-specific sets", 
    url: "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/",
    problems: "Company-wise"
  },
  { 
    name: "All-DSA-Sheets (GitHub)", 
    author: "GFGSC-RTU", 
    highlights: "Includes Striver, Love Babbar, Fraz, Arsh Goyal, etc.", 
    url: "https://github.com/GFGSC-RTU/All-DSA-Sheets",
    problems: "Multiple sheets"
  },
  { 
    name: "450-DSA Platform", 
    author: "Love Babbar Tracker", 
    highlights: "Live tracker for Love Babbar sheet", 
    url: "https://github.com/AsishRaju/450-DSA",
    problems: "450 problems"
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

        <Tabs defaultValue="sheets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="sheets">Top DSA Sheets</TabsTrigger>
            <TabsTrigger value="resources">Additional Resources</TabsTrigger>
            <TabsTrigger value="features">Must-Have Features</TabsTrigger>
          </TabsList>

          <TabsContent value="sheets">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ TOP DSA SHEETS (WITH REAL LINKS)</h2>
              <p className="text-gray-600">Handpicked collection of the most effective DSA problem sheets from top educators and platforms</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dsaSheets.map((sheet, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                        {sheet.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{sheet.author}</p>
                    <Badge variant="secondary" className="text-xs w-fit">
                      {sheet.problems}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {sheet.highlights}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        className="flex-1 mr-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => window.open(sheet.url, '_blank')}
                      >
                        Access Sheet
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(sheet.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 ADDITIONAL RESOURCES TO INTEGRATE</h2>
              <p className="text-gray-600">Comprehensive collection of learning resources to support your DSA journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <resource.icon className="w-6 h-6 mr-3 text-blue-600" />
                      {resource.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {resource.sources}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      Explore Resources
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🔥 MUST-HAVE FEATURES (FOR WORLD-CLASS PLATFORM)</h2>
              <p className="text-gray-600">Advanced features that make this the ultimate DSA learning platform</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mustHaveFeatures.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-gray-900">
                      <section.icon className="w-6 h-6 mr-3 text-blue-600" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
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
