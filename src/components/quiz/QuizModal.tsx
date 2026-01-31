"use client";

import { useState, useMemo, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "./QuizCard";
import { QuizResults } from "./QuizResults";
import { getRandomQuiz, calculateScore, QuizQuestion } from "@/data/quizzes";
import { TopicSlug } from "@/data/types";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: TopicSlug;
  questionCount?: number;
}

export function QuizModal({
  isOpen,
  onClose,
  topic,
  questionCount = 5,
}: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const initQuiz = useCallback(() => {
    const newQuestions = getRandomQuiz(questionCount, topic);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResults(false);
  }, [questionCount, topic]);

  useMemo(() => {
    if (isOpen && questions.length === 0) {
      initQuiz();
    }
  }, [isOpen, questions.length, initQuiz]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentIndex];
  const hasAnsweredCurrent = answers[currentIndex] !== undefined;
  const allAnswered = answers.length === questions.length && answers.every((a) => a !== undefined);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (allAnswered) {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRetry = () => {
    initQuiz();
  };

  const handleClose = () => {
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setShowResults(false);
    onClose();
  };

  const score = showResults ? calculateScore(answers, questions) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {showResults && score ? (
          <QuizResults
            correct={score.correct}
            total={score.total}
            percentage={score.percentage}
            onRetry={handleRetry}
            onClose={handleClose}
          />
        ) : currentQuestion ? (
          <div className="space-y-4">
            <QuizCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentIndex]}
            />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
              >
                {currentIndex === questions.length - 1 ? "See Results" : "Next"}
                {currentIndex < questions.length - 1 && (
                  <ChevronRight className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Loading quiz...
          </div>
        )}
      </div>
    </div>
  );
}
