// LeetCode Stats Fetcher Edge Function
// This function fetches statistics from LeetCode for a given username
// and stores them in the database.

import { createClient } from 'npm:@supabase/supabase-js@2.32.0';

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Handle OPTIONS requests for CORS
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// LeetCode GraphQL API endpoint
const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

// GraphQL query to fetch user profile data
const userProfileQuery = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
      userAvatar
      reputation
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
  }
}
`;

// GraphQL query to fetch user's submission calendar
const userCalendarQuery = `
query userProfileCalendar($username: String!) {
  matchedUser(username: $username) {
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
  }
}
`;

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get URL parameters
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Username is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract the token from the header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized request' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Fetch LeetCode user profile using GraphQL API
    const profileResponse = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({
        query: userProfileQuery,
        variables: { username }
      })
    });
    
    if (!profileResponse.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch LeetCode profile: ${profileResponse.statusText}` }),
        { 
          status: profileResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const profileData = await profileResponse.json();
    
    if (profileData.errors) {
      return new Response(
        JSON.stringify({ error: profileData.errors[0].message || 'Error fetching LeetCode profile' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (!profileData.data.matchedUser) {
      return new Response(
        JSON.stringify({ error: 'LeetCode user not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Fetch submission calendar data
    const calendarResponse = await fetch(LEETCODE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/${username}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({
        query: userCalendarQuery,
        variables: { username }
      })
    });
    
    let submissionCalendar = {};
    let streak = 0;
    
    if (calendarResponse.ok) {
      const calendarData = await calendarResponse.json();
      if (calendarData.data?.matchedUser?.userCalendar) {
        const userCalendar = calendarData.data.matchedUser.userCalendar;
        submissionCalendar = JSON.parse(userCalendar.submissionCalendar || '{}');
        streak = userCalendar.streak || 0;
      }
    }
    
    // Extract and format the data
    const matchedUser = profileData.data.matchedUser;
    const submitStats = matchedUser.submitStats.acSubmissionNum;
    
    // Get the counts by difficulty
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSolved = 0;
    
    submitStats.forEach((stat: any) => {
      if (stat.difficulty === "Easy") {
        easySolved = stat.count;
      } else if (stat.difficulty === "Medium") {
        mediumSolved = stat.count;
      } else if (stat.difficulty === "Hard") {
        hardSolved = stat.count;
      } else if (stat.difficulty === "All") {
        totalSolved = stat.count;
      }
    });
    
    // Calculate acceptance rate (dummy value for now - would need additional API call)
    const acceptanceRate = 70.0; // Placeholder
    
    // Get ranking
    const ranking = matchedUser.profile.ranking || 0;
    
    // Store the data in Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('leetcode_stats')
      .upsert({
        user_id: user.id,
        username: username,
        total_solved: totalSolved,
        easy_solved: easySolved,
        medium_solved: mediumSolved,
        hard_solved: hardSolved,
        acceptance_rate: acceptanceRate,
        ranking: ranking,
        submission_calendar: submissionCalendar,
        last_fetched_at: new Date().toISOString()
      })
      .select();

    if (insertError) {
      console.error('Error inserting LeetCode stats:', insertError);
      return new Response(
        JSON.stringify({ error: `Failed to save LeetCode stats: ${insertError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: insertData[0] }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in LeetCode stats edge function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});