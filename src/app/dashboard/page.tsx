"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  Flame, 
  Target, 
  Trophy, 
  TrendingUp,
  Calendar,
  BookOpen,
  Brain,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { problems, topics } from "@/data";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { progress, isLoading, getTopicProgressStats, getStreakCalendar } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const topicStats = getTopicProgressStats();
  const calendar = getStreakCalendar(30);
  const totalProblems = problems.length;
  const completionRate = progress?.totalProblemsAttempted 
    ? Math.round((progress.totalProblemsCompleted / progress.totalProblemsAttempted) * 100) 
    : 0;

  // Calculate difficulty breakdown
  const difficultyBreakdown = {
    easy: { total: problems.filter(p => p.difficulty === "easy").length, completed: 0 },
    medium: { total: problems.filter(p => p.difficulty === "medium").length, completed: 0 },
    hard: { total: problems.filter(p => p.difficulty === "hard").length, completed: 0 },
  };

  if (progress?.problems) {
    Object.values(progress.problems).forEach(p => {
      if (p.status === "completed") {
        const problem = problems.find(prob => prob.id === p.problemId);
        if (problem) {
          difficultyBreakdown[problem.difficulty].completed++;
        }
      }
    });
  }

  // Get recent activity
  const recentActivity = progress?.problems 
    ? Object.values(progress.problems)
        .filter(p => p.lastAttempted)
        .sort((a, b) => new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime())
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {session?.user?.name && (
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.dayStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.totalProblemsAttempted || 0}</p>
                <p className="text-xs text-muted-foreground">Attempted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Trophy className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress?.totalProblemsCompleted || 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Activity Calendar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                30-Day Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {calendar.map((day) => (
                  <div
                    key={day.date}
                    className={`w-4 h-4 rounded-sm transition-colors ${
                      day.count === 0 ? "bg-muted" :
                      day.count === 1 ? "bg-green-200 dark:bg-green-900" :
                      day.count === 2 ? "bg-green-400 dark:bg-green-700" :
                      "bg-green-600 dark:bg-green-500"
                    }`}
                    title={`${day.date}: ${day.count} completed`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
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

          {/* Difficulty Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Difficulty Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["easy", "medium", "hard"] as const).map((diff) => {
                const data = difficultyBreakdown[diff];
                const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                return (
                  <div key={diff}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium capitalize ${
                        diff === "easy" ? "text-green-600" :
                        diff === "medium" ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {diff}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {data.completed}/{data.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          diff === "easy" ? "bg-green-500" :
                          diff === "medium" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Topic Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topic Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topicStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Start solving problems to see topic progress!
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {topicStats.map((stat) => {
                    const topic = topics.find(t => t.slug === stat.topic);
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
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity yet. Start practicing!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const problem = problems.find(p => p.id === activity.problemId);
                    return (
                      <div key={activity.problemId} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {problem?.title || activity.problemId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.lastAttempted}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activity.status === "completed" 
                            ? "bg-green-500/10 text-green-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Problems Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {progress?.totalProblemsCompleted || 0} / {totalProblems}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ 
                      width: `${totalProblems > 0 
                        ? Math.round(((progress?.totalProblemsCompleted || 0) / totalProblems) * 100) 
                        : 0}%` 
                    }}
                  />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {totalProblems > 0 
                  ? Math.round(((progress?.totalProblemsCompleted || 0) / totalProblems) * 100) 
                  : 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
