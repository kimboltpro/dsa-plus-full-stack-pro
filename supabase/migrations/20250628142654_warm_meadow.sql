/*
  # LeetCode Integration Schema

  1. New Tables
     - `leetcode_stats` - Stores LeetCode user statistics
       - `id` (uuid, primary key)
       - `user_id` (uuid, foreign key to auth.users)
       - `username` (text, LeetCode username)
       - Various stats fields (solved counts, ratings, etc.)
       
  2. Functions
     - `get_solved_problems_by_topic` - Retrieves solved problems by topic for a user
     - `sync_leetcode_to_user_stats` - Updates user stats based on LeetCode data
     
  3. Security
     - RLS policies for the leetcode_stats table
     - Permission settings for functions
*/

-- Create leetcode_stats table
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON public.leetcode_stats USING btree (user_id);

-- Enable Row Level Security
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own LeetCode stats"
  ON public.leetcode_stats
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own LeetCode stats"
  ON public.leetcode_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Create trigger function for syncing LeetCode stats to user_stats
CREATE OR REPLACE FUNCTION public.sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user_stats when LeetCode stats are updated
  INSERT INTO user_stats (user_id, total_problems_solved, updated_at)
  VALUES (NEW.user_id, NEW.total_solved, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW EXECUTE FUNCTION sync_leetcode_to_user_stats();

-- Create function to get solved problems by topic
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(
  user_id_param uuid
)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id AS topic_id,
    t.name AS topic_name,
    COUNT(up.problem_id)::bigint AS count
  FROM
    topics t
  LEFT JOIN
    problems p ON t.id = p.topic_id
  LEFT JOIN
    user_progress up ON p.id = up.problem_id 
                     AND up.user_id = user_id_param 
                     AND up.status = 'solved'
  GROUP BY
    t.id, t.name
  ORDER BY
    count DESC, t.name ASC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO anon;

-- Enable realtime for the leetcode_stats table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leetcode_stats;