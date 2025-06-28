/*
  # Fix update_codolio_stats function

  1. Drop existing function if it exists
  2. Create new function with correct return type
  3. Grant permissions to authenticated users
*/

-- Drop the existing function first (if it exists)
DROP FUNCTION IF EXISTS public.update_codolio_stats(uuid, text, text, integer, integer, jsonb, jsonb, jsonb);

-- Create the update_codolio_stats function
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