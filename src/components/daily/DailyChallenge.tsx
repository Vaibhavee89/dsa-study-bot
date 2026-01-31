"use client";

import { useMemo } from "react";
import { Calendar, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDailyProblem } from "@/data";
import { useProblemProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

const difficultyColors = {
  easy: "text-green-500 bg-green-500/10",
  medium: "text-yellow-500 bg-yellow-500/10",
  hard: "text-red-500 bg-red-500/10",
};

export function DailyChallenge({ onSelectProblem }: { onSelectProblem?: (problem: string) => void }) {
  const dailyProblem = useMemo(() => getDailyProblem(), []);
  const { isCompleted, isInProgress } = useProblemProgress(dailyProblem.id);

  const handleAskAbout = () => {
    if (onSelectProblem) {
      onSelectProblem(
        `I'd like help with today's daily challenge: ${dailyProblem.title} (LeetCode #${dailyProblem.leetcodeId}). Can you give me a hint on how to approach this problem?`
      );
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Daily Challenge
          {isCompleted && (
            <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
          )}
          {isInProgress && !isCompleted && (
            <Clock className="h-4 w-4 text-yellow-500 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{dailyProblem.title}</h3>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full capitalize",
                difficultyColors[dailyProblem.difficulty]
              )}
            >
              {dailyProblem.difficulty}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {dailyProblem.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {dailyProblem.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs bg-muted px-2 py-0.5 rounded"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleAskAbout}
          >
            Ask for Hints
          </Button>
          {dailyProblem.leetcodeUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={dailyProblem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
