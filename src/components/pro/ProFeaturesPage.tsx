
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, ExternalLink, BookOpen, Video, FileText, Code, Search, Trophy, Brain, Globe, Smartphone, Star } from 'lucide-react';

const dsaSheets = [
  { name: "Striver's SDE Sheet", author: "Take U Forward", highlights: "79 handpicked problems for interviews", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
  { name: "Fraz Sheet", author: "Fraz (GitHub)", highlights: "Topic-wise + difficulty-wise curation", url: "https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPkQojjSZ0Ie" },
  { name: "Love Babbar 450 DSA Sheet", author: "Love Babbar / GFG", highlights: "One of the most followed sheets for placement", url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view" },
  { name: "TUF Sheet (Take U Forward)", author: "Raj Vikramaditya", highlights: "Covers patterns & intuition with YouTube links", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
  { name: "SDE Sheet by Raj Vikramaditya", author: "TUF", highlights: "Focus on patterns (Sliding window, DP, etc.)", url: "https://takeuforward.org/" },
  { name: "GFG Top 100 Interview Questions", author: "GeeksforGeeks", highlights: "Company-tagged questions", url: "https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/" },
  { name: "GFG Must-Do 75/150", author: "GeeksforGeeks", highlights: "Very popular for quick revision", url: "https://www.geeksforgeeks.org/must-do-coding-questions-for-companies-like-amazon-microsoft-adobe/" },
  { name: "NeetCode Blind 75 / 150", author: "Neetcode.io", highlights: "Leetcode-style structured sheet", url: "https://neetcode.io/practice" },
  { name: "Coding Ninjas Problem List", author: "CN Studio", highlights: "Structured by course modules", url: "https://www.codingninjas.com/" },
  { name: "Leetcode Top Interview Questions", author: "Leetcode", highlights: "Actual curated problems asked by FAANG", url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/" },
  { name: "Microsoft, Amazon, Google tagged sets", author: "GFG/Leetcode", highlights: "Company-specific sets", url: "https://leetcode.com/company/" },
  { name: "Scaler Academy DSA Tracks", author: "Scaler", highlights: "Their syllabus sheets & modules", url: "https://www.scaler.com/" },
  { name: "CS50 Problem Sets", author: "Harvard (for basics)", highlights: "Brilliant for foundation", url: "https://cs50.harvard.edu/" },
  { name: "MIT OCW Algorithms Problem Sets", author: "MIT OpenCourseWare", highlights: "Gold-standard academic DSA resources", url: "https://ocw.mit.edu/" }
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
  { category: "🧭 ROADMAP & STRUCTURE", features: ["Beginner to Advanced interactive roadmap", "Visual dependency tree of concepts", "Toggle switch: 'Sheet mode' / 'Roadmap mode'"] },
  { category: "🧩 SHEET INTEGRATION", features: ["All sheets tabbed with filters: Easy, Medium, Hard, Topic, Platform", "Option to 'Add your own sheet' (crowdsourced mode)"] },
  { category: "🎯 PROBLEM ATTEMPT TRACKER", features: ["Solved, attempted, bookmarked, marked for review", "Cloud sync via user account", "Daily streak tracking + XP points"] },
  { category: "💻 IN-BUILT CODE EDITOR", features: ["Supports C++, Java, Python with custom test cases", "Monaco or Ace editor + language switcher", "Save code per question (autosave & backup)"] },
  { category: "📊 DASHBOARD", features: ["Total questions solved, daily/weekly goals", "Time spent on topics", "Pie chart by sheet/topic/difficulty", "Certificate unlock on completion (gamify)"] },
  { category: "📹 VIDEO TUTORIAL EMBED", features: ["Auto-embed video tutorials (Striver, Babbar, Apna College, etc.)", "Toggle to view 'only problems with video explanation'"] },
  { category: "🔍 SEARCH & FILTER ENGINE", features: ["Smart filtering by topic, tag, difficulty, company, platform, sheet", "Full-text search (even inside problem description)"] },
  { category: "📚 THEORY + EXAMPLES", features: ["GFG/W3Schools/Notes under each topic (in markdown)", "AI assistant to explain problem & give hints"] },
  { category: "💡 WEEKLY CHALLENGES", features: ["Daily 2–5 problem suggestions based on your progress", "Community leaderboard", "Feature to challenge a friend (duel mode)"] },
  { category: "🧑‍💻 INTERVIEW MODE", features: ["Timer-based 'mock' tests with questions from top companies", "After test: Performance graph + solutions"] },
  { category: "🧠 NOTES & DISCUSSIONS", features: ["Personal notes section per problem/topic", "Public discussions (like Leetcode)", "Upvote/downvote explanations"] },
  { category: "🌐 MULTI-LANGUAGE SUPPORT", features: ["Add Hindi/English toggle for beginners", "Regional language support for future expansion"] },
  { category: "📲 MOBILE RESPONSIVE + PWA", features: ["Save to home screen", "Offline mode for sheets + notes", "Push notifications for challenge alerts"] },
  { category: "🎁 EXTRAS FOR UNIQUENESS", features: ["📦 AI Mode: Use Openrouter to give dynamic hints or partial solutions", "🏆 Badges for milestones: 50Qs, 100Qs, 1st DP solved, etc.", "🔗 Smart Links: Hover over any GFG/W3 link to show preview/snippet"] }
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ TOP DSA SHEETS (TO INTEGRATE)</h2>
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
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {sheet.highlights}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        className="flex-1 mr-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                    <CardTitle className="text-lg text-gray-900">
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {feature}
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
