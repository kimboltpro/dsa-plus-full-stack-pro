
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  MessageCircle, 
  Rocket, 
  BookOpen, 
  Users, 
  Trophy,
  Zap,
  Target,
  Globe,
  Database,
  Server,
  Smartphone,
  Brain,
  PlayCircle
} from 'lucide-react';
import InteractiveProjectBuilder from './InteractiveProjectBuilder';
import { useNavigate } from 'react-router-dom';

const FullStackPage = () => {
  const navigate = useNavigate();

  const handleChatAssistanceStart = () => {
    // Navigate to playground or a dedicated chat page
    navigate('/playground');
  };

  const handleInteractiveProjectsStart = () => {
    // Scroll to the Interactive Project Builder section
    const projectSection = document.getElementById('interactive-projects-section');
    if (projectSection) {
      projectSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
                ← Back
              </Button>
              <div className="flex items-center">
                <Rocket className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Full Stack Development Hub
                  </h1>
                  <p className="text-gray-600 mt-1">Build, Deploy, and Scale Modern Applications</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                🚀 Pro Features
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Transform Ideas into Production-Ready Applications
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Master full-stack development with our comprehensive platform featuring AI-powered coding assistance, 
            interactive project tutorials, and real-world deployment workflows.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Building Now
            </Button>
            <Button variant="outline" size="lg">
              <BookOpen className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Chat Assistance Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-pink-50 via-purple-50 to-violet-50 border-2 border-purple-100">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 mr-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">Chat Assistance</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">✨ Featured</Badge>
                    <Badge className="bg-purple-100 text-purple-800">⚡</Badge>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Get instant help from 350+ AI models for coding, debugging, and learning
              </p>
              
              <Button 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 text-lg group-hover:scale-105 transition-transform"
                onClick={handleChatAssistanceStart}
              >
                Get Started ✨
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Brain className="w-5 h-5 text-purple-600 mr-2" />
                    AI Capabilities
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Code Generation
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Bug Fixing
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Code Review
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      Learning Help
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    🤖 Powered by Claude, GPT-4, and more
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Projects Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-2 border-blue-100">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mr-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-2xl font-bold text-gray-900">Interactive Projects</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">✨ Featured</Badge>
                    <Badge className="bg-blue-100 text-blue-800">⚡</Badge>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Build real projects with step-by-step tutorials and live code environments
              </p>
              
              <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 text-lg group-hover:scale-105 transition-transform"
                onClick={handleInteractiveProjectsStart}
              >
                Get Started ✨
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Code className="w-5 h-5 text-blue-600 mr-2" />
                    Project Types
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      React Apps
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                      Node.js APIs
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Full Stack
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Mobile Apps
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    🛠️ Live coding environments included
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Master Modern Technologies</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'React', icon: '⚛️', color: 'from-blue-400 to-blue-600' },
              { name: 'Node.js', icon: '🟢', color: 'from-green-400 to-green-600' },
              { name: 'TypeScript', icon: '📘', color: 'from-blue-500 to-indigo-600' },
              { name: 'Next.js', icon: '▲', color: 'from-gray-700 to-gray-900' },
              { name: 'MongoDB', icon: '🍃', color: 'from-green-500 to-emerald-600' },
              { name: 'PostgreSQL', icon: '🐘', color: 'from-blue-600 to-purple-600' },
            ].map((tech, index) => (
              <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow bg-white border-2 hover:border-gray-300">
                <div className={`text-3xl mb-2 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                  {tech.icon}
                </div>
                <div className="font-semibold text-gray-900">{tech.name}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Project Builder Section */}
        <div id="interactive-projects-section">
          <InteractiveProjectBuilder />
        </div>

        {/* Learning Path */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Your Learning Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">1. Learn Fundamentals</h4>
              <p className="text-gray-600">Master the basics with interactive tutorials and hands-on exercises</p>
            </Card>
            <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">2. Build Projects</h4>
              <p className="text-gray-600">Apply your knowledge by building real-world applications</p>
            </Card>
            <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
              <Trophy className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-3">3. Deploy & Scale</h4>
              <p className="text-gray-600">Launch your applications and learn production best practices</p>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-blue-700 mt-1">Project Templates</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-3xl font-bold text-green-600">350+</div>
            <div className="text-sm text-green-700 mt-1">AI Models</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-purple-700 mt-1">Hands-on Learning</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-orange-700 mt-1">AI Support</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 border-0">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</CardTitle>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of developers who are accelerating their careers with our full-stack development platform
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Your First Project
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FullStackPage;
