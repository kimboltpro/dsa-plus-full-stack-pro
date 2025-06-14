
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InteractiveProjectBuilder from './InteractiveProjectBuilder';
import OpenRouterChatbot from '../chatbot/OpenRouterChatbot';
import { 
  Monitor, 
  Server, 
  Cloud, 
  Brain, 
  Map, 
  FileText, 
  Mail, 
  ExternalLink, 
  Search, 
  Star, 
  Heart, 
  Eye,
  Bookmark,
  Award,
  Video,
  BookOpen,
  Code,
  Globe,
  Database,
  Settings,
  Lock,
  Layers,
  MessageCircle,
  Rocket,
  Sparkles,
  Zap
} from 'lucide-react';

const fullStackResources = {
  frontend: [
    {
      name: "MDN Web Docs",
      description: "Official references for HTML, CSS, JavaScript - the ultimate web development documentation",
      type: "Documentation",
      tags: ["HTML", "CSS", "JavaScript", "Web Standards"],
      link: "https://developer.mozilla.org/",
      difficulty: "All Levels",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "Frontend Mentor",
      description: "Real-world HTML/CSS/JS challenges with professional designs to build your portfolio",
      type: "Practice Platform",
      tags: ["HTML", "CSS", "JavaScript", "Projects"],
      link: "https://www.frontendmentor.io/",
      difficulty: "Beginner-Advanced",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "JavaScript.info",
      description: "Deep dive into JavaScript fundamentals with interactive examples and comprehensive tutorials",
      type: "Tutorial",
      tags: ["JavaScript", "ES6+", "DOM", "Async"],
      link: "https://javascript.info/",
      difficulty: "Beginner-Advanced",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "Namaste JavaScript",
      description: "Free comprehensive JavaScript tutorials covering fundamentals to advanced concepts",
      type: "Video Course",
      tags: ["JavaScript", "YouTube", "Hindi/English"],
      link: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
      difficulty: "Beginner-Intermediate",
      rating: 4.8
    },
    {
      name: "CSS-Tricks",
      description: "Articles, layouts, animations, flexbox/grid insights and modern CSS techniques",
      type: "Blog/Articles",
      tags: ["CSS", "Flexbox", "Grid", "Animations"],
      link: "https://css-tricks.com/",
      difficulty: "All Levels",
      rating: 4.7
    },
    {
      name: "Tailwind CSS Docs",
      description: "Official utility-first CSS framework documentation with examples and best practices",
      type: "Documentation",
      tags: ["CSS", "Tailwind", "Utility-First"],
      link: "https://tailwindcss.com/docs",
      difficulty: "Beginner-Advanced",
      rating: 4.8
    },
    {
      name: "FreeCodeCamp JavaScript Certification",
      description: "Interactive learning & exercises with hands-on coding challenges and projects",
      type: "Interactive Course",
      tags: ["JavaScript", "Certification", "Projects"],
      link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures",
      difficulty: "Beginner-Intermediate",
      rating: 4.7
    },
    {
      name: "React Docs (React.dev)",
      description: "Official modern React documentation with hooks, patterns, and best practices",
      type: "Documentation",
      tags: ["React", "Hooks", "JSX", "Components"],
      link: "https://react.dev/",
      difficulty: "Intermediate",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "30 Seconds of Code",
      description: "Bite-sized JavaScript, CSS, React, and more snippets for quick reference",
      type: "Code Snippets",
      tags: ["JavaScript", "React", "CSS", "Snippets"],
      link: "https://www.30secondsofcode.org/",
      difficulty: "All Levels",
      rating: 4.6
    }
  ],
  backend: [
    {
      name: "Node.js Documentation",
      description: "Official API details and comprehensive guides for server-side JavaScript development",
      type: "Documentation",
      tags: ["Node.js", "JavaScript", "Server"],
      link: "https://nodejs.org/en/docs/",
      difficulty: "Intermediate",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "Express.js Guide",
      description: "Official Express framework documentation for building web applications and APIs",
      type: "Documentation",
      tags: ["Express", "Node.js", "API", "Middleware"],
      link: "https://expressjs.com/",
      difficulty: "Beginner-Intermediate",
      rating: 4.7
    },
    {
      name: "The Odin Project - Backend Path",
      description: "Free full-stack JavaScript curriculum with hands-on projects and community support",
      type: "Learning Path",
      tags: ["Full Stack", "JavaScript", "Projects"],
      link: "https://www.theodinproject.com/paths/full-stack-javascript",
      difficulty: "Beginner-Advanced",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "Auth0 Blog",
      description: "Tutorials & articles on authentication, security, and identity management",
      type: "Blog/Articles",
      tags: ["Authentication", "Security", "JWT", "OAuth"],
      link: "https://auth0.com/blog/",
      difficulty: "Intermediate-Advanced",
      rating: 4.6
    },
    {
      name: "MongoDB University",
      description: "Free official MongoDB courses covering database design, queries, and administration",
      type: "Video Course",
      tags: ["MongoDB", "Database", "NoSQL"],
      link: "https://university.mongodb.com/",
      difficulty: "Beginner-Advanced",
      rating: 4.7
    },
    {
      name: "PostgreSQL Tutorial",
      description: "In-depth guides on SQL and Postgres covering queries, optimization, and advanced features",
      type: "Tutorial",
      tags: ["PostgreSQL", "SQL", "Database"],
      link: "https://www.postgresqltutorial.com/",
      difficulty: "Beginner-Advanced",
      rating: 4.8
    },
    {
      name: "JWT.io Introduction",
      description: "JSON Web Token overview & tutorial with debugger and implementation guides",
      type: "Tutorial",
      tags: ["JWT", "Authentication", "Security"],
      link: "https://jwt.io/introduction/",
      difficulty: "Intermediate",
      rating: 4.5
    },
    {
      name: "Express Cheatsheet",
      description: "Quick reference for Express.js syntax, middleware, and routing patterns",
      type: "Cheatsheet",
      tags: ["Express", "Node.js", "Quick Reference"],
      link: "https://devhints.io/express",
      difficulty: "All Levels",
      rating: 4.4
    },
    {
      name: "Zod Documentation",
      description: "Type-safe schema validation library docs for TypeScript and JavaScript",
      type: "Documentation",
      tags: ["TypeScript", "Validation", "Schema"],
      link: "https://zod.dev/",
      difficulty: "Intermediate",
      rating: 4.6
    }
  ],
  devops: [
    {
      name: "Vercel Documentation",
      description: "Guides for deployment, especially for Next.js and modern web applications",
      type: "Documentation",
      tags: ["Deployment", "Next.js", "Serverless"],
      link: "https://vercel.com/docs",
      difficulty: "Beginner-Intermediate",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "Netlify Docs",
      description: "Static site hosting and serverless functions guide with CI/CD integration",
      type: "Documentation",
      tags: ["Static Sites", "Serverless", "CI/CD"],
      link: "https://docs.netlify.com/",
      difficulty: "Beginner-Intermediate",
      rating: 4.7
    },
    {
      name: "Docker Curriculum",
      description: "Beginner's tutorial for learning Docker containerization and deployment",
      type: "Tutorial",
      tags: ["Docker", "Containers", "DevOps"],
      link: "https://docker-curriculum.com/",
      difficulty: "Beginner-Intermediate",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "Git Handbook",
      description: "Git basics and repository workflow from GitHub's official guides",
      type: "Guide",
      tags: ["Git", "Version Control", "GitHub"],
      link: "https://guides.github.com/introduction/git-handbook/",
      difficulty: "Beginner",
      rating: 4.6
    },
    {
      name: "GitHub Actions Documentation",
      description: "CI/CD tutorials using GitHub Actions for automated workflows",
      type: "Documentation",
      tags: ["CI/CD", "GitHub", "Automation"],
      link: "https://docs.github.com/en/actions",
      difficulty: "Intermediate",
      rating: 4.7
    },
    {
      name: "Railway Documentation",
      description: "Infrastructure deployment for backends + databases with simplified DevOps",
      type: "Documentation",
      tags: ["Deployment", "Database", "Infrastructure"],
      link: "https://docs.railway.app/",
      difficulty: "Beginner-Intermediate",
      rating: 4.5
    },
    {
      name: "Render Documentation",
      description: "Full-stack deployment with Render for web services and databases",
      type: "Documentation",
      tags: ["Deployment", "Full Stack", "Database"],
      link: "https://docs.render.com/",
      difficulty: "Beginner-Intermediate",
      rating: 4.6
    },
    {
      name: "Nginx Essentials",
      description: "Reverse proxy setup guide and web server configuration tutorials",
      type: "Tutorial",
      tags: ["Nginx", "Web Server", "Proxy"],
      link: "https://www.digitalocean.com/community/tutorials/nginx-essential",
      difficulty: "Intermediate-Advanced",
      rating: 4.5
    }
  ],
  systemDesign: [
    {
      name: "System Design Primer",
      description: "Comprehensive GitHub repo for system design interview prep with examples and patterns",
      type: "Repository",
      tags: ["System Design", "Interview", "Architecture"],
      link: "https://github.com/donnemartin/system-design-primer",
      difficulty: "Intermediate-Advanced",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "Awesome System Design",
      description: "Open-source alternative to paid system design courses with free resources",
      type: "Repository",
      tags: ["System Design", "Free Resources", "Architecture"],
      link: "https://github.com/madd86/awesome-system-design",
      difficulty: "Intermediate-Advanced",
      rating: 4.7
    },
    {
      name: "High Scalability",
      description: "Case studies of large-scale architectures from real-world companies",
      type: "Blog/Articles",
      tags: ["Scalability", "Architecture", "Case Studies"],
      link: "http://highscalability.com/",
      difficulty: "Advanced",
      rating: 4.6
    },
    {
      name: "ByteByteGo",
      description: "Animated system design explainer videos covering distributed systems concepts",
      type: "Video Course",
      tags: ["System Design", "YouTube", "Animation"],
      link: "https://www.youtube.com/c/ByteByteGo",
      difficulty: "Intermediate-Advanced",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "Awesome Scalability Cheatsheet",
      description: "All-in-one reference for scalability and architecture patterns",
      type: "Cheatsheet",
      tags: ["Scalability", "Architecture", "Quick Reference"],
      link: "https://github.com/binhnguyennus/awesome-scalability",
      difficulty: "Intermediate-Advanced",
      rating: 4.7
    },
    {
      name: "Backend Tech Roadmap",
      description: "Visual roadmap for backend development and system architecture learning path",
      type: "Roadmap",
      tags: ["Backend", "Roadmap", "Architecture"],
      link: "https://roadmap.sh/backend",
      difficulty: "All Levels",
      rating: 4.6
    }
  ],
  fullStackPaths: [
    {
      name: "The Odin Project",
      description: "Complete and free full-stack JavaScript roadmap with projects and community",
      type: "Learning Path",
      tags: ["Full Stack", "JavaScript", "Projects"],
      link: "https://www.theodinproject.com/",
      difficulty: "Beginner-Advanced",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "Full Stack Open",
      description: "In-depth React + Node.js course from the University of Helsinki",
      type: "University Course",
      tags: ["React", "Node.js", "University"],
      link: "https://fullstackopen.com/en/",
      difficulty: "Intermediate-Advanced",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "FreeCodeCamp Full Stack Certifications",
      description: "Multiple JavaScript full-stack certifications with hands-on projects",
      type: "Certification",
      tags: ["Certification", "JavaScript", "Projects"],
      link: "https://www.freecodecamp.org/",
      difficulty: "Beginner-Advanced",
      rating: 4.8
    },
    {
      name: "Roadmap.sh Visual Learning Paths",
      description: "Interactive roadmaps for all development roles with step-by-step guidance",
      type: "Roadmap",
      tags: ["Roadmap", "Career", "Learning Path"],
      link: "https://roadmap.sh/",
      difficulty: "All Levels",
      rating: 4.7
    },
    {
      name: "Codecademy Free Web Development",
      description: "Beginner-friendly interactive learning paths for web development",
      type: "Interactive Course",
      tags: ["Interactive", "Beginner", "Web Development"],
      link: "https://www.codecademy.com/catalog/subject/web-development",
      difficulty: "Beginner",
      rating: 4.5
    },
    {
      name: "JavaScript Full Course - BroCode",
      description: "Comprehensive JavaScript + DOM crash course covering all fundamentals",
      type: "Video Course",
      tags: ["JavaScript", "YouTube", "DOM"],
      link: "https://youtu.be/HD13eq_Pmp8",
      difficulty: "Beginner-Intermediate",
      rating: 4.6
    }
  ],
  cheatsheets: [
    {
      name: "JavaScript Cheatsheet",
      description: "Quick JavaScript syntax reference covering ES6+ features and common patterns",
      type: "Cheatsheet",
      tags: ["JavaScript", "ES6+", "Quick Reference"],
      link: "https://devhints.io/js",
      difficulty: "All Levels",
      rating: 4.7
    },
    {
      name: "React Cheatsheet",
      description: "Comprehensive React reference with hooks, components, and best practices",
      type: "Cheatsheet",
      tags: ["React", "Hooks", "Components"],
      link: "https://reactcheatsheet.com/",
      difficulty: "Intermediate",
      rating: 4.6
    },
    {
      name: "Git Cheatsheet",
      description: "GitHub Education PDF covering essential Git commands and workflows",
      type: "PDF Cheatsheet",
      tags: ["Git", "Version Control", "Commands"],
      link: "https://education.github.com/git-cheat-sheet-education.pdf",
      difficulty: "All Levels",
      rating: 4.8
    },
    {
      name: "HTML + CSS Cheat Sheet",
      description: "Stanford's comprehensive HTML and CSS reference guide",
      type: "PDF Cheatsheet",
      tags: ["HTML", "CSS", "Quick Reference"],
      link: "https://web.stanford.edu/class/cs142/lectures/HTML_CSS.pdf",
      difficulty: "Beginner-Intermediate",
      rating: 4.5
    },
    {
      name: "MongoDB Query Cheatsheet",
      description: "Official MongoDB query operations and syntax reference",
      type: "Cheatsheet",
      tags: ["MongoDB", "Database", "Queries"],
      link: "https://docs.mongodb.com/manual/reference/cheatsheet/",
      difficulty: "Intermediate",
      rating: 4.6
    },
    {
      name: "Node.js Quick Reference",
      description: "Essential Node.js APIs and patterns for server-side development",
      type: "Cheatsheet",
      tags: ["Node.js", "API", "Server"],
      link: "https://devhints.io/nodejs",
      difficulty: "Intermediate",
      rating: 4.5
    },
    {
      name: "Linux Command Line Cheatsheet",
      description: "Unix/Linux command reference for developers and system administrators",
      type: "Cheatsheet",
      tags: ["Linux", "Command Line", "Unix"],
      link: "https://fosswire.com/post/2007/08/unix-linux-command-reference/",
      difficulty: "All Levels",
      rating: 4.4
    },
    {
      name: "Vim Cheatsheet",
      description: "Essential Vim commands and shortcuts for efficient text editing",
      type: "Cheatsheet",
      tags: ["Vim", "Editor", "Shortcuts"],
      link: "https://vim.rtorr.com/",
      difficulty: "Intermediate",
      rating: 4.3
    },
    {
      name: "Modern JS Cheatsheet",
      description: "GitHub repository covering modern JavaScript features and concepts",
      type: "Repository Cheatsheet",
      tags: ["JavaScript", "Modern JS", "ES6+"],
      link: "https://github.com/mbeaudru/modern-js-cheatsheet",
      difficulty: "Intermediate",
      rating: 4.7
    }
  ],
  newsletters: [
    {
      name: "JavaScript Weekly",
      description: "Weekly news covering everything JavaScript - libraries, frameworks, and ecosystem updates",
      type: "Newsletter",
      tags: ["JavaScript", "Weekly", "News"],
      link: "https://javascriptweekly.com/",
      difficulty: "All Levels",
      rating: 4.8
    },
    {
      name: "React Status",
      description: "Curated weekly React news, tutorials, and community updates",
      type: "Newsletter",
      tags: ["React", "Weekly", "Community"],
      link: "https://react.statuscode.com/",
      difficulty: "Intermediate",
      rating: 4.7
    },
    {
      name: "Frontend Focus",
      description: "Weekly frontend newsletter covering HTML, CSS, JavaScript, and design",
      type: "Newsletter",
      tags: ["Frontend", "HTML", "CSS", "Design"],
      link: "https://frontendfoc.us/",
      difficulty: "All Levels",
      rating: 4.6
    },
    {
      name: "Daily Dev Tips",
      description: "Short daily developer tips covering various web development topics",
      type: "Daily Newsletter",
      tags: ["Daily", "Tips", "Web Development"],
      link: "https://daily-dev-tips.com/",
      difficulty: "All Levels",
      rating: 4.5
    },
    {
      name: "LogRocket Blog",
      description: "Technical articles on web development, performance, and debugging",
      type: "Blog",
      tags: ["Technical", "Performance", "Debugging"],
      link: "https://blog.logrocket.com/",
      difficulty: "Intermediate-Advanced",
      rating: 4.6
    },
    {
      name: "DEV Community",
      description: "Community-written full-stack articles and tutorials from developers worldwide",
      type: "Community Blog",
      tags: ["Community", "Full Stack", "Tutorials"],
      link: "https://dev.to/t/fullstack",
      difficulty: "All Levels",
      rating: 4.7
    }
  ],
  youtubeResources: [
    {
      name: "Namaste JavaScript (Akshay Saini)",
      description: "Deep JavaScript fundamentals explained in Hindi/English with practical examples",
      type: "YouTube Playlist",
      tags: ["JavaScript", "Fundamentals", "Hindi"],
      link: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
      difficulty: "Beginner-Intermediate",
      editorsPick: true,
      rating: 4.9
    },
    {
      name: "JavaScript Full Course - BroCode",
      description: "Comprehensive 8-hour JavaScript + DOM crash course covering all essentials",
      type: "YouTube Video",
      tags: ["JavaScript", "Full Course", "DOM"],
      link: "https://youtu.be/lex4vgJ4n-M",
      difficulty: "Beginner-Intermediate",
      rating: 4.7
    },
    {
      name: "JavaScript Tutorial for Beginners - BroCode",
      description: "Step-by-step JavaScript tutorial series perfect for absolute beginners",
      type: "YouTube Playlist",
      tags: ["JavaScript", "Beginner", "Tutorial"],
      link: "https://www.youtube.com/playlist?list=PLZPZq0r_RZOO1zkgO4bIdfuLpizCeHYKv",
      difficulty: "Beginner",
      rating: 4.6
    },
    {
      name: "HTML & CSS Full Course - BroCode",
      description: "Complete HTML and CSS course covering modern web development practices",
      type: "YouTube Video",
      tags: ["HTML", "CSS", "Web Development"],
      link: "https://youtu.be/HGTJBPNC-Gw",
      difficulty: "Beginner",
      rating: 4.5
    },
    {
      name: "ByteByteGo - System Design",
      description: "Animated system design explainer videos covering distributed systems concepts",
      type: "YouTube Channel",
      tags: ["System Design", "Animation", "Architecture"],
      link: "https://www.youtube.com/c/ByteByteGo",
      difficulty: "Intermediate-Advanced",
      editorsPick: true,
      rating: 4.8
    },
    {
      name: "System Design Primer Playlist",
      description: "Deep-dive system design tutorials covering scalability and architecture patterns",
      type: "YouTube Playlist",
      tags: ["System Design", "Scalability", "Interview"],
      link: "https://www.youtube.com/playlist?list=PLTCrU9sGyburBw9wNOHebv9SjlE4Elv5a",
      difficulty: "Advanced",
      rating: 4.7
    },
    {
      name: "System Design: How to Start",
      description: "Introduction to system design concepts and interview preparation strategies",
      type: "YouTube Video",
      tags: ["System Design", "Interview", "Beginner"],
      link: "https://www.youtube.com/watch?v=1_Z7qhbJpV4",
      difficulty: "Intermediate",
      rating: 4.6
    },
    {
      name: "Auth0: Getting Started with Authorization",
      description: "Authentication and authorization fundamentals using Auth0 platform",
      type: "YouTube Video",
      tags: ["Authentication", "Authorization", "Security"],
      link: "https://www.youtube.com/watch?v=pT6Ae68QisY",
      difficulty: "Intermediate",
      rating: 4.5
    },
    {
      name: "Authentication & Authorization with Auth0",
      description: "Step-by-step implementation guide for Auth0 authentication in web apps",
      type: "YouTube Video",
      tags: ["Auth0", "Implementation", "Security"],
      link: "https://www.youtube.com/watch?v=OxLijPpUpPk",
      difficulty: "Intermediate-Advanced",
      rating: 4.4
    }
  ]
};

const FullStackPage = () => {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set());
  const [viewedResources, setViewedResources] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedDifficulty,  setSelectedDifficulty] = useState<string>('');

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

  const toggleSaved = (resourceName: string) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceName)) {
      newSaved.delete(resourceName);
    } else {
      newSaved.add(resourceName);
    }
    setSavedResources(newSaved);
  };

  const markAsViewed = (resourceName: string) => {
    const newViewed = new Set(viewedResources);
    newViewed.add(resourceName);
    setViewedResources(newViewed);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'documentation': return <BookOpen className="w-4 h-4" />;
      case 'video course': case 'youtube video': case 'youtube playlist': case 'youtube channel': return <Video className="w-4 h-4" />;
      case 'tutorial': return <Code className="w-4 h-4" />;
      case 'cheatsheet': case 'pdf cheatsheet': case 'repository cheatsheet': return <FileText className="w-4 h-4" />;
      case 'blog/articles': case 'blog': case 'community blog': return <Mail className="w-4 h-4" />;
      case 'repository': return <Database className="w-4 h-4" />;
      case 'roadmap': return <Map className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      case 'All Levels': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterResources = (resources: any[]) => {
    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTags = selectedTags.size === 0 || 
                         resource.tags.some((tag: string) => selectedTags.has(tag));
      
      const matchesDifficulty = !selectedDifficulty || 
                               resource.difficulty?.includes(selectedDifficulty);
      
      return matchesSearch && matchesTags && matchesDifficulty;
    });
  };

  const renderResourceCard = (resource: any) => (
    <Card key={resource.name} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                {resource.name}
              </CardTitle>
              {resource.editorsPick && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1">
                  <Award className="w-3 h-3 mr-1" />
                  Editor's Pick
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(resource.type)}
              <span className="text-sm text-gray-600">{resource.type}</span>
              {viewedResources.has(resource.name) && (
                <Badge variant="outline" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Viewed
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaved(resource.name)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {savedResources.has(resource.name) ? (
                <Bookmark className="w-4 h-4 fill-blue-500 text-blue-500" />
              ) : (
                <Bookmark className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold ml-1">{resource.rating}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{resource.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          {resource.difficulty && (
            <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
              {resource.difficulty}
            </Badge>
          )}
          
          <Button 
            asChild 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => markAsViewed(resource.name)}
          >
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
              Explore
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const sections = [
    { 
      id: 'chat-assistance', 
      title: '🤖✨ Chat Assistance', 
      icon: MessageCircle, 
      component: <OpenRouterChatbot />,
      description: 'Get instant help from 350+ AI models for coding, debugging, and learning',
      featured: true,
      magicGradient: 'from-purple-500 via-pink-500 to-red-500'
    },
    { 
      id: 'interactive-projects', 
      title: '🚀⚡ Interactive Projects', 
      icon: Rocket, 
      component: <InteractiveProjectBuilder />,
      description: 'Build real projects with step-by-step tutorials and live code environments',
      featured: true,
      magicGradient: 'from-blue-500 via-cyan-500 to-teal-500'
    },
    { 
      id: 'frontend', 
      title: '🌐 Frontend Resources', 
      icon: Monitor, 
      data: fullStackResources.frontend,
      description: 'Master modern frontend development with HTML, CSS, JavaScript, and popular frameworks'
    },
    { 
      id: 'backend', 
      title: '🛠️ Backend Resources', 
      icon: Server, 
      data: fullStackResources.backend,
      description: 'Server-side development, APIs, databases, and backend architecture'
    },
    { 
      id: 'devops', 
      title: '☁️ DevOps & Deployment', 
      icon: Cloud, 
      data: fullStackResources.devops,
      description: 'Deployment, CI/CD, containerization, and infrastructure management'
    },
    { 
      id: 'system-design', 
      title: '🧠 System Design', 
      icon: Brain, 
      data: fullStackResources.systemDesign,
      description: 'Scalable architecture, distributed systems, and system design patterns'
    },
    { 
      id: 'fullstack-paths', 
      title: '📦 Full Stack Learning Paths', 
      icon: Layers, 
      data: fullStackResources.fullStackPaths,
      description: 'Comprehensive learning paths and structured curricula for full-stack development'
    },
    { 
      id: 'cheatsheets', 
      title: '🧾 Cheatsheets & Quick References', 
      icon: FileText, 
      data: fullStackResources.cheatsheets,
      description: 'Quick reference materials and cheat sheets for various technologies'
    },
    { 
      id: 'newsletters', 
      title: '📬 Newsletters & Blogs', 
      icon: Mail, 
      data: fullStackResources.newsletters,
      description: 'Stay updated with the latest in web development through curated content'
    },
    { 
      id: 'youtube', 
      title: '📺 YouTube Learning Resources', 
      icon: Video, 
      data: fullStackResources.youtubeResources,
      description: 'High-quality video tutorials and courses from top educators'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Full Stack Dev Toolkit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated collection of 100% free, world-class learning resources for full-stack development
          </p>
        </div>

        {/* Featured Magic Sections */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.filter(section => section.featured).map((section) => (
            <div
              key={section.id}
              className={`relative p-1 rounded-2xl bg-gradient-to-r ${section.magicGradient} shadow-2xl hover:shadow-3xl transition-all duration-300 group`}
            >
              <div className="bg-white rounded-xl p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.magicGradient} text-white shadow-lg`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">Featured</span>
                      <Zap className="w-4 h-4 text-purple-500" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <Button 
                  className={`w-full bg-gradient-to-r ${section.magicGradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200`}
                  onClick={() => {
                    const element = document.getElementById(`tab-${section.id}`);
                    element?.click();
                  }}
                >
                  <span className="flex items-center gap-2">
                    Get Started
                    <Sparkles className="w-4 h-4" />
                  </span>
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedDifficulty === 'Beginner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Beginner' ? '' : 'Beginner')}
              >
                Beginner
              </Button>
              <Button
                variant={selectedDifficulty === 'Intermediate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Intermediate' ? '' : 'Intermediate')}
              >
                Intermediate
              </Button>
              <Button
                variant={selectedDifficulty === 'Advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Advanced' ? '' : 'Advanced')}
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="chat-assistance" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
            {sections.map((section) => (
              <TabsTrigger 
                key={section.id} 
                value={section.id}
                id={`tab-${section.id}`}
                className={`text-xs lg:text-sm ${
                  section.featured 
                    ? `bg-gradient-to-r ${section.magicGradient} text-white data-[state=active]:text-white data-[state=active]:shadow-lg` 
                    : ''
                }`}
              >
                <section.icon className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">{section.title.split(' ')[1] || section.title.split(' ')[0]}</span>
                <span className="lg:hidden">{section.title.split(' ')[0]}</span>
                {section.featured && <Sparkles className="w-3 h-3 ml-1" />}
              </TabsTrigger>
            ))}
          </TabsList>

          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  {section.featured && (
                    <Badge className={`bg-gradient-to-r ${section.magicGradient} text-white px-3 py-1`}>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">{section.description}</p>
              </div>
              
              {section.component ? (
                <div className={section.featured ? `p-1 rounded-2xl bg-gradient-to-r ${section.magicGradient}` : ''}>
                  <div className={section.featured ? 'bg-white rounded-xl p-6' : ''}>
                    {section.component}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filterResources(section.data || []).map(renderResourceCard)}
                  </div>
                  
                  {filterResources(section.data || []).length === 0 && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No resources found matching your criteria.</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* My Toolkit Summary */}
        {savedResources.size > 0 && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <Bookmark className="w-5 h-5 mr-2 fill-blue-500 text-blue-500" />
              My Learning Toolkit ({savedResources.size} resources saved)
            </h3>
            <p className="text-sm text-blue-700">
              You have saved {savedResources.size} resources to your personal toolkit. 
              Access them anytime for quick reference and continue your learning journey!
            </p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(fullStackResources).flat().length + 6}
            </div>
            <div className="text-sm text-blue-700">Total Resources</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{sections.length}</div>
            <div className="text-sm text-green-700">Categories</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{savedResources.size}</div>
            <div className="text-sm text-purple-700">Bookmarked</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{viewedResources.size}</div>
            <div className="text-sm text-orange-700">Explored</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FullStackPage;
