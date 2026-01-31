// Quiz questions for Discord bot
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search divides the search space in half each iteration, resulting in O(log n) time complexity.",
    topic: "binary-search"
  },
  {
    id: "q2",
    question: "Which data structure uses LIFO (Last In, First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
    explanation: "A Stack follows LIFO - the last element added is the first one removed.",
    topic: "stack"
  },
  {
    id: "q3",
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "Merge sort requires O(n) auxiliary space for the temporary arrays during merging.",
    topic: "sorting"
  },
  {
    id: "q4",
    question: "Which traversal visits nodes in order: left, root, right?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctAnswer: 1,
    explanation: "Inorder traversal visits left subtree, then root, then right subtree.",
    topic: "tree"
  },
  {
    id: "q5",
    question: "What is the worst-case time complexity of quicksort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
    explanation: "Quicksort's worst case is O(n²) when the pivot is always the smallest or largest element.",
    topic: "sorting"
  },
  {
    id: "q6",
    question: "Which algorithm finds the shortest path in an unweighted graph?",
    options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
    correctAnswer: 1,
    explanation: "BFS finds the shortest path in unweighted graphs because it explores nodes level by level.",
    topic: "graph"
  },
  {
    id: "q7",
    question: "What is the time complexity of inserting into a hash table (average case)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Hash tables provide O(1) average case insertion using hash functions.",
    topic: "hash-table"
  },
  {
    id: "q8",
    question: "Which technique is used to solve the 'Longest Common Subsequence' problem?",
    options: ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
    correctAnswer: 2,
    explanation: "LCS is a classic dynamic programming problem with overlapping subproblems.",
    topic: "dynamic-programming"
  },
  {
    id: "q9",
    question: "What is the height of a balanced binary search tree with n nodes?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "A balanced BST has height O(log n), ensuring efficient operations.",
    topic: "tree"
  },
  {
    id: "q10",
    question: "Which data structure is best for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    explanation: "A heap provides O(log n) insertion and O(1) access to the min/max element.",
    topic: "heap"
  }
];

export function getRandomQuiz(count: number = 5): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuizByTopic(topic: string): QuizQuestion | undefined {
  const filtered = quizQuestions.filter(q => q.topic === topic);
  return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : undefined;
}
