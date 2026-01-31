"use client";

import { Trophy, Target, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  correct: number;
  total: number;
  percentage: number;
  onRetry: () => void;
  onClose: () => void;
}

export function QuizResults({
  correct,
  total,
  percentage,
  onRetry,
  onClose,
}: QuizResultsProps) {
  const getMessage = () => {
    if (percentage >= 90) return { text: "Excellent!", emoji: "🎉" };
    if (percentage >= 70) return { text: "Great job!", emoji: "👏" };
    if (percentage >= 50) return { text: "Good effort!", emoji: "💪" };
    return { text: "Keep practicing!", emoji: "📚" };
  };

  const message = getMessage();

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <div className="text-6xl mb-2">{message.emoji}</div>
        <CardTitle className="text-2xl">{message.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${percentage * 3.52} 352`}
                className={cn(
                  percentage >= 70 ? "text-green-500" :
                  percentage >= 50 ? "text-yellow-500" : "text-red-500"
                )}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{percentage}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-muted rounded-lg">
            <Target className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <div className="text-2xl font-bold">{correct}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <Trophy className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onRetry}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
