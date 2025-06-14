
-- Create enum types for better data organization
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE sheet_type AS ENUM ('tuf', 'striver', 'love_babbar_450', 'fraz', 'gfg_top_100', 'company_specific');
CREATE TYPE problem_status AS ENUM ('not_attempted', 'attempted', 'solved');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  github_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- DSA topics for roadmap organization
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  parent_topic_id UUID REFERENCES public.topics(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Problem sheets
CREATE TABLE public.sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sheet_type sheet_type NOT NULL,
  total_problems INTEGER DEFAULT 0,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual problems
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty difficulty_level NOT NULL,
  topic_id UUID REFERENCES public.topics(id),
  sheet_id UUID REFERENCES public.sheets(id),
  problem_url TEXT,
  solution_url TEXT,
  tags TEXT[],
  companies TEXT[],
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status problem_status NOT NULL DEFAULT 'not_attempted',
  attempted_at TIMESTAMP WITH TIME ZONE,
  solved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  code_solution TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  UNIQUE(user_id, problem_id)
);

-- User bookmarks
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Articles and resources
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  source TEXT, -- 'gfg', 'w3schools', 'custom'
  source_url TEXT,
  topic_id UUID REFERENCES public.topics(id),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User notes on articles
CREATE TABLE public.user_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Interview questions
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty difficulty_level NOT NULL,
  topic_id UUID REFERENCES public.topics(id),
  companies TEXT[],
  question_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User daily goals and streaks
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_problems_solved INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 3,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes" ON public.user_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON public.user_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON public.user_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON public.user_notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for reference data
CREATE POLICY "Everyone can view topics" ON public.topics FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Everyone can view sheets" ON public.sheets FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Everyone can view problems" ON public.problems FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Everyone can view articles" ON public.articles FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Everyone can view interview questions" ON public.interview_questions FOR SELECT TO authenticated, anon USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for topics (DSA roadmap structure)
INSERT INTO public.topics (name, description, order_index) VALUES
('Basics', 'Programming fundamentals and basic concepts', 1),
('Arrays', 'Array data structure and related algorithms', 2),
('Strings', 'String manipulation and algorithms', 3),
('Linked Lists', 'Linked list data structure and operations', 4),
('Stacks & Queues', 'Stack and Queue data structures', 5),
('Trees', 'Tree data structures and traversal algorithms', 6),
('Graphs', 'Graph data structure and graph algorithms', 7),
('Dynamic Programming', 'Dynamic programming concepts and problems', 8),
('Greedy Algorithms', 'Greedy algorithm approach and problems', 9),
('Backtracking', 'Backtracking algorithm technique', 10),
('Advanced Topics', 'Advanced algorithms and data structures', 11);

-- Insert sample sheets
INSERT INTO public.sheets (name, description, sheet_type, total_problems, source_url) VALUES
('TUF Sheet', 'Take U Forward comprehensive SDE interview preparation sheet', 'tuf', 191, 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'),
('Striver DSA Sheet', '79 most important DSA problems for interview preparation', 'striver', 79, 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'),
('Love Babbar 450', '450 most loved DSA problems curated by Love Babbar', 'love_babbar_450', 450, 'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view'),
('Fraz Sheet', 'Curated list of important DSA problems by Mohammad Fraz', 'fraz', 400, 'https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPkQojjSZ0Ie/edit#gid=0'),
('GFG Top 100', 'GeeksforGeeks top 100 coding problems for interviews', 'gfg_top_100', 100, 'https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/'),
('Company Specific', 'Problems asked in top tech companies like Google, Amazon, Microsoft', 'company_specific', 500, null);
