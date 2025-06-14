
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, Search, Bookmark, Star } from 'lucide-react';

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const topics = ['Array', 'String', 'Tree', 'Graph', 'Dynamic Programming', 'Backtracking', 'Binary Search'];
  const companies = ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber'];
  
  const searchResults = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      topics: ["Array", "Hash Table"],
      companies: ["Google", "Amazon"],
      description: "Given an array of integers nums and an integer target...",
      platform: "LeetCode"
    },
    {
      id: 2,
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      topics: ["Tree", "Dynamic Programming"],
      companies: ["Facebook", "Google"],
      description: "A path in a binary tree is a sequence of nodes...",
      platform: "LeetCode"
    }
  ];

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleCompanyToggle = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-600" />
          Advanced Search & Filter Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search problems by title, description, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leetcode">LeetCode</SelectItem>
                <SelectItem value="gfg">GeeksforGeeks</SelectItem>
                <SelectItem value="hackerrank">HackerRank</SelectItem>
                <SelectItem value="codeforces">Codeforces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sheet Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Sheet</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select sheet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="striver">Striver's SDE Sheet</SelectItem>
                <SelectItem value="lovebabbar">Love Babbar 450</SelectItem>
                <SelectItem value="neetcode">NeetCode 75</SelectItem>
                <SelectItem value="gfg-top100">GFG Top 100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Topics Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox 
                  id={topic}
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={() => handleTopicToggle(topic)}
                />
                <label htmlFor={topic} className="text-sm">{topic}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Companies Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Companies</label>
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <div key={company} className="flex items-center space-x-2">
                <Checkbox 
                  id={company}
                  checked={selectedCompanies.includes(company)}
                  onCheckedChange={() => handleCompanyToggle(company)}
                />
                <label htmlFor={company} className="text-sm">{company}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Searches */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Saved Searches</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
              <Bookmark className="w-3 h-3 mr-1" />
              Google Medium Problems
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
              <Bookmark className="w-3 h-3 mr-1" />
              Dynamic Programming Hard
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-100">
              <Bookmark className="w-3 h-3 mr-1" />
              Array & String Easy
            </Badge>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Search Results (2 found)</h4>
            <Button variant="outline" size="sm">
              Save Search Query
            </Button>
          </div>
          
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div key={result.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium">{result.title}</h5>
                  <div className="flex items-center space-x-2">
                    <Badge variant={result.difficulty === 'Easy' ? 'secondary' : result.difficulty === 'Medium' ? 'default' : 'destructive'}>
                      {result.difficulty}
                    </Badge>
                    <Badge variant="outline">{result.platform}</Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {result.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {result.companies.map((company) => (
                      <Badge key={company} variant="outline" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-medium mb-2 flex items-center">
            <Star className="w-4 h-4 mr-2 text-purple-600" />
            AI-Powered Suggestions
          </h4>
          <p className="text-sm text-purple-700 mb-2">
            Based on your search, you might also be interested in:
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
              "Longest Substring" problems
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
              Similar sliding window problems
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-purple-100">
              Hash table variations
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
