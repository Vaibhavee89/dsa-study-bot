"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export function StreakCalendar({ days = 30 }: { days?: number }) {
  const { getStreakCalendar } = useProgress();

  const calendar = useMemo(() => getStreakCalendar(days), [days, getStreakCalendar]);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-green-200 dark:bg-green-900";
    if (count === 2) return "bg-green-400 dark:bg-green-700";
    if (count >= 3) return "bg-green-600 dark:bg-green-500";
    return "bg-muted";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {calendar.map((day) => (
            <div
              key={day.date}
              className={cn(
                "w-3 h-3 rounded-sm transition-colors",
                getIntensity(day.count)
              )}
              title={`${day.date}: ${day.count} problem${day.count !== 1 ? "s" : ""} completed`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-2 mt-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
