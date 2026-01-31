import { TopicSlug } from "./types";

export type QuestionType = "multiple_choice" | "true_false" | "complexity";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  topic: TopicSlug;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topic: TopicSlug;
  questions: QuizQuestion[];
}

export const quizQuestions: QuizQuestion[] = [
  // Arrays
  {
    id: "arr-1",
    type: "complexity",
    topic: "arrays",
    difficulty: "easy",
    question: "What is the time complexity of accessing an element by index in an array?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Arrays provide constant time O(1) access because elements are stored in contiguous memory locations.",
  },
  {
    id: "arr-2",
    type: "multiple_choice",
    topic: "arrays",
    difficulty: "easy",
    question: "Which operation is most expensive in an unsorted array?",
    options: ["Access by index", "Search for an element", "Get array length", "Access first element"],
    correctAnswer: 1,
    explanation: "Searching in an unsorted array requires O(n) time as you may need to check every element.",
  },
  {
    id: "arr-3",
    type: "true_false",
    topic: "arrays",
    difficulty: "easy",
    question: "Inserting an element at the beginning of an array is O(1) operation.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "Inserting at the beginning requires shifting all existing elements, making it O(n).",
  },

  // Hash Table
  {
    id: "hash-1",
    type: "complexity",
    topic: "hash-table",
    difficulty: "easy",
    question: "What is the average time complexity of lookup in a hash table?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 0,
    explanation: "Hash tables provide O(1) average case lookup using hash functions to directly compute the index.",
  },
  {
    id: "hash-2",
    type: "multiple_choice",
    topic: "hash-table",
    difficulty: "medium",
    question: "What happens when two keys hash to the same index?",
    options: ["Error is thrown", "Collision occurs", "Key is rejected", "Hash table resizes"],
    correctAnswer: 1,
    explanation: "A collision occurs when two keys hash to the same index. This is handled by techniques like chaining or open addressing.",
  },
  {
    id: "hash-3",
    type: "true_false",
    topic: "hash-table",
    difficulty: "medium",
    question: "Hash tables maintain the insertion order of elements.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "Standard hash tables do not maintain insertion order. Some implementations like LinkedHashMap do.",
  },

  // Linked List
  {
    id: "ll-1",
    type: "complexity",
    topic: "linked-list",
    difficulty: "easy",
    question: "What is the time complexity of inserting at the head of a singly linked list?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Inserting at the head only requires updating the head pointer and the new node's next pointer - O(1).",
  },
  {
    id: "ll-2",
    type: "multiple_choice",
    topic: "linked-list",
    difficulty: "medium",
    question: "What is the main advantage of a doubly linked list over a singly linked list?",
    options: ["Less memory usage", "Faster search", "Bidirectional traversal", "Simpler implementation"],
    correctAnswer: 2,
    explanation: "Doubly linked lists allow traversal in both directions, making operations like deletion more efficient.",
  },
  {
    id: "ll-3",
    type: "true_false",
    topic: "linked-list",
    difficulty: "easy",
    question: "Linked lists provide O(1) random access to elements.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "Linked lists require O(n) traversal to access elements as they are not stored contiguously.",
  },

  // Stack
  {
    id: "stack-1",
    type: "multiple_choice",
    topic: "stack",
    difficulty: "easy",
    question: "Which principle does a stack follow?",
    options: ["FIFO", "LIFO", "Random Access", "Priority Based"],
    correctAnswer: 1,
    explanation: "Stack follows LIFO (Last In, First Out) - the last element added is the first one removed.",
  },
  {
    id: "stack-2",
    type: "multiple_choice",
    topic: "stack",
    difficulty: "medium",
    question: "Which problem is best solved using a stack?",
    options: ["Finding shortest path", "Balancing parentheses", "Sorting elements", "Finding median"],
    correctAnswer: 1,
    explanation: "Stacks are ideal for matching/balancing problems like parentheses, as you need to match the most recent opening bracket.",
  },

  // Binary Tree
  {
    id: "bt-1",
    type: "complexity",
    topic: "binary-tree",
    difficulty: "medium",
    question: "What is the time complexity of searching in a balanced binary search tree?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "In a balanced BST, each comparison eliminates half the remaining nodes, giving O(log n) search.",
  },
  {
    id: "bt-2",
    type: "multiple_choice",
    topic: "binary-tree",
    difficulty: "easy",
    question: "In a binary tree, what is the maximum number of nodes at level k?",
    options: ["k", "2k", "2^k", "k²"],
    correctAnswer: 2,
    explanation: "At level k (starting from 0), a binary tree can have at most 2^k nodes.",
  },
  {
    id: "bt-3",
    type: "multiple_choice",
    topic: "binary-tree",
    difficulty: "medium",
    question: "Which traversal visits nodes in sorted order for a BST?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctAnswer: 1,
    explanation: "Inorder traversal (left, root, right) visits BST nodes in ascending sorted order.",
  },

  // Dynamic Programming
  {
    id: "dp-1",
    type: "multiple_choice",
    topic: "dynamic-programming",
    difficulty: "medium",
    question: "What are the two key properties required for dynamic programming?",
    options: [
      "Sorting and searching",
      "Optimal substructure and overlapping subproblems",
      "Divide and conquer",
      "Greedy choice and local optimum"
    ],
    correctAnswer: 1,
    explanation: "DP requires optimal substructure (optimal solution built from optimal subsolutions) and overlapping subproblems (same subproblems solved multiple times).",
  },
  {
    id: "dp-2",
    type: "multiple_choice",
    topic: "dynamic-programming",
    difficulty: "easy",
    question: "What is memoization?",
    options: [
      "Sorting technique",
      "Storing computed results to avoid recomputation",
      "Memory allocation method",
      "Graph traversal technique"
    ],
    correctAnswer: 1,
    explanation: "Memoization stores results of expensive function calls and returns cached results for same inputs.",
  },

  // Two Pointers
  {
    id: "tp-1",
    type: "multiple_choice",
    topic: "two-pointers",
    difficulty: "easy",
    question: "When is the two-pointer technique most useful?",
    options: [
      "Unsorted arrays only",
      "Sorted arrays or when searching for pairs",
      "Only for linked lists",
      "Only for strings"
    ],
    correctAnswer: 1,
    explanation: "Two pointers work well on sorted arrays for finding pairs, or in problems where you need to compare elements from different positions.",
  },
  {
    id: "tp-2",
    type: "complexity",
    topic: "two-pointers",
    difficulty: "medium",
    question: "What is the typical time complexity improvement when using two pointers vs brute force for pair finding?",
    options: ["O(n²) to O(n)", "O(n) to O(1)", "O(n log n) to O(n)", "No improvement"],
    correctAnswer: 0,
    explanation: "Two pointers can reduce O(n²) brute force pair finding to O(n) by eliminating redundant comparisons.",
  },

  // Graph
  {
    id: "graph-1",
    type: "multiple_choice",
    topic: "graph",
    difficulty: "medium",
    question: "Which algorithm is best for finding the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Dijkstra's", "Bellman-Ford"],
    correctAnswer: 1,
    explanation: "BFS finds shortest paths in unweighted graphs because it explores nodes level by level.",
  },
  {
    id: "graph-2",
    type: "complexity",
    topic: "graph",
    difficulty: "medium",
    question: "What is the time complexity of BFS on a graph with V vertices and E edges?",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V × E)"],
    correctAnswer: 2,
    explanation: "BFS visits each vertex once O(V) and explores each edge once O(E), giving O(V + E).",
  },

  // Sorting
  {
    id: "sort-1",
    type: "complexity",
    topic: "sorting",
    difficulty: "easy",
    question: "What is the average time complexity of QuickSort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1,
    explanation: "QuickSort has O(n log n) average case, though worst case is O(n²) with poor pivot selection.",
  },
  {
    id: "sort-2",
    type: "multiple_choice",
    topic: "sorting",
    difficulty: "medium",
    question: "Which sorting algorithm is stable?",
    options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "MergeSort is stable - it maintains the relative order of equal elements. QuickSort and HeapSort are not stable.",
  },
  {
    id: "sort-3",
    type: "true_false",
    topic: "sorting",
    difficulty: "medium",
    question: "Comparison-based sorting algorithms cannot be faster than O(n log n) in the worst case.",
    options: ["True", "False"],
    correctAnswer: 0,
    explanation: "This is proven by the decision tree model - comparison sorts have a lower bound of Ω(n log n).",
  },
];

export function getQuizzesByTopic(topic: TopicSlug): QuizQuestion[] {
  return quizQuestions.filter((q) => q.topic === topic);
}

export function getRandomQuiz(count: number = 5, topic?: TopicSlug): QuizQuestion[] {
  const pool = topic ? getQuizzesByTopic(topic) : quizQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function calculateScore(answers: number[], questions: QuizQuestion[]): {
  correct: number;
  total: number;
  percentage: number;
} {
  const correct = answers.filter((ans, i) => ans === questions[i].correctAnswer).length;
  return {
    correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
  };
}
