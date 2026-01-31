export type ProblemStatus = "not_started" | "in_progress" | "completed" | "revisit";

export interface ProblemProgress {
  problemId: string;
  status: ProblemStatus;
  attempts: number;
  lastAttempted: string;
  notes?: string;
  hintsUsed: number[];
  completedAt?: string;
}

export interface UserProgress {
  dayStreak: number;
  lastActiveDate: string;
  totalProblemsAttempted: number;
  totalProblemsCompleted: number;
  problems: Record<string, ProblemProgress>;
  topicProgress: Record<string, { attempted: number; completed: number }>;
}

export interface DailyActivity {
  date: string;
  problemsAttempted: number;
  problemsCompleted: number;
}

const STORAGE_KEY = "dsa-study-bot-progress";
const ACTIVITY_KEY = "dsa-study-bot-activity";

const getDefaultProgress = (): UserProgress => ({
  dayStreak: 0,
  lastActiveDate: "",
  totalProblemsAttempted: 0,
  totalProblemsCompleted: 0,
  problems: {},
  topicProgress: {},
});

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getDefaultProgress();
    return JSON.parse(stored);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function getProblemProgress(problemId: string): ProblemProgress | null {
  const progress = getProgress();
  return progress.problems[problemId] || null;
}

export function updateProblemProgress(
  problemId: string,
  updates: Partial<ProblemProgress>,
  topics: string[] = []
): void {
  const progress = getProgress();
  const today = new Date().toISOString().split("T")[0];
  
  const existing = progress.problems[problemId];
  const isNewAttempt = !existing;
  const isNewCompletion = updates.status === "completed" && existing?.status !== "completed";
  
  const newProgress: ProblemProgress = {
    problemId,
    status: existing?.status || "in_progress",
    attempts: existing?.attempts || 0,
    lastAttempted: today,
    hintsUsed: existing?.hintsUsed || [],
    ...updates,
  };
  
  progress.problems[problemId] = newProgress;
  
  if (isNewAttempt) {
    progress.totalProblemsAttempted++;
  }
  
  if (isNewCompletion) {
    progress.totalProblemsCompleted++;
    progress.problems[problemId].completedAt = today;
  }
  
  // Update topic progress
  topics.forEach((topic) => {
    if (!progress.topicProgress[topic]) {
      progress.topicProgress[topic] = { attempted: 0, completed: 0 };
    }
    if (isNewAttempt) {
      progress.topicProgress[topic].attempted++;
    }
    if (isNewCompletion) {
      progress.topicProgress[topic].completed++;
    }
  });
  
  // Update streak
  updateStreak(progress, today);
  
  saveProgress(progress);
  updateDailyActivity(isNewAttempt, isNewCompletion);
}

export function markHintUsed(problemId: string, hintLevel: number): void {
  const progress = getProgress();
  const problemProgress = progress.problems[problemId];
  
  if (problemProgress && !problemProgress.hintsUsed.includes(hintLevel)) {
    problemProgress.hintsUsed.push(hintLevel);
    problemProgress.hintsUsed.sort();
    saveProgress(progress);
  }
}

export function updateStreak(progress: UserProgress, today: string): void {
  const lastActive = progress.lastActiveDate;
  
  if (!lastActive) {
    progress.dayStreak = 1;
  } else {
    const lastDate = new Date(lastActive);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 0) {
      // Same day, no change
    } else if (diffDays === 1) {
      progress.dayStreak++;
    } else {
      progress.dayStreak = 1;
    }
  }
  
  progress.lastActiveDate = today;
}

export function getDailyActivity(): DailyActivity[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(ACTIVITY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function updateDailyActivity(attempted: boolean, completed: boolean): void {
  if (typeof window === "undefined") return;
  
  const today = new Date().toISOString().split("T")[0];
  const activities = getDailyActivity();
  
  let todayActivity = activities.find((a) => a.date === today);
  
  if (!todayActivity) {
    todayActivity = { date: today, problemsAttempted: 0, problemsCompleted: 0 };
    activities.push(todayActivity);
  }
  
  if (attempted) todayActivity.problemsAttempted++;
  if (completed) todayActivity.problemsCompleted++;
  
  // Keep only last 365 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 365);
  const filtered = activities.filter((a) => new Date(a.date) >= cutoff);
  
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to save activity:", error);
  }
}

export function getStreakCalendar(days: number = 30): { date: string; count: number }[] {
  const activities = getDailyActivity();
  const activityMap = new Map(activities.map((a) => [a.date, a.problemsCompleted]));
  
  const result: { date: string; count: number }[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      count: activityMap.get(dateStr) || 0,
    });
  }
  
  return result;
}

export function getTopicProgressStats(): {
  topic: string;
  attempted: number;
  completed: number;
  percentage: number;
}[] {
  const progress = getProgress();
  
  return Object.entries(progress.topicProgress)
    .map(([topic, stats]) => ({
      topic,
      attempted: stats.attempted,
      completed: stats.completed,
      percentage: stats.attempted > 0 
        ? Math.round((stats.completed / stats.attempted) * 100) 
        : 0,
    }))
    .sort((a, b) => b.attempted - a.attempted);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
}
