/*
  # Create LeetCode Stats Table and Functions
  
  1. New Tables
    - `leetcode_stats` - Stores user LeetCode statistics
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `username` (text)
      - Various statistics fields
  
  2. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for authenticated users
    
  3. Functions
    - Functions to handle fetching and updating LeetCode stats
*/

-- Create LeetCode stats table
CREATE TABLE IF NOT EXISTS public.leetcode_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  totalSolved integer DEFAULT 0,
  easySolved integer DEFAULT 0,
  mediumSolved integer DEFAULT 0,
  hardSolved integer DEFAULT 0,
  acceptanceRate float DEFAULT 0,
  ranking integer DEFAULT 0,
  submissionCalendar jsonb DEFAULT '{}'::jsonb,
  last_fetched_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, username)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON public.leetcode_stats(user_id);

-- Enable RLS on the table
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the leetcode_stats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' AND policyname = 'Users can manage their own LeetCode stats'
  ) THEN
    CREATE POLICY "Users can manage their own LeetCode stats" 
    ON public.leetcode_stats 
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
    ON public.leetcode_stats 
    FOR SELECT 
    TO public
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Function to update user stats based on LeetCode progress
CREATE OR REPLACE FUNCTION public.sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user_stats with LeetCode data
  UPDATE public.user_stats
  SET 
    total_problems_solved = NEW.totalSolved,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update user stats when LeetCode stats are updated
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON public.leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
AFTER INSERT OR UPDATE
ON public.leetcode_stats
FOR EACH ROW
EXECUTE FUNCTION public.sync_leetcode_to_user_stats();

-- Enable realtime for the leetcode_stats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public'
    AND tablename = 'leetcode_stats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leetcode_stats;
  END IF;
END
$$;

-- Function to get LeetCode stats by user_id
CREATE OR REPLACE FUNCTION public.get_leetcode_stats(user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  totalSolved INTEGER,
  easySolved INTEGER,
  mediumSolved INTEGER,
  hardSolved INTEGER,
  acceptanceRate FLOAT,
  ranking INTEGER,
  submissionCalendar JSONB,
  last_fetched_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    id,
    username,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate,
    ranking,
    submissionCalendar,
    last_fetched_at
  FROM 
    leetcode_stats
  WHERE 
    user_id = get_leetcode_stats.user_id
  LIMIT 1;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_leetcode_stats(UUID) TO authenticated;