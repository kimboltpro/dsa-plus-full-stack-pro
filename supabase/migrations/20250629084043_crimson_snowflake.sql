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

-- Add foreign key constraint only if it doesn't exist
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

-- Add unique constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leetcode_stats_user_id_username_key' 
    AND table_name = 'leetcode_stats'
  ) THEN
    ALTER TABLE leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_username_key 
    UNIQUE (user_id, username);
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats USING btree (user_id);

-- Enable Row Level Security
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own LeetCode stats" ON leetcode_stats;
DROP POLICY IF EXISTS "Users can read their own LeetCode stats" ON leetcode_stats;

-- Create policies
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

-- Create sync_leetcode_to_user_stats function - without the conditional check
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
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