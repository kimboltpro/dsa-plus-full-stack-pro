// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { serve } from "npm:http";
import { createClient } from "npm:@supabase/supabase-js";

interface CodolioProfile {
  username: string;
  totalSolved: number;
  streak: number;
  topicCounts: Record<string, number>;
  ratingsTimeline: {
    date: string;
    rating: number;
  }[];
  platformStats: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 204,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      status: 405,
    });
  }

  try {
    // Get the request body
    const { username } = await req.json();

    if (!username) {
      return new Response(JSON.stringify({ error: "Username is required" }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 400,
      });
    }

    // Get the JWT token from the request headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 401,
      });
    }

    // Fetch Codolio profile data
    // In a real implementation, this would fetch from Codolio's API
    // For this demonstration, we'll simulate a response
    
    // Mock fetch from Codolio API
    const fetchCodolioProfile = async (username: string): Promise<CodolioProfile> => {
      // Simulate API call latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock data for demonstration purposes
      return {
        username,
        totalSolved: Math.floor(Math.random() * 300) + 50,
        streak: Math.floor(Math.random() * 30) + 1,
        topicCounts: {
          "Arrays": Math.floor(Math.random() * 50) + 20,
          "Strings": Math.floor(Math.random() * 40) + 15,
          "LinkedList": Math.floor(Math.random() * 30) + 10,
          "Trees": Math.floor(Math.random() * 25) + 5,
          "DP": Math.floor(Math.random() * 20) + 3,
          "Graphs": Math.floor(Math.random() * 15) + 2
        },
        ratingsTimeline: Array.from({ length: 10 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (9 - i) * 7);
          return {
            date: date.toISOString().split('T')[0],
            rating: 1200 + Math.floor(Math.random() * 30) * (i + 1)
          };
        }),
        platformStats: {
          leetcode: {
            solved: Math.floor(Math.random() * 200) + 50,
            ranking: Math.floor(Math.random() * 10000) + 1000,
          },
          codeforces: {
            rating: Math.floor(Math.random() * 500) + 1200,
            contests: Math.floor(Math.random() * 20) + 5,
          }
        }
      };
    };

    // Fetch profile data
    const profileData = await fetchCodolioProfile(username);
    
    // Store the data in the codolio_stats table
    const { data: statsData, error: statsError } = await supabase.rpc(
      "update_codolio_stats",
      {
        p_user_id: user.id,
        p_username: username,
        p_profile_url: `https://codolio.io/${username}`,
        p_total_solved: profileData.totalSolved,
        p_streak: profileData.streak,
        p_topic_counts: profileData.topicCounts,
        p_ratings_timeline: profileData.ratingsTimeline,
        p_platform_stats: profileData.platformStats
      }
    );

    if (statsError) {
      console.error("Error storing Codolio stats:", statsError);
      return new Response(JSON.stringify({ error: "Failed to store stats" }), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        status: 500,
      });
    }

    // Return the profile data
    return new Response(JSON.stringify({ 
      message: "Codolio stats fetched and stored successfully",
      data: profileData
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in fetch-codolio-stats function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      status: 500,
    });
  }
});