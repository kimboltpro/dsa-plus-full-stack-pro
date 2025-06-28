/*
  # Add Codolio Integration

  1. New Tables
    - `codolio_stats` - Stores user Codolio profile data with columns for all relevant stats
  
  2. Changes
    - Adds table with proper indexes and RLS policies
    - Creates functions to update user's Codolio data
  
  3. Security
    - Enables RLS on the new table
    - Adds policy for authenticated users to manage their own Codolio data
*/

-- Create table for storing Codolio profile stats
CREATE TABLE IF NOT EXISTS public.codolio_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  profile_url TEXT,
  total_solved INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  topic_counts JSONB DEFAULT '{}'::jsonb,
  ratings_timeline JSONB DEFAULT '{}'::jsonb,
  platform_stats JSONB DEFAULT '{}'::jsonb,
  last_fetched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, username)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_codolio_stats_user_id ON public.codolio_stats(user_id);

-- Enable RLS on the table
ALTER TABLE public.codolio_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the codolio_stats table
CREATE POLICY "Users can manage their own Codolio stats" 
ON public.codolio_stats 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own Codolio stats" 
ON public.codolio_stats 
FOR SELECT 
USING (auth.uid() = user_id);

-- Function to update Codolio stats
CREATE OR REPLACE FUNCTION public.update_codolio_stats(
  p_user_id UUID,
  p_username TEXT,
  p_profile_url TEXT,
  p_total_solved INTEGER,
  p_streak INTEGER,
  p_topic_counts JSONB,
  p_ratings_timeline JSONB,
  p_platform_stats JSONB
)
RETURNS SETOF public.codolio_stats
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update or insert Codolio stats
  RETURN QUERY
  INSERT INTO public.codolio_stats (
    user_id,
    username,
    profile_url,
    total_solved,
    streak,
    topic_counts,
    ratings_timeline,
    platform_stats,
    last_fetched_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_username,
    p_profile_url,
    p_total_solved,
    p_streak,
    p_topic_counts,
    p_ratings_timeline,
    p_platform_stats,
    now(),
    now()
  )
  ON CONFLICT (user_id, username) DO UPDATE SET
    profile_url = p_profile_url,
    total_solved = p_total_solved,
    streak = p_streak,
    topic_counts = p_topic_counts,
    ratings_timeline = p_ratings_timeline,
    platform_stats = p_platform_stats,
    last_fetched_at = now(),
    updated_at = now()
  RETURNING *;
END;
$$;

-- Enable realtime for the codolio_stats table
ALTER PUBLICATION supabase_realtime ADD TABLE public.codolio_stats;