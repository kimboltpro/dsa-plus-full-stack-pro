-- Create function to get solved problems by difficulty
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_difficulty(
  user_id UUID
)
RETURNS TABLE (
  difficulty TEXT,
  count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.difficulty::TEXT, 
    COUNT(up.id)::BIGINT as count
  FROM 
    user_progress up
  JOIN 
    problems p ON up.problem_id = p.id
  WHERE 
    up.user_id = get_solved_problems_by_difficulty.user_id AND
    up.status = 'solved'
  GROUP BY 
    p.difficulty
  ORDER BY 
    p.difficulty;
END;
$$;

-- Function to get solved problems by topic
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(
  user_id_param UUID
)
RETURNS TABLE (
  topic_id UUID,
  topic_name TEXT,
  count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id AS topic_id,
    t.name AS topic_name,
    COUNT(up.problem_id)::BIGINT AS count
  FROM
    topics t
  LEFT JOIN
    problems p ON t.id = p.topic_id
  LEFT JOIN
    user_progress up ON p.id = up.problem_id AND 
                        up.user_id = user_id_param AND 
                        up.status = 'solved'
  GROUP BY
    t.id, t.name
  ORDER BY
    count DESC, t.name ASC;
END;
$$;

-- Function to update user streak when logging in
CREATE OR REPLACE FUNCTION update_user_login_streak()
RETURNS TRIGGER AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := today_date - INTERVAL '1 day';
  last_login_date DATE;
  streak_count INT;
BEGIN
  -- Get user's last activity date
  SELECT last_activity_date, current_streak INTO last_login_date, streak_count
  FROM user_stats
  WHERE user_id = NEW.user_id;
  
  IF last_login_date IS NULL THEN
    -- First login
    streak_count := 1;
  ELSIF last_login_date = today_date THEN
    -- Already logged in today, no change
    RETURN NEW;
  ELSIF last_login_date = yesterday_date THEN
    -- Consecutive day login
    streak_count := streak_count + 1;
  ELSE
    -- Streak broken
    streak_count := 1;
  END IF;
  
  -- Update user stats
  UPDATE user_stats
  SET 
    last_activity_date = today_date,
    current_streak = streak_count,
    longest_streak = GREATEST(COALESCE(longest_streak, 0), streak_count),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_difficulty(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(UUID) TO authenticated;