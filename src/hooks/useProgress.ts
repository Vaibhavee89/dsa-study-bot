"use client";

import { useState, useEffect, useCallback } from "react";
import {
  UserProgress,
  ProblemProgress,
  ProblemStatus,
  getProgress,
  getProblemProgress,
  updateProblemProgress,
  markHintUsed,
  getStreakCalendar,
  getTopicProgressStats,
  resetProgress,
} from "@/lib/progress";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProgress = useCallback(() => {
    const currentProgress = getProgress();
    setProgress(currentProgress);
  }, []);

  useEffect(() => {
    refreshProgress();
    setIsLoading(false);
  }, [refreshProgress]);

  const updateProblem = useCallback(
    (problemId: string, updates: Partial<ProblemProgress>, topics: string[] = []) => {
      updateProblemProgress(problemId, updates, topics);
      refreshProgress();
    },
    [refreshProgress]
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
      refreshProgress();
    },
    [refreshProgress]
  );

  const reset = useCallback(() => {
    resetProgress();
    refreshProgress();
  }, [refreshProgress]);

  return {
    progress,
    isLoading,
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
