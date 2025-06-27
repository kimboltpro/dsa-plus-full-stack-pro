
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import PlaygroundPage from "./components/playground/PlaygroundPage";
import RoadmapPage from "./components/roadmap/RoadmapPage";
import SheetsPage from "./components/sheets/SheetsPage";
import ProFeaturesPage from "./components/pro/ProFeaturesPage";
import FullStackPage from "./components/fullstack/FullStackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/sheets" element={<SheetsPage />} />
            <Route path="/pro" element={<ProFeaturesPage />} />
            <Route path="/fullstack" element={<FullStackPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
