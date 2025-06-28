/*
  # Add missing RPC function for topic progress

  1. New Functions
    - `get_solved_problems_by_topic` - Returns count of solved problems grouped by topic for a user
  
  2. Security
    - Function is accessible to authenticated users
    - Only returns data for the requesting user's problems
*/

-- Create function to get solved problems count by topic for a user
CREATE OR REPLACE FUNCTION public.get_solved_problems_by_topic(user_id_param uuid)
RETURNS TABLE(topic_id uuid, topic_name text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.topic_id,
        t.name AS topic_name,
        COUNT(up.problem_id) AS count
    FROM
        user_progress up
    JOIN
        problems p ON up.problem_id = p.id
    JOIN
        topics t ON p.topic_id = t.id
    WHERE
        up.user_id = user_id_param AND up.status = 'solved'
    GROUP BY
        p.topic_id, t.name
    ORDER BY
        count DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_solved_problems_by_topic(uuid) TO authenticated;