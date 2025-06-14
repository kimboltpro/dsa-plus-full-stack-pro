
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sheets = [
  {
    name: "TUF Sheet",
    description: "Take U Forward's comprehensive SDE interview preparation sheet",
    problems: "191 Problems",
    difficulty: "Beginner to Advanced",
    topics: ["Arrays", "Strings", "Trees", "Graphs", "DP"],
    color: "bg-blue-500"
  },
  {
    name: "Striver DSA Sheet",
    description: "79 most important DSA problems for interview preparation",
    problems: "79 Problems",
    difficulty: "Intermediate",
    topics: ["Binary Search", "Heaps", "Recursion", "Backtracking"],
    color: "bg-purple-500"
  },
  {
    name: "Love Babbar 450",
    description: "450 most loved DSA problems curated by Love Babbar",
    problems: "450 Problems",
    difficulty: "All Levels",
    topics: ["Arrays", "Matrix", "Strings", "Trees", "Graphs"],
    color: "bg-green-500"
  },
  {
    name: "Fraz Sheet",
    description: "Curated list of important DSA problems by Mohammad Fraz",
    problems: "400+ Problems",
    difficulty: "Intermediate to Advanced",
    topics: ["Dynamic Programming", "Trees", "Graphs", "Greedy"],
    color: "bg-orange-500"
  },
  {
    name: "GFG Top 100",
    description: "GeeksforGeeks top 100 coding problems for interviews",
    problems: "100 Problems",
    difficulty: "All Levels",
    topics: ["Arrays", "Strings", "Linked Lists", "Trees"],
    color: "bg-teal-500"
  },
  {
    name: "Company Specific",
    description: "Problems asked in top tech companies like Google, Amazon, Microsoft",
    problems: "500+ Problems",
    difficulty: "Advanced",
    topics: ["System Design", "Optimization", "Complex DS"],
    color: "bg-indigo-500"
  }
];

export const Sheets = () => {
  return (
    <section id="sheets" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curated Problem Sheets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access the most popular and effective DSA sheets, all organized and tracked in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sheets.map((sheet, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {sheet.name}
                  </CardTitle>
                  <div className={`w-3 h-3 rounded-full ${sheet.color}`}></div>
                </div>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {sheet.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {sheet.problems}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {sheet.difficulty}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {sheet.topics.map((topic, topicIndex) => (
                    <Badge 
                      key={topicIndex} 
                      variant="outline" 
                      className="text-xs px-2 py-1"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Solving
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
