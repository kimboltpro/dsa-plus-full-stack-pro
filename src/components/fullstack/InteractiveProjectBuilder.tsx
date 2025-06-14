
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Rocket, 
  BookOpen, 
  Github, 
  ExternalLink,
  Clock,
  Users,
  Star,
  Zap,
  Database,
  Globe,
  Server,
  Smartphone
} from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  learningOutcomes: string[];
  features: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'todo-react',
    name: 'Todo App with React & Local Storage',
    description: 'Build a fully functional todo application with React, featuring CRUD operations, local storage persistence, and modern UI.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Local Storage'],
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    learningOutcomes: ['React Hooks', 'State Management', 'Local Storage API', 'Component Architecture'],
    features: ['Add/Edit/Delete todos', 'Mark as complete', 'Filter by status', 'Responsive design'],
    demoUrl: 'https://codesandbox.io/s/react-todo-app-template',
    githubUrl: 'https://github.com/template/react-todo-starter'
  },
  {
    id: 'weather-api',
    name: 'Weather Dashboard with API Integration',
    description: 'Create a weather dashboard that fetches real-time data from weather APIs with interactive charts and forecasts.',
    techStack: ['React', 'Axios', 'Weather API', 'Chart.js', 'CSS Modules'],
    difficulty: 'Intermediate',
    estimatedTime: '4-6 hours',
    learningOutcomes: ['API Integration', 'Async JavaScript', 'Data Visualization', 'Error Handling'],
    features: ['Current weather display', '5-day forecast', 'Search by city', 'Weather charts', 'Geolocation'],
    demoUrl: 'https://codesandbox.io/s/weather-dashboard-template',
    githubUrl: 'https://github.com/template/weather-dashboard-starter'
  },
  {
    id: 'ecommerce-mern',
    name: 'E-commerce Store (MERN Stack)',
    description: 'Full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration.',
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'Stripe API'],
    difficulty: 'Advanced',
    estimatedTime: '12-16 hours',
    learningOutcomes: ['Full-stack Architecture', 'Authentication', 'Database Design', 'Payment Processing'],
    features: ['User registration/login', 'Product catalog', 'Shopping cart', 'Order management', 'Admin panel'],
    demoUrl: 'https://codesandbox.io/s/mern-ecommerce-template',
    githubUrl: 'https://github.com/template/mern-ecommerce-starter'
  },
  {
    id: 'blog-nextjs',
    name: 'Blog Platform with Next.js & Markdown',
    description: 'Modern blog platform with static generation, markdown support, SEO optimization, and deployment to Vercel.',
    techStack: ['Next.js', 'Markdown', 'Tailwind CSS', 'Vercel', 'TypeScript'],
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    learningOutcomes: ['Static Site Generation', 'Markdown Processing', 'SEO Optimization', 'Deployment'],
    features: ['Markdown blog posts', 'Syntax highlighting', 'Tag system', 'Search functionality', 'RSS feed'],
    demoUrl: 'https://codesandbox.io/s/nextjs-blog-template',
    githubUrl: 'https://github.com/template/nextjs-blog-starter'
  },
  {
    id: 'chat-realtime',
    name: 'Real-time Chat Application',
    description: 'Build a real-time chat app with Socket.io, featuring multiple rooms, user presence, and message history.',
    techStack: ['React', 'Socket.io', 'Node.js', 'Express', 'MongoDB'],
    difficulty: 'Advanced',
    estimatedTime: '8-10 hours',
    learningOutcomes: ['WebSocket Communication', 'Real-time Features', 'Event Handling', 'User Presence'],
    features: ['Multiple chat rooms', 'Real-time messaging', 'User presence indicators', 'Message history', 'File sharing'],
    demoUrl: 'https://codesandbox.io/s/realtime-chat-template',
    githubUrl: 'https://github.com/template/realtime-chat-starter'
  },
  {
    id: 'portfolio-gatsby',
    name: 'Developer Portfolio with Gatsby',
    description: 'Professional portfolio website with project showcases, blog, contact form, and performance optimization.',
    techStack: ['Gatsby', 'GraphQL', 'Styled Components', 'Netlify Forms'],
    difficulty: 'Intermediate',
    estimatedTime: '5-7 hours',
    learningOutcomes: ['Static Site Generation', 'GraphQL', 'Performance Optimization', 'SEO'],
    features: ['Project showcase', 'Blog integration', 'Contact form', 'Resume download', 'Analytics'],
    demoUrl: 'https://codesandbox.io/s/gatsby-portfolio-template',
    githubUrl: 'https://github.com/template/gatsby-portfolio-starter'
  }
];

const InteractiveProjectBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const filteredTemplates = projectTemplates.filter(template => 
    !selectedDifficulty || template.difficulty === selectedDifficulty
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (techStack: string[]) => {
    if (techStack.includes('React')) return <Code className="w-5 h-5 text-blue-500" />;
    if (techStack.includes('Node.js')) return <Server className="w-5 h-5 text-green-500" />;
    if (techStack.includes('MongoDB')) return <Database className="w-5 h-5 text-green-600" />;
    if (techStack.includes('Next.js')) return <Globe className="w-5 h-5 text-black" />;
    return <Code className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">🚀 Interactive Project Builder</h3>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Learn by building! Choose from our curated project templates and follow step-by-step tutorials 
          with live code environments, automated deployment, and portfolio integration.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          variant={selectedDifficulty === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDifficulty('')}
        >
          All Projects
        </Button>
        <Button
          variant={selectedDifficulty === 'Beginner' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDifficulty('Beginner')}
        >
          Beginner
        </Button>
        <Button
          variant={selectedDifficulty === 'Intermediate' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDifficulty('Intermediate')}
        >
          Intermediate
        </Button>
        <Button
          variant={selectedDifficulty === 'Advanced' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDifficulty('Advanced')}
        >
          Advanced
        </Button>
      </div>

      {/* Project Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(template.techStack)}
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </CardTitle>
                </div>
                <Badge className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{template.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {template.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  4.8
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-blue-50 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start Building
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={template.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Builder Modal/Detail View */}
      {selectedTemplate && (
        <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-blue-900">
                Building: {selectedTemplate.name}
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
                <TabsTrigger value="code">Live Code</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Learning Outcomes</h4>
                    <ul className="space-y-2">
                      {selectedTemplate.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Features</h4>
                    <ul className="space-y-2">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Star className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tutorial" className="space-y-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Tutorial</h4>
                  <div className="space-y-3">
                    {[
                      'Set up development environment',
                      'Create project structure',
                      'Implement core functionality',
                      'Add styling and UI components',
                      'Test and debug',
                      'Deploy to production'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                        <Badge variant="outline" className="ml-auto">
                          {index === 0 ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">Live Code Environment</h4>
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Code className="w-12 h-12 mx-auto mb-3" />
                      <p>CodeSandbox integration would appear here</p>
                      <p className="text-sm mt-2">Live preview, file explorer, and terminal</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button asChild>
                      <a href={selectedTemplate.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in CodeSandbox
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={selectedTemplate.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View on GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="deploy" className="space-y-4">
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">One-Click Deployment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <Rocket className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h5 className="font-medium mb-2">Vercel</h5>
                      <p className="text-sm text-gray-600 mb-3">Perfect for React & Next.js</p>
                      <Button size="sm" className="w-full">Deploy</Button>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Globe className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h5 className="font-medium mb-2">Netlify</h5>
                      <p className="text-sm text-gray-600 mb-3">Great for static sites</p>
                      <Button size="sm" variant="outline" className="w-full">Deploy</Button>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Server className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h5 className="font-medium mb-2">Railway</h5>
                      <p className="text-sm text-gray-600 mb-3">Full-stack applications</p>
                      <Button size="sm" variant="outline" className="w-full">Deploy</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{projectTemplates.length}</div>
          <div className="text-sm text-blue-700">Project Templates</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-sm text-green-700">Free to Use</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-purple-700">Available</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">Live</div>
          <div className="text-sm text-orange-700">Code Preview</div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveProjectBuilder;
