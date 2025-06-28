/*
  # Codolio Stats Table Creation with Policy Checks
  
  1. New Tables
    - `codolio_stats` table for storing user coding profiles from external platforms
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `username` (text, not null)
      - `profile_url` (text)
      - `total_solved` (integer)
      - `streak` (integer)
      - `topic_counts` (jsonb)
      - `ratings_timeline` (jsonb)
      - `platform_stats` (jsonb)
      - `last_fetched_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on table
    - Add policies for authenticated users to manage their own stats
    - Check if policies exist before creating them
  
  3. Functions
    - Create `update_codolio_stats` function for updating user profile stats
*/

-- Create codolio_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.codolio_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL,
    profile_url text,
    total_solved integer DEFAULT 0,
    streak integer DEFAULT 0,
    topic_counts jsonb DEFAULT '{}'::jsonb,
    ratings_timeline jsonb DEFAULT '{}'::jsonb,
    platform_stats jsonb DEFAULT '{}'::jsonb,
    last_fetched_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT codolio_stats_user_id_username_key UNIQUE (user_id, username)
);

-- Enable Row Level Security
ALTER TABLE public.codolio_stats ENABLE ROW LEVEL SECURITY;

-- Check if policies exist before creating them
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'codolio_stats' AND policyname = 'Users can manage their own Codolio stats'
    ) THEN
        CREATE POLICY "Users can manage their own Codolio stats" 
        ON public.codolio_stats 
        FOR ALL 
        TO public
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'codolio_stats' AND policyname = 'Users can read their own Codolio stats'
    ) THEN
        CREATE POLICY "Users can read their own Codolio stats" 
        ON public.codolio_stats 
        FOR SELECT 
        TO public
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_codolio_stats_user_id ON public.codolio_stats(user_id);

-- Create or replace function to update Codolio stats
CREATE OR REPLACE FUNCTION public.update_codolio_stats(
    p_user_id uuid,
    p_username text,
    p_profile_url text,
    p_total_solved integer,
    p_streak integer,
    p_topic_counts jsonb,
    p_ratings_timeline jsonb,
    p_platform_stats jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_username,
        p_profile_url,
        p_total_solved,
        p_streak,
        p_topic_counts,
        p_ratings_timeline,
        p_platform_stats,
        now(),
        now(),
        now()
    )
    ON CONFLICT (user_id, username) DO UPDATE SET
        profile_url = EXCLUDED.profile_url,
        total_solved = EXCLUDED.total_solved,
        streak = EXCLUDED.streak,
        topic_counts = EXCLUDED.topic_counts,
        ratings_timeline = EXCLUDED.ratings_timeline,
        platform_stats = EXCLUDED.platform_stats,
        last_fetched_at = now(),
        updated_at = now();
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.update_codolio_stats(uuid, text, text, integer, integer, jsonb, jsonb, jsonb) TO authenticated;

-- Enable realtime for the codolio_stats table
ALTER PUBLICATION supabase_realtime ADD TABLE public.codolio_stats;