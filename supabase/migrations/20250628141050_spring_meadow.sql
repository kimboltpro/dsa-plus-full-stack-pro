/*
  # LeetCode Stats Integration
  
  1. New Tables
    - `leetcode_stats` - For storing LeetCode user stats
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `username` (text)
      - `total_solved` (integer)
      - `easy_solved` (integer)
      - `medium_solved` (integer)
      - `hard_solved` (integer)
      - `acceptance_rate` (double precision)
      - `ranking` (integer)
      - `submission_calendar` (jsonb)
      - And more fields for timestamps

  2. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for authenticated users
  
  3. Functions
    - Update `sync_leetcode_to_user_stats` to update user_stats table
    - Create function to get LeetCode stats for a user
*/

-- Create leetcode_stats table with snake_case column names
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats(user_id);

-- Enable RLS on the table
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the leetcode_stats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' AND policyname = 'Users can manage their own LeetCode stats'
  ) THEN
    CREATE POLICY "Users can manage their own LeetCode stats" 
    ON leetcode_stats 
    FOR ALL 
    TO public
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' AND policyname = 'Users can read their own LeetCode stats'
  ) THEN
    CREATE POLICY "Users can read their own LeetCode stats" 
    ON leetcode_stats 
    FOR SELECT 
    TO public
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Function to sync leetcode stats to user_stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_stats with LeetCode data
  UPDATE user_stats
  SET 
    total_problems_solved = GREATEST(total_problems_solved, NEW.total_solved),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update user stats when LeetCode stats are updated
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
AFTER INSERT OR UPDATE
ON leetcode_stats
FOR EACH ROW
EXECUTE FUNCTION sync_leetcode_to_user_stats();

-- Function to get solved problems by topic for a user
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE(topic_id uuid, topic_name text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.topic_id,
    t.name AS topic_name,
    COUNT(up.problem_id) AS count
  FROM
    user_progress up
  JOIN
    problems p ON up.problem_id = p.id
  JOIN
    topics t ON p.topic_id = t.id
  WHERE
    up.user_id = user_id_param AND up.status = 'solved'
  GROUP BY
    p.topic_id, t.name
  ORDER BY
    count DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;

-- Enable realtime for the leetcode_stats table (for subscriptions)
DO $$
BEGIN
  -- Check if the publication exists
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Try to add the table to realtime if not already added
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public'
      AND tablename = 'leetcode_stats'
    ) THEN
      BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE leetcode_stats;
      EXCEPTION WHEN OTHERS THEN
        -- If it fails because the table is already a member, that's fine
        NULL;
      END;
    END IF;
  END IF;
END
$$;