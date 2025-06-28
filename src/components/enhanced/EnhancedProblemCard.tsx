// Enhanced problem card with better UX and features
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookmarkIcon, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  Eye,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { bookmarksAPI, problemsAPI } from '@/lib/api';
import { useApiMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface Problem {
  id: string;
  title: string;
  description?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  companies?: string[];
  problem_url?: string;
  user_progress?: {
    status: 'not_attempted' | 'attempted' | 'solved';
  };
  topics?: { name: string };
  sheets?: { name: string };
}

interface EnhancedProblemCardProps {
  problem: Problem;
  onStatusUpdate?: (problemId: string, status: string) => void;
  showStats?: boolean;
  compact?: boolean;
}

export const EnhancedProblemCard: React.FC<EnhancedProblemCardProps> = ({
  problem,
  onStatusUpdate,
  showStats = true,
  compact = false
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { mutate: toggleBookmark, loading: bookmarkLoading } = useApiMutation();
  const { mutate: updateProgress, loading: progressLoading } = useApiMutation();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'solved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'attempted':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'solved': return 'border-l-green-500 bg-green-50';
      case 'attempted': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-gray-300 bg-white';
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      const result = await toggleBookmark(bookmarksAPI.toggleBookmark, problem.id);
      setIsBookmarked(result);
      toast.success(result ? 'Problem bookmarked' : 'Bookmark removed');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleStatusUpdate = async (status: 'attempted' | 'solved') => {
    try {
      await updateProgress(problemsAPI.updateProgress, problem.id, { status });
      onStatusUpdate?.(problem.id, status);
      toast.success(`Problem marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const openProblem = () => {
    if (problem.problem_url) {
      window.open(problem.problem_url, '_blank');
    }
  };

  return (
    <Card 
      className={cn(
        'group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 cursor-pointer',
        getStatusColor(problem.user_progress?.status),
        compact ? 'p-3' : 'p-0'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openProblem}
    >
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(problem.user_progress?.status)}
              <h3 className={cn(
                'font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors',
                compact ? 'text-base' : 'text-lg'
              )}>
                {problem.title}
              </h3>
              {showStats && (
                <Badge 
                  variant="outline" 
                  className={cn('text-xs shrink-0', getDifficultyColor(problem.difficulty))}
                >
                  {problem.difficulty}
                </Badge>
              )}
            </div>
            
            {!compact && problem.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {problem.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-3">
              {problem.topics && (
                <Badge variant="outline" className="text-xs">
                  {problem.topics.name}
                </Badge>
              )}
              {problem.sheets && (
                <Badge variant="outline" className="text-xs">
                  {problem.sheets.name}
                </Badge>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {problem.tags?.slice(0, compact ? 2 : 4).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700"
                >
                  {tag}
                </Badge>
              ))}
              {problem.tags?.length > (compact ? 2 : 4) && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700">
                  +{problem.tags.length - (compact ? 2 : 4)}
                </Badge>
              )}
            </div>

            {/* Companies */}
            {showStats && problem.companies && problem.companies.length > 0 && (
              <div className="flex items-center gap-1 mb-3">
                <Users className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {problem.companies.slice(0, 3).map((company, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 border-blue-200 text-blue-800 bg-blue-50"
                    >
                      {company}
                    </Badge>
                  ))}
                  {problem.companies.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-800 bg-blue-50">
                      +{problem.companies.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkToggle();
              }}
              variant="ghost"
              size="sm"
              disabled={bookmarkLoading}
              className={cn(
                'h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity',
                isBookmarked && 'opacity-100 text-blue-600'
              )}
            >
              <BookmarkIcon className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
            </Button>
            
            {problem.problem_url && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  openProblem();
                }}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn('pt-0', compact && 'pt-0')}>
        {/* Progress Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('attempted');
            }}
            variant="outline"
            size="sm"
            disabled={progressLoading}
            className={cn(
              'flex-1 text-xs',
              problem.user_progress?.status === 'attempted' && 'bg-yellow-50 border-yellow-300 text-yellow-700'
            )}
          >
            <Clock className="h-3 w-3 mr-1" />
            {problem.user_progress?.status === 'attempted' ? 'Attempted' : 'Mark Attempted'}
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('solved');
            }}
            variant="outline"
            size="sm"
            disabled={progressLoading}
            className={cn(
              'flex-1 text-xs',
              problem.user_progress?.status === 'solved' && 'bg-green-50 border-green-300 text-green-700'
            )}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            {problem.user_progress?.status === 'solved' ? 'Solved' : 'Mark Solved'}
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to playground or code editor
            }}
            variant="ghost"
            size="sm"
            className="px-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="h-3 w-3 mr-1" />
            Code
          </Button>
        </div>

        {/* Interactive Features */}
        {isHovered && !compact && showStats && (
          <div className="mt-4 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>1.2k views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>89% success rate</span>
                </div>
              </div>
              <span>Est. 15-30 min</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};