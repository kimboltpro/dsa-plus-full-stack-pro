/*
  # Add missing database objects

  1. New Tables
    - `leetcode_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `username` (text, unique with user_id)
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

  2. Functions
    - `get_solved_problems_by_topic` - Returns topic-wise problem solving counts for a user
    - `sync_leetcode_to_user_stats` - Syncs LeetCode stats to user_stats table

  3. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for users to manage their own LeetCode stats
    - Add trigger to sync LeetCode stats to user_stats

  4. Indexes
    - Add performance indexes for common queries
*/

-- Create leetcode_stats table if it doesn't exist
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
  submission_calendar jsonb DEFAULT '{}'::jsonb,
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'leetcode_stats' AND constraint_name = 'leetcode_stats_user_id_fkey'
  ) THEN
    ALTER TABLE leetcode_stats ADD CONSTRAINT leetcode_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'leetcode_stats' AND constraint_name = 'leetcode_stats_user_id_username_key'
  ) THEN
    ALTER TABLE leetcode_stats ADD CONSTRAINT leetcode_stats_user_id_username_key 
    UNIQUE (user_id, username);
  END IF;
END $$;

-- Add indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'leetcode_stats' AND indexname = 'idx_leetcode_stats_user_id') THEN
    CREATE INDEX idx_leetcode_stats_user_id ON leetcode_stats USING btree (user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can manage their own LeetCode stats" ON leetcode_stats;
CREATE POLICY "Users can manage their own LeetCode stats"
  ON leetcode_stats
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own LeetCode stats" ON leetcode_stats;
CREATE POLICY "Users can read their own LeetCode stats"
  ON leetcode_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Create function to sync LeetCode stats to user_stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_stats when LeetCode stats are updated
  INSERT INTO user_stats (user_id, total_problems_solved, updated_at)
  VALUES (NEW.user_id, NEW.total_solved, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for syncing LeetCode stats
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW EXECUTE FUNCTION sync_leetcode_to_user_stats();

-- Create function to get solved problems by topic
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id as topic_id,
    t.name as topic_name,
    COUNT(up.id) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO anon;