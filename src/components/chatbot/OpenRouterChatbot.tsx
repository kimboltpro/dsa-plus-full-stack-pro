import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Settings, 
  Search, 
  Filter,
  Info,
  Zap,
  DollarSign,
  Clock,
  X,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Plus
} from 'lucide-react';

interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider: {
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
  per_request_limits?: {
    prompt_tokens: string;
    completion_tokens: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

const OpenRouterChatbot = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<OpenRouterModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<OpenRouterModel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Fetch models when API key is available
  useEffect(() => {
    if (apiKey) {
      fetchModels();
    }
  }, [apiKey]);

  // Filter models based on search term
  useEffect(() => {
    const filtered = models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredModels(filtered);
  }, [models, searchTerm]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to clean and format message content
  const formatMessageContent = (content: string) => {
    // Remove excessive special characters and clean up text
    let cleaned = content
      .replace(/^[#\-\*\`]+\s*/gm, '') // Remove markdown headers and list markers at start of lines
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
      .replace(/`([^`]+)`/g, '$1') // Remove inline code backticks for now, we'll handle code blocks separately
      .replace(/^\s*[\-\*\+]\s+/gm, '• ') // Convert markdown lists to bullet points
      .trim();

    return cleaned;
  };

  // Function to detect and format code blocks
  const renderFormattedMessage = (content: string) => {
    // Split content by code blocks (```...```)
    const parts = content.split(/(```[\s\S]*?```)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const codeContent = part.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const language = lines[0].toLowerCase();
        const code = lines.slice(language.match(/^(js|javascript|ts|typescript|html|css|python|java|cpp|c)$/) ? 1 : 0).join('\n');
        
        return (
          <div key={index} className="my-4 rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 text-xs ml-2 font-mono">{language || 'code'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  <Copy className="w-3 h-3" />
                  <span className="text-xs ml-1">Copy</span>
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code className="text-green-400 font-mono">{code}</code>
              </pre>
            </div>
          </div>
        );
      } else {
        // Regular text content
        const cleaned = formatMessageContent(part);
        if (!cleaned.trim()) return null;
        
        return (
          <div key={index} className="leading-relaxed">
            {cleaned.split('\n').map((line, lineIndex) => (
              <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                {line.trim() || <br />}
              </p>
            ))}
          </div>
        );
      }
    }).filter(Boolean);
  };

  const saveApiKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey);
    setError('');
    if (apiKey) {
      fetchModels();
    }
  };

  const fetchModels = async () => {
    if (!apiKey) return;
    
    setModelsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models. Please check your API key.');
      }

      const data = await response.json();
      setModels(data.data || []);
      setFilteredModels(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setModelsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedModel || !apiKey) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DSA Mastery Hub',
        },
        body: JSON.stringify({
          model: selectedModel.id,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for DSA Mastery Hub, helping users with programming, algorithms, data structures, and full-stack development questions.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI model');
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'No response received',
        timestamp: new Date(),
        model: selectedModel.name,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num === 0) return 'Free';
    if (num < 0.001) return `$${(num * 1000000).toFixed(2)}/1M tokens`;
    return `$${num.toFixed(4)}/1K tokens`;
  };

  const getModelBadgeColor = (modelId: string) => {
    if (modelId.includes('gpt')) return 'bg-green-100 text-green-800';
    if (modelId.includes('claude')) return 'bg-purple-100 text-purple-800';
    if (modelId.includes('llama')) return 'bg-blue-100 text-blue-800';
    if (modelId.includes('gemini')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const renderMessage = (message: ChatMessage) => (
    <div key={message.id} className={`flex gap-3 mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
          
          <div className="prose prose-sm max-w-none">
            {renderFormattedMessage(message.content)}
          </div>
          
          {message.role === 'assistant' && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => navigator.clipboard.writeText(message.content)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500 hover:text-green-600 hover:bg-green-50">
                <ThumbsUp className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50">
                <ThumbsDown className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                <RotateCcw className="w-3 h-3" />
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
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chat Assistance
          </h3>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access 350+ AI models through OpenRouter. Get help with coding, algorithms, and development questions.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100">
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="models" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Bot className="w-4 h-4 mr-2" />
            Models
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Settings className="w-4 h-4" />
                </div>
                OpenRouter Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your OpenRouter API key"
                      className="pr-10 bg-white border-gray-200 focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button 
                    onClick={saveApiKey}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Save
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Get your free API key from{' '}
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                    OpenRouter.ai
                  </a>
                </p>
              </div>

              {apiKey && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">API Key Configured</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {models.length > 0 ? `${models.length} models loaded` : 'Loading models...'}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  Available Models ({filteredModels.length})
                </CardTitle>
                {modelsLoading && <Loader2 className="w-4 h-4 animate-spin text-purple-500" />}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchModels}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredModels.length === 0 && !modelsLoading && (
                <p className="text-gray-500 text-center py-8">
                  {apiKey ? 'No models found. Try refreshing.' : 'Configure your API key to load models.'}
                </p>
              )}
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedModel?.id === model.id 
                        ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{model.name}</h4>
                        <p className="text-sm text-gray-500">{model.id}</p>
                      </div>
                      <Badge className={getModelBadgeColor(model.id)}>
                        {model.id.split('/')[0]}
                      </Badge>
                    </div>
                    
                    {model.description && (
                      <p className="text-sm text-gray-700 mb-2">{model.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-3 h-3" />
                        Input: {formatPrice(model.pricing.prompt)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-3 h-3" />
                        Output: {formatPrice(model.pricing.completion)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Info className="w-3 h-3" />
                        {model.context_length.toLocaleString()} tokens
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  Chat Assistance
                </CardTitle>
                {selectedModel && (
                  <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                    {selectedModel.name}
                  </Badge>
                )}
              </div>
              {!selectedModel && (
                <p className="text-sm text-gray-500">Select a model from the Models tab to start chatting</p>
              )}
            </CardHeader>
            <CardContent>
              {selectedModel ? (
                <div className="space-y-4">
                  {/* Chat Messages Area */}
                  <div className="h-[500px] overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white rounded-xl p-4 border border-gray-100">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                          <Bot className="w-8 h-8 text-purple-500" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Start a conversation!</h4>
                        <p className="text-gray-600 text-sm mb-6">Ask me anything about programming, algorithms, or development.</p>
                        
                        {/* Quick Start Suggestions */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[
                            "Explain JavaScript variables",
                            "Help with React components", 
                            "Debug my code",
                            "System design patterns"
                          ].map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="outline"
                              size="sm"
                              onClick={() => setInputMessage(suggestion)}
                              className="text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(renderMessage)}
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
                    )}
                  </div>
                  
                  {/* Message Input Area */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask anything about programming, DSA, or development..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={isLoading}
                        className="min-h-[50px] max-h-32 resize-none bg-white border-gray-200 focus:ring-2 focus:ring-purple-500 rounded-xl"
                        rows={1}
                      />
                    </div>
                    <Button 
                      onClick={sendMessage} 
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl h-12 w-12 p-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {messages.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMessages([])}
                        className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Clear Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Export Chat
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium mb-2">Setup Required</p>
                  <p className="text-sm">Configure your API key and select a model to start chatting</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenRouterChatbot;
