// Follow Deno Docs for HTTP handling
// https://deno.land/manual@v1.35.0/runtime/http_server_apis

import { createClient } from 'npm:@supabase/supabase-js';

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  }

  return supabase;
}

// Handle OPTIONS request for CORS
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Fetch LeetCode profile data
async function fetchLeetCodeStats(username: string) {
  try {
    // Use the LeetCode Stats API
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch LeetCode stats: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.status === 'error') {
      throw new Error(data.message || 'Invalid LeetCode username');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw error;
  }
}

// Save LeetCode stats to database
async function saveLeetCodeStats(supabase: any, userId: string, username: string, data: any) {
  try {
    const { error } = await supabase
      .from('leetcode_stats')
      .upsert({
        user_id: userId,
        username,
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
        acceptanceRate: data.acceptanceRate,
        ranking: data.ranking,
        submissionCalendar: data.submissionCalendar || {},
        last_fetched_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error saving LeetCode stats:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client with auth context
    const supabase = await createSupabaseClient(req);

    // Get user information
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Parse request body
    const { username } = await req.json();
    
    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Fetch LeetCode stats
    const leetCodeData = await fetchLeetCodeStats(username);
    
    // Save stats to database
    await saveLeetCodeStats(supabase, user.id, username, leetCodeData);
    
    // Return processed data
    return new Response(JSON.stringify({
      success: true,
      data: leetCodeData
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in request:', error);
    
    // Return error response
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});