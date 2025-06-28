/*
  # Complete Database Schema Setup

  1. Enums
    - difficulty_enum: Easy, Medium, Hard
    - problem_status_enum: not_attempted, attempted, solved, review  
    - sheet_type_enum: tuf, striver, love_babbar_450, fraz, gfg_top_100, company_specific

  2. Tables
    - profiles: User profile information
    - user_stats: User statistics and streaks
    - topics: Problem topics/categories
    - sheets: Problem sheet collections
    - problems: Individual problems
    - user_progress: User's progress on problems
    - bookmarks: User's bookmarked problems
    - articles: Educational articles
    - user_notes: User notes on articles
    - interview_questions: Interview preparation questions
    - leetcode_stats: LeetCode profile statistics
    - codolio_stats: Codolio profile statistics

  3. Functions
    - get_solved_problems_by_topic: Aggregate solved problems by topic
    - update_user_streak: Update user streak when problems are solved
    - sync_leetcode_to_user_stats: Sync LeetCode stats to user stats
    - handle_new_user: Handle new user registration

  4. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Create enums
CREATE TYPE IF NOT EXISTS difficulty_enum AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE IF NOT EXISTS problem_status_enum AS ENUM ('not_attempted', 'attempted', 'solved', 'review');
CREATE TYPE IF NOT EXISTS sheet_type_enum AS ENUM ('tuf', 'striver', 'love_babbar_450', 'fraz', 'gfg_top_100', 'company_specific');

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
CREATE POLICY IF NOT EXISTS "Users can read own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

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
CREATE POLICY IF NOT EXISTS "Users can read own stats" ON user_stats
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own stats" ON user_stats
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
CREATE POLICY IF NOT EXISTS "Authenticated users can read topics" ON topics
  FOR SELECT TO authenticated USING (true);

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
CREATE POLICY IF NOT EXISTS "Authenticated users can read sheets" ON sheets
  FOR SELECT TO authenticated USING (true);

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
CREATE POLICY IF NOT EXISTS "Authenticated users can read problems" ON problems
  FOR SELECT TO authenticated USING (true);

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
CREATE POLICY IF NOT EXISTS "Users can read own progress" ON user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own progress" ON user_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
CREATE POLICY IF NOT EXISTS "Users can manage own bookmarks" ON bookmarks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
CREATE POLICY IF NOT EXISTS "Authenticated users can read articles" ON articles
  FOR SELECT TO authenticated USING (true);

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
CREATE POLICY IF NOT EXISTS "Users can manage own notes" ON user_notes
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
CREATE POLICY IF NOT EXISTS "Authenticated users can read interview questions" ON interview_questions
  FOR SELECT TO authenticated USING (true);

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
  submission_calendar jsonb DEFAULT '{}',
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, username)
);

ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- LeetCode stats policies
CREATE POLICY IF NOT EXISTS "Users can read their own LeetCode stats" ON leetcode_stats
  FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own LeetCode stats" ON leetcode_stats
  FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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
  topic_counts jsonb DEFAULT '{}',
  ratings_timeline jsonb DEFAULT '{}',
  platform_stats jsonb DEFAULT '{}',
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, username)
);

ALTER TABLE codolio_stats ENABLE ROW LEVEL SECURITY;

-- Codolio stats policies
CREATE POLICY IF NOT EXISTS "Users can read their own Codolio stats" ON codolio_stats
  FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own Codolio stats" ON codolio_stats
  FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

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

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_user_streak ON user_progress;
CREATE TRIGGER trigger_update_user_streak
  BEFORE INSERT OR UPDATE OF status ON user_progress
  FOR EACH ROW
  WHEN (NEW.status = 'solved')
  EXECUTE FUNCTION update_user_streak();

DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW
  EXECUTE FUNCTION sync_leetcode_to_user_stats();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();