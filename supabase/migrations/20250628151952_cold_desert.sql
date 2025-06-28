/*
  # Fix missing database objects

  1. New Tables
    - `leetcode_stats` - Store LeetCode user statistics and progress
    - `codolio_stats` - Store Codolio platform integration data
  
  2. New Functions
    - `get_solved_problems_by_topic` - RPC function to get topic-wise problem solving stats
    - `moddatetime` - Trigger function to auto-update timestamps
  
  3. Security
    - Enable RLS on both new tables
    - Add policies for users to manage their own stats
    - Create proper indexes for performance
  
  4. Triggers
    - Auto-update timestamps on record changes
    - Sync LeetCode data to user stats when updated
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create moddatetime function if it doesn't exist
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create leetcode_stats table
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
    submission_calendar jsonb DEFAULT '{}',
    last_fetched_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT leetcode_stats_user_id_username_key UNIQUE (user_id, username)
);

-- Add foreign key constraint to leetcode_stats
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'leetcode_stats_user_id_fkey'
    ) THEN
        ALTER TABLE public.leetcode_stats 
        ADD CONSTRAINT leetcode_stats_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on leetcode_stats
ALTER TABLE public.leetcode_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for leetcode_stats
CREATE POLICY IF NOT EXISTS "Users can read their own LeetCode stats"
    ON public.leetcode_stats
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own LeetCode stats"
    ON public.leetcode_stats
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for leetcode_stats
CREATE INDEX IF NOT EXISTS idx_leetcode_stats_user_id ON public.leetcode_stats USING btree (user_id);

-- Create trigger for leetcode_stats updated_at
CREATE TRIGGER IF NOT EXISTS trigger_sync_leetcode
    AFTER INSERT OR UPDATE ON public.leetcode_stats
    FOR EACH ROW EXECUTE FUNCTION sync_leetcode_to_user_stats();

-- Create codolio_stats table
CREATE TABLE IF NOT EXISTS public.codolio_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    username text NOT NULL,
    profile_url text,
    total_solved integer DEFAULT 0,
    streak integer DEFAULT 0,
    topic_counts jsonb DEFAULT '{}',
    ratings_timeline jsonb DEFAULT '{}',
    platform_stats jsonb DEFAULT '{}',
    last_fetched_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT codolio_stats_user_id_username_key UNIQUE (user_id, username)
);

-- Add foreign key constraint to codolio_stats
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'codolio_stats_user_id_fkey'
    ) THEN
        ALTER TABLE public.codolio_stats 
        ADD CONSTRAINT codolio_stats_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS on codolio_stats
ALTER TABLE public.codolio_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for codolio_stats
CREATE POLICY IF NOT EXISTS "Users can read their own Codolio stats"
    ON public.codolio_stats
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own Codolio stats"
    ON public.codolio_stats
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for codolio_stats
CREATE INDEX IF NOT EXISTS idx_codolio_stats_user_id ON public.codolio_stats USING btree (user_id);

-- Create get_solved_problems_by_topic function
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE(topic_id uuid, topic_name text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id AS topic_id,
    t.name AS topic_name,
    COALESCE(COUNT(up.problem_id), 0)::bigint AS count
  FROM
    public.topics t
  LEFT JOIN
    public.problems p ON p.topic_id = t.id
  LEFT JOIN
    public.user_progress up ON up.problem_id = p.id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY
    t.id, t.name
  ORDER BY
    count DESC, t.name ASC;
END;
$$;

-- Create sync_leetcode_to_user_stats function if it doesn't exist
CREATE OR REPLACE FUNCTION sync_leetcode_to_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert user_stats when leetcode_stats changes
    INSERT INTO user_stats (user_id, total_problems_solved, updated_at)
    VALUES (NEW.user_id, COALESCE(NEW.total_solved, 0), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        total_problems_solved = GREATEST(user_stats.total_problems_solved, COALESCE(NEW.total_solved, 0)),
        updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update_user_streak function if it doesn't exist
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    user_stats_record RECORD;
    current_date_only DATE;
    yesterday_date DATE;
    streak_count INTEGER;
BEGIN
    -- Only proceed if status changed to 'solved'
    IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
        current_date_only := CURRENT_DATE;
        yesterday_date := current_date_only - INTERVAL '1 day';
        
        -- Get current user stats
        SELECT * INTO user_stats_record 
        FROM user_stats 
        WHERE user_id = NEW.user_id;
        
        -- If no user stats exist, create them
        IF user_stats_record IS NULL THEN
            INSERT INTO user_stats (
                user_id, 
                total_problems_solved, 
                current_streak, 
                longest_streak, 
                last_activity_date
            ) VALUES (
                NEW.user_id, 
                1, 
                1, 
                1, 
                current_date_only
            );
            RETURN NEW;
        END IF;
        
        -- Update total problems solved
        UPDATE user_stats 
        SET total_problems_solved = total_problems_solved + 1
        WHERE user_id = NEW.user_id;
        
        -- Calculate streak
        IF user_stats_record.last_activity_date = current_date_only THEN
            -- Same day, don't change streak
            streak_count := user_stats_record.current_streak;
        ELSIF user_stats_record.last_activity_date = yesterday_date THEN
            -- Consecutive day, increment streak
            streak_count := user_stats_record.current_streak + 1;
        ELSE
            -- Not consecutive, reset streak
            streak_count := 1;
        END IF;
        
        -- Update user stats
        UPDATE user_stats 
        SET 
            current_streak = streak_count,
            longest_streak = GREATEST(longest_streak, streak_count),
            last_activity_date = current_date_only,
            updated_at = now()
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;