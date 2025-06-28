import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Brain, ExternalLink, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NextProblemSuggestionProps {
  isLoading: boolean;
}

const NextProblemSuggestion: React.FC<NextProblemSuggestionProps> = ({ isLoading }) => {
  const { user } = useAuth();
  const [suggestedProblems, setSuggestedProblems] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSuggestedProblems = async () => {
      try {
        setDataLoading(true);
        
        // First, find user's weakest topics based on solve rate
        const { data: topicProgress, error: topicError } = await supabase
          .from('user_progress')
          .select(`
            problems(
              topic_id,
              topics(name)
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'solved');
        
        if (topicError) {
          console.error('Error fetching topic progress:', topicError);
          return;
        }
        
        // Count solved problems by topic
        const topicSolveCount = new Map<string, { id: string, name: string, count: number }>();
        topicProgress?.forEach(progress => {
          if (progress.problems?.topic_id && progress.problems?.topics?.name) {
            const topicId = progress.problems.topic_id;
            const topicName = progress.problems.topics.name;
            
            if (topicSolveCount.has(topicId)) {
              topicSolveCount.get(topicId)!.count += 1;
            } else {
              topicSolveCount.set(topicId, { id: topicId, name: topicName, count: 1 });
            }
          }
        });
        
        // Convert to array and sort by solve count
        const sortedTopics = Array.from(topicSolveCount.values())
          .sort((a, b) => a.count - b.count);
        
        // Take the 2 least solved topics (or fewer if less than 2 exist)
        const weakTopics = sortedTopics.slice(0, 2);
        
        // If no topics found, fetch some random topics
        if (weakTopics.length === 0) {
          const { data: randomTopics, error: randomError } = await supabase
            .from('topics')
            .select('id, name')
            .limit(2);
            
          if (!randomError && randomTopics) {
            weakTopics.push(...randomTopics.map(topic => ({ 
              id: topic.id, 
              name: topic.name, 
              count: 0
            })));
          }
        }
        
        // Now fetch problems from these weak topics that the user hasn't solved yet
        let suggestedProblemsData: any[] = [];
        
        if (weakTopics.length > 0) {
          // Get user's solved problem IDs
          const { data: solvedProblems, error: solvedError } = await supabase
            .from('user_progress')
            .select('problem_id')
            .eq('user_id', user.id)
            .in('status', ['solved', 'attempted']);
            
          if (solvedError) {
            console.error('Error fetching solved problems:', solvedError);
          } else {
            const solvedIds = (solvedProblems || []).map(p => p.problem_id);
            
            // Fetch suitable problems from weak topics
            for (const topic of weakTopics) {
              const { data: problems, error: problemsError } = await supabase
                .from('problems')
                .select(`
                  *,
                  topics(name),
                  sheets(name)
                `)
                .eq('topic_id', topic.id)
                .order('difficulty', { ascending: true })
                .limit(2);
                
              if (problemsError) {
                console.error(`Error fetching problems for topic ${topic.id}:`, problemsError);
              } else if (problems && problems.length > 0) {
                // Filter out already solved problems
                const newProblems = problems.filter(p => !solvedIds.includes(p.id));
                suggestedProblemsData.push(...newProblems);
              }
            }
          }
        }
        
        // If still no problems, fetch random unsolved problems
        if (suggestedProblemsData.length === 0) {
          const { data: randomProblems, error: randomError } = await supabase
            .from('problems')
            .select(`
              *,
              topics(name),
              sheets(name)
            `)
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (!randomError && randomProblems) {
            suggestedProblemsData = randomProblems;
          }
        }
        
        // Limit to 3 problems maximum
        setSuggestedProblems(suggestedProblemsData.slice(0, 3));
      } catch (err) {
        console.error('Error in fetchSuggestedProblems:', err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchSuggestedProblems();
  }, [user]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Smart Recommendations
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
                      Recommended
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
            <Star className="w-4 h-4 mr-2" />
            Explore All Problems
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextProblemSuggestion;