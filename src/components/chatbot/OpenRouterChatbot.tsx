
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Loader2
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">🤖 AI Assistant (OpenRouter)</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access 350+ AI models through OpenRouter. Get help with coding, algorithms, and development questions.
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
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
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button onClick={saveApiKey}>Save</Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Get your free API key from{' '}
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    OpenRouter.ai
                  </a>
                </p>
              </div>

              {apiKey && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Available Models ({filteredModels.length})
                </CardTitle>
                {modelsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={fetchModels}>
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
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedModel?.id === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
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

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Chat Assistant
                </CardTitle>
                {selectedModel && (
                  <Badge className={getModelBadgeColor(selectedModel.id)}>
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
                  <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Start a conversation! Ask me anything about programming, algorithms, or development.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border shadow-sm'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {message.role === 'user' ? (
                                  <User className="w-4 h-4" />
                                ) : (
                                  <Bot className="w-4 h-4" />
                                )}
                                <span className="text-xs opacity-75">
                                  {message.role === 'user' ? 'You' : message.model || 'Assistant'}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-50 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white border shadow-sm p-3 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm text-gray-600">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about programming, DSA, or development..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      disabled={isLoading}
                    />
                    <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {messages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessages([])}
                      className="w-full"
                    >
                      Clear Chat History
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Configure your API key and select a model to start chatting</p>
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
