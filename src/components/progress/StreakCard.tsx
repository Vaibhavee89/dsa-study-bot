"use client";

import { Flame, Trophy, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";

export function StreakCard() {
  const { progress, isLoading } = useProgress();

  if (isLoading || !progress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{progress.dayStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{progress.totalProblemsAttempted}</div>
            <div className="text-xs text-muted-foreground">Attempted</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">{progress.totalProblemsCompleted}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
