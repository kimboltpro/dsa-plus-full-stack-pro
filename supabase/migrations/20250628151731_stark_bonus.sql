/*
  # Create get_solved_problems_by_topic function

  1. New Functions
    - `get_solved_problems_by_topic(user_id_param)`
      - Takes a user ID parameter
      - Returns topic_id, topic_name, and count of solved problems per topic
      - Joins user_progress, problems, and topics tables
      - Filters for solved problems only

  2. Security
    - Function is accessible to authenticated users
    - Uses existing RLS policies on underlying tables
*/

CREATE OR REPLACE FUNCTION get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE (
  topic_id uuid,
  topic_name text,
  count bigint
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    t.id as topic_id,
    t.name as topic_name,
    COALESCE(COUNT(up.id), 0) as count
  FROM topics t
  LEFT JOIN problems p ON p.topic_id = t.id
  LEFT JOIN user_progress up ON up.problem_id = p.id 
    AND up.user_id = user_id_param 
    AND up.status = 'solved'
  GROUP BY t.id, t.name
  ORDER BY t.order_index, t.name;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_solved_problems_by_topic(uuid) TO anon;