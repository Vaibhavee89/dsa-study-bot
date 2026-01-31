"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { getTopicBySlug } from "@/data/topics";

export function TopicProgress() {
  const { getTopicProgressStats } = useProgress();

  const stats = useMemo(() => getTopicProgressStats(), [getTopicProgressStats]);

  if (stats.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Topic Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Start solving problems to see your progress by topic!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Topic Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.slice(0, 5).map((stat) => {
          const topic = getTopicBySlug(stat.topic);
          return (
            <div key={stat.topic}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-2">
                  <span>{topic?.icon || "📚"}</span>
                  {topic?.name || stat.topic}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.completed}/{stat.attempted}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
