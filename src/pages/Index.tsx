
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Sheets } from "@/components/Sheets";
import { Stats } from "@/components/Stats";
import { Resources } from "@/components/Resources";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Zap, Target, Shield, BookOpen, Trophy } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show full home page for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Header for authenticated users */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DSA Mastery Hub
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate('/sheets')}>
                  Sheets
                </Button>
                <Button variant="ghost" onClick={() => navigate('/roadmap')}>
                  Roadmap
                </Button>
                <Button variant="ghost" onClick={() => navigate('/playground')}>
                  Playground
                </Button>
                <Button variant="ghost" onClick={() => navigate('/pro')}>
                  🌟 Pro Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/fullstack')}>
                  🚀 Full Stack
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your ultimate destination for Data Structures & Algorithms mastery. Access TUF Sheet, Striver Sheet, Love Babbar 450, and more — all organized, tracked, and optimized for your success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/roadmap')}
              >
                📋 View Roadmap
              </Button>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors cursor-pointer" onClick={() => navigate('/sheets')}>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle className="text-lg">Problem Sheets</CardTitle>
                </div>
                <CardDescription>
                  Access curated problem sets from top sources
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-green-100 hover:border-green-200 transition-colors cursor-pointer" onClick={() => navigate('/playground')}>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Code className="h-6 w-6 text-green-600 mr-2" />
                  <CardTitle className="text-lg">Code Playground</CardTitle>
                </div>
                <CardDescription>
                  Practice coding with our interactive environment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors cursor-pointer" onClick={() => navigate('/roadmap')}>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Target className="h-6 w-6 text-purple-600 mr-2" />
                  <CardTitle className="text-lg">DSA Roadmap</CardTitle>
                </div>
                <CardDescription>
                  Follow structured learning paths
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-200 transition-colors cursor-pointer" onClick={() => navigate('/pro')}>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Zap className="h-6 w-6 text-orange-600 mr-2" />
                  <CardTitle className="text-lg">Pro Features</CardTitle>
                </div>
                <CardDescription>
                  Unlock advanced tools and analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Features Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Everything You Need to Master DSA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600 text-center">Monitor your learning journey with detailed analytics</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <Code className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Coding</h3>
                <p className="text-sm text-gray-600 text-center">Practice with built-in code editor and feedback</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
                <Trophy className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Achievement System</h3>
                <p className="text-sm text-gray-600 text-center">Earn badges as you master different topics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication-required landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSA Mastery Hub
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Data Structures & Algorithms
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of developers who have accelerated their coding journey with our comprehensive DSA learning platform
          </p>
          
          {/* Auth Required Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Authentication Required</span>
            </div>
            <p className="text-gray-600 mb-4">
              To access our comprehensive DSA learning resources, interactive coding environment, and track your progress, please sign up or sign in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate('/auth')}
              >
                Sign Up Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle className="text-lg">Progress Tracking</CardTitle>
              </div>
              <CardDescription>
                Monitor your learning journey with detailed analytics and milestone tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Overall Progress</span>
                  <span className="text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Code className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle className="text-lg">Interactive Coding</CardTitle>
              </div>
              <CardDescription>
                Practice with our built-in code editor and instant feedback system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>function binarySearch(arr, target) &#123;</div>
                <div className="ml-4">let left = 0, right = arr.length - 1;</div>
                <div className="ml-4">// ... implementation</div>
                <div>&#125;</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Trophy className="h-6 w-6 text-purple-600 mr-2" />
                <CardTitle className="text-lg">Achievement System</CardTitle>
              </div>
              <CardDescription>
                Earn badges and unlock achievements as you master different topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                  🏆 Array Master
                </div>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                  🔍 Search Expert
                </div>
                <div className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">
                  🌟 Tree Wizard
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What You'll Get Access To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Sheets</h3>
              <p className="text-sm text-gray-600 text-center">Curated problem sets covering all DSA topics</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
              <Code className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Live Coding Environment</h3>
              <p className="text-sm text-gray-600 text-center">Practice coding with instant feedback</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
              <Target className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Roadmaps</h3>
              <p className="text-sm text-gray-600 text-center">Tailored learning paths for your goals</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Chat Assistant</h3>
              <p className="text-sm text-gray-600 text-center">Get help from our intelligent coding assistant</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join our community and take your coding skills to the next level
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('/auth')}
            >
              Get Started Now - It's Free!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
