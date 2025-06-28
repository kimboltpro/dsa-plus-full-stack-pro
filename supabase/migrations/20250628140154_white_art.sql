/*
  # Fix LeetCode Stats and Database Functions

  1. Database Functions
    - Create `get_solved_problems_by_topic` function for dashboard analytics
  
  2. Table Updates  
    - Update `leetcode_stats` table to match code expectations (snake_case columns)
    - Ensure proper constraints and indexes
    
  3. Security
    - Maintain existing RLS policies
    - Update policies if needed for new column names
*/

-- First, create the missing function for topic-wise progress
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE(topic_id uuid, topic_name text, count bigint)
LANGUAGE plpgsql
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

-- Update leetcode_stats table structure to match code expectations
DO $$
BEGIN
  -- Check if the table exists and has the old column names
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'leetcode_stats' AND column_name = 'totalsolved'
  ) THEN
    -- Rename columns to snake_case to match code expectations
    ALTER TABLE leetcode_stats RENAME COLUMN totalsolved TO total_solved;
    ALTER TABLE leetcode_stats RENAME COLUMN easysolved TO easy_solved;
    ALTER TABLE leetcode_stats RENAME COLUMN mediumsolved TO medium_solved;
    ALTER TABLE leetcode_stats RENAME COLUMN hardsolved TO hard_solved;
    ALTER TABLE leetcode_stats RENAME COLUMN acceptancerate TO acceptance_rate;
    ALTER TABLE leetcode_stats RENAME COLUMN submissioncalendar TO submission_calendar;
  END IF;
  
  -- Ensure the table exists with correct structure if it doesn't
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
END $$;

-- Ensure RLS is enabled
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can manage their own LeetCode stats" ON leetcode_stats;
DROP POLICY IF EXISTS "Users can read their own LeetCode stats" ON leetcode_stats;

-- Create RLS policies
CREATE POLICY "Users can manage their own LeetCode stats"
  ON leetcode_stats
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own LeetCode stats"
  ON leetcode_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leetcode_stats_user_id_fkey'
  ) THEN
    ALTER TABLE leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint on user_id and username if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leetcode_stats_user_id_username_key'
  ) THEN
    ALTER TABLE leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_username_key 
    UNIQUE (user_id, username);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats(user_id);

-- Add trigger to sync leetcode stats to user_stats if function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'sync_leetcode_to_user_stats') THEN
    DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
    CREATE TRIGGER trigger_sync_leetcode
      AFTER INSERT OR UPDATE ON leetcode_stats
      FOR EACH ROW
      EXECUTE FUNCTION sync_leetcode_to_user_stats();
  END IF;
END $$;