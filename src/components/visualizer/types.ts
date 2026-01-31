export type AlgorithmType = "sorting" | "searching" | "graph" | "tree";

export interface ArrayBar {
  value: number;
  state: "default" | "comparing" | "swapping" | "sorted" | "pivot" | "found";
}

export interface VisualizerState {
  array: ArrayBar[];
  comparisons: number;
  swaps: number;
  currentStep: number;
  totalSteps: number;
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  algorithm: string;
}

export interface AlgorithmStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  found?: number;
  description: string;
}

export interface Algorithm {
  id: string;
  name: string;
  type: AlgorithmType;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
}

export const ALGORITHMS: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    type: "sorting",
    description: "Repeatedly swaps adjacent elements if they are in wrong order",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    type: "sorting",
    description: "Finds minimum element and places it at the beginning",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    type: "sorting",
    description: "Builds sorted array one element at a time",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    type: "sorting",
    description: "Divides array using pivot and recursively sorts partitions",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    type: "sorting",
    description: "Divides array in half, sorts, and merges back together",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    type: "searching",
    description: "Searches sorted array by repeatedly dividing search interval in half",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
  {
    id: "linear-search",
    name: "Linear Search",
    type: "searching",
    description: "Sequentially checks each element until match is found",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    stable: true,
  },
];

export function generateRandomArray(size: number, min: number = 5, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
