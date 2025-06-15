
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LeetCodeWidget } from "./widgets/LeetCodeWidget";
// Scaffolded widgets for future use:
import { CodeforcesWidget } from "./widgets/CodeforcesWidget";
import { CodeChefWidget } from "./widgets/CodeChefWidget";
import { HackerRankWidget } from "./widgets/HackerRankWidget";
import { GithubWidget } from "./widgets/GithubWidget";
import { fetchLeetCodeStats } from "./fetchers/leetcodeFetcher";

const platformDefs = [
  {
    id: "leetcode",
    label: "LeetCode",
    placeholder: "LeetCode username or profile link",
    iconUrl: "https://leetcode.com/favicon.ico",
  },
  {
    id: "codeforces",
    label: "Codeforces",
    placeholder: "CF handle or link",
    iconUrl: "https://codeforces.com/favicon.ico",
  },
  {
    id: "codechef",
    label: "CodeChef",
    placeholder: "CodeChef handle or link",
    iconUrl: "https://www.codechef.com/favicon.ico",
  },
  {
    id: "hackerrank",
    label: "HackerRank",
    placeholder: "HackerRank handle or link",
    iconUrl: "https://hrcdn.net/community-frontend/assets/favicon-ddc852f75a.png",
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "GitHub username or link",
    iconUrl: "https://github.githubassets.com/favicons/favicon.svg",
  },
];

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const [inputs, setInputs] = useState({
    leetcode: "",
    codeforces: "",
    codechef: "",
    hackerrank: "",
    github: "",
  });
  const [stats, setStats] = useState<{
    leetcode?: any;
    codeforces?: any;
    codechef?: any;
    hackerrank?: any;
    github?: any;
  }>({});
  const [fetching, setFetching] = useState<{ [key: string]: boolean }>({});
  const [validated, setValidated] = useState<{ [key: string]: boolean }>({});

  // Handle input change
  function handleInputChange(platform: string, value: string) {
    setInputs((prev) => ({ ...prev, [platform]: value }));
    setValidated((prev) => ({ ...prev, [platform]: false }));
  }

  // Helper: Extract username from profile link or pass as is for username
  function extractUsername(platform: string, rawInput: string) {
    let trimmed = rawInput.trim();
    if (platform === "leetcode" && trimmed.startsWith("https://leetcode.com/")) {
      trimmed = trimmed
        .replace("https://leetcode.com/", "")
        .replace(/\/+/g, ""); // removes trailing slashes
    }
    if (platform === "codeforces" && trimmed.startsWith("https://codeforces.com/profile/")) {
      trimmed = trimmed.replace("https://codeforces.com/profile/", "").replace(/\/+/g, "");
    }
    if (platform === "codechef" && trimmed.startsWith("https://www.codechef.com/users/")) {
      trimmed = trimmed.replace("https://www.codechef.com/users/", "").replace(/\/+/g, "");
    }
    if (platform === "hackerrank" && trimmed.startsWith("https://www.hackerrank.com/")) {
      trimmed = trimmed.replace("https://www.hackerrank.com/", "").replace(/\/+/g, "");
    }
    if (platform === "github" && trimmed.startsWith("https://github.com/")) {
      trimmed = trimmed.replace("https://github.com/", "").replace(/\/+/g, "");
    }
    return trimmed;
  }

  // Validate and fetch stats for platforms
  async function handleFetchStats(platform: string) {
    if (!inputs[platform]) {
      toast.error("Please enter a username or profile URL");
      return;
    }
    setFetching((prev) => ({ ...prev, [platform]: true }));
    try {
      if (platform === "leetcode") {
        let username = extractUsername("leetcode", inputs.leetcode);
        const data = await fetchLeetCodeStats(username);
        setStats((prev) => ({ ...prev, leetcode: data }));
        setValidated((prev) => ({ ...prev, leetcode: true }));
        toast.success("LeetCode stats fetched!");
      }
      // Scaffold for other platforms:
      else {
        toast.info("This platform will be implemented soon!");
        setValidated((prev) => ({ ...prev, [platform]: false }));
      }
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
              <div key={p.id} className="my-4 flex flex-col sm:flex-row items-center gap-4">
                <img src={p.iconUrl} className="w-6 h-6" alt={p.label} />
                <Input
                  placeholder={p.placeholder}
                  value={inputs[p.id as keyof typeof inputs]}
                  onChange={(e) => handleInputChange(p.id, e.target.value)}
                  className="w-full sm:w-1/2"
                  disabled={fetching[p.id]}
                  autoCorrect="off"
                />
                <Button
                  onClick={() => handleFetchStats(p.id)}
                  disabled={!inputs[p.id] || fetching[p.id]}
                  // No loading prop here, handled by native disabled + spinner
                >
                  {fetching[p.id] ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 rounded-full border-b-2 border-blue-400 border-t-transparent" />
                      Loading...
                    </span>
                  ) : validated[p.id] ? "Refresh" : "Verify"}
                </Button>
                <div>
                  {validated[p.id] && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Display */}
        <div className="grid gap-6">
          {stats.leetcode && <LeetCodeWidget stats={stats.leetcode} />}
          {/* Scaffolds for additional platforms, showing placeholder widgets */}
          {inputs.codeforces && (
            <CodeforcesWidget stats={stats.codeforces} fetching={fetching.codeforces} />
          )}
          {inputs.codechef && (
            <CodeChefWidget stats={stats.codechef} fetching={fetching.codechef} />
          )}
          {inputs.hackerrank && (
            <HackerRankWidget stats={stats.hackerrank} fetching={fetching.hackerrank} />
          )}
          {inputs.github && (
            <GithubWidget stats={stats.github} fetching={fetching.github} />
          )}
        </div>

        {/* Global Performance Heatmap Placeholder */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Performance Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-gray-400">
                (Coming soon: Visualize all problem, submission, and contest activity here)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badge / Achievement System Placeholder */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements & Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-gray-400">
                (Coming soon: Earn and view trophies, badges, and milestones)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Timeline Placeholder */}
        <div className="mt-12 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-gray-400">
                (Coming soon: See your full contest history and key milestones)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
