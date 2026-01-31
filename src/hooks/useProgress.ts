"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  UserProgress,
  ProblemProgress,
  ProblemStatus,
  getProgress,
  saveProgress,
  getProblemProgress,
  updateProblemProgress,
  markHintUsed,
  getStreakCalendar,
  getTopicProgressStats,
  resetProgress,
} from "@/lib/progress";

async function fetchServerProgress(): Promise<UserProgress | null> {
  try {
    const response = await fetch("/api/progress");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function syncToServer(progress: UserProgress): Promise<boolean> {
  try {
    const response = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(progress),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function mergeProgress(local: UserProgress, server: UserProgress): UserProgress {
  // Take the higher values for stats
  const merged: UserProgress = {
    dayStreak: Math.max(local.dayStreak, server.dayStreak),
    lastActiveDate: local.lastActiveDate > server.lastActiveDate ? local.lastActiveDate : server.lastActiveDate,
    totalProblemsAttempted: Math.max(local.totalProblemsAttempted, server.totalProblemsAttempted),
    totalProblemsCompleted: Math.max(local.totalProblemsCompleted, server.totalProblemsCompleted),
    problems: { ...server.problems },
    topicProgress: { ...server.topicProgress },
  };

  // Merge problem progress - keep the one with more attempts or completed status
  for (const [problemId, localProblem] of Object.entries(local.problems)) {
    const serverProblem = merged.problems[problemId];
    if (!serverProblem) {
      merged.problems[problemId] = localProblem;
    } else {
      // Prefer completed status, then more attempts
      if (localProblem.status === "completed" || 
          (serverProblem.status !== "completed" && localProblem.attempts > serverProblem.attempts)) {
        merged.problems[problemId] = localProblem;
      }
    }
  }

  // Merge topic progress - take higher values
  for (const [topic, localTopic] of Object.entries(local.topicProgress)) {
    const serverTopic = merged.topicProgress[topic];
    if (!serverTopic) {
      merged.topicProgress[topic] = localTopic;
    } else {
      merged.topicProgress[topic] = {
        attempted: Math.max(localTopic.attempted, serverTopic.attempted),
        completed: Math.max(localTopic.completed, serverTopic.completed),
      };
    }
  }

  return merged;
}

export function useProgress() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshProgress = useCallback(async () => {
    const localProgress = getProgress();
    setProgress(localProgress);

    // If logged in, fetch from server and merge
    if (status === "authenticated" && session?.user) {
      const serverProgress = await fetchServerProgress();
      if (serverProgress) {
        // Merge: use whichever has more progress
        const merged = mergeProgress(localProgress, serverProgress);
        setProgress(merged);
        saveProgress(merged);
      }
    }
  }, [session, status]);

  useEffect(() => {
    refreshProgress().then(() => setIsLoading(false));
  }, [refreshProgress]);

  // Debounced sync to server
  const debouncedSync = useCallback((progressData: UserProgress) => {
    if (status !== "authenticated") return;
    
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(async () => {
      setIsSyncing(true);
      await syncToServer(progressData);
      setIsSyncing(false);
    }, 2000); // Sync after 2 seconds of inactivity
  }, [status]);

  const updateProblem = useCallback(
    (problemId: string, updates: Partial<ProblemProgress>, topics: string[] = []) => {
      updateProblemProgress(problemId, updates, topics);
      const updatedProgress = getProgress();
      setProgress(updatedProgress);
      debouncedSync(updatedProgress);
    },
    [debouncedSync]
  );

  const markCompleted = useCallback(
    (problemId: string, topics: string[] = []) => {
      updateProblem(problemId, { status: "completed" }, topics);
    },
    [updateProblem]
  );

  const markInProgress = useCallback(
    (problemId: string, topics: string[] = []) => {
      updateProblem(problemId, { status: "in_progress" }, topics);
    },
    [updateProblem]
  );

  const incrementAttempts = useCallback(
    (problemId: string, topics: string[] = []) => {
      const current = getProblemProgress(problemId);
      updateProblem(
        problemId,
        { attempts: (current?.attempts || 0) + 1 },
        topics
      );
    },
    [updateProblem]
  );

  const useHint = useCallback(
    (problemId: string, hintLevel: number) => {
      markHintUsed(problemId, hintLevel);
      const updatedProgress = getProgress();
      setProgress(updatedProgress);
      debouncedSync(updatedProgress);
    },
    [debouncedSync]
  );

  const reset = useCallback(() => {
    resetProgress();
    const updatedProgress = getProgress();
    setProgress(updatedProgress);
    // Also sync reset to server
    if (status === "authenticated") {
      syncToServer(updatedProgress);
    }
  }, [status]);

  return {
    progress,
    isLoading,
    isSyncing,
    refreshProgress,
    updateProblem,
    markCompleted,
    markInProgress,
    incrementAttempts,
    useHint,
    reset,
    getProblemProgress,
    getStreakCalendar,
    getTopicProgressStats,
  };
}

export function useProblemProgress(problemId: string) {
  const [problemProgress, setProblemProgress] = useState<ProblemProgress | null>(null);

  useEffect(() => {
    const progress = getProblemProgress(problemId);
    setProblemProgress(progress);
  }, [problemId]);

  const refresh = useCallback(() => {
    const progress = getProblemProgress(problemId);
    setProblemProgress(progress);
  }, [problemId]);

  const updateStatus = useCallback(
    (status: ProblemStatus, topics: string[] = []) => {
      updateProblemProgress(problemId, { status }, topics);
      refresh();
    },
    [problemId, refresh]
  );

  const useHint = useCallback(
    (hintLevel: number) => {
      markHintUsed(problemId, hintLevel);
      refresh();
    },
    [problemId, refresh]
  );

  return {
    problemProgress,
    refresh,
    updateStatus,
    useHint,
    isCompleted: problemProgress?.status === "completed",
    isInProgress: problemProgress?.status === "in_progress",
    hintsUsed: problemProgress?.hintsUsed || [],
  };
}
