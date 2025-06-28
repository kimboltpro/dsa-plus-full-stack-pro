/*
  # Create LeetCode Stats Table

  1. New Tables
    - `leetcode_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `username` (text, not null)
      - `total_solved` (integer, default 0)
      - `easy_solved` (integer, default 0) 
      - `medium_solved` (integer, default 0)
      - `hard_solved` (integer, default 0)
      - `acceptance_rate` (double precision, default 0)
      - `ranking` (integer, default 0)
      - `submission_calendar` (jsonb, default {})
      - `last_fetched_at` (timestamp with time zone, default now())
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `leetcode_stats` table
    - Add policies for users to manage their own LeetCode stats
    - Add indexes for performance

  3. Constraints
    - Unique constraint on (user_id, username)
    - Foreign key to users table
*/

CREATE TABLE IF NOT EXISTS public.leetcode_stats (
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
  last_fetched_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint on user_id and username combination
ALTER TABLE public.leetcode_stats 
ADD CONSTRAINT IF NOT EXISTS leetcode_stats_user_id_username_key 
UNIQUE (user_id, username);

-- Add foreign key constraint to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'leetcode_stats_user_id_fkey' 
    AND table_name = 'leetcode_stats'
  ) THEN
    ALTER TABLE public.leetcode_stats 
    ADD CONSTRAINT leetcode_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id 
ON public.leetcode_stats USING btree (user_id);

-- Enable Row Level Security
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY IF NOT EXISTS "Users can read their own LeetCode stats"
  ON public.leetcode_stats
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own LeetCode stats"
  ON public.leetcode_stats
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function for syncing LeetCode stats to user stats
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user_stats when leetcode_stats is updated
  INSERT INTO public.user_stats (user_id, total_problems_solved, updated_at)
  VALUES (NEW.user_id, NEW.total_solved, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_problems_solved = GREATEST(user_stats.total_problems_solved, NEW.total_solved),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER IF NOT EXISTS trigger_sync_leetcode
  AFTER INSERT OR UPDATE ON public.leetcode_stats
  FOR EACH ROW EXECUTE FUNCTION sync_leetcode_to_user_stats();