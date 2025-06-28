-- Create enum types if they don't exist (using existing names from schema)
DO $$ BEGIN
    CREATE TYPE difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sheet_type_enum AS ENUM ('tuf', 'striver', 'love_babbar_450', 'fraz', 'gfg_top_100', 'company_specific');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE problem_status_enum AS ENUM ('not_attempted', 'attempted', 'solved', 'review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  github_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- DSA topics for roadmap organization
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  parent_topic_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key for parent topic if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'topics_parent_topic_id_fkey' 
    AND table_name = 'topics'
  ) THEN
    ALTER TABLE public.topics ADD CONSTRAINT topics_parent_topic_id_fkey 
    FOREIGN KEY (parent_topic_id) REFERENCES public.topics(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Problem sheets
CREATE TABLE IF NOT EXISTS public.sheets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sheet_type sheet_type_enum NOT NULL,
  total_problems INTEGER DEFAULT 0,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual problems
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty difficulty_enum NOT NULL,
  topic_id UUID,
  sheet_id UUID,
  problem_url TEXT,
  solution_url TEXT,
  order_index INTEGER,
  tags TEXT[],
  companies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign keys for problems if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'problems_topic_id_fkey' 
    AND table_name = 'problems'
  ) THEN
    ALTER TABLE public.problems ADD CONSTRAINT problems_topic_id_fkey 
    FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'problems_sheet_id_fkey' 
    AND table_name = 'problems'
  ) THEN
    ALTER TABLE public.problems ADD CONSTRAINT problems_sheet_id_fkey 
    FOREIGN KEY (sheet_id) REFERENCES public.sheets(id) ON DELETE SET NULL;
  END IF;
END $$;

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_id UUID NOT NULL,
  status problem_status_enum DEFAULT 'not_attempted',
  code_solution TEXT,
  notes TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE,
  solved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, problem_id)
);

-- Add foreign keys for user_progress if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_progress_user_id_fkey' 
    AND table_name = 'user_progress'
  ) THEN
    ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_progress_problem_id_fkey' 
    AND table_name = 'user_progress'
  ) THEN
    ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_problem_id_fkey 
    FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE CASCADE;
  END IF;
END $$;

-- User bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Add foreign keys for bookmarks if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookmarks_user_id_fkey' 
    AND table_name = 'bookmarks'
  ) THEN
    ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookmarks_problem_id_fkey' 
    AND table_name = 'bookmarks'
  ) THEN
    ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_problem_id_fkey 
    FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Articles and resources
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  topic_id UUID,
  source TEXT,
  source_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key for articles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'articles_topic_id_fkey' 
    AND table_name = 'articles'
  ) THEN
    ALTER TABLE public.articles ADD CONSTRAINT articles_topic_id_fkey 
    FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE SET NULL;
  END IF;
END $$;

-- User notes on articles
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Add foreign keys for user_notes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_notes_user_id_fkey' 
    AND table_name = 'user_notes'
  ) THEN
    ALTER TABLE public.user_notes ADD CONSTRAINT user_notes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_notes_article_id_fkey' 
    AND table_name = 'user_notes'
  ) THEN
    ALTER TABLE public.user_notes ADD CONSTRAINT user_notes_article_id_fkey 
    FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Interview questions
CREATE TABLE IF NOT EXISTS public.interview_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty difficulty_enum NOT NULL,
  topic_id UUID,
  companies TEXT[],
  question_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key for interview_questions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'interview_questions_topic_id_fkey' 
    AND table_name = 'interview_questions'
  ) THEN
    ALTER TABLE public.interview_questions ADD CONSTRAINT interview_questions_topic_id_fkey 
    FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE SET NULL;
  END IF;
END $$;

-- User daily goals and streaks
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_problems_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  daily_goal INTEGER DEFAULT 3,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key for user_stats if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_stats_user_id_fkey' 
    AND table_name = 'user_stats'
  ) THEN
    ALTER TABLE public.user_stats ADD CONSTRAINT user_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security on tables that don't have it
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies only if they don't exist
DO $$
BEGIN
  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- User progress policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can read own progress') THEN
    CREATE POLICY "Users can read own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can manage own progress') THEN
    CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Bookmarks policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can manage own bookmarks') THEN
    CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User notes policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_notes' AND policyname = 'Users can manage own notes') THEN
    CREATE POLICY "Users can manage own notes" ON public.user_notes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User stats policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_stats' AND policyname = 'Users can read own stats') THEN
    CREATE POLICY "Users can read own stats" ON public.user_stats FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_stats' AND policyname = 'Users can manage own stats') THEN
    CREATE POLICY "Users can manage own stats" ON public.user_stats FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Public read access for reference data
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Authenticated users can read topics') THEN
    CREATE POLICY "Authenticated users can read topics" ON public.topics FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sheets' AND policyname = 'Authenticated users can read sheets') THEN
    CREATE POLICY "Authenticated users can read sheets" ON public.sheets FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'problems' AND policyname = 'Authenticated users can read problems') THEN
    CREATE POLICY "Authenticated users can read problems" ON public.problems FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Authenticated users can read articles') THEN
    CREATE POLICY "Authenticated users can read articles" ON public.articles FOR SELECT TO authenticated USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'interview_questions' AND policyname = 'Authenticated users can read interview questions') THEN
    CREATE POLICY "Authenticated users can read interview questions" ON public.interview_questions FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_order ON public.topics(order_index);
CREATE INDEX IF NOT EXISTS idx_topics_parent_id ON public.topics(parent_topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_topic_id ON public.problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_sheet_id ON public.problems(sheet_id);
CREATE INDEX IF NOT EXISTS idx_problems_tags ON public.problems USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_problems_companies ON public.problems USING gin(companies);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_problem_id ON public.user_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- Insert sample data for topics (DSA roadmap structure) - only if not exists
INSERT INTO public.topics (name, description, order_index) 
SELECT * FROM (VALUES
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
  ('Advanced Topics', 'Advanced algorithms and data structures', 11)
) AS v(name, description, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE topics.name = v.name);

-- Insert sample sheets - only if not exists (FIXED TYPE CASTING ISSUE)
INSERT INTO public.sheets (name, description, sheet_type, total_problems, source_url) 
SELECT * FROM (VALUES
  ('TUF Sheet', 'Take U Forward comprehensive SDE interview preparation sheet', 'tuf'::sheet_type_enum, 191, 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'),
  ('Striver DSA Sheet', '79 most important DSA problems for interview preparation', 'striver'::sheet_type_enum, 79, 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/'),
  ('Love Babbar 450', '450 most loved DSA problems curated by Love Babbar', 'love_babbar_450'::sheet_type_enum, 450, 'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view'),
  ('Fraz Sheet', 'Curated list of important DSA problems by Mohammad Fraz', 'fraz'::sheet_type_enum, 400, 'https://docs.google.com/spreadsheets/d/1-wKcV99KtO91dXdPkwmXGTdtyxAfk1mbPkQojjSZ0Ie/edit#gid=0'),
  ('GFG Top 100', 'GeeksforGeeks top 100 coding problems for interviews', 'gfg_top_100'::sheet_type_enum, 100, 'https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/'),
  ('Company Specific', 'Problems asked in top tech companies like Google, Amazon, Microsoft', 'company_specific'::sheet_type_enum, 500, null)
) AS v(name, description, sheet_type, total_problems, source_url)
WHERE NOT EXISTS (SELECT 1 FROM public.sheets WHERE sheets.name = v.name);