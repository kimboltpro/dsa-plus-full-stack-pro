import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  Settings, 
  Maximize, 
  Minimize,
  Copy,
  Clock,
  Zap,
  Bug,
  FileCode,
  Terminal,
  Lightbulb,
  BookOpen,
  Code2
} from 'lucide-react';
import { toast } from 'sonner';

const PlaygroundPage = () => {
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // Sample problem: Find maximum sum subarray (Kadane's Algorithm)
    vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    
    int maxSum = arr[0];
    int currentSum = arr[0];
    
    for (int i = 1; i < arr.size(); i++) {
        currentSum = max(arr[i], currentSum + arr[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    cout << "Maximum subarray sum: " << maxSum << endl;
    return 0;
}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const editorRef = useRef(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const languages = [
    { 
      value: 'cpp', 
      label: 'C++', 
      template: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // Your solution here
    cout << "Hello, DSA Mastery Hub!" << endl;
    return 0;
}`
    },
    { 
      value: 'java', 
      label: 'Java', 
      template: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        // Your solution here
        System.out.println("Hello, DSA Mastery Hub!");
    }
}`
    },
    { 
      value: 'python', 
      label: 'Python', 
      template: `# Your solution here
def main():
    print("Hello, DSA Mastery Hub!")

if __name__ == "__main__":
    main()`
    },
    { 
      value: 'javascript', 
      label: 'JavaScript', 
      template: `// Your solution here
function main() {
    console.log("Hello, DSA Mastery Hub!");
}

main();`
    }
  ];

  const themes = [
    { value: 'dark', label: 'Dark Theme' },
    { value: 'light', label: 'Light Theme' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'github', label: 'GitHub' }
  ];

  const sampleProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
      ],
      hints: [
        "Try using a hash map to store values and their indices",
        "Check if target - current number exists in the hash map"
      ],
      companies: ["Google", "Amazon", "Microsoft"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
      ],
      hints: [
        "Use a stack data structure",
        "Push opening brackets and pop when you see closing brackets"
      ],
      companies: ["Facebook", "Amazon", "Google"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    {
      id: 3,
      title: "Maximum Subarray",
      difficulty: "Medium",
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
        { input: 'nums = [1]', output: '1' },
        { input: 'nums = [5,4,-1,7,8]', output: '23' }
      ],
      hints: [
        "This is a classic dynamic programming problem (Kadane's Algorithm)",
        "Keep track of the maximum sum ending at current position"
      ],
      companies: ["Microsoft", "Google", "Amazon"],
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    }
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template = languages.find(lang => lang.value === newLanguage)?.template || '';
    setCode(template);
    toast.info(`Switched to ${languages.find(lang => lang.value === newLanguage)?.label}`);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setExecutionTime(0);
    const startTime = Date.now();
    
    // Simulate code execution with realistic timing
    const executionInterval = setInterval(() => {
      setExecutionTime(Date.now() - startTime);
    }, 10);

    try {
      // Simulate API call to code execution service
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      // Mock successful execution
      const mockOutput = `Hello, DSA Mastery Hub!

Exit code: 0
Execution time: ${Date.now() - startTime}ms
Memory used: ${Math.floor(Math.random() * 1024 + 512)}KB`;
      
      setOutput(mockOutput);
      setMemoryUsage(Math.floor(Math.random() * 1024 + 512));
      toast.success('Code executed successfully!');
    } catch (error) {
      setOutput('Error: Execution failed\nPlease check your code for syntax errors.');
      toast.error('Execution failed');
    } finally {
      clearInterval(executionInterval);
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    const codeData = {
      language,
      code,
      timestamp: new Date().toISOString(),
      problem: selectedProblem?.title || 'Untitled'
    };
    localStorage.setItem(`playground_${Date.now()}`, JSON.stringify(codeData));
    toast.success('Code saved to local storage!');
  };

  const handleReset = () => {
    const template = languages.find(lang => lang.value === language)?.template || '';
    setCode(template);
    setInput('');
    setOutput('');
    toast.info('Code reset to template');
  };

  const handleDownload = () => {
    const extension = {
      cpp: 'cpp',
      java: 'java',
      python: 'py',
      javascript: 'js'
    }[language];
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-green-400 border-gray-700';
      case 'light':
        return 'bg-white text-gray-900 border-gray-300';
      case 'monokai':
        return 'bg-gray-800 text-yellow-300 border-gray-600';
      case 'github':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-900 text-green-400 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Code2 className="h-8 w-8 mr-3 text-blue-600" />
            Advanced Code Playground
          </h1>
          <p className="text-gray-600">
            Professional IDE experience with multi-language support, syntax highlighting, and real-time execution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problem Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Practice Problems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleProblems.map((problem) => (
                  <div 
                    key={problem.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedProblem?.id === problem.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedProblem(problem)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{problem.title}</h3>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{problem.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {problem.companies.slice(0, 2).map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Browse More Problems
                </Button>
              </CardContent>
            </Card>

            {/* Problem Details */}
            {selectedProblem && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedProblem.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(selectedProblem.difficulty)}>
                      {selectedProblem.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Time: {selectedProblem.timeComplexity} | Space: {selectedProblem.spaceComplexity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedProblem.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Examples</h4>
                    <div className="space-y-2">
                      {selectedProblem.examples.map((example, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Hints</h4>
                    <ul className="space-y-1">
                      {selectedProblem.hints.map((hint, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start">
                          <span className="mr-2">💡</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Companies</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedProblem.companies.map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Terminal className="h-5 w-5 mr-2" />
                    Code Editor
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {/* Language Selection */}
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Theme Selection */}
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Font Size */}
                    <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12px</SelectItem>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Editor Actions */}
                    <Button size="sm" variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                    
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    
                    <Button size="sm" variant="outline" onClick={handleSave}>
                      <Save className="h-4 w-4" />
                    </Button>

                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button size="sm" onClick={handleRun} disabled={isRunning}>
                      {isRunning ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs defaultValue="code" className="h-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="code" className="flex items-center">
                      <FileCode className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="input">Input</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="debug">Debug</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="m-0 p-4 h-96">
                    <Textarea
                      ref={editorRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Write your code here..."
                      className={`h-full font-mono resize-none ${getThemeStyles()}`}
                      style={{ fontSize: `${fontSize}px` }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="input" className="m-0 p-4 h-96">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your test input here..."
                      className="h-full font-mono text-sm resize-none"
                    />
                  </TabsContent>
                  
                  <TabsContent value="output" className="m-0 p-4 h-96">
                    <div className="h-full flex flex-col">
                      {/* Execution Stats */}
                      {(executionTime > 0 || memoryUsage > 0) && (
                        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-blue-600" />
                            <span className="text-sm font-medium">
                              {isRunning ? `${executionTime}ms` : `${executionTime}ms`}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm font-medium">{memoryUsage}KB</span>
                          </div>
                          {isRunning && (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                              <span className="text-sm text-blue-600">Executing...</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <ScrollArea className="flex-1 h-full">
                        <pre className={`h-full overflow-auto text-sm p-4 rounded border font-mono ${getThemeStyles()}`}>
                          {output || 'Run your code to see the output here...'}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="debug" className="m-0 p-4 h-96">
                    <div className="h-full">
                      <div className="flex items-center mb-4">
                        <Bug className="h-5 w-5 mr-2 text-red-600" />
                        <h3 className="font-medium">Debug Console</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Code Analysis</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">
                            No syntax errors detected. Code is ready for execution.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <Lightbulb className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm font-medium">Optimization Suggestions</span>
                          </div>
                          <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                            <li>• Consider using const for variables that don't change</li>
                            <li>• Add input validation for edge cases</li>
                          </ul>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                          <Bug className="h-4 w-4 mr-2" />
                          Set Breakpoint
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              {/* Test Cases Section */}
              <div className="p-4 border-t">
                <h4 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Test Cases
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Test Case 1: Passed</span>
                      <Badge variant="outline" className="text-xs">100ms</Badge>
                    </div>
                    <div className="text-xs text-gray-600 ml-6">
                      Input: [2,7,11,15], target = 9<br/>
                      Expected: [0,1]<br/>
                      Got: [0,1] ✓
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Test Case 2: Failed</span>
                      <Badge variant="outline" className="text-xs">150ms</Badge>
                    </div>
                    <div className="text-xs text-gray-600 ml-6">
                      Input: [3,2,4], target = 6<br/>
                      Expected: [1,2]<br/>
                      Got: [0,2] ✗
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Tests Passed: <span className="font-medium">1/2</span>
                    </span>
                    <Progress value={50} className="w-20 h-2" />
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Run All Tests
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="font-medium">Quick Actions</h3>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import File
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Auto-save:</span>
                <Badge variant="outline" className="text-green-600 border-green-600">ON</Badge>
                <span>Last saved: 2 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PlaygroundPage;