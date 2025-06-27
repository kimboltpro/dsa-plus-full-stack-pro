import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import PlaygroundPage from "./components/playground/PlaygroundPage";
import RoadmapPage from "./components/roadmap/RoadmapPage";
import SheetsPage from "./components/sheets/SheetsPage";
import ProFeaturesPage from "./components/pro/ProFeaturesPage";
import FullStackPage from "./components/fullstack/FullStackPage";

// Enhanced Components
import AdvancedDashboard from "./components/enhanced/AdvancedDashboard";
import SmartRoadmap from "./components/enhanced/SmartRoadmap";
import ProblemSolver from "./components/enhanced/ProblemSolver";
import CodeEditor from "./components/enhanced/CodeEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<AdvancedDashboard />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/roadmap" element={<SmartRoadmap />} />
              <Route path="/sheets" element={<SheetsPage />} />
              <Route path="/pro" element={<ProFeaturesPage />} />
              <Route path="/fullstack" element={<FullStackPage />} />
              
              {/* Enhanced Routes */}
              <Route path="/solve/:problemId" element={<ProblemSolver />} />
              <Route path="/editor" element={<CodeEditor />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/dashboard-legacy" element={<Dashboard />} />
              <Route path="/roadmap-legacy" element={<RoadmapPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;