
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Book, 
  Code, 
  ArrowUp,
  Search,
  FileText,
  User as UserIcon,
  Book as BookIcon
} from "lucide-react";

const features = [
  {
    icon: <User className="h-8 w-8" />,
    title: "DSA Roadmap Module",
    description: "Interactive flowchart from basics to advanced topics with progress tracking and milestone highlighting.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BookIcon className="h-8 w-8" />,
    title: "Curated Sheets Section",
    description: "Access TUF, Fraz, Striver, Love Babbar 450, and more with topic-wise organization and progress sync.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Articles & Tutorials",
    description: "GFG articles, W3Schools tutorials, and educational content organized by topic with note-taking.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Code Playground",
    description: "Built-in editor with custom test cases, problem tracking, and solution management.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: <ArrowUp className="h-8 w-8" />,
    title: "Progress Tracker",
    description: "Visual progress charts, streak counters, milestone badges, and competitive leaderboards.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: <UserIcon className="h-8 w-8" />,
    title: "Interview Questions Bank",
    description: "Company-specific interview problems with filtering, bookmarking, and solution tracking.",
    gradient: "from-teal-500 to-cyan-500"
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Smart Search & Filters",
    description: "Full-text search across problems and articles with advanced filtering by topic and difficulty.",
    gradient: "from-rose-500 to-pink-500"
  },
  {
    icon: <Book className="h-8 w-8" />,
    title: "Resources Hub",
    description: "PDF sheets, YouTube playlists, cheat sheets, and comprehensive learning materials in one place.",
    gradient: "from-amber-500 to-orange-500"
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Master DSA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            8 comprehensive modules designed to take you from beginner to expert in Data Structures and Algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
