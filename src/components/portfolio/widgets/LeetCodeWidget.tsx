
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Activity } from "lucide-react";

type LeetCodeStats = {
  problemsSolved: number;
  contestRating: number | null;
  streak: number | null;
  badges: { name: string }[];
  recentSubmissions: { title: string; time: string }[];
  avatar: string | null;
  profileUrl: string;
};

export function LeetCodeWidget({ stats }: { stats: LeetCodeStats }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-4 space-y-0">
        <a href={stats.profileUrl} target="_blank" rel="noopener noreferrer">
          {stats.avatar ? (
            <img
              src={stats.avatar}
              className="w-12 h-12 rounded-full border shadow-sm"
              alt="LeetCode avatar"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </a>
        <CardTitle>
          <span className="text-lg font-bold">LeetCode</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 items-center">
          <Award className="text-yellow-500 w-5 h-5" />
          <span className="font-bold text-xl">{stats.problemsSolved}</span>
          <span className="text-gray-600 text-sm">problems solved</span>
        </div>
        <div className="flex gap-4 items-center mt-1">
          <Activity className="text-blue-500 w-5 h-5" />
          <span className="font-semibold">
            Rating:{" "}
            {stats.contestRating ? (
              <span className="text-blue-700">{stats.contestRating}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {stats.badges.map((b, i) => (
            <Badge key={i} className="bg-yellow-100 text-yellow-800">
              {b.name}
            </Badge>
          ))}
        </div>
        <div className="mt-2">
          <div className="font-semibold text-xs mb-1">Recent Submissions:</div>
          <ul className="text-xs text-gray-700">
            {stats.recentSubmissions.map((sub, i) => (
              <li key={i}>
                <span className="font-medium">{sub.title}</span> &mdash;{" "}
                <span className="text-gray-500">{sub.time}</span>
              </li>
            ))}
            {!stats.recentSubmissions.length && (
              <li className="text-gray-400">No recent submissions.</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
