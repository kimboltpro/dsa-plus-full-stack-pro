/*
  # LeetCode Stats Integration

  1. Table Setup
    - Create `leetcode_stats` table if it doesn't exist with snake_case column names
  
  2. Security
    - Enable Row Level Security
    - Add policies for users to manage their own stats
  
  3. Functions
    - Add sync function to update user_stats with LeetCode progress
    - Create function to get solved problems by topic
*/

-- First check if the table exists, and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leetcode_stats') THEN
    -- Create the LeetCode stats table with snake_case column names from the start
    CREATE TABLE public.leetcode_stats (
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
  END IF;
END
$$;

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

-- Create the sync function only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'sync_leetcode_to_user_stats' 
    AND pronamespace = 'public'::regnamespace
  ) THEN
    -- Function to update user stats based on LeetCode progress
    CREATE FUNCTION public.sync_leetcode_to_user_stats()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update user_stats with LeetCode data
      UPDATE public.user_stats
      SET 
        total_problems_solved = NEW.total_solved,
        updated_at = now()
      WHERE user_id = NEW.user_id;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END
$$;

-- Create trigger to update user stats when LeetCode stats are updated
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON public.leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
AFTER INSERT OR UPDATE
ON public.leetcode_stats
FOR EACH ROW
EXECUTE FUNCTION public.sync_leetcode_to_user_stats();

-- Create the function to get solved problems by topic
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(user_id_param uuid)
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
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO authenticated;

-- Enable realtime for the leetcode_stats table if not already enabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Check if the table is already in the publication
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public'
      AND tablename = 'leetcode_stats'
    ) THEN
      -- Try to add the table to realtime
      BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leetcode_stats;
      EXCEPTION WHEN OTHERS THEN
        -- If it fails because the table is already a member, that's fine
        NULL;
      END;
    END IF;
  END IF;
END
$$;

-- Function to get LeetCode stats by user_id
CREATE OR REPLACE FUNCTION public.get_leetcode_stats(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  total_solved INTEGER,
  easy_solved INTEGER,
  medium_solved INTEGER,
  hard_solved INTEGER,
  acceptance_rate DOUBLE PRECISION,
  ranking INTEGER,
  submission_calendar JSONB,
  last_fetched_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    id,
    username,
    total_solved,
    easy_solved,
    medium_solved,
    hard_solved,
    acceptance_rate,
    ranking,
    submission_calendar,
    last_fetched_at
  FROM 
    leetcode_stats
  WHERE 
    user_id = user_id_param
  LIMIT 1;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_leetcode_stats(UUID) TO authenticated;