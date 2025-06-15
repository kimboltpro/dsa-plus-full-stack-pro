
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Users, BookOpen, User } from "lucide-react";

type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  dsaRepos: Array<{
    name: string;
    description: string;
    stars: number;
    url: string;
    language: string;
  }>;
  contributionsThisYear: number;
  avatar: string | null;
  profileUrl: string;
};

export function GithubWidget({ stats, fetching }: { stats?: GithubStats; fetching: boolean }) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0">
        <a href={stats?.profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
          {stats?.avatar ? (
            <img
              src={stats.avatar}
              className="w-12 h-12 rounded-full border shadow-sm"
              alt="GitHub avatar"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </a>
        <CardTitle>GitHub</CardTitle>
      </CardHeader>
      <CardContent>
        {fetching ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : stats ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>{stats.publicRepos} repos</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span>{stats.followers} followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{stats.totalStars} total stars</span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-purple-500" />
                <span>{stats.following} following</span>
              </div>
            </div>
            {stats.dsaRepos.length > 0 && (
              <div className="mt-4">
                <div className="font-semibold text-sm mb-2">DSA/Coding Repositories:</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {stats.dsaRepos.map((repo, i) => (
                    <div key={i} className="text-xs">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                        {repo.name}
                      </a>
                      {repo.language && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-gray-500">
                        <Star className="w-3 h-3" />
                        <span>{repo.stars}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Enter your GitHub username to see stats</div>
        )}
      </CardContent>
    </Card>
  );
}
