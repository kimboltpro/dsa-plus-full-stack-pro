
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Sheets } from "@/components/Sheets";
import { Stats } from "@/components/Stats";
import { Resources } from "@/components/Resources";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
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
