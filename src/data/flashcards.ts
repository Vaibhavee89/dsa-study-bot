import { TopicSlug } from "./types";

export interface Flashcard {
  id: string;
  topic: TopicSlug;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
}

export const flashcards: Flashcard[] = [
  // Arrays
  {
    id: "fc-arr-1",
    topic: "arrays",
    front: "What is the time complexity of inserting at the end of a dynamic array (amortized)?",
    back: "O(1) amortized. Occasionally O(n) when resizing is needed, but averaged over many insertions it's constant.",
    difficulty: "easy",
  },
  {
    id: "fc-arr-2",
    topic: "arrays",
    front: "When should you use an array vs a linked list?",
    back: "Use arrays when you need fast random access (O(1)) and know the size. Use linked lists when you need frequent insertions/deletions at arbitrary positions.",
    difficulty: "medium",
  },

  // Hash Table
  {
    id: "fc-hash-1",
    topic: "hash-table",
    front: "What is a hash collision and how is it handled?",
    back: "A collision occurs when two keys hash to the same index. Common solutions: Chaining (linked lists at each bucket) or Open Addressing (probing for next empty slot).",
    difficulty: "medium",
  },
  {
    id: "fc-hash-2",
    topic: "hash-table",
    front: "What is the load factor of a hash table?",
    back: "Load factor = n/k where n is number of entries and k is number of buckets. Higher load factor means more collisions. Typically resize when load factor > 0.75.",
    difficulty: "medium",
  },

  // Linked List
  {
    id: "fc-ll-1",
    topic: "linked-list",
    front: "How do you detect a cycle in a linked list?",
    back: "Floyd's Cycle Detection (Tortoise and Hare): Use two pointers, one moving 2x speed. If they meet, there's a cycle. Time: O(n), Space: O(1).",
    difficulty: "medium",
  },
  {
    id: "fc-ll-2",
    topic: "linked-list",
    front: "How do you find the middle of a linked list in one pass?",
    back: "Use two pointers: slow moves 1 step, fast moves 2 steps. When fast reaches end, slow is at middle.",
    difficulty: "easy",
  },

  // Stack
  {
    id: "fc-stack-1",
    topic: "stack",
    front: "What problems are stacks commonly used for?",
    back: "1. Parentheses matching\n2. Expression evaluation\n3. Undo operations\n4. DFS traversal\n5. Function call stack\n6. Monotonic stack problems",
    difficulty: "easy",
  },
  {
    id: "fc-stack-2",
    topic: "stack",
    front: "What is a monotonic stack?",
    back: "A stack that maintains elements in sorted order (increasing or decreasing). Used for finding next greater/smaller element problems. O(n) time complexity.",
    difficulty: "hard",
  },

  // Queue
  {
    id: "fc-queue-1",
    topic: "queue",
    front: "How do you implement a queue using two stacks?",
    back: "Use stack1 for enqueue (push). For dequeue: if stack2 empty, pop all from stack1 to stack2, then pop stack2. Amortized O(1) for both operations.",
    difficulty: "medium",
  },

  // Binary Tree
  {
    id: "fc-bt-1",
    topic: "binary-tree",
    front: "What are the three DFS traversal orders?",
    back: "1. Preorder: Root → Left → Right\n2. Inorder: Left → Root → Right\n3. Postorder: Left → Right → Root\n\nInorder on BST gives sorted order.",
    difficulty: "easy",
  },
  {
    id: "fc-bt-2",
    topic: "binary-tree",
    front: "What is the height of a balanced binary tree with n nodes?",
    back: "O(log n). A balanced tree has roughly equal nodes in left and right subtrees, halving the problem at each level.",
    difficulty: "easy",
  },
  {
    id: "fc-bt-3",
    topic: "binary-tree",
    front: "How do you check if a binary tree is a valid BST?",
    back: "Use inorder traversal (should be sorted) OR recursive check with min/max bounds. Each node must be > all left descendants and < all right descendants.",
    difficulty: "medium",
  },

  // Heap
  {
    id: "fc-heap-1",
    topic: "heap",
    front: "What is the time complexity of building a heap from n elements?",
    back: "O(n) using heapify (bottom-up). Not O(n log n) because most nodes are near the bottom and require fewer swaps.",
    difficulty: "medium",
  },
  {
    id: "fc-heap-2",
    topic: "heap",
    front: "When should you use a heap?",
    back: "1. Finding k largest/smallest elements\n2. Priority queues\n3. Median finding (two heaps)\n4. Merge k sorted lists\n5. Dijkstra's algorithm",
    difficulty: "medium",
  },

  // Graph
  {
    id: "fc-graph-1",
    topic: "graph",
    front: "BFS vs DFS: When to use which?",
    back: "BFS: Shortest path (unweighted), level-order traversal, closer nodes first.\nDFS: Path finding, cycle detection, topological sort, connected components, backtracking.",
    difficulty: "medium",
  },
  {
    id: "fc-graph-2",
    topic: "graph",
    front: "What is topological sort and when is it used?",
    back: "Linear ordering of vertices where for every edge u→v, u comes before v. Used for: task scheduling, build systems, course prerequisites. Only works on DAGs.",
    difficulty: "hard",
  },

  // Dynamic Programming
  {
    id: "fc-dp-1",
    topic: "dynamic-programming",
    front: "What are the steps to solve a DP problem?",
    back: "1. Define state (what info needed)\n2. Find recurrence relation\n3. Identify base cases\n4. Determine computation order\n5. Optimize space if possible",
    difficulty: "medium",
  },
  {
    id: "fc-dp-2",
    topic: "dynamic-programming",
    front: "Top-down vs Bottom-up DP?",
    back: "Top-down (Memoization): Recursive + cache, natural, may have stack overflow.\nBottom-up (Tabulation): Iterative, builds table, often more space-efficient.",
    difficulty: "medium",
  },

  // Two Pointers
  {
    id: "fc-tp-1",
    topic: "two-pointers",
    front: "What are common two-pointer patterns?",
    back: "1. Opposite ends (sorted array, palindrome)\n2. Same direction (fast/slow for cycles)\n3. Sliding window (subarray problems)\n4. Two arrays (merge sorted)",
    difficulty: "easy",
  },

  // Binary Search
  {
    id: "fc-bs-1",
    topic: "binary-search",
    front: "How do you handle duplicates in binary search?",
    back: "For leftmost: if arr[mid] >= target, right = mid\nFor rightmost: if arr[mid] <= target, left = mid\nAdjust loop condition and return accordingly.",
    difficulty: "medium",
  },
  {
    id: "fc-bs-2",
    topic: "binary-search",
    front: "When can binary search be applied beyond sorted arrays?",
    back: "Any monotonic function! Search space problems: find minimum capacity, maximum speed, etc. If f(x) is monotonic, binary search on x.",
    difficulty: "hard",
  },

  // Sorting
  {
    id: "fc-sort-1",
    topic: "sorting",
    front: "Compare QuickSort, MergeSort, and HeapSort",
    back: "QuickSort: O(n log n) avg, O(n²) worst, in-place, not stable\nMergeSort: O(n log n) always, O(n) space, stable\nHeapSort: O(n log n) always, in-place, not stable",
    difficulty: "medium",
  },

  // Backtracking
  {
    id: "fc-bt-1",
    topic: "backtracking",
    front: "What is the backtracking template?",
    back: "1. Choose: Make a choice\n2. Explore: Recurse with the choice\n3. Unchoose: Undo the choice (backtrack)\n\nUsed for: permutations, combinations, sudoku, N-queens.",
    difficulty: "medium",
  },

  // Sliding Window
  {
    id: "fc-sw-1",
    topic: "sliding-window",
    front: "Fixed vs Variable sliding window?",
    back: "Fixed: Window size constant, slide by 1 each step.\nVariable: Expand right to include, shrink left to exclude. Track condition with hash map or counter.",
    difficulty: "medium",
  },
];

export function getFlashcardsByTopic(topic: TopicSlug): Flashcard[] {
  return flashcards.filter((f) => f.topic === topic);
}

export function getRandomFlashcards(count: number = 10, topic?: TopicSlug): Flashcard[] {
  const pool = topic ? getFlashcardsByTopic(topic) : flashcards;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
