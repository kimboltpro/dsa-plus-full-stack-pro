
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const dsaSheets = [
    { name: "Striver's SDE Sheet", author: "Take U Forward", problems: "79 handpicked problems", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/" },
    { name: "Fraz Sheet", author: "Fraz (GitHub)", problems: "Topic-wise + difficulty-wise curation", url: "https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPkQojjSZ0Ie" },
    { name: "Love Babbar 450 DSA Sheet", author: "Love Babbar / GFG", problems: "Most followed for placement", url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view" },
    { name: "TUF Sheet", author: "Raj Vikramaditya", problems: "Patterns & intuition with YouTube", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
    { name: "GFG Top 100 Interview Questions", author: "GeeksforGeeks", problems: "Company-tagged questions", url: "https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/" },
    { name: "NeetCode Blind 75", author: "Neetcode.io", problems: "Leetcode-style structured sheet", url: "https://neetcode.io/practice" },
    { name: "Leetcode Top Interview Questions", author: "Leetcode", problems: "FAANG curated problems", url: "https://leetcode.com/explore/interview/card/top-interview-questions-easy/" },
  ];

  const additionalResources = [
    { name: "Theory & Articles", sources: "GeeksforGeeks, W3Schools, Javatpoint", icon: "📘" },
    { name: "Video Explanations", sources: "Striver, CodeHelp, Apna College", icon: "📹" },
    { name: "Cheat Sheets", sources: "GitHub DSA notes, STL references", icon: "📜" },
    { name: "Practice Platforms", sources: "Leetcode, GFG, HackerRank", icon: "🔄" },
    { name: "Interactive Courses", sources: "Coursera, Udemy, GFG self-paced", icon: "🧠" },
    { name: "DSA Trackers", sources: "Notion/Excel templates", icon: "📊" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSA Mastery Hub
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#sheets" className="text-gray-700 hover:text-blue-600 transition-colors">Sheets</a>
              <a href="#resources" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</a>
              <a href="#roadmap" className="text-gray-700 hover:text-blue-600 transition-colors">Roadmap</a>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                      <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                      Pro Features
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[800px] p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {/* DSA Sheets Section */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                              ✅ Top DSA Sheets
                            </h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                              {dsaSheets.map((sheet, index) => (
                                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm text-gray-900">{sheet.name}</h4>
                                      <p className="text-xs text-gray-600 mt-1">{sheet.author}</p>
                                      <p className="text-xs text-blue-600 mt-1">{sheet.problems}</p>
                                    </div>
                                    <a 
                                      href={sheet.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Additional Resources Section */}
                          <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                              📚 Additional Resources
                            </h3>
                            <div className="space-y-3">
                              {additionalResources.map((resource, index) => (
                                <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                                  <h4 className="font-medium text-sm text-gray-900 flex items-center">
                                    <span className="mr-2">{resource.icon}</span>
                                    {resource.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1">{resource.sources}</p>
                                </div>
                              ))}
                            </div>

                            {/* Must-Have Features Preview */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                              <h4 className="font-semibold text-sm text-gray-900 mb-2">🔥 Must-Have Features</h4>
                              <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Interactive Roadmap & Structure</li>
                                <li>• In-built Code Editor</li>
                                <li>• Progress Dashboard & Analytics</li>
                                <li>• Video Tutorial Integration</li>
                                <li>• AI-Powered Hints & Solutions</li>
                                <li>• Mobile App & Offline Mode</li>
                              </ul>
                              <Button 
                                size="sm" 
                                className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600"
                                onClick={() => navigate('/pro')}
                              >
                                View All Pro Features
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
              <a href="#sheets" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Sheets</a>
              <a href="#resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Resources</a>
              <a href="#roadmap" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Roadmap</a>
              
              {/* Mobile Pro Features */}
              <div className="px-3 py-2">
                <button 
                  className="flex items-center text-gray-700 mb-2 w-full text-left"
                  onClick={() => navigate('/pro')}
                >
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="font-medium">Pro Features</span>
                </button>
                <div className="ml-6 space-y-2 text-sm">
                  <div className="text-gray-600">✅ Top DSA Sheets</div>
                  <div className="text-gray-600">📚 Additional Resources</div>
                  <div className="text-gray-600">🔥 Premium Features</div>
                </div>
              </div>
              
              <div className="pt-4 pb-2 space-y-2">
                {user ? (
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => navigate('/auth')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => navigate('/auth')}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
