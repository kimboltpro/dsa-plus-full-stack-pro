import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.32.0';

interface LeetCodeResponse {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: string; // JSON string
}

interface LeetCodeStats {
  username: string;
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  acceptance_rate: number;
  ranking: number;
  submission_calendar: Record<string, number>;
}

serve(async (req) => {
  // CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Extract username from request
  const url = new URL(req.url);
  const username = url.searchParams.get('username');
  
  if (!username) {
    return new Response(
      JSON.stringify({ error: 'Username is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized request' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    // Fetch data from LeetCode API
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch LeetCode stats: ${response.statusText}` }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    const leetcodeData = await response.json() as LeetCodeResponse;
    
    // Transform submission calendar from string to JSON if needed
    let submissionCalendar: Record<string, number>;
    if (typeof leetcodeData.submissionCalendar === 'string') {
      submissionCalendar = JSON.parse(leetcodeData.submissionCalendar);
    } else {
      submissionCalendar = leetcodeData.submissionCalendar as unknown as Record<string, number>;
    }
    
    // Format the data to match our database schema
    const leetcodeStats: LeetCodeStats = {
      username: username,
      total_solved: leetcodeData.totalSolved,
      easy_solved: leetcodeData.easySolved,
      medium_solved: leetcodeData.mediumSolved,
      hard_solved: leetcodeData.hardSolved,
      acceptance_rate: leetcodeData.acceptanceRate,
      ranking: leetcodeData.ranking,
      submission_calendar: submissionCalendar,
    };
    
    // Store the stats in the database
    const { data: insertData, error: insertError } = await supabase
      .from('leetcode_stats')
      .upsert({
        user_id: user.id,
        username: leetcodeStats.username,
        total_solved: leetcodeStats.total_solved,
        easy_solved: leetcodeStats.easy_solved,
        medium_solved: leetcodeStats.medium_solved,
        hard_solved: leetcodeStats.hard_solved,
        acceptance_rate: leetcodeStats.acceptance_rate,
        ranking: leetcodeStats.ranking,
        submission_calendar: leetcodeStats.submission_calendar,
        last_fetched_at: new Date().toISOString()
      }, { onConflict: 'user_id,username' })
      .select('*')
      .single();
    
    if (insertError) {
      return new Response(
        JSON.stringify({ error: `Failed to store LeetCode stats: ${insertError.message}` }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data: leetcodeStats }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
    
  } catch (error) {
    console.error('Error in LeetCode stats edge function:', error);
    
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});