/*
# Create missing database objects

1. New Tables
  - `leetcode_stats`
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to users table)
    - `username` (text, not null)
    - `total_solved` (integer, default 0)
    - `easy_solved` (integer, default 0)
    - `medium_solved` (integer, default 0)
    - `hard_solved` (integer, default 0)
    - `acceptance_rate` (double precision, default 0)
    - `ranking` (integer, default 0)
    - `submission_calendar` (jsonb, default '{}')
    - `last_fetched_at` (timestamptz, default now)
    - `created_at` (timestamptz, default now)
    - `updated_at` (timestamptz, default now)

2. Security
  - Enable RLS on `leetcode_stats` table
  - Add policies for authenticated users to manage their own LeetCode stats

3. Functions
  - `get_solved_problems_by_topic` - Returns topic-wise solved problem counts for a user
  - `sync_leetcode_to_user_stats` - Syncs LeetCode stats to user_stats table
  - `update_user_streak` - Updates user streak when problems are solved

4. Triggers
  - Trigger to sync LeetCode stats to user_stats table
  - Trigger to update user streak when user_progress is updated

5. Indexes
  - Indexes for performance optimization
*/

-- Create leetcode_stats table
CREATE TABLE IF NOT EXISTS leetcode_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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
  CONSTRAINT leetcode_stats_user_id_username_key UNIQUE (user_id, username)
);

-- Add foreign key constraint to users table (assuming users table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'users' AND table_schema = 'public'
  ) THEN
    ALTER TABLE leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own LeetCode stats"
  ON leetcode_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own LeetCode stats"
  ON leetcode_stats
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats (user_id);

-- Create get_solved_problems_by_topic function
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as topic_id,
    t.name as topic_name,
    COALESCE(COUNT(up.id), 0) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name;
END;
$$;

-- Create sync_leetcode_to_user_stats function
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user_stats with LeetCode data
  INSERT INTO user_stats (
    user_id, 
    total_problems_solved, 
    updated_at
  )
  VALUES (
    NEW.user_id,
    NEW.total_solved,
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Create update_user_streak function
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date date := CURRENT_DATE;
  yesterday_date date := CURRENT_DATE - INTERVAL '1 day';
  current_streak_val integer := 0;
  longest_streak_val integer := 0;
BEGIN
  -- Only proceed if status changed to 'solved'
  IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
    -- Update solved_at timestamp
    NEW.solved_at := now();
    
    -- Get current streak and longest streak from user_stats
    SELECT current_streak, longest_streak 
    INTO current_streak_val, longest_streak_val
    FROM user_stats 
    WHERE user_id = NEW.user_id;
    
    -- If no stats record exists, create one
    IF current_streak_val IS NULL THEN
      current_streak_val := 0;
      longest_streak_val := 0;
    END IF;
    
    -- Check if user solved problems yesterday or today
    IF EXISTS (
      SELECT 1 FROM user_progress up
      JOIN problems p ON p.id = up.problem_id
      WHERE up.user_id = NEW.user_id 
        AND up.status = 'solved'
        AND DATE(up.solved_at) = yesterday_date
    ) OR EXISTS (
      SELECT 1 FROM user_progress up
      JOIN problems p ON p.id = up.problem_id
      WHERE up.user_id = NEW.user_id 
        AND up.status = 'solved'
        AND DATE(up.solved_at) = today_date
        AND up.id != NEW.id -- Exclude current record
    ) THEN
      -- Continue streak
      current_streak_val := current_streak_val + 1;
    ELSE
      -- Start new streak
      current_streak_val := 1;
    END IF;
    
    -- Update longest streak if current is longer
    longest_streak_val := GREATEST(longest_streak_val, current_streak_val);
    
    -- Update user_stats
    INSERT INTO user_stats (
      user_id,
      current_streak,
      longest_streak,
      last_activity_date,
      total_problems_solved,
      updated_at
    )
    VALUES (
      NEW.user_id,
      current_streak_val,
      longest_streak_val,
      today_date,
      1,
      now()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      current_streak = current_streak_val,
      longest_streak = longest_streak_val,
      last_activity_date = today_date,
      total_problems_solved = user_stats.total_problems_solved + 1,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW
  EXECUTE FUNCTION sync_leetcode_to_user_stats();

DROP TRIGGER IF EXISTS trigger_update_user_streak ON user_progress;
CREATE TRIGGER trigger_update_user_streak
  AFTER INSERT OR UPDATE OF status ON user_progress
  FOR EACH ROW
  WHEN (NEW.status = 'solved')
  EXECUTE FUNCTION update_user_streak();