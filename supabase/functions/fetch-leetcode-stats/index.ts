import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.4.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface LeetCodeQuery {
  query: string;
  variables: {
    username: string;
  };
}

interface LeetCodeResponse {
  data: {
    matchedUser: {
      username: string;
      submitStats: {
        acSubmissionNum: {
          difficulty: string;
          count: number;
          submissions: number;
        }[];
      };
      profile: {
        ranking: number;
        userAvatar: string;
        realName: string;
      };
      userCalendar: {
        submissionCalendar: string;
      };
    };
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    // Get username from the request
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    
    if (!username) {
      return new Response(JSON.stringify({ 
        error: "Username is required" 
      }), {
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Set up Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user JWT from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: "Authorization header required" 
      }), {
        status: 401,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Get user details from the token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        error: "Invalid token" 
      }), {
        status: 401,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Prepare LeetCode GraphQL query
    const leetCodeQuery: LeetCodeQuery = {
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
              userAvatar
              realName
            }
            userCalendar {
              submissionCalendar
            }
          }
        }
      `,
      variables: {
        username: username,
      }
    };
    
    // Send request to LeetCode GraphQL API
    const leetCodeResponse = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": `https://leetcode.com/${username}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      body: JSON.stringify(leetCodeQuery)
    });
    
    if (!leetCodeResponse.ok) {
      return new Response(JSON.stringify({ 
        error: `Failed to fetch LeetCode data: ${leetCodeResponse.statusText}` 
      }), {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    const leetCodeData: LeetCodeResponse = await leetCodeResponse.json();
    
    if (!leetCodeData.data?.matchedUser) {
      return new Response(JSON.stringify({ 
        error: `LeetCode user '${username}' not found` 
      }), {
        status: 404,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Extract the data we need
    const { matchedUser } = leetCodeData.data;
    const { submitStats, profile, userCalendar } = matchedUser;
    
    // Process submission numbers by difficulty
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSolved = 0;
    
    submitStats.acSubmissionNum.forEach(item => {
      if (item.difficulty === "Easy") easySolved = item.count;
      if (item.difficulty === "Medium") mediumSolved = item.count;
      if (item.difficulty === "Hard") hardSolved = item.count;
      if (item.difficulty === "All") totalSolved = item.count;
    });
    
    // Calculate acceptance rate (if available)
    let acceptanceRate = 0;
    const totalSubmissions = submitStats.acSubmissionNum.find(item => item.difficulty === "All")?.submissions || 0;
    if (totalSubmissions > 0 && totalSolved > 0) {
      acceptanceRate = (totalSolved / totalSubmissions) * 100;
    }
    
    // Process the submission calendar
    const submissionCalendar = userCalendar?.submissionCalendar 
      ? JSON.parse(userCalendar.submissionCalendar) 
      : {};
    
    // Prepare the data to save to our database
    const leetCodeStats = {
      user_id: user.id,
      username: username,
      total_solved: totalSolved,
      easy_solved: easySolved,
      medium_solved: mediumSolved,
      hard_solved: hardSolved,
      acceptance_rate: acceptanceRate,
      ranking: profile?.ranking || 0,
      submission_calendar: submissionCalendar,
      last_fetched_at: new Date().toISOString()
    };
    
    // Save or update the data in our database
    const { data: savedData, error: saveError } = await supabase
      .from('leetcode_stats')
      .upsert(leetCodeStats)
      .select()
      .single();
    
    if (saveError) {
      console.error("Database error:", saveError);
      return new Response(JSON.stringify({ 
        error: `Failed to save LeetCode data: ${saveError.message}` 
      }), {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
    
    // Return the saved data
    return new Response(JSON.stringify(savedData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error("Error in fetch-leetcode-stats function:", error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}` 
    }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
});