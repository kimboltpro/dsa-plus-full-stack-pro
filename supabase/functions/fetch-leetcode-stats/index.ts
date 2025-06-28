// Follow Deno Docs for HTTP handling
// https://deno.land/manual@v1.35.0/runtime/http_server_apis

import { createClient } from 'npm:@supabase/supabase-js@2';

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Create a Supabase client with the Auth context
async function createSupabaseClient(req: Request) {
  const authHeader = req.headers.get('Authorization');

  // Get environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  // Create client using auth header if present, otherwise use service role key
  const supabase = createClient(
    supabaseUrl,
    authHeader ? supabaseAnonKey : supabaseServiceKey,
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    }
  );

  if (authHeader) {
    // Get the user from the auth header
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data?.user) {
      throw new Error('Unauthorized: Invalid auth token');
    }

    return { supabase, user: data.user };
  }

  return { supabase, user: null };
}

// Handle OPTIONS request for CORS
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Fetch LeetCode user profile data
async function fetchLeetCodeProfile(username: string) {
  try {
    // GraphQL query for LeetCode
    const query = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStats {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            profile {
              ranking
            }
            userCalendar {
              submissionCalendar
            }
          }
        }
      `,
      variables: { username }
    };

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`LeetCode API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.matchedUser) {
      throw new Error(`LeetCode user "${username}" not found`);
    }

    return data.data.matchedUser;
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw error;
  }
}

// Process LeetCode data
function processLeetCodeData(data: any) {
  // Extract submission stats
  const submitStats = data.submitStats?.acSubmissionNum || [];
  
  let totalSolved = 0;
  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let totalSubmissions = 0;
  
  submitStats.forEach((stat: any) => {
    if (stat.difficulty === "All") {
      totalSolved = stat.count;
      totalSubmissions = stat.submissions;
    } else if (stat.difficulty === "Easy") {
      easySolved = stat.count;
    } else if (stat.difficulty === "Medium") {
      mediumSolved = stat.count;
    } else if (stat.difficulty === "Hard") {
      hardSolved = stat.count;
    }
  });
  
  // Calculate acceptance rate
  const acceptanceRate = totalSubmissions > 0 ? (totalSolved / totalSubmissions) * 100 : 0;
  
  // Get submission calendar
  const submissionCalendar = data.userCalendar?.submissionCalendar
    ? JSON.parse(data.userCalendar.submissionCalendar)
    : {};
  
  return {
    username: data.username,
    total_solved: totalSolved,
    easy_solved: easySolved,
    medium_solved: mediumSolved,
    hard_solved: hardSolved,
    acceptance_rate: acceptanceRate,
    ranking: data.profile?.ranking || 0,
    submission_calendar: submissionCalendar
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    // Get username from query params
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create Supabase client
    const { supabase, user } = await createSupabaseClient(req);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Fetch LeetCode profile
    const leetCodeData = await fetchLeetCodeProfile(username);
    
    // Process the data
    const processedData = processLeetCodeData(leetCodeData);
    
    // Save to database
    const { data: savedData, error } = await supabase
      .from("leetcode_stats")
      .upsert({
        user_id: user.id,
        username: username,
        total_solved: processedData.total_solved,
        easy_solved: processedData.easy_solved,
        medium_solved: processedData.medium_solved,
        hard_solved: processedData.hard_solved,
        acceptance_rate: processedData.acceptance_rate,
        ranking: processedData.ranking,
        submission_calendar: processedData.submission_calendar,
        last_fetched_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving LeetCode data:", error);
      throw new Error(`Error saving LeetCode data: ${error.message}`);
    }
    
    // Return the saved data
    return new Response(
      JSON.stringify(savedData),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});