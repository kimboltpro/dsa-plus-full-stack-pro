
import { Button } from "@/components/ui/button";
import { Menu, X, Crown, Code2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
              
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => navigate('/pro')}
              >
                <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                Pro Features
              </button>

              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                onClick={() => navigate('/fullstack')}
              >
                <div className="relative mr-2">
                  <Code2 className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80"></div>
                </div>
                <span className="font-medium">Full Stack</span>
              </button>
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
                  className="flex items-center text-gray-700 w-full text-left"
                  onClick={() => navigate('/pro')}
                >
                  <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="font-medium">Pro Features</span>
                </button>
              </div>

              {/* Mobile Full Stack */}
              <div className="px-3 py-2">
                <button 
                  className="flex items-center text-gray-700 w-full text-left group"
                  onClick={() => navigate('/fullstack')}
                >
                  <div className="relative mr-2">
                    <Code2 className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80"></div>
                  </div>
                  <span className="font-medium">Full Stack</span>
                </button>
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
