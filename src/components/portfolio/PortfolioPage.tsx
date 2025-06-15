import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LeetCodeWidget } from "./widgets/LeetCodeWidget";
import { fetchLeetCodeStats } from "./fetchers/leetcodeFetcher";
// Add future imports for CodeforcesWidget, CodeChefWidget, etc.

const platformDefs = [
  {
    id: "leetcode",
    label: "LeetCode",
    placeholder: "LeetCode username",
    iconUrl: "https://leetcode.com/favicon.ico",
  },
  // TODO: Add Codeforces, CodeChef, HackerRank, GitHub, etc.
];

// You can optionally store the list of user profiles in Supabase.
// For now we'll keep them in local state (expandable to persistent storage).
export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const [inputs, setInputs] = useState({
    leetcode: "",
    // Add more platforms here...
  });
  const [stats, setStats] = useState<{
    leetcode?: any;
    // ... future stats per platform
  }>({});
  const [fetching, setFetching] = useState<{ [key: string]: boolean }>({});
  const [validated, setValidated] = useState<{ [key: string]: boolean }>({});

  // Handle input change
  function handleInputChange(platform: string, value: string) {
    setInputs((prev) => ({ ...prev, [platform]: value }));
    setValidated((prev) => ({ ...prev, [platform]: false }));
  }

  // Validate and fetch stats for a platform
  async function handleFetchStats(platform: string) {
    if (!inputs[platform]) {
      toast.error("Please enter a username or profile URL");
      return;
    }
    setFetching((prev) => ({ ...prev, [platform]: true }));
    try {
      if (platform === "leetcode") {
        // Accept both username and profile link.
        let username = inputs.leetcode.trim();
        if (username.startsWith("https://leetcode.com/")) {
          username = username.replace("https://leetcode.com/", "").replaceAll("/", "");
        }
        const data = await fetchLeetCodeStats(username);
        setStats((prev) => ({ ...prev, leetcode: data }));
        setValidated((prev) => ({ ...prev, leetcode: true }));
        toast.success("LeetCode stats fetched!");
      }
      // else if: add other platforms
    } catch (err: any) {
      toast.error("Failed to fetch stats: " + (err?.message || "Unknown error"));
      setValidated((prev) => ({ ...prev, [platform]: false }));
    } finally {
      setFetching((prev) => ({ ...prev, [platform]: false }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Please sign in to access your portfolio and set up your competitive programming profiles.
            </p>
            <Button asChild>
              <a href="/auth">Go to Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-20">
      <div className="max-w-3xl mx-auto pt-12 px-4 sm:px-8">
        {/* Portfolio Card */}
        <Card className="mb-10 shadow-lg border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Personal CP Portfolio</CardTitle>
            <div className="mt-2 text-gray-600 text-sm">
              Aggregate and showcase your real-time stats across major competitive programming platforms.
            </div>
          </CardHeader>
          <CardContent>
            {platformDefs.map((p) => (
              <div key={p.id} className="my-4 flex items-center gap-4">
                <img src={p.iconUrl} className="w-6 h-6" alt={p.label} />
                <Input
                  placeholder={p.placeholder}
                  value={inputs[p.id as keyof typeof inputs]}
                  onChange={(e) => handleInputChange(p.id, e.target.value)}
                  className="w-1/2"
                  disabled={fetching[p.id]}
                />
                <Button
                  loading={fetching[p.id]}
                  onClick={() => handleFetchStats(p.id)}
                  disabled={!inputs[p.id]}
                >
                  {validated[p.id] ? "Refresh" : "Verify"}
                </Button>
                <div>
                  {validated[p.id] && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Verified</span>
                  )}
                </div>
              </div>
            ))}
            {/* Add more platforms as needed */}
          </CardContent>
        </Card>

        {/* Stats Display */}
        <div className="grid gap-6">
          {stats.leetcode && <LeetCodeWidget stats={stats.leetcode} />}
          {/* Add widgets for codeforces, codechef, etc. as more are implemented */}
        </div>
      </div>
    </div>
  );
}
