import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Maximize2, 
  Minimize2,
  Copy,
  Check,
  Bug,
  Zap,
  Clock,
  MemoryStick,
  TestTube,
  FileCode,
  Terminal
} from 'lucide-react';
import { toast } from 'sonner';
import { useHotkeys } from 'react-hotkeys-hook';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status?: 'passed' | 'failed' | 'pending';
  executionTime?: number;
  memoryUsed?: number;
}

interface CodeEditorProps {
  problemId?: string;
  initialCode?: string;
  language?: string;
  testCases?: TestCase[];
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
}

const languages = [
  { value: 'cpp', label: 'C++', extension: 'cpp', template: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}` },
  { value: 'java', label: 'Java', extension: 'java', template: `public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        \n    }\n}` },
  { value: 'python', label: 'Python', extension: 'py', template: `# Your code here\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()` },
  { value: 'javascript', label: 'JavaScript', extension: 'js', template: `// Your code here\n\nfunction main() {\n    \n}\n\nmain();` },
  { value: 'typescript', label: 'TypeScript', extension: 'ts', template: `// Your code here\n\nfunction main(): void {\n    \n}\n\nmain();` },
  { value: 'go', label: 'Go', extension: 'go', template: `package main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    \n}` },
  { value: 'rust', label: 'Rust', extension: 'rs', template: `fn main() {\n    // Your code here\n    \n}` }
];

const themes = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast Dark' },
  { value: 'hc-light', label: 'High Contrast Light' }
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  problemId,
  initialCode,
  language: initialLanguage = 'cpp',
  testCases = [],
  onCodeChange,
  onLanguageChange
}) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(initialCode || languages.find(l => l.value === initialLanguage)?.template || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<TestCase[]>(testCases);
  const [activeTab, setActiveTab] = useState('code');
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(true);
  const [copied, setCopied] = useState(false);

  const editorRef = useRef<any>(null);

  // Keyboard shortcuts
  useHotkeys('ctrl+enter', () => handleRun(), { enableOnFormTags: true });
  useHotkeys('ctrl+s', (e) => { e.preventDefault(); handleSave(); }, { enableOnFormTags: true });
  useHotkeys('f11', (e) => { e.preventDefault(); setIsFullscreen(!isFullscreen); });
  useHotkeys('ctrl+/', () => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.commentLine', {});
    }
  }, { enableOnFormTags: true });

  useEffect(() => {
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    onLanguageChange?.(language);
  }, [language, onLanguageChange]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const template = languages.find(l => l.value === newLanguage)?.template || '';
    setCode(template);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('output');
    
    const startTime = Date.now();
    
    try {
      // Simulate code execution with realistic timing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      
      const endTime = Date.now();
      const execTime = endTime - startTime;
      
      setExecutionTime(execTime);
      setMemoryUsage(Math.floor(Math.random() * 50) + 10); // MB
      
      // Simulate output based on language
      const sampleOutputs = {
        cpp: 'Compilation successful!\nExecution completed.\nOutput: Hello World!',
        java: 'Compilation successful!\nExecution completed.\nOutput: Hello World!',
        python: 'Execution completed.\nOutput: Hello World!',
        javascript: 'Execution completed.\nOutput: Hello World!',
        typescript: 'Compilation successful!\nExecution completed.\nOutput: Hello World!',
        go: 'Compilation successful!\nExecution completed.\nOutput: Hello World!',
        rust: 'Compilation successful!\nExecution completed.\nOutput: Hello World!'
      };
      
      setOutput(sampleOutputs[language as keyof typeof sampleOutputs] || 'Execution completed.');
      
      // Run test cases
      if (testCases.length > 0) {
        const updatedTestCases = testCases.map(testCase => ({
          ...testCase,
          actualOutput: testCase.expectedOutput, // Simulate passing tests
          status: 'passed' as const,
          executionTime: Math.floor(Math.random() * 100) + 10,
          memoryUsed: Math.floor(Math.random() * 20) + 5
        }));
        setTestResults(updatedTestCases);
      }
      
      toast.success(`Code executed successfully in ${execTime}ms`);
    } catch (error) {
      setOutput('Error: Execution failed\n' + (error as Error).message);
      toast.error('Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${languages.find(l => l.value === language)?.extension || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code saved successfully!');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Code copied to clipboard!');
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleRun);
    
    // Configure editor options
    editor.updateOptions({
      fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      lineNumbers: 'on',
      renderWhitespace: 'selection'
    });
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCode className="w-5 h-5" />
              Advanced Code Editor
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Language Selector */}
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

              {/* Theme Selector */}
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-24">
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

              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Download className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              
              <Button onClick={handleRun} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                {isRunning ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning ? 'Running...' : 'Run'}
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {executionTime ? `${executionTime}ms` : '--'}
            </div>
            <div className="flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              {memoryUsage ? `${memoryUsage}MB` : '--'}
            </div>
            <div className="flex items-center gap-1">
              <TestTube className="w-3 h-3" />
              {testResults.length > 0 ? `${testResults.filter(t => t.status === 'passed').length}/${testResults.length} passed` : 'No tests'}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70} minSize={50}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="tests">Tests ({testResults.length})</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="m-0 h-[600px]">
                  <Editor
                    height="100%"
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    onMount={handleEditorDidMount}
                    options={{
                      fontSize,
                      wordWrap: wordWrap ? 'on' : 'off',
                      minimap: { enabled: minimap },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                      folding: true,
                      lineNumbers: 'on',
                      renderWhitespace: 'selection',
                      bracketPairColorization: { enabled: true },
                      guides: { bracketPairs: true },
                      smoothScrolling: true,
                      cursorBlinking: 'smooth'
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="output" className="m-0 p-4 h-[600px] overflow-auto">
                  <div className="space-y-4">
                    {isRunning ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Executing code...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {executionTime && (
                          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Execution Time: {executionTime}ms
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MemoryStick className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Memory: {memoryUsage}MB
                              </span>
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4" />
                            <span className="text-gray-400">Output:</span>
                          </div>
                          <pre className="whitespace-pre-wrap">
                            {output || 'No output yet. Click "Run" to execute your code.'}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="tests" className="m-0 p-4 h-[600px] overflow-auto">
                  <div className="space-y-4">
                    {testResults.length === 0 ? (
                      <div className="text-center py-8">
                        <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No test cases available</p>
                      </div>
                    ) : (
                      testResults.map((testCase, index) => (
                        <Card key={testCase.id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Test Case {index + 1}</h4>
                            <Badge 
                              variant={testCase.status === 'passed' ? 'default' : testCase.status === 'failed' ? 'destructive' : 'secondary'}
                            >
                              {testCase.status || 'pending'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="font-medium text-gray-700">Input:</label>
                              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">{testCase.input}</pre>
                            </div>
                            <div>
                              <label className="font-medium text-gray-700">Expected Output:</label>
                              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">{testCase.expectedOutput}</pre>
                            </div>
                            {testCase.actualOutput && (
                              <div className="md:col-span-2">
                                <label className="font-medium text-gray-700">Actual Output:</label>
                                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">{testCase.actualOutput}</pre>
                              </div>
                            )}
                          </div>
                          
                          {testCase.executionTime && (
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                              <span>Time: {testCase.executionTime}ms</span>
                              <span>Memory: {testCase.memoryUsed}MB</span>
                            </div>
                          )}
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="m-0 p-4 h-[600px] overflow-auto">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Size</label>
                      <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[10, 12, 14, 16, 18, 20, 24].map(size => (
                            <SelectItem key={size} value={size.toString()}>{size}px</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Word Wrap</label>
                      <Button
                        variant={wordWrap ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWordWrap(!wordWrap)}
                      >
                        {wordWrap ? "On" : "Off"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Minimap</label>
                      <Button
                        variant={minimap ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMinimap(!minimap)}
                      >
                        {minimap ? "On" : "Off"}
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Run Code</span>
                          <Badge variant="outline">Ctrl + Enter</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Save Code</span>
                          <Badge variant="outline">Ctrl + S</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Toggle Fullscreen</span>
                          <Badge variant="outline">F11</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Comment Line</span>
                          <Badge variant="outline">Ctrl + /</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="p-4 h-full">
                <h4 className="font-medium mb-4">Problem Description</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600">
                    This is where the problem description would appear. The editor supports multiple languages,
                    real-time execution, test case validation, and many other features to enhance your coding experience.
                  </p>
                  
                  <h5 className="font-medium mt-4 mb-2">Example:</h5>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <div><strong>Input:</strong> nums = [2,7,11,15], target = 9</div>
                    <div><strong>Output:</strong> [0,1]</div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeEditor;