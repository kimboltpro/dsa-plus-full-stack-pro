/*
  # Database Schema for DSA Mastery Hub
  
  1. New Tables
    - Creates enum types for difficulty levels, problem status, and sheet types
    - Sets up all required tables including:
      - profiles, user_stats, topics, sheets, problems
      - user_progress, bookmarks, articles, user_notes
      - interview_questions, leetcode_stats, codolio_stats
  2. Security
    - Enables RLS on all tables
    - Creates appropriate policies for data access
  3. Functions & Triggers
    - Adds functions for updating user streaks and stats
    - Creates triggers for maintaining data consistency
*/

-- Create enums using DO block to check existence first
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
    CREATE TYPE difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'problem_status_enum') THEN
    CREATE TYPE problem_status_enum AS ENUM ('not_attempted', 'attempted', 'solved', 'review');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sheet_type_enum') THEN
    CREATE TYPE sheet_type_enum AS ENUM ('tuf', 'striver', 'love_babbar_450', 'fraz', 'gfg_top_100', 'company_specific');
  END IF;
END
$$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  github_profile text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON profiles
      FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE TO authenticated USING (auth.uid() = id);
  END IF;
END
$$;

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_problems_solved integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  daily_goal integer DEFAULT 3,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- User stats policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_stats' AND policyname = 'Users can read own stats') THEN
    CREATE POLICY "Users can read own stats" ON user_stats
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_stats' AND policyname = 'Users can manage own stats') THEN
    CREATE POLICY "Users can manage own stats" ON user_stats
      FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  order_index integer NOT NULL,
  parent_topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Topics policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Authenticated users can read topics') THEN
    CREATE POLICY "Authenticated users can read topics" ON topics
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Create indexes for topics
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(order_index);
CREATE INDEX IF NOT EXISTS idx_topics_parent_id ON topics(parent_topic_id);

-- Create sheets table
CREATE TABLE IF NOT EXISTS sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sheet_type sheet_type_enum NOT NULL,
  total_problems integer DEFAULT 0,
  source_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sheets ENABLE ROW LEVEL SECURITY;

-- Sheets policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sheets' AND policyname = 'Authenticated users can read sheets') THEN
    CREATE POLICY "Authenticated users can read sheets" ON sheets
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty difficulty_enum NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  sheet_id uuid REFERENCES sheets(id) ON DELETE SET NULL,
  problem_url text,
  solution_url text,
  order_index integer,
  tags text[],
  companies text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

-- Problems policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'problems' AND policyname = 'Authenticated users can read problems') THEN
    CREATE POLICY "Authenticated users can read problems" ON problems
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Create indexes for problems
CREATE INDEX IF NOT EXISTS idx_problems_topic_id ON problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_problems_sheet_id ON problems(sheet_id);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_tags ON problems USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_problems_companies ON problems USING gin(companies);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  status problem_status_enum DEFAULT 'not_attempted',
  code_solution text,
  notes text,
  time_complexity text,
  space_complexity text,
  attempted_at timestamptz,
  solved_at timestamptz,
  UNIQUE(user_id, problem_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can read own progress') THEN
    CREATE POLICY "Users can read own progress" ON user_progress
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_progress' AND policyname = 'Users can manage own progress') THEN
    CREATE POLICY "Users can manage own progress" ON user_progress
      FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create indexes for user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_problem_id ON user_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookmarks' AND policyname = 'Users can manage own bookmarks') THEN
    CREATE POLICY "Users can manage own bookmarks" ON bookmarks
      FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create index for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  source text,
  source_url text,
  tags text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Articles policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'articles' AND policyname = 'Authenticated users can read articles') THEN
    CREATE POLICY "Authenticated users can read articles" ON articles
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Create user_notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- User notes policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_notes' AND policyname = 'Users can manage own notes') THEN
    CREATE POLICY "Users can manage own notes" ON user_notes
      FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty difficulty_enum NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  question_url text,
  companies text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Interview questions policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'interview_questions' AND policyname = 'Authenticated users can read interview questions') THEN
    CREATE POLICY "Authenticated users can read interview questions" ON interview_questions
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Create leetcode_stats table
CREATE TABLE IF NOT EXISTS leetcode_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  total_solved integer DEFAULT 0,
  easy_solved integer DEFAULT 0,
  medium_solved integer DEFAULT 0,
  hard_solved integer DEFAULT 0,
  acceptance_rate double precision DEFAULT 0,
  ranking integer DEFAULT 0,
  submission_calendar jsonb DEFAULT '{}'::jsonb,
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, username)
);

ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- LeetCode stats policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leetcode_stats' AND policyname = 'Users can read their own LeetCode stats') THEN
    CREATE POLICY "Users can read their own LeetCode stats" ON leetcode_stats
      FOR SELECT TO public USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leetcode_stats' AND policyname = 'Users can manage their own LeetCode stats') THEN
    CREATE POLICY "Users can manage their own LeetCode stats" ON leetcode_stats
      FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create index for leetcode_stats
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats(user_id);

-- Create codolio_stats table
CREATE TABLE IF NOT EXISTS codolio_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  profile_url text,
  total_solved integer DEFAULT 0,
  streak integer DEFAULT 0,
  topic_counts jsonb DEFAULT '{}'::jsonb,
  ratings_timeline jsonb DEFAULT '{}'::jsonb,
  platform_stats jsonb DEFAULT '{}'::jsonb,
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, username)
);

ALTER TABLE codolio_stats ENABLE ROW LEVEL SECURITY;

-- Codolio stats policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'codolio_stats' AND policyname = 'Users can read their own Codolio stats') THEN
    CREATE POLICY "Users can read their own Codolio stats" ON codolio_stats
      FOR SELECT TO public USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'codolio_stats' AND policyname = 'Users can manage their own Codolio stats') THEN
    CREATE POLICY "Users can manage their own Codolio stats" ON codolio_stats
      FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- Create index for codolio_stats
CREATE INDEX IF NOT EXISTS idx_codolio_stats_user_id ON codolio_stats(user_id);

-- Create the get_solved_problems_by_topic function
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as topic_id,
    t.name as topic_name,
    COUNT(up.problem_id) as count
  FROM topics t
  LEFT JOIN problems p ON t.id = p.topic_id
  LEFT JOIN user_progress up ON p.id = up.problem_id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO anon;

-- Create trigger function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when a problem is solved
  IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
    -- Update solved_at timestamp
    NEW.solved_at = now();
    
    -- Update user stats
    INSERT INTO user_stats (user_id, total_problems_solved, last_activity_date, updated_at)
    VALUES (NEW.user_id, 1, CURRENT_DATE, now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_problems_solved = user_stats.total_problems_solved + 1,
      last_activity_date = CURRENT_DATE,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to sync LeetCode stats to user stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync LeetCode total solved to user stats
  INSERT INTO user_stats (user_id, total_problems_solved, updated_at)
  VALUES (NEW.user_id, NEW.total_solved, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  
  -- Create user stats for new user
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers with safety checks
DO $$
BEGIN
  -- Create user progress trigger if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_user_streak') THEN
    CREATE TRIGGER trigger_update_user_streak
      BEFORE INSERT OR UPDATE OF status ON user_progress
      FOR EACH ROW
      WHEN (NEW.status = 'solved')
      EXECUTE FUNCTION update_user_streak();
  END IF;
  
  -- Create leetcode stats trigger if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_sync_leetcode') THEN
    CREATE TRIGGER trigger_sync_leetcode
      AFTER INSERT OR UPDATE ON leetcode_stats
      FOR EACH ROW
      EXECUTE FUNCTION sync_leetcode_to_user_stats();
  END IF;
  
  -- Create auth user trigger if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
  END IF;
END
$$;