
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Monitor, Play, Save, Download } from 'lucide-react';

const CodeEditor = () => {
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    
    for(int num : nums) {
        cout << num << " ";
    }
    
    return 0;
}`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput('1 2 3 4 5\n\nExecution completed successfully!');
      setIsRunning(false);
    }, 1500);
  };

  const handleSave = () => {
    localStorage.setItem(`code_${Date.now()}`, JSON.stringify({ language, code }));
    alert('Code saved successfully!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-blue-600" />
          In-Built Code Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline">Auto-save enabled</Badge>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" onClick={handleRun} disabled={isRunning}>
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Code Editor</h4>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm min-h-[300px] bg-gray-900 text-green-400 border-gray-700"
              placeholder="Write your code here..."
            />
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Output</h4>
            <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm min-h-[300px] border">
              {isRunning ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                  Executing code...
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{output || 'No output yet. Click "Run Code" to execute.'}</pre>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Custom Test Cases</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea 
              placeholder="Input test case 1&#10;Example: 5&#10;1 2 3 4 5"
              className="text-sm"
              rows={3}
            />
            <Textarea 
              placeholder="Expected output 1&#10;Example: 15"
              className="text-sm"
              rows={3}
            />
          </div>
          <Button className="mt-2" size="sm">
            Test Against Custom Cases
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
