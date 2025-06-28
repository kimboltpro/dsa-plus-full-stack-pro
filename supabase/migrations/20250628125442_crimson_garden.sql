-- Function to get solved problems by difficulty
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_difficulty(
  user_id UUID
)
RETURNS TABLE (
  difficulty TEXT,
  count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.difficulty::TEXT, 
    COUNT(up.id) as count
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
$$;

-- Function to get solved problems by topic
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(
  user_id UUID
)
RETURNS TABLE (
  topic_id UUID,
  topic_name TEXT,
  count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.topic_id, 
    t.name as topic_name,
    COUNT(up.id) as count
  FROM 
    user_progress up
  JOIN 
    problems p ON up.problem_id = p.id
  JOIN
    topics t ON p.topic_id = t.id
  WHERE 
    up.user_id = get_solved_problems_by_topic.user_id AND
    up.status = 'solved' AND
    p.topic_id IS NOT NULL
  GROUP BY 
    p.topic_id, t.name
  ORDER BY 
    count DESC;
$$;

-- Function to get next recommended problems based on user's weakest topics
CREATE OR REPLACE FUNCTION public.get_recommended_problems(
  user_id UUID,
  limit_count INTEGER DEFAULT 3
)
RETURNS SETOF problems
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  weak_topics UUID[];
  solved_problems UUID[];
  attempted_problems UUID[];
BEGIN
  -- Get user's solved problems
  SELECT array_agg(problem_id) INTO solved_problems
  FROM user_progress
  WHERE user_id = get_recommended_problems.user_id AND status = 'solved';
  
  -- Get user's attempted problems
  SELECT array_agg(problem_id) INTO attempted_problems
  FROM user_progress
  WHERE user_id = get_recommended_problems.user_id AND status = 'attempted';
  
  -- Get user's weakest topics (those with lowest solve ratio)
  WITH topic_counts AS (
    SELECT 
      p.topic_id,
      COUNT(DISTINCT p.id) AS total_problems,
      COUNT(DISTINCT up.problem_id) FILTER (WHERE up.status = 'solved' AND up.user_id = get_recommended_problems.user_id) AS solved_problems
    FROM 
      problems p
    LEFT JOIN 
      user_progress up ON p.id = up.problem_id AND up.user_id = get_recommended_problems.user_id
    WHERE 
      p.topic_id IS NOT NULL
    GROUP BY 
      p.topic_id
    HAVING
      COUNT(DISTINCT p.id) > 0
  )
  SELECT 
    array_agg(topic_id) INTO weak_topics
  FROM (
    SELECT 
      topic_id,
      COALESCE(solved_problems, 0) / total_problems::float AS solve_ratio
    FROM 
      topic_counts
    ORDER BY 
      solve_ratio ASC, total_problems DESC
    LIMIT 3
  ) weak;
  
  -- If no weak topics found, get any topics
  IF weak_topics IS NULL OR array_length(weak_topics, 1) = 0 THEN
    SELECT array_agg(id) INTO weak_topics
    FROM topics
    LIMIT 3;
  END IF;
  
  -- Return recommended problems
  RETURN QUERY
  SELECT p.*
  FROM problems p
  WHERE 
    p.topic_id = ANY(weak_topics) AND
    (solved_problems IS NULL OR p.id <> ALL(solved_problems)) AND
    (attempted_problems IS NULL OR p.id <> ALL(attempted_problems))
  ORDER BY 
    CASE
      WHEN p.difficulty = 'Easy' THEN 1
      WHEN p.difficulty = 'Medium' THEN 2
      WHEN p.difficulty = 'Hard' THEN 3
    END,
    p.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to update user streak when problem is solved
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  last_activity DATE;
  streak_to_update INTEGER;
BEGIN
  -- Only proceed if this is a solved status
  IF NEW.status <> 'solved' THEN
    RETURN NEW;
  END IF;

  -- Get user's current stats
  SELECT last_activity_date, current_streak INTO last_activity, streak_to_update
  FROM user_stats
  WHERE user_id = NEW.user_id;
  
  -- Update streak logic
  IF last_activity IS NULL THEN
    -- First ever activity
    streak_to_update := 1;
  ELSIF last_activity = current_date - INTERVAL '1 day' THEN
    -- Consecutive day, increase streak
    streak_to_update := streak_to_update + 1;
  ELSIF last_activity < current_date - INTERVAL '1 day' THEN
    -- Streak broken, reset to 1
    streak_to_update := 1;
  ELSIF last_activity = current_date THEN
    -- Already solved today, no streak change
    NULL;
  END IF;

  -- Update user stats
  UPDATE user_stats
  SET 
    last_activity_date = current_date,
    current_streak = streak_to_update,
    longest_streak = GREATEST(longest_streak, streak_to_update),
    total_problems_solved = total_problems_solved + 1,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace trigger for updating user streak
DROP TRIGGER IF EXISTS trigger_update_user_streak ON user_progress;
CREATE TRIGGER trigger_update_user_streak
AFTER INSERT OR UPDATE OF status
ON user_progress
FOR EACH ROW
WHEN (NEW.status = 'solved')
EXECUTE FUNCTION public.update_user_streak();

-- Enhanced auth user creation function to initialize stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_stats (
    user_id,
    total_problems_solved,
    current_streak,
    longest_streak,
    daily_goal,
    last_activity_date
  )
  VALUES (
    NEW.id,
    0,
    0,
    0,
    3,
    NULL
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;