// Follow Deno Docs for HTTP handling
// https://deno.land/manual@v1.35.0/runtime/http_server_apis

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

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  try {
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

    // Fetch data from LeetCode Stats API
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    console.log(`Fetching LeetCode stats from ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch LeetCode stats: ${response.statusText}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const leetcodeData = await response.json();
    
    if (leetcodeData.status === 'error') {
      return new Response(
        JSON.stringify({ error: leetcodeData.message || 'LeetCode API returned an error' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('LeetCode data received:', leetcodeData);
    
    // Process submission calendar to ensure it's JSON
    let submissionCalendar = {};
    if (leetcodeData.submissionCalendar) {
      if (typeof leetcodeData.submissionCalendar === 'string') {
        submissionCalendar = JSON.parse(leetcodeData.submissionCalendar);
      } else {
        submissionCalendar = leetcodeData.submissionCalendar;
      }
    }
    
    // Insert or update the LeetCode stats in the database
    const { data: insertData, error: insertError } = await supabase
      .from('leetcode_stats')
      .upsert({
        user_id: user.id,
        username: username,
        total_solved: leetcodeData.totalSolved || 0,
        easy_solved: leetcodeData.easySolved || 0,
        medium_solved: leetcodeData.mediumSolved || 0,
        hard_solved: leetcodeData.hardSolved || 0,
        acceptance_rate: leetcodeData.acceptanceRate || 0,
        ranking: leetcodeData.ranking || 0,
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
      JSON.stringify({ success: true, data: insertData }),
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