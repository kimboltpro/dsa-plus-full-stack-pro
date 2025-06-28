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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code, Zap, Target, Shield, BookOpen, Trophy, TrendingUp, Users, CheckCircle, Star, Rocket, Brain, Clock, Award, Github, ExternalLink, Play, Monitor, Database, Globe, Terminal, Lightbulb, Siren as Fire, Coffee } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-purple-600 animate-ping"></div>
        </div>
      </div>
    );
  }

  // Enhanced home page for authenticated users
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Enhanced Header for authenticated users */}
        <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Code className="h-8 w-8 text-blue-600 mr-3" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    DSA Mastery Hub
                  </h1>
                  <p className="text-xs text-gray-500">Welcome back, {user.email?.split('@')[0]}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="relative">
                  Dashboard
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1">3</Badge>
                </Button>
                <Button variant="ghost" onClick={() => navigate('/sheets')}>
                  Sheets
                </Button>
                <Button variant="ghost" onClick={() => navigate('/roadmap')}>
                  Roadmap
                </Button>
                <Button variant="ghost" onClick={() => navigate('/playground')} className="relative">
                  <Code className="h-4 w-4 mr-2" />
                  Playground
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </Button>
                <Button variant="ghost" onClick={() => navigate('/pro')} className="text-yellow-600 hover:text-yellow-700">
                  <Star className="h-4 w-4 mr-1" />
                  Pro Features
                </Button>
                <Button variant="ghost" onClick={() => navigate('/fullstack')} className="text-emerald-600 hover:text-emerald-700">
                  <Rocket className="h-4 w-4 mr-1" />
                  Full Stack
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with enhanced design */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
                <Fire className="h-6 w-6 text-orange-500 animate-pulse" />
                <h1 className="text-5xl font-bold text-gray-900">Master DSA Like a Pro</h1>
                <Coffee className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Your ultimate destination for Data Structures & Algorithms mastery. Join 50,000+ developers who've accelerated their careers with our comprehensive platform featuring real-time coding environment, AI assistance, and industry-curated problem sets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/dashboard')}
              >
                <Target className="h-5 w-5 mr-2" />
                Continue Learning
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/playground')}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Coding Now
              </Button>
            </div>

            {/* Quick stats for authenticated users */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">247</div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Topics Mastered</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-orange-600">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="group border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden" onClick={() => navigate('/sheets')}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg ml-3">Problem Sheets</CardTitle>
                </div>
                <CardDescription>
                  Access curated problem sets from top sources like Striver, Love Babbar, and TUF
                </CardDescription>
                <div className="flex items-center mt-3">
                  <Progress value={75} className="flex-1 h-2" />
                  <span className="text-sm text-gray-500 ml-2">75% complete</span>
                </div>
              </CardHeader>
            </Card>

            <Card className="group border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden" onClick={() => navigate('/playground')}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Terminal className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg ml-3">Code Playground</CardTitle>
                </div>
                <CardDescription>
                  Advanced IDE with multi-language support, real-time execution, and AI assistance
                </CardDescription>
                <div className="flex items-center mt-3 space-x-2">
                  <Badge variant="outline" className="text-xs">C++</Badge>
                  <Badge variant="outline" className="text-xs">Java</Badge>
                  <Badge variant="outline" className="text-xs">Python</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="group border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden" onClick={() => navigate('/roadmap')}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg ml-3">DSA Roadmap</CardTitle>
                </div>
                <CardDescription>
                  Follow structured learning paths from basics to advanced topics
                </CardDescription>
                <div className="flex items-center mt-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-purple-400' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">60% progress</span>
                </div>
              </CardHeader>
            </Card>

            <Card className="group border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer relative overflow-hidden" onClick={() => navigate('/pro')}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="relative">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg group-hover:shadow-lg transition-all">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg ml-3">Pro Features</CardTitle>
                </div>
                <CardDescription>
                  Unlock advanced tools, analytics, and premium content
                </CardDescription>
                <div className="flex items-center mt-3">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Rocket className="h-3 w-3 mr-1" />
                    Upgrade
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Enhanced Features Grid */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Developers Choose Us</h2>
            <p className="text-lg text-gray-600 mb-12">Everything you need to excel in technical interviews and advance your career</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-xl">AI-Powered Learning</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Get personalized hints, code reviews, and learning recommendations from our advanced AI assistant
                </p>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="text-xs">Smart Hints</Badge>
                  <Badge variant="outline" className="text-xs">Code Review</Badge>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-xl">Real-Time Analytics</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Track your progress with detailed analytics, performance metrics, and growth insights
                </p>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="text-xs">Performance</Badge>
                  <Badge variant="outline" className="text-xs">Growth</Badge>
                </div>
              </div>
              
              <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-xl">Community Driven</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Learn from and compete with a global community of 50,000+ passionate developers
                </p>
                <div className="mt-4 flex space-x-2">
                  <Badge variant="outline" className="text-xs">Discussions</Badge>
                  <Badge variant="outline" className="text-xs">Competitions</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Technology showcase */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 text-white mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Built for Modern Developers</h2>
              <p className="text-lg opacity-90">Supporting all major programming languages and frameworks</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              {[
                { name: 'JavaScript', icon: '🟨' },
                { name: 'TypeScript', icon: '🔷' },
                { name: 'Python', icon: '🐍' },
                { name: 'Java', icon: '☕' },
                { name: 'C++', icon: '⚡' },
                { name: 'React', icon: '⚛️' },
                { name: 'Node.js', icon: '💚' },
                { name: 'Docker', icon: '🐳' }
              ].map((tech, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{tech.icon}</div>
                  <div className="text-sm opacity-75">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Skills?</h2>
                <p className="text-xl mb-6 opacity-90">
                  Start your journey to becoming a better developer today
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Target className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={() => navigate('/playground')}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Coding
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced authentication-required landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Sheets />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;