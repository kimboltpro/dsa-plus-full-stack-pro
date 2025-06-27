import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Code, 
  Zap, 
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  Search,
  Settings,
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  FileCode,
  Cpu,
  Brain,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  isLoading?: boolean;
  feedback?: 'positive' | 'negative' | null;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  strengths: string[];
  contextLength: number;
  pricing: string;
  isAvailable: boolean;
}

const models: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Advanced multimodal model with strong coding capabilities',
    capabilities: ['Code generation', 'Debugging', 'Explanation', 'Optimization'],
    strengths: ['Accurate code generation', 'Detailed explanations', 'Algorithm design'],
    contextLength: 128000,
    pricing: '$0.01/1K tokens',
    isAvailable: true
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Powerful model with excellent reasoning and code understanding',
    capabilities: ['Code generation', 'Debugging', 'Explanation', 'Documentation'],
    strengths: ['Detailed reasoning', 'Code understanding', 'Documentation generation'],
    contextLength: 200000,
    pricing: '$0.015/1K tokens',
    isAvailable: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s advanced model with strong coding capabilities',
    capabilities: ['Code generation', 'Explanation', 'Translation'],
    strengths: ['Fast responses', 'Multilingual code', 'Integration with Google services'],
    contextLength: 32000,
    pricing: '$0.0025/1K tokens',
    isAvailable: true
  },
  {
    id: 'codellama-70b',
    name: 'CodeLlama 70B',
    provider: 'Meta',
    description: 'Specialized code generation model',
    capabilities: ['Code generation', 'Completion', 'Explanation'],
    strengths: ['Programming language expertise', 'Code completion', 'Fast generation'],
    contextLength: 16000,
    pricing: '$0.005/1K tokens',
    isAvailable: true
  }
];

const samplePrompts = [
  "Explain the time complexity of quicksort algorithm",
  "Debug this code: function fib(n) { if (n <= 0) return 0; if (n == 1) return 1; return fib(n-1) + fib(n+1); }",
  "Write a function to check if a binary tree is balanced",
  "Optimize this code for better performance: function isPrime(n) { for(let i=2; i<n; i++) if(n%i===0) return false; return n>1; }",
  "Explain the difference between BFS and DFS traversal",
  "Convert this recursive solution to iterative: function factorial(n) { return n <= 1 ? 1 : n * factorial(n-1); }"
];

export const AICodeAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'I am your AI coding assistant. I can help you with algorithm explanations, code generation, debugging, and optimization. How can I help you today?',
      timestamp: new Date(),
      model: 'System'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(models[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateSampleResponse(inputMessage),
        timestamp: new Date(),
        model: selectedModel.name
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateSampleResponse = (query: string): string => {
    // This is a placeholder function that would be replaced with actual API calls
    if (query.toLowerCase().includes('sort') || query.toLowerCase().includes('complexity')) {
      return `# Time Complexity of Quicksort

Quicksort has different time complexities depending on the scenario:

- **Best Case**: O(n log n)
- **Average Case**: O(n log n)
- **Worst Case**: O(n²)

The worst case occurs when the pivot selection consistently results in highly unbalanced partitions, such as when the array is already sorted and we always pick the first or last element as the pivot.

Here's a simple implementation of quicksort in JavaScript:

\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
\`\`\`

To improve the worst-case scenario, you can use techniques like:
1. Choosing a random pivot
2. Using the "median-of-three" pivot selection
3. Implementing hybrid sorting algorithms (e.g., combining quicksort with insertion sort for small subarrays)`;
    }
    
    if (query.toLowerCase().includes('debug')) {
      return `I found a bug in your Fibonacci function:

\`\`\`javascript
function fib(n) { 
  if (n <= 0) return 0; 
  if (n == 1) return 1; 
  return fib(n-1) + fib(n+1); // BUG HERE
}
\`\`\`

The issue is in the recursive calls. You're calling \`fib(n-1) + fib(n+1)\` which will lead to an infinite recursion because \`fib(n+1)\` will always increase the argument.

The correct implementation should be:

\`\`\`javascript
function fib(n) { 
  if (n <= 0) return 0; 
  if (n == 1) return 1; 
  return fib(n-1) + fib(n-2); // FIXED
}
\`\`\`

This correctly implements the Fibonacci sequence where each number is the sum of the two preceding ones.

However, this implementation still has exponential time complexity O(2^n) due to repeated calculations. For better performance, consider using dynamic programming:

\`\`\`javascript
function fib(n) {
  if (n <= 0) return 0;
  if (n == 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}
\`\`\`

This iterative solution has O(n) time complexity and O(1) space complexity.`;
    }
    
    if (query.toLowerCase().includes('balanced') && query.toLowerCase().includes('tree')) {
      return `# Checking if a Binary Tree is Balanced

A balanced binary tree is one where the height difference between the left and right subtrees of any node is not more than 1.

Here's a function to check if a binary tree is balanced:

\`\`\`javascript
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isBalanced(root) {
  // Returns -1 if the tree is unbalanced, otherwise returns the height
  function checkHeight(node) {
    if (!node) return 0;
    
    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1;
    
    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1;
    
    // Check if current node is balanced
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    
    // Return height of current subtree
    return Math.max(leftHeight, rightHeight) + 1;
  }
  
  return checkHeight(root) !== -1;
}
\`\`\`

This solution uses a bottom-up approach with a time complexity of O(n), where n is the number of nodes in the tree. It calculates the height of each subtree only once, making it efficient.

The function returns true if the tree is balanced and false otherwise.

Example usage:
\`\`\`javascript
// Balanced tree
//     1
//    / \\
//   2   3
//  / \\
// 4   5
const balancedTree = new TreeNode(1, 
  new TreeNode(2, new TreeNode(4), new TreeNode(5)), 
  new TreeNode(3)
);
console.log(isBalanced(balancedTree)); // true

// Unbalanced tree
//     1
//    / 
//   2   
//  / 
// 3
const unbalancedTree = new TreeNode(1, 
  new TreeNode(2, new TreeNode(3), null), 
  null
);
console.log(isBalanced(unbalancedTree)); // false
\`\`\``;
    }
    
    // Default response
    return `Thank you for your question! I'd be happy to help with "${query}".

As an AI coding assistant, I can provide:

1. Algorithm explanations
2. Code generation and implementation
3. Debugging assistance
4. Optimization suggestions
5. Time and space complexity analysis

Could you provide more details about what you're trying to accomplish? For example:
- What programming language are you using?
- What specific problem are you trying to solve?
- Do you have any existing code you'd like me to review?

The more context you provide, the better I can assist you!`;
  };

  const handleCopyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: msg.feedback === feedback ? null : feedback } 
          : msg
      )
    );
    toast.success(feedback === 'positive' ? 'Thanks for the positive feedback!' : 'Thanks for the feedback. We\'ll improve.');
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  const renderMessageContent = (content: string) => {
    // Split content by code blocks (```...```)
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const codeContent = part.slice(3, -3).trim();
        const firstLineBreak = codeContent.indexOf('\n');
        let language = 'javascript'; // Default language
        let code = codeContent;
        
        if (firstLineBreak !== -1) {
          const firstLine = codeContent.substring(0, firstLineBreak).trim();
          if (['javascript', 'js', 'typescript', 'ts', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust'].includes(firstLine)) {
            language = firstLine;
            code = codeContent.substring(firstLineBreak + 1);
          }
        }
        
        return (
          <div key={index} className="my-4 rounded-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200">
              <span className="text-xs font-mono">{language}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-gray-300 hover:text-white"
                onClick={() => handleCopyMessage(code)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={atomOneDark}
              customStyle={{ margin: 0, padding: '1rem' }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      } else if (part.startsWith('# ')) {
        // This is a heading
        const lines = part.split('\n');
        return (
          <div key={index} className="my-4">
            {lines.map((line, lineIndex) => {
              if (line.startsWith('# ')) {
                return <h3 key={lineIndex} className="text-xl font-bold mb-2">{line.substring(2)}</h3>;
              } else if (line.startsWith('## ')) {
                return <h4 key={lineIndex} className="text-lg font-bold mb-2">{line.substring(3)}</h4>;
              } else if (line.startsWith('### ')) {
                return <h5 key={lineIndex} className="text-base font-bold mb-2">{line.substring(4)}</h5>;
              } else if (line.startsWith('- ')) {
                return <li key={lineIndex} className="ml-4">{line.substring(2)}</li>;
              } else if (line.match(/^\d+\. /)) {
                return <li key={lineIndex} className="ml-4">{line.substring(line.indexOf(' ') + 1)}</li>;
              } else if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={lineIndex} className="font-bold">{line.substring(2, line.length - 2)}</p>;
              } else {
                return <p key={lineIndex} className="mb-2">{line}</p>;
              }
            })}
          </div>
        );
      } else {
        // Regular text
        return <p key={index} className="mb-4 whitespace-pre-line">{part}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Code Assistant
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your intelligent coding companion for algorithm explanations, code generation, debugging, and optimization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="models" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Bot className="w-4 h-4 mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Available AI Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {models.map((model) => (
                    <Card 
                      key={model.id} 
                      className={`cursor-pointer hover:shadow-lg transition-all ${
                        selectedModel.id === model.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{model.name}</h3>
                            <Badge variant="outline">{model.provider}</Badge>
                          </div>
                          {selectedModel.id === model.id && (
                            <CheckCircle className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 uppercase">Capabilities</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {model.capabilities.map((capability) => (
                                <Badge key={capability} variant="secondary" className="text-xs">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Context Length</span>
                            <span>{(model.contextLength / 1000).toFixed(0)}K tokens</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pricing</span>
                            <span>{model.pricing}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat with {selectedModel.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  <div className="space-y-6">
                    {messages.slice(1).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <Bot className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">How can I help you code today?</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          Ask me about algorithms, data structures, code optimization, debugging, or any programming concept.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                          {samplePrompts.slice(0, 4).map((prompt, index) => (
                            <Button 
                              key={index} 
                              variant="outline" 
                              className="justify-start text-left h-auto py-2"
                              onClick={() => handlePromptClick(prompt)}
                            >
                              <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{prompt}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.slice(1).map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : ''}`}>
                            <div
                              className={`p-4 rounded-2xl shadow-sm ${
                                message.role === 'user'
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-4'
                                  : 'bg-white border border-gray-200 shadow-md'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium opacity-75">
                                  {message.role === 'user' ? 'You' : (message.model || 'AI Assistant')}
                                </span>
                                <span className="text-xs opacity-50">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              
                              {message.isLoading ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Thinking...</span>
                                </div>
                              ) : (
                                <div className="prose prose-sm max-w-none">
                                  {renderMessageContent(message.content)}
                                </div>
                              )}
                              
                              {message.role === 'assistant' && (
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    onClick={() => handleCopyMessage(message.content)}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`h-7 px-2 ${message.feedback === 'positive' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                                    onClick={() => handleFeedback(message.id, 'positive')}
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`h-7 px-2 ${message.feedback === 'negative' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                                    onClick={() => handleFeedback(message.id, 'negative')}
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => toast.success('Message saved to your collection')}
                                  >
                                    <Bookmark className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {message.role === 'user' && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          </div>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-600">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="mt-auto">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about algorithms, data structures, or code..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={isLoading}
                        className="min-h-[50px] max-h-32 resize-none bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl"
                        rows={1}
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl h-12 w-12 p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Sparkles className="w-3 h-3" />
                    <span>Using {selectedModel.name} • Context: {(selectedModel.contextLength / 1000).toFixed(0)}K tokens</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Assistant Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Response Style</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all ring-2 ring-purple-500 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium">Code-focused</h4>
                      </div>
                      <p className="text-sm text-gray-600">Prioritize code examples with minimal explanations</p>
                    </Card>
                    
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium">Educational</h4>
                      </div>
                      <p className="text-sm text-gray-600">Detailed explanations with theory and examples</p>
                    </Card>
                    
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium">Concise</h4>
                      </div>
                      <p className="text-sm text-gray-600">Brief, to-the-point responses</p>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Code Language Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Language</label>
                      <Select defaultValue="javascript">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Languages</label>
                      <Select defaultValue="python">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Response Length</label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concise">Concise</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Code Style</label>
                      <Select defaultValue="standard">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="functional">Functional</SelectItem>
                          <SelectItem value="object-oriented">Object-Oriented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Include Comments</label>
                      <Select defaultValue="moderate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="extensive">Extensive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileCode className="w-5 h-5" />
                    Code Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Save and access your frequently used code templates
                  </p>
                  <Button className="w-full">Manage Templates</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cpu className="w-5 h-5" />
                    API Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your own API keys for enhanced capabilities
                  </p>
                  <Button className="w-full">Configure API</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="w-5 h-5" />
                    Learning Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Enable detailed explanations for learning purposes
                  </p>
                  <Button className="w-full">Configure Learning</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium">Code Generation</h3>
            </div>
            <p className="text-sm text-gray-700">Generate optimized code in multiple languages</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Algorithm Mastery</h3>
            </div>
            <p className="text-sm text-gray-700">Learn complex algorithms with step-by-step explanations</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Instant Debugging</h3>
            </div>
            <p className="text-sm text-gray-700">Identify and fix bugs in your code quickly</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium">Performance Optimization</h3>
            </div>
            <p className="text-sm text-gray-700">Get suggestions to improve code efficiency</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICodeAssistant;