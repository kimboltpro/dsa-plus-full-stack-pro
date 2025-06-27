import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Code, 
  CheckCircle, 
  Clock, 
  Star, 
  Bookmark, 
  Share2, 
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
  Award,
  Timer,
  Brain,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  companies: string[];
  likes: number;
  dislikes: number;
  acceptance: number;
  submissions: number;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  hints: string[];
  followUp?: string;
  relatedProblems: Array<{
    id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}

interface Solution {
  id: string;
  language: string;
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  author: string;
  votes: number;
  isAccepted: boolean;
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status?: 'passed' | 'failed' | 'pending';
  executionTime?: number;
  memoryUsed?: number;
}

const sampleProblem: Problem = {
  id: '1',
  title: 'Two Sum',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  difficulty: 'easy',
  topics: ['Array', 'Hash Table'],
  companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
  likes: 15420,
  dislikes: 512,
  acceptance: 49.2,
  submissions: 3142567,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]'
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]'
    }
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  hints: [
    'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it\'s best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.',
    'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?',
    'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?'
  ],
  followUp: 'What if the array is sorted? What if the same number appears multiple times?',
  relatedProblems: [
    { id: '2', title: 'Three Sum', difficulty: 'medium' },
    { id: '3', title: 'Four Sum', difficulty: 'medium' },
    { id: '4', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'easy' }
  ]
};

const sampleTestCases: TestCase[] = [
  {
    id: '1',
    input: '[2,7,11,15]\n9',
    expectedOutput: '[0,1]'
  },
  {
    id: '2',
    input: '[3,2,4]\n6',
    expectedOutput: '[1,2]'
  },
  {
    id: '3',
    input: '[3,3]\n6',
    expectedOutput: '[0,1]'
  }
];

const sampleSolutions: Solution[] = [
  {
    id: '1',
    language: 'cpp',
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`,
    explanation: 'Use a hash map to store the complement of each number. For each number, check if its complement exists in the map.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    author: 'LeetCode',
    votes: 1250,
    isAccepted: true
  },
  {
    id: '2',
    language: 'python',
    code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashmap = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hashmap:
                return [hashmap[complement], i]
            hashmap[num] = i
        return []`,
    explanation: 'Python implementation using dictionary for O(1) lookup time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    author: 'Community',
    votes: 890,
    isAccepted: true
  }
];

export const ProblemSolver: React.FC = () => {
  const [problem] = useState<Problem>(sampleProblem);
  const [testCases] = useState<TestCase[]>(sampleTestCases);
  const [solutions] = useState<Solution[]>(sampleSolutions);
  const [userCode, setUserCode] = useState('');
  const [userLanguage, setUserLanguage] = useState('cpp');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Problem link copied to clipboard!');
  };

  const handleSubmit = () => {
    toast.success('Solution submitted successfully!');
  };

  const showNextHint = () => {
    if (currentHint < problem.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Timer className="w-4 h-4" />
                {formatTime(timeSpent)}
              </div>
              
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Problem Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {problem.likes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="w-4 h-4" />
              {problem.dislikes.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {problem.acceptance}% Acceptance
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {problem.submissions.toLocaleString()} Submissions
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Description */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="solutions">Solutions</TabsTrigger>
                    <TabsTrigger value="discuss">Discuss</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="description" className="space-y-6">
                  {/* Problem Description */}
                  <div>
                    <h3 className="font-semibold mb-3">Problem</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line">{problem.description}</p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-semibold mb-3">Examples</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium mb-2">Example {index + 1}:</div>
                          <div className="space-y-2 text-sm">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            {example.explanation && (
                              <div><strong>Explanation:</strong> {example.explanation}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-semibold mb-3">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Topics and Companies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Topics</h4>
                      <div className="flex flex-wrap gap-1">
                        {problem.topics.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Companies</h4>
                      <div className="flex flex-wrap gap-1">
                        {problem.companies.map((company) => (
                          <Badge key={company} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hints */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Hints</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHints(!showHints)}
                      >
                        {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showHints ? 'Hide' : 'Show'} Hints
                      </Button>
                    </div>
                    
                    {showHints && (
                      <div className="space-y-3">
                        {problem.hints.slice(0, currentHint + 1).map((hint, index) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-yellow-800 mb-1">Hint {index + 1}</div>
                                <p className="text-sm text-yellow-700">{hint}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {currentHint < problem.hints.length - 1 && (
                          <Button variant="outline" size="sm" onClick={showNextHint}>
                            Show Next Hint
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Related Problems */}
                  <div>
                    <h3 className="font-semibold mb-3">Related Problems</h3>
                    <div className="space-y-2">
                      {problem.relatedProblems.map((relatedProblem) => (
                        <div key={relatedProblem.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">{relatedProblem.title}</span>
                          <Badge className={getDifficultyColor(relatedProblem.difficulty)} variant="outline">
                            {relatedProblem.difficulty}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="solutions" className="space-y-4">
                  {solutions.map((solution) => (
                    <Card key={solution.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{solution.language}</Badge>
                          {solution.isAccepted && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="w-4 h-4" />
                            {solution.votes}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-3">
                        <pre>{solution.code}</pre>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>Explanation:</strong> {solution.explanation}</p>
                        <div className="flex gap-4">
                          <span><strong>Time:</strong> {solution.timeComplexity}</span>
                          <span><strong>Space:</strong> {solution.spaceComplexity}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="discuss" className="space-y-4">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Discussion feature coming soon!</p>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Personal Notes</h3>
                    <Textarea
                      placeholder="Write your notes, approach, or observations here..."
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <Button className="mt-2" onClick={() => toast.success('Notes saved!')}>
                      Save Notes
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="space-y-6">
            <CodeEditor
              problemId={problem.id}
              testCases={testCases}
              onCodeChange={setUserCode}
              onLanguageChange={setUserLanguage}
            />
            
            {/* Submit Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Solution
                    </Button>
                    <Button variant="outline">
                      <Flag className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Time spent: {formatTime(timeSpent)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolver;