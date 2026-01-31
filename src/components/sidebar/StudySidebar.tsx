"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Brain, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  X,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StreakCard } from "@/components/progress/StreakCard";
import { StreakCalendar } from "@/components/progress/StreakCalendar";
import { TopicProgress } from "@/components/progress/TopicProgress";
import { DailyChallenge } from "@/components/daily/DailyChallenge";
import { QuizModal } from "@/components/quiz/QuizModal";
import { FlashcardDeck } from "@/components/flashcards/FlashcardDeck";
import { cn } from "@/lib/utils";
import { ArrayVisualizer } from "@/components/visualizer";

interface StudySidebarProps {
  onSelectProblem?: (problem: string) => void;
}

export function StudySidebar({ onSelectProblem }: StudySidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [activeTab, setActiveTab] = useState<"progress" | "study" | "visualize">("progress");

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed top-4 left-4 z-50 transition-all duration-300",
          isOpen && "left-[340px]"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[320px] bg-background border-r z-40 transition-transform duration-300 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Study Tools</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-1 mb-4">
            <Button
              variant={activeTab === "progress" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs px-2"
              onClick={() => setActiveTab("progress")}
            >
              Progress
            </Button>
            <Button
              variant={activeTab === "study" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs px-2"
              onClick={() => setActiveTab("study")}
            >
              Study
            </Button>
            <Button
              variant={activeTab === "visualize" ? "default" : "outline"}
              size="sm"
              className="flex-1 text-xs px-2"
              onClick={() => setActiveTab("visualize")}
            >
              Visualize
            </Button>
          </div>

          {activeTab === "progress" && (
            <div className="space-y-4">
              <StreakCard />
              <StreakCalendar days={21} />
              <TopicProgress />
            </div>
          )}

          {activeTab === "study" && (
            <div className="space-y-4">
              {/* Daily Challenge */}
              <DailyChallenge onSelectProblem={(problem) => {
                onSelectProblem?.(problem);
                setIsOpen(false);
              }} />

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Practice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowQuiz(true)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Take a Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowFlashcards(true)}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Review Flashcards
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      onSelectProblem?.("Can you give me a random DSA problem to practice?");
                      setIsOpen(false);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Random Problem
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "visualize" && (
            <div className="space-y-4">
              <ArrayVisualizer />
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        questionCount={5}
      />

      {/* Flashcards Modal */}
      {showFlashcards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowFlashcards(false)}
          />
          <div className="relative w-full max-w-lg mx-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setShowFlashcards(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>DSA Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <FlashcardDeck count={10} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
