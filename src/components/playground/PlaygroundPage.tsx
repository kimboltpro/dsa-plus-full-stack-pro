
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const PlaygroundPage = () => {
  const { user, loading } = useAuth();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, DSA Mastery Hub!" << endl;
    return 0;
}`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

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
    { value: 'cpp', label: 'C++', template: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello, DSA Mastery Hub!" << endl;\n    return 0;\n}` },
    { value: 'java', label: 'Java', template: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, DSA Mastery Hub!");\n    }\n}` },
    { value: 'python', label: 'Python', template: `# Your code here\nprint("Hello, DSA Mastery Hub!")` },
    { value: 'javascript', label: 'JavaScript', template: `// Your code here\nconsole.log("Hello, DSA Mastery Hub!");` }
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template = languages.find(lang => lang.value === newLanguage)?.template || '';
    setCode(template);
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput('Hello, DSA Mastery Hub!\n\nExecution completed successfully!');
      setIsRunning(false);
      toast.success('Code executed successfully!');
    }, 2000);
  };

  const handleSave = () => {
    toast.success('Code saved to your workspace!');
  };

  const handleReset = () => {
    const template = languages.find(lang => lang.value === language)?.template || '';
    setCode(template);
    setInput('');
    setOutput('');
    toast.info('Code reset to template');
  };

  const sampleProblems = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
      ]
    },
    {
      id: 2,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Code Playground
          </h1>
          <p className="text-gray-600">
            Write, test, and debug your solutions in a powerful online IDE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Description */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sample Problems</span>
                  <Badge variant="outline">Practice</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleProblems.map((problem) => (
                  <div key={problem.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{problem.title}</h3>
                      <Badge 
                        className={
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Examples:</p>
                      {problem.examples.map((example, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => toast.info(`Loading ${problem.title} template...`)}
                    >
                      Solve This Problem
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
                  <div className="flex items-center space-x-2">
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
                    <Button size="sm" variant="outline" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" onClick={handleRun} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-1" />
                      {isRunning ? 'Running...' : 'Run'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="code" className="h-full">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="input">Input</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="code" className="m-0 p-4 h-96">
                    <Textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Write your code here..."
                      className="h-full font-mono text-sm resize-none"
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
                    <div className="h-full">
                      {isRunning ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-gray-600">Executing code...</span>
                        </div>
                      ) : (
                        <pre className="h-full overflow-auto text-sm bg-gray-50 p-4 rounded border font-mono">
                          {output || 'Run your code to see the output here...'}
                        </pre>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Test Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Test Case 1: Passed</span>
                    </div>
                    <div className="text-xs text-gray-600 ml-6">
                      Input: [2,7,11,15], target = 9<br/>
                      Expected: [0,1]<br/>
                      Got: [0,1]
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Test Case 2: Failed</span>
                    </div>
                    <div className="text-xs text-gray-600 ml-6">
                      Input: [3,2,4], target = 6<br/>
                      Expected: [1,2]<br/>
                      Got: [0,2]
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaygroundPage;
