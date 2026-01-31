"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomFlashcards, Flashcard } from "@/data/flashcards";
import { TopicSlug } from "@/data/types";
import { cn } from "@/lib/utils";

interface FlashcardDeckProps {
  topic?: TopicSlug;
  count?: number;
}

export function FlashcardDeck({ topic, count = 10 }: FlashcardDeckProps) {
  const [cards, setCards] = useState<Flashcard[]>(() => getRandomFlashcards(count, topic));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setCards(getRandomFlashcards(count, topic));
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
  };

  const handleMarkKnown = () => {
    const newKnown = new Set(knownCards);
    if (knownCards.has(currentCard.id)) {
      newKnown.delete(currentCard.id);
    } else {
      newKnown.add(currentCard.id);
    }
    setKnownCards(newKnown);
  };

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const knownCount = knownCards.size;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-500 transform-style-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Front */}
          <Card className={cn(
            "absolute inset-0 backface-hidden",
            isFlipped && "invisible"
          )}>
            <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
              <span className={cn(
                "text-xs px-2 py-1 rounded-full mb-4",
                currentCard.difficulty === "easy" && "bg-green-500/10 text-green-600",
                currentCard.difficulty === "medium" && "bg-yellow-500/10 text-yellow-600",
                currentCard.difficulty === "hard" && "bg-red-500/10 text-red-600"
              )}>
                {currentCard.topic}
              </span>
              <p className="text-lg font-medium">{currentCard.front}</p>
              <p className="text-sm text-muted-foreground mt-4">Click to reveal answer</p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card className={cn(
            "absolute inset-0 backface-hidden rotate-y-180",
            !isFlipped && "invisible"
          )}>
            <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
              <p className="text-base whitespace-pre-line">{currentCard.back}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          <Button
            variant={knownCards.has(currentCard.id) ? "default" : "outline"}
            size="sm"
            onClick={handleMarkKnown}
          >
            {knownCards.has(currentCard.id) ? "Known ✓" : "Mark as Known"}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-muted-foreground">
        {knownCount} of {cards.length} cards marked as known
      </div>
    </div>
  );
}
