
import React, { useState, useEffect } from 'react';

const CodingTerminal = () => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const codeSnippets = [
    `// Binary Search Implementation
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`,

    `// Merge Sort Algorithm
void mergeSort(vector<int>& arr, int l, int r) {
  if (l >= r) return;
  
  int mid = l + (r - l) / 2;
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  merge(arr, l, mid, r);
}`,

    `# Dynamic Programming - Fibonacci
def fibonacci(n, memo={}):
  if n in memo:
    return memo[n]
  
  if n <= 2:
    return 1
  
  memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
  return memo[n]`,

    `// Graph BFS Traversal
class Graph {
  bfs(start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node)) {
        visited.add(node);
        result.push(node);
        queue.push(...this.adjacencyList[node]);
      }
    }
    
    return result;
  }
}`,

    `// Sliding Window Maximum
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
  deque<int> dq;
  vector<int> result;
  
  for (int i = 0; i < nums.size(); i++) {
    while (!dq.empty() && dq.front() <= i - k) {
      dq.pop_front();
    }
    
    while (!dq.empty() && nums[dq.back()] <= nums[i]) {
      dq.pop_back();
    }
    
    dq.push_back(i);
    
    if (i >= k - 1) {
      result.push_back(nums[dq.front()]);
    }
  }
  
  return result;
}`
  ];

  const fullCode = codeSnippets.join('\n\n');

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < fullCode.length) {
        setDisplayedCode(fullCode.substring(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      } else {
        // Reset and start over
        setTimeout(() => {
          setDisplayedCode('');
          setCurrentIndex(0);
        }, 3000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, fullCode]);

  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      <div className="relative h-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto p-8">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700/30 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/40 rounded-t-lg border-b border-gray-700/30">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm ml-4">dsa-practice.js</span>
              </div>
              <div className="text-gray-500 text-xs">
                <span className="animate-pulse">●</span> Live Coding Session
              </div>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm h-96 overflow-hidden">
              <pre className="text-green-400 leading-relaxed">
                <code>
                  {displayedCode}
                  <span className="animate-pulse text-cyan-400">|</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Binary Code */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400/20 font-mono text-xs animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodingTerminal;
