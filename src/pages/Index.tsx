
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

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Auth CTA Section */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="text-sm font-medium">
            {user ? 'Welcome back! Continue your DSA journey' : 'Start your DSA mastery journey today'}
          </span>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
          >
            {user ? 'Go to Dashboard' : 'Sign Up Free'}
          </Button>
        </div>
      </div>

      <Hero />
      <Features />
      <Sheets />
      <Stats />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
