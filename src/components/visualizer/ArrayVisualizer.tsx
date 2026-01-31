"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlgorithmStep, ALGORITHMS, generateRandomArray } from "./types";
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  binarySearch,
  linearSearch,
} from "./algorithms";

const BAR_COLORS = {
  default: "bg-primary",
  comparing: "bg-yellow-500",
  swapping: "bg-red-500",
  sorted: "bg-green-500",
  pivot: "bg-purple-500",
  found: "bg-green-400",
};

export function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble-sort");
  const [arraySize, setArraySize] = useState(20);
  const [searchTarget, setSearchTarget] = useState<number | null>(null);
  
  const generatorRef = useRef<Generator<AlgorithmStep> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    setArray(newArray);
    setCurrentStep(null);
    setIsRunning(false);
    setIsPaused(false);
    generatorRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Set search target for search algorithms
    const alg = ALGORITHMS.find((a) => a.id === algorithm);
    if (alg?.type === "searching") {
      setSearchTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    }
  }, [arraySize, algorithm]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const getGenerator = useCallback(() => {
    switch (algorithm) {
      case "bubble-sort":
        return bubbleSort(array);
      case "selection-sort":
        return selectionSort(array);
      case "insertion-sort":
        return insertionSort(array);
      case "quick-sort":
        return quickSort(array);
      case "merge-sort":
        return mergeSort(array);
      case "binary-search":
        return binarySearch(array, searchTarget || array[0]);
      case "linear-search":
        return linearSearch(array, searchTarget || array[0]);
      default:
        return bubbleSort(array);
    }
  }, [algorithm, array, searchTarget]);

  const runStep = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator();
    }

    const result = generatorRef.current.next();
    
    if (result.done) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    setCurrentStep(result.value);
    setArray(result.value.array);
  }, [getGenerator]);

  const runVisualization = useCallback(() => {
    if (!isRunning || isPaused) return;

    runStep();
    
    const delay = Math.max(10, 500 - speed * 5);
    timeoutRef.current = setTimeout(runVisualization, delay);
  }, [isRunning, isPaused, runStep, speed]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      runVisualization();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isRunning, isPaused, runVisualization]);

  const handleStart = () => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator();
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    generateArray();
  };

  const handleStep = () => {
    if (!generatorRef.current) {
      generatorRef.current = getGenerator();
    }
    runStep();
  };

  const getBarColor = (index: number) => {
    if (!currentStep) return BAR_COLORS.default;
    if (currentStep.found === index) return BAR_COLORS.found;
    if (currentStep.pivot === index) return BAR_COLORS.pivot;
    if (currentStep.swapping?.includes(index)) return BAR_COLORS.swapping;
    if (currentStep.comparing?.includes(index)) return BAR_COLORS.comparing;
    if (currentStep.sorted?.includes(index)) return BAR_COLORS.sorted;
    return BAR_COLORS.default;
  };

  const selectedAlgorithm = ALGORITHMS.find((a) => a.id === algorithm);
  const isSearchAlgorithm = selectedAlgorithm?.type === "searching";

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Algorithm Visualizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <Select value={algorithm} onValueChange={setAlgorithm} disabled={isRunning}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header-sorting" disabled className="font-semibold">
                Sorting
              </SelectItem>
              {ALGORITHMS.filter((a) => a.type === "sorting").map((alg) => (
                <SelectItem key={alg.id} value={alg.id}>
                  {alg.name}
                </SelectItem>
              ))}
              <SelectItem value="header-searching" disabled className="font-semibold">
                Searching
              </SelectItem>
              {ALGORITHMS.filter((a) => a.type === "searching").map((alg) => (
                <SelectItem key={alg.id} value={alg.id}>
                  {alg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!isRunning ? (
            <Button size="sm" onClick={handleStart}>
              <Play className="h-4 w-4 mr-1" /> Start
            </Button>
          ) : isPaused ? (
            <Button size="sm" onClick={handleStart}>
              <Play className="h-4 w-4 mr-1" /> Resume
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handlePause}>
              <Pause className="h-4 w-4 mr-1" /> Pause
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={handleStep} disabled={isRunning && !isPaused}>
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed and Size Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Speed</label>
            <Slider
              value={[speed]}
              onValueChange={([v]: number[]) => setSpeed(v)}
              min={1}
              max={100}
              step={1}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Size: {arraySize}</label>
            <Slider
              value={[arraySize]}
              onValueChange={([v]: number[]) => setArraySize(v)}
              min={5}
              max={50}
              step={1}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Search Target */}
        {isSearchAlgorithm && searchTarget !== null && (
          <div className="text-sm text-muted-foreground">
            Searching for: <span className="font-bold text-primary">{searchTarget}</span>
          </div>
        )}

        {/* Visualization */}
        <div className="h-48 flex items-end justify-center gap-[2px] bg-muted/30 rounded-lg p-2">
          {array.map((value, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-100 rounded-t",
                getBarColor(index)
              )}
              style={{
                height: `${(value / 100) * 100}%`,
                width: `${Math.max(100 / array.length - 1, 2)}%`,
              }}
            />
          ))}
        </div>

        {/* Step Description */}
        {currentStep && (
          <div className="text-sm text-center text-muted-foreground">
            {currentStep.description}
          </div>
        )}

        {/* Algorithm Info */}
        {selectedAlgorithm && (
          <div className="text-xs text-muted-foreground space-y-1 border-t pt-2">
            <p><strong>{selectedAlgorithm.name}</strong>: {selectedAlgorithm.description}</p>
            <p>
              Time: Best {selectedAlgorithm.timeComplexity.best}, 
              Avg {selectedAlgorithm.timeComplexity.average}, 
              Worst {selectedAlgorithm.timeComplexity.worst}
            </p>
            <p>Space: {selectedAlgorithm.spaceComplexity} | Stable: {selectedAlgorithm.stable ? "Yes" : "No"}</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary" />
            <span>Default</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span>Sorted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-500" />
            <span>Pivot</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
