
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CodeforcesWidget({ stats, fetching }: { stats?: any; fetching: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Codeforces</CardTitle>
      </CardHeader>
      <CardContent>
        {fetching ? (
          <Skeleton className="h-16 w-full mb-2" />
        ) : stats ? (
          <div>Codeforces stats will appear here.</div>
        ) : (
          <div className="text-gray-400 text-sm">Widget coming soon</div>
        )}
      </CardContent>
    </Card>
  );
}
