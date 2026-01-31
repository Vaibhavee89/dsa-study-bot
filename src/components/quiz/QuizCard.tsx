"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuizQuestion } from "@/data/quizzes";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerIndex: number) => void;
  selectedAnswer?: number;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
}: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(selectedAnswer ?? null);
  const hasAnswered = selected !== null;
  const isCorrect = selected === question.correctAnswer;

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelected(index);
    onAnswer(index);
  };

  const getOptionStyle = (index: number) => {
    if (!hasAnswered) {
      return "hover:bg-accent hover:border-accent-foreground/20 cursor-pointer";
    }

    if (index === question.correctAnswer) {
      return "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400";
    }

    if (index === selected && index !== question.correctAnswer) {
      return "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400";
    }

    return "opacity-50";
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            question.difficulty === "easy" && "bg-green-500/10 text-green-600",
            question.difficulty === "medium" && "bg-yellow-500/10 text-yellow-600",
            question.difficulty === "hard" && "bg-red-500/10 text-red-600"
          )}>
            {question.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-medium mb-4">{question.question}</h3>

        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered}
              className={cn(
                "w-full p-3 text-left rounded-lg border transition-colors flex items-center gap-3",
                getOptionStyle(index)
              )}
            >
              <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {hasAnswered && index === question.correctAnswer && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {hasAnswered && index === selected && index !== question.correctAnswer && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </button>
          ))}
        </div>

        {hasAnswered && (
          <div className={cn(
            "mt-4 p-4 rounded-lg",
            isCorrect ? "bg-green-500/10" : "bg-amber-500/10"
          )}>
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
