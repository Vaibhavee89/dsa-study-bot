export type Difficulty = "easy" | "medium" | "hard";

export type TopicSlug =
  | "arrays"
  | "strings"
  | "hash-table"
  | "linked-list"
  | "stack"
  | "queue"
  | "tree"
  | "binary-tree"
  | "binary-search-tree"
  | "heap"
  | "graph"
  | "dynamic-programming"
  | "greedy"
  | "backtracking"
  | "recursion"
  | "binary-search"
  | "two-pointers"
  | "sliding-window"
  | "sorting"
  | "math"
  | "bit-manipulation"
  | "trie"
  | "union-find"
  | "divide-and-conquer";

export interface Topic {
  slug: TopicSlug;
  name: string;
  description: string;
  icon: string;
}

export interface Hint {
  level: 1 | 2 | 3 | 4;
  content: string;
}

export interface Problem {
  id: string;
  title: string;
  leetcodeId?: number;
  leetcodeUrl?: string;
  difficulty: Difficulty;
  topics: TopicSlug[];
  description: string;
  hints: Hint[];
  patterns: string[];
  timeComplexity: string;
  spaceComplexity: string;
  companies?: string[];
}

export interface ProblemFilter {
  difficulty?: Difficulty;
  topics?: TopicSlug[];
  search?: string;
}
