
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Code, 
  Zap, 
  BarChart3, 
  Eye, 
  Gamepad2, 
  ExternalLink, 
  Search, 
  Star, 
  Heart, 
  Sparkles,
  FileText,
  Activity,
  Puzzle,
  Wrench
} from 'lucide-react';

const dsaResources = {
  cheatSheets: [
    {
      name: "Striver's STL Cheat Sheet",
      topics: "C++ STL (vectors, sets, maps)",
      link: "https://takeuforward.org/c/c-stl-tutorial-most-frequent-used-stl-containers/",
      description:
        "Comprehensive C++ STL reference with examples and time complexities",
      rating: 4.9,
      category: "C++",
    },
    {
      name: "Techie Delight Cheat Sheet",
      topics: "Patterns, complexities",
      link: "https://www.techiedelight.com/data-structures-and-algorithms-problems/",
      description: "Quick reference for common DSA patterns and algorithms",
      rating: 4.7,
      category: "General",
    },
    {
      name: "Codeforces STL Sheet",
      topics: "Competitive C++",
      link: "https://codeforces.com/blog/entry/74684",
      description: "Essential STL functions for competitive programming",
      rating: 4.8,
      category: "C++",
    },
    {
      name: "Python DSA Cheatsheet",
      topics: "Lists, dicts, sets, heaps",
      link: "https://www.stationx.net/python-data-structures-cheat-sheet/",
      description: "Python data structures and algorithms quick reference",
      rating: 4.6,
      category: "Python",
    },
    {
      name: "Java DSA Cheatsheet",
      topics: "Collections, recursion",
      link: "https://javaconceptoftheday.com/java-collections-cheat-sheet/",
      description: "Java collections framework and common algorithms",
      rating: 4.5,
      category: "Java",
    },
  ],
  complexityTables: [
    {
      name: "Big-O Complexity Graph",
      description: "Interactive complexity comparison chart with visual graphs",
      link: "https://www.bigocheatsheet.com/",
      rating: 4.9,
      category: "Reference"
    },
    {
      name: "GFG Time/Space Complexity List",
      description: "Comprehensive list of algorithm complexities with explanations",
      link: "https://www.geeksforgeeks.org/g-fact-86/",
      rating: 4.6,
      category: "Reference"
    },
    {
      name: "MIT's Complexity Chart",
      description: "Academic reference for computational complexity theory",
      link: "https://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-17.html",
      rating: 4.8,
      category: "Academic"
    }
  ],
  codeGenerators: [
    {
      name: "STL Visualizer",
      description: "C++ STL step-by-step execution visualization",
      link: "https://pythontutor.com/cpp.html",
      rating: 4.8,
      category: "Visualization"
    },
    {
      name: "Java Collections Visualizer",
      description: "HashMap, TreeMap visual representations",
      link: "https://visualgo.net/en",
      rating: 4.7,
      category: "Visualization"
    },
    {
      name: "Binary Tree Generator",
      description: "Create custom test cases for tree problems",
      link: "https://btv.melezinek.cz/",
      rating: 4.5,
      category: "Generator"
    },
    {
      name: "Custom Input Generator Tool",
      description: "Generate sorted/random input files for testing",
      link: "https://www.random.org/",
      rating: 4.3,
      category: "Generator"
    },
    {
      name: "OnlineGDB",
      description: "Online IDE to run and debug DSA problems",
      link: "https://www.onlinegdb.com/",
      rating: 4.6,
      category: "IDE"
    },
    {
      name: "Replit Templates",
      description: "Prebuilt DSA boilerplates for quick start",
      link: "https://replit.com/@templates",
      rating: 4.4,
      category: "Templates"
    }
  ],
  templates: [
    {
      name: "C++ DSA Template",
      description: "Striver's competitive programming template with fast I/O",
      link: "https://github.com/striver79/StriversCpSheet",
      rating: 4.9,
      category: "C++"
    },
    {
      name: "Java Fast IO + DSA Template",
      description: "Optimized Java template for competitive programming",
      link: "https://github.com/anishLearnsToCode/java-dsa-template",
      rating: 4.7,
      category: "Java"
    },
    {
      name: "Python Competitive Starter",
      description: "Python boilerplate with common imports and utilities",
      link: "https://github.com/cheran-senthil/PyRival",
      rating: 4.6,
      category: "Python"
    }
  ],
  theoryPatterns: [
    {
      name: "TUF A-Z Sheet",
      description: "Pattern-first roadmap for complete DSA mastery",
      link: "https://takeuforward.org/strivers-a2z-dsa-course/",
      rating: 4.9,
      category: "Roadmap"
    },
    {
      name: "Leetcode Patterns",
      description: "Tag and technique-based problem categorization",
      link: "https://seanprashad.com/leetcode-patterns/",
      rating: 4.8,
      category: "Patterns"
    },
    {
      name: "Coding Interview University",
      description: "Complete computer science degree curriculum",
      link: "https://github.com/jwasham/coding-interview-university",
      rating: 4.9,
      category: "Comprehensive"
    },
    {
      name: "MIT OCW Algorithms",
      description: "Pure academic algorithms course from MIT",
      link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
      rating: 4.8,
      category: "Academic"
    },
    {
      name: "Visual Algo",
      description: "Step-by-step algorithm visualizations",
      link: "https://visualgo.net/en",
      rating: 4.7,
      category: "Visual Learning"
    }
  ],
  visualizationTools: [
    {
      name: "VisualGo",
      description: "Interactive data structure and algorithm animations",
      link: "https://visualgo.net/en",
      rating: 4.9,
      category: "Interactive"
    },
    {
      name: "AlgoExpert Visualizer",
      description: "Premium algorithm visualization platform",
      link: "https://www.algoexpert.io",
      rating: 4.8,
      category: "Premium"
    },
    {
      name: "Recursion Tree Builder",
      description: "Manual recursion tree drawing and visualization",
      link: "https://recursion-tree.vercel.app/",
      rating: 4.5,
      category: "Recursion"
    },
    {
      name: "Trie Visual Tool",
      description: "Construct Trie data structure with step-by-step view",
      link: "https://www.cs.usfca.edu/~galles/visualization/Trie.html",
      rating: 4.6,
      category: "Data Structures"
    }
  ],
  gamifiedPractice: [
    {
      name: "Coding Ninja Studio",
      description: "XP system with structured learning paths",
      link: "https://www.naukri.com/code360",
      rating: 4.7,
      category: "Gamified"
    },
    {
      name: "Codewars",
      description: "Kata-based coding challenges with belt system",
      link: "https://www.codewars.com/",
      rating: 4.6,
      category: "Challenges"
    },
    {
      name: "LeetCode Missions",
      description: "Daily missions and streak tracking",
      link: "https://leetcode.com",
      rating: 4.8,
      category: "Daily Practice"
    },
    {
      name: "GFG Daily Challenges",
      description: "Problem of the day with streak system",
      link: "https://www.geeksforgeeks.org/problem-of-the-day/",
      rating: 4.5,
      category: "Daily Practice"
    }
  ]
};

const DSAToolkit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());

  const toggleSaved = (resourceName: string) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceName)) {
      newSaved.delete(resourceName);
    } else {
      newSaved.add(resourceName);
    }
    setSavedResources(newSaved);
  };

  const getRandomResource = () => {
    const allResources = Object.values(dsaResources).flat();
    const randomResource = allResources[Math.floor(Math.random() * allResources.length)];
    window.open(randomResource.link, '_blank');
  };

  const filterResources = (resources: any[]) => {
    return resources.filter(resource => 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderResourceCard = (resource: any) => (
    <Card key={resource.name} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
              {resource.name}
            </CardTitle>
            {resource.topics && (
              <p className="text-sm text-gray-600 mt-1">{resource.topics}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaved(resource.name)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Heart 
                className={`w-4 h-4 ${savedResources.has(resource.name) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold ml-1">{resource.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">{resource.description}</p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs px-2 py-1">
              {resource.category}
            </Badge>
            
            <Button 
              asChild 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Open Tool
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const sections = [
    { 
      id: 'cheat-sheets', 
      title: '🧠 Cheat Sheets & Quick References', 
      icon: FileText, 
      data: dsaResources.cheatSheets,
      description: 'Quick reference materials for algorithms and data structures'
    },
    { 
      id: 'complexity', 
      title: '🔍 Complexity Reference Tables', 
      icon: BarChart3, 
      data: dsaResources.complexityTables,
      description: 'Time and space complexity references for algorithms'
    },
    { 
      id: 'generators', 
      title: '🛠 Code Generators & Playgrounds', 
      icon: Code, 
      data: dsaResources.codeGenerators,
      description: 'Tools for generating code snippets and testing environments'
    },
    { 
      id: 'templates', 
      title: '🧩 Templates & Boilerplates', 
      icon: Puzzle, 
      data: dsaResources.templates,
      description: 'Ready-to-use code templates for competitive programming'
    },
    { 
      id: 'theory', 
      title: '📚 Theory & Pattern Repositories', 
      icon: BookOpen, 
      data: dsaResources.theoryPatterns,
      description: 'Comprehensive learning resources and pattern guides'
    },
    { 
      id: 'visualization', 
      title: '🧠 Visualization Tools', 
      icon: Eye, 
      data: dsaResources.visualizationTools,
      description: 'Interactive tools for visualizing algorithms and data structures'
    },
    { 
      id: 'gamified', 
      title: '🎮 Gamified DSA Practice', 
      icon: Gamepad2, 
      data: dsaResources.gamifiedPractice,
      description: 'Fun and engaging platforms for practicing DSA problems'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Wrench className="w-6 h-6 mr-3 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSA Toolkit
              </CardTitle>
              <p className="text-gray-600 mt-1">Master resources collection for comprehensive DSA preparation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={getRandomResource}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Random Tool
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search resources by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="cheat-sheets" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                className="text-xs lg:text-sm"
              >
                <section.icon className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">{section.title.split(' ')[1]}</span>
                <span className="lg:hidden">{section.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600">{section.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterResources(section.data).map(renderResourceCard)}
              </div>
              
              {filterResources(section.data).length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No resources found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Saved Resources Summary */}
        {savedResources.size > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
              My Saved Toolkit ({savedResources.size} resources)
            </h4>
            <p className="text-sm text-blue-700">
              You have saved {savedResources.size} resources to your personal toolkit. 
              Access them anytime for quick reference!
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(dsaResources).flat().length}
            </div>
            <div className="text-sm text-blue-700">Total Resources</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">7</div>
            <div className="text-sm text-green-700">Categories</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(Object.values(dsaResources).flat().reduce((sum, r) => sum + r.rating, 0) / Object.values(dsaResources).flat().length).toFixed(1)}
            </div>
            <div className="text-sm text-purple-700">Avg Rating</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{savedResources.size}</div>
            <div className="text-sm text-orange-700">Saved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DSAToolkit;
