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

// Fetch Codolio profile data
async function fetchCodolioProfile(username: string) {
  try {
    // Use the public Codolio API endpoint
    const response = await fetch(`https://codolio.com/api/profile/${username}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Codolio profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Codolio data:', error);
    throw error;
  }
}

// Transform Codolio data into our format
function transformCodolioData(data: any) {
  // Process and transform the data from Codolio format
  // This implementation depends on the actual Codolio API structure
  // This is a simplified example
  
  return {
    totalSolved: data.totalSolved || 0,
    streak: data.streak || 0,
    topicCounts: data.topicBreakdown || {},
    ratingsTimeline: data.ratingsHistory || {},
    platformStats: data.platforms || {},
  };
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
    
    // Fetch Codolio profile data
    const codolioData = await fetchCodolioProfile(username);
    
    // Transform data to our format
    const transformedData = transformCodolioData(codolioData);
    
    // Return processed data
    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});