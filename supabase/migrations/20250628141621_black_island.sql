/*
  # LeetCode Stats Table Creation and Configuration

  1. New Tables
     - `leetcode_stats` - Store LeetCode statistics for users
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to auth.users)
       - `username` (text, LeetCode username)
       - `total_solved` (integer, total problems solved)
       - `easy_solved` (integer, easy problems solved)
       - `medium_solved` (integer, medium problems solved)
       - `hard_solved` (integer, hard problems solved)
       - `acceptance_rate` (double precision, submission acceptance rate)
       - `ranking` (integer, global ranking)
       - `submission_calendar` (jsonb, submission history calendar)
       - `last_fetched_at` (timestamptz, when stats were last updated)
       - `created_at` (timestamptz, when record was created)
       - `updated_at` (timestamptz, when record was last updated)
  
  2. Security
     - Enable Row Level Security on leetcode_stats
     - Add policies for users to manage and read their own stats
  
  3. Functions
     - Add function to sync LeetCode stats to user_stats
*/

-- Create leetcode_stats table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS public.leetcode_stats (
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
END $$;

-- Enable RLS
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON public.leetcode_stats(user_id);

-- Create RLS policies only if they don't exist
DO $$ 
BEGIN
  -- Check if the policy already exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' 
    AND policyname = 'Users can read their own LeetCode stats'
  ) THEN
    CREATE POLICY "Users can read their own LeetCode stats"
      ON public.leetcode_stats
      FOR SELECT
      TO public
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' 
    AND policyname = 'Users can manage their own LeetCode stats'
  ) THEN
    CREATE POLICY "Users can manage their own LeetCode stats"
      ON public.leetcode_stats
      FOR ALL
      TO public
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create RPC function to get solved problems by topic (if it doesn't exist)
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
    COUNT(up.id) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = get_solved_problems_by_topic.user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name ASC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;

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