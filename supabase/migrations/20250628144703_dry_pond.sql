/*
  # Fix LeetCode Integration

  1. Tables
    - Create `leetcode_stats` table with proper snake_case column names
    - Add appropriate constraints and indexes
  
  2. RLS Policies
    - Add RLS policies with proper checks for existence
  
  3. Functions
    - Create sync function for user stats
    - Create topic progress helper function
    - Add proper permissions
*/

-- Create leetcode_stats table with proper naming convention
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
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT leetcode_stats_user_id_username_key UNIQUE (user_id, username)
);

-- Add foreign key constraint to auth.users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leetcode_stats_user_id_fkey' 
    AND table_name = 'leetcode_stats'
  ) THEN
    ALTER TABLE leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats(user_id);

-- Enable Row Level Security
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Safely drop and recreate RLS policies
DO $$
BEGIN
  -- Check if policies exist before dropping
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' AND policyname = 'Users can read their own LeetCode stats'
  ) THEN
    DROP POLICY "Users can read their own LeetCode stats" ON leetcode_stats;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'leetcode_stats' AND policyname = 'Users can manage their own LeetCode stats'
  ) THEN
    DROP POLICY "Users can manage their own LeetCode stats" ON leetcode_stats;
  END IF;
END $$;

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

-- Create function to sync LeetCode stats to user_stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user_stats when LeetCode stats are updated
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW
  EXECUTE FUNCTION sync_leetcode_to_user_stats();

-- Create or replace the get_solved_problems_by_topic function
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
    COALESCE(COUNT(up.id) FILTER (WHERE up.problem_id IS NOT NULL), 0)::bigint as count
  FROM topics t
  LEFT JOIN problems p ON t.id = p.topic_id
  LEFT JOIN user_progress up ON p.id = up.problem_id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO anon;

-- Conditionally enable realtime for the leetcode_stats table
DO $$
BEGIN
  -- Check if the publication exists
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
      -- Add the table to the publication
      ALTER PUBLICATION supabase_realtime ADD TABLE leetcode_stats;
    END IF;
  END IF;
END
$$;