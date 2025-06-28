/*
  # Create get_solved_problems_by_topic function

  1. New Functions
    - `get_solved_problems_by_topic(user_id uuid)`
      - Returns table with topic_id, topic_name, and count of solved problems
      - Counts problems marked as 'solved' in user_progress for the given user
      - Groups by topic and includes topic names

  2. Security
    - Function is accessible to authenticated users
    - Uses SECURITY DEFINER to access data with elevated privileges
    - Includes proper parameter validation

  3. Performance
    - Optimized query with proper joins
    - Returns data sorted by count (descending) for better UX
*/

-- Create function to get solved problems count by topic for a user
CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id uuid)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate input parameter
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'user_id parameter cannot be null';
  END IF;

  -- Return topic-wise solved problems count
  RETURN QUERY
  SELECT 
    t.id as topic_id,
    t.name as topic_name,
    COALESCE(COUNT(up.id), 0) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = get_solved_problems_by_topic.user_id 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY count DESC, t.name ASC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_solved_problems_by_topic(uuid) IS 
'Returns the count of solved problems grouped by topic for a specific user. Includes all topics even if the user has not solved any problems in that topic (count = 0).';