-- Create RPC functions for dashboard analytics

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

-- Function to get calendar activity data
CREATE OR REPLACE FUNCTION public.get_calendar_activity(
  user_id UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  activity_date DATE,
  problem_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    DATE(solved_at) as activity_date, 
    COUNT(id) as problem_count
  FROM 
    user_progress
  WHERE 
    user_id = get_calendar_activity.user_id AND
    status = 'solved' AND
    solved_at IS NOT NULL AND
    DATE(solved_at) >= start_date AND
    DATE(solved_at) <= end_date
  GROUP BY 
    DATE(solved_at)
  ORDER BY 
    activity_date;
$$;

-- Function to get user's solved problem count by day for last 30 days
CREATE OR REPLACE FUNCTION public.get_activity_last_30_days(
  user_id UUID
)
RETURNS TABLE (
  activity_date DATE,
  problem_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '29 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    )::DATE as day
  )
  SELECT 
    ds.day as activity_date,
    COALESCE(COUNT(up.id), 0) as problem_count
  FROM 
    date_series ds
  LEFT JOIN 
    user_progress up ON DATE(up.solved_at) = ds.day AND 
                        up.user_id = get_activity_last_30_days.user_id AND
                        up.status = 'solved'
  GROUP BY 
    ds.day
  ORDER BY 
    ds.day;
$$;

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  problems_solved BIGINT,
  current_streak INTEGER,
  score BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    us.total_problems_solved as problems_solved,
    us.current_streak,
    -- Calculate score: 10 points per problem + 5 points per streak day
    (us.total_problems_solved * 10) + (us.current_streak * 5) as score
  FROM 
    profiles p
  JOIN 
    user_stats us ON p.id = us.user_id
  ORDER BY 
    score DESC, problems_solved DESC, current_streak DESC
  LIMIT 
    limit_count;
$$;

-- Function to get friend activity
CREATE OR REPLACE FUNCTION public.get_friend_activity(
  user_id UUID,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  friend_id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  activity_type TEXT,
  activity_description TEXT,
  activity_time TIMESTAMP WITH TIME ZONE,
  current_streak INTEGER
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  -- This is a placeholder function
  -- In a real app, you would have a friends table and join with it
  -- For now, we'll return activity from any user

  SELECT 
    p.id as friend_id,
    p.username,
    p.full_name,
    p.avatar_url,
    'problem_solved' as activity_type,
    'Solved a problem' as activity_description,
    up.solved_at as activity_time,
    us.current_streak
  FROM 
    user_progress up
  JOIN 
    profiles p ON up.user_id = p.id
  JOIN 
    user_stats us ON p.id = us.user_id
  WHERE 
    up.user_id <> get_friend_activity.user_id AND
    up.status = 'solved'
  ORDER BY 
    up.solved_at DESC
  LIMIT 
    limit_count;
$$;