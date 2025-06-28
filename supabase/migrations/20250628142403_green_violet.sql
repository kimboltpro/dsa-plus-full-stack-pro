/*
  # Create get_solved_problems_by_topic Function

  1. New Functions
    - `get_solved_problems_by_topic(user_id_param uuid)`
      - Returns table with topic_id, topic_name, and count of solved problems
      - Joins topics, problems, and user_progress tables
      - Filters by user_id and solved status
      - Orders by count descending

  2. Security
    - Grant execute permission to authenticated users
*/

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
        COUNT(up.problem_id)::bigint AS count
    FROM
        public.topics t
    LEFT JOIN
        public.problems p ON t.id = p.topic_id
    LEFT JOIN
        public.user_progress up ON p.id = up.problem_id 
        AND up.user_id = user_id_param 
        AND up.status = 'solved'
    GROUP BY
        t.id, t.name
    ORDER BY
        count DESC, t.name ASC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO anon;