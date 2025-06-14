
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Youtube, Book, Code } from "lucide-react";

const resources = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "PDF Cheat Sheets",
    description: "Downloadable quick reference guides for all DSA topics",
    count: "25+ PDFs",
    color: "bg-red-500"
  },
  {
    icon: <Youtube className="h-6 w-6" />,
    title: "Video Tutorials",
    description: "Curated playlists from top educators like Striver, Love Babbar",
    count: "500+ Videos",
    color: "bg-red-600"
  },
  {
    icon: <Book className="h-6 w-6" />,
    title: "Articles & Blogs",
    description: "In-depth explanations and tutorials from GFG and W3Schools",
    count: "1000+ Articles",
    color: "bg-blue-500"
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Code Templates",
    description: "Ready-to-use code templates for common algorithms and patterns",
    count: "100+ Templates",
    color: "bg-green-500"
  }
];

export const Resources = () => {
  return (
    <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Learning Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to supplement your learning journey, from quick references to detailed tutorials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resources.map((resource, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center text-white mx-auto mb-4`}>
                  {resource.icon}
                </div>
                <CardTitle className="text-lg font-semibold">
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <div className="text-sm font-medium text-blue-600">
                  {resource.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Access All Resources
          </Button>
        </div>
      </div>
    </section>
  );
};
