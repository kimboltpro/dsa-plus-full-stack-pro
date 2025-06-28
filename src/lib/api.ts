// API utility functions for production-ready data fetching
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Problem = Tables['problems']['Row'];
type UserProgress = Tables['user_progress']['Row'];
type Sheet = Tables['sheets']['Row'];
type Topic = Tables['topics']['Row'];

// Enhanced error handling
export class APIError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Problem-related API functions
export const problemsAPI = {
  // Get problems with filtering and pagination
  async getProblems(filters?: {
    difficulty?: string;
    topic_id?: string;
    sheet_id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Problem[]> {
    try {
      let query = supabase
        .from('problems')
        .select(`
          *,
          topics(name),
          sheets(name, sheet_type)
        `);

      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.topic_id) {
        query = query.eq('topic_id', filters.topic_id);
      }
      if (filters?.sheet_id) {
        query = query.eq('sheet_id', filters.sheet_id);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      query = query.range(start, end).order('order_index', { ascending: true });

      const { data, error } = await query;

      if (error) throw new APIError('Failed to fetch problems', 500, error);
      return data || [];
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  },

  // Get problem by ID with related data
  async getProblemById(id: string): Promise<Problem & { user_progress?: UserProgress }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('problems')
        .select(`
          *,
          topics(name, description),
          sheets(name, sheet_type)
        `)
        .eq('id', id)
        .single();

      const { data: problem, error } = await query;
      if (error) throw new APIError('Problem not found', 404, error);

      // Get user progress if authenticated
      let userProgress = null;
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('problem_id', id)
          .eq('user_id', user.id)
          .single();
        userProgress = progress;
      }

      return { ...problem, user_progress: userProgress };
    } catch (error) {
      console.error('Error fetching problem:', error);
      throw error;
    }
  },

  // Update user progress for a problem
  async updateProgress(problemId: string, progress: Partial<UserProgress>): Promise<UserProgress> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new APIError('User not authenticated', 401);

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          ...progress,
          attempted_at: progress.status === 'attempted' ? new Date().toISOString() : undefined,
          solved_at: progress.status === 'solved' ? new Date().toISOString() : undefined,
        })
        .select()
        .single();

      if (error) throw new APIError('Failed to update progress', 500, error);
      return data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
};

// Sheet-related API functions
export const sheetsAPI = {
  async getAllSheets(): Promise<Sheet[]> {
    try {
      const { data, error } = await supabase
        .from('sheets')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw new APIError('Failed to fetch sheets', 500, error);
      return data || [];
    } catch (error) {
      console.error('Error fetching sheets:', error);
      throw error;
    }
  },

  async getSheetWithProblems(sheetId: string): Promise<Sheet & { problems: Problem[] }> {
    try {
      const { data: sheet, error: sheetError } = await supabase
        .from('sheets')
        .select('*')
        .eq('id', sheetId)
        .single();

      if (sheetError) throw new APIError('Sheet not found', 404, sheetError);

      const { data: problems, error: problemsError } = await supabase
        .from('problems')
        .select(`
          *,
          topics(name)
        `)
        .eq('sheet_id', sheetId)
        .order('order_index', { ascending: true });

      if (problemsError) throw new APIError('Failed to fetch sheet problems', 500, problemsError);

      return { ...sheet, problems: problems || [] };
    } catch (error) {
      console.error('Error fetching sheet with problems:', error);
      throw error;
    }
  }
};

// Topic-related API functions
export const topicsAPI = {
  async getAllTopics(): Promise<Topic[]> {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw new APIError('Failed to fetch topics', 500, error);
      return data || [];
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },

  async getTopicWithProblems(topicId: string): Promise<Topic & { problems: Problem[] }> {
    try {
      const { data: topic, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (topicError) throw new APIError('Topic not found', 404, topicError);

      const { data: problems, error: problemsError } = await supabase
        .from('problems')
        .select(`
          *,
          sheets(name, sheet_type)
        `)
        .eq('topic_id', topicId)
        .order('difficulty', { ascending: true });

      if (problemsError) throw new APIError('Failed to fetch topic problems', 500, problemsError);

      return { ...topic, problems: problems || [] };
    } catch (error) {
      console.error('Error fetching topic with problems:', error);
      throw error;
    }
  }
};

// User stats API functions
export const userStatsAPI = {
  async getUserStats(): Promise<Tables['user_stats']['Row'] | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new APIError('Failed to fetch user stats', 500, error);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  },

  async updateUserStats(stats: Partial<Tables['user_stats']['Row']>): Promise<Tables['user_stats']['Row']> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new APIError('User not authenticated', 401);

      const { data, error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          ...stats,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw new APIError('Failed to update user stats', 500, error);
      return data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
};

// Search API functions
export const searchAPI = {
  async globalSearch(query: string): Promise<{
    problems: Problem[];
    topics: Topic[];
    sheets: Sheet[];
  }> {
    try {
      const [problems, topics, sheets] = await Promise.all([
        supabase
          .from('problems')
          .select('*, topics(name), sheets(name)')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10),
        supabase
          .from('topics')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(5),
        supabase
          .from('sheets')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(5)
      ]);

      return {
        problems: problems.data || [],
        topics: topics.data || [],
        sheets: sheets.data || []
      };
    } catch (error) {
      console.error('Error performing global search:', error);
      throw new APIError('Search failed', 500, error);
    }
  }
};

// Bookmarks API functions
export const bookmarksAPI = {
  async getUserBookmarks(): Promise<Tables['bookmarks']['Row'][]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          problems(
            *,
            topics(name),
            sheets(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new APIError('Failed to fetch bookmarks', 500, error);
      return data || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  },

  async toggleBookmark(problemId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new APIError('User not authenticated', 401);

      // Check if bookmark exists
      const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('problem_id', problemId)
        .single();

      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', existing.id);

        if (error) throw new APIError('Failed to remove bookmark', 500, error);
        return false;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            problem_id: problemId
          });

        if (error) throw new APIError('Failed to add bookmark', 500, error);
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }
};