import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Brain, ExternalLink, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NextProblemSuggestionProps {
  isLoading: boolean;
}

const NextProblemSuggestion: React.FC<NextProblemSuggestionProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [suggestedProblems, setSuggestedProblems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSuggestedProblems();
    }
  }, [user]);

  const fetchSuggestedProblems = async () => {
    try {
      setDataLoading(true);
      
      // Get all solved and attempted problem IDs
      const { data: solvedProblems } = await supabase
        .from('user_progress')
        .select('problem_id')
        .eq('user_id', user?.id)
        .eq('status', 'solved');
        
      const { data: attemptedProblems } = await supabase
        .from('user_progress')
        .select('problem_id')
        .eq('user_id', user?.id)
        .eq('status', 'attempted');
      
      const solvedIds = solvedProblems?.map(p => p.problem_id) || [];
      const attemptedIds = attemptedProblems?.map(p => p.problem_id) || [];
      const excludeIds = [...solvedIds, ...attemptedIds];
      
      // Find problems the user hasn't attempted yet, prioritizing easier ones
      const { data: newProblems, error } = await supabase
        .from('problems')
        .select(`
          *,
          topics(name),
          sheets(name)
        `)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('difficulty', { ascending: true }) // Start with easier problems
        .limit(3);
      
      if (error) {
        throw error;
      }
      
      setSuggestedProblems(newProblems || []);
    } catch (err) {
      console.error('Error fetching suggested problems:', err);
    } finally {
      setDataLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSuggestedProblems();
    toast.success("Recommendations refreshed!");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || dataLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Recommended Problems
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleRefresh} 
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedProblems.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {suggestedProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => window.open(problem.problem_url, '_blank')}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 mr-2 group-hover:text-blue-600 transition-colors">{problem.title}</h4>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {problem.topics?.name && <span>{problem.topics.name} • </span>}
                      {problem.sheets?.name && <span>{problem.sheets.name}</span>}
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-gradient-to-r from-amber-300 to-orange-400 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Best Match
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    {problem.tags && problem.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {problem.tags && problem.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{problem.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No personalized recommendations available yet.</p>
            <p className="text-sm">Keep solving problems to get smart suggestions!</p>
          </div>
        )}

        <div className="pt-2">
          <Button variant="outline" className="w-full" onClick={() => window.location.href = '/sheets'}>
            <Zap className="w-4 h-4 mr-2" />
            Explore All Problems
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextProblemSuggestion;