/*
  # Add LeetCode stats table and RPC function

  1. New Tables
    - `leetcode_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `username` (text, not null)
      - `total_solved` (integer, default 0)
      - `easy_solved` (integer, default 0)
      - `medium_solved` (integer, default 0)
      - `hard_solved` (integer, default 0)
      - `acceptance_rate` (double precision, default 0)
      - `ranking` (integer, default 0)
      - `submission_calendar` (jsonb, default '{}')
      - `last_fetched_at` (timestamp with time zone, default now())
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. New Functions
    - `get_solved_problems_by_topic` - Returns solved problems count by topic for a user

  3. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for users to manage their own LeetCode stats
    - Add trigger to sync LeetCode stats to user stats
*/

-- Create leetcode_stats table
CREATE TABLE IF NOT EXISTS leetcode_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Enable RLS
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats(user_id);

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

-- Create RPC function to get solved problems by topic
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id uuid)
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
    COUNT(up.id) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = get_solved_problems_by_topic.user_id 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name ASC;
END;
$$;

-- Create function to sync LeetCode stats to user stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user_stats table with LeetCode data
  INSERT INTO user_stats (user_id, total_problems_solved, updated_at)
  VALUES (NEW.user_id, NEW.total_solved, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Create trigger to sync LeetCode stats
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW
  EXECUTE FUNCTION sync_leetcode_to_user_stats();