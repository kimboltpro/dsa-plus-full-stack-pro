/*
  # Create LeetCode Stats Table

  1. New Tables
    - `leetcode_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `username` (text, LeetCode username)
      - `total_solved` (integer, total problems solved)
      - `easy_solved` (integer, easy problems solved)
      - `medium_solved` (integer, medium problems solved)
      - `hard_solved` (integer, hard problems solved)
      - `acceptance_rate` (double precision, overall acceptance rate)
      - `ranking` (integer, LeetCode ranking)
      - `submission_calendar` (jsonb, submission calendar data)
      - `last_fetched_at` (timestamptz, when data was last fetched)
      - `created_at` (timestamptz, record creation time)
      - `updated_at` (timestamptz, record update time)

  2. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for users to manage their own LeetCode stats

  3. Functions
    - Create sync function to update user_stats when LeetCode stats change
    - Add trigger to automatically sync data
*/

-- Create LeetCode stats table
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON leetcode_stats USING btree (user_id);

-- Enable Row Level Security
ALTER TABLE leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
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

-- Create or replace trigger function to sync LeetCode stats to user_stats
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

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_sync_leetcode ON leetcode_stats;
CREATE TRIGGER trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON leetcode_stats
  FOR EACH ROW EXECUTE FUNCTION sync_leetcode_to_user_stats();