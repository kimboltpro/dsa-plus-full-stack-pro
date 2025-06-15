
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Award, User } from "lucide-react";

type CodeforcesStats = {
  rating: number;
  maxRating: number;
  rank: string;
  problemsSolved: number;
  contestsParticipated: number;
  avatar: string | null;
  profileUrl: string;
};

export function CodeforcesWidget({ stats, fetching }: { stats?: CodeforcesStats; fetching: boolean }) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4 space-y-0">
        <a href={stats?.profileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
          {stats?.avatar ? (
            <img
              src={stats.avatar}
              className="w-12 h-12 rounded-full border shadow-sm"
              alt="Codeforces avatar"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </a>
        <CardTitle>Codeforces</CardTitle>
      </CardHeader>
      <CardContent>
        {fetching ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : stats ? (
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <Trophy className="text-yellow-500 w-5 h-5" />
              <span className="font-bold text-xl text-blue-600">{stats.rating}</span>
              <Badge variant="secondary">{stats.rank}</Badge>
            </div>
            <div className="flex gap-4 items-center">
              <Target className="text-green-500 w-5 h-5" />
              <span className="font-semibold">{stats.problemsSolved}</span>
              <span className="text-gray-600 text-sm">problems solved</span>
            </div>
            <div className="flex gap-4 items-center">
              <Award className="text-purple-500 w-5 h-5" />
              <span className="font-semibold">{stats.contestsParticipated}</span>
              <span className="text-gray-600 text-sm">contests</span>
            </div>
            <div className="text-xs text-gray-500">
              Max Rating: <span className="font-semibold text-blue-700">{stats.maxRating}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Enter your Codeforces handle to see stats</div>
        )}
      </CardContent>
    </Card>
  );
}
