import { Topic } from "./types";

export const topics: Topic[] = [
  {
    slug: "arrays",
    name: "Arrays",
    description: "Linear data structure storing elements in contiguous memory",
    icon: "📊",
  },
  {
    slug: "strings",
    name: "Strings",
    description: "Sequence of characters and string manipulation techniques",
    icon: "🔤",
  },
  {
    slug: "hash-table",
    name: "Hash Table",
    description: "Key-value storage with O(1) average lookup time",
    icon: "🗂️",
  },
  {
    slug: "linked-list",
    name: "Linked List",
    description: "Linear collection of nodes connected by pointers",
    icon: "🔗",
  },
  {
    slug: "stack",
    name: "Stack",
    description: "LIFO (Last In, First Out) data structure",
    icon: "📚",
  },
  {
    slug: "queue",
    name: "Queue",
    description: "FIFO (First In, First Out) data structure",
    icon: "🚶",
  },
  {
    slug: "tree",
    name: "Tree",
    description: "Hierarchical data structure with root and child nodes",
    icon: "🌳",
  },
  {
    slug: "binary-tree",
    name: "Binary Tree",
    description: "Tree where each node has at most two children",
    icon: "🌲",
  },
  {
    slug: "binary-search-tree",
    name: "Binary Search Tree",
    description: "Binary tree with ordered nodes for efficient searching",
    icon: "🔍",
  },
  {
    slug: "heap",
    name: "Heap",
    description: "Complete binary tree satisfying heap property",
    icon: "⛰️",
  },
  {
    slug: "graph",
    name: "Graph",
    description: "Collection of nodes connected by edges",
    icon: "🕸️",
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Optimization technique using memoization or tabulation",
    icon: "📈",
  },
  {
    slug: "greedy",
    name: "Greedy",
    description: "Making locally optimal choices at each step",
    icon: "🎯",
  },
  {
    slug: "backtracking",
    name: "Backtracking",
    description: "Exploring all possibilities by building solutions incrementally",
    icon: "↩️",
  },
  {
    slug: "recursion",
    name: "Recursion",
    description: "Solving problems by breaking them into smaller subproblems",
    icon: "🔄",
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    description: "Efficient searching in sorted arrays with O(log n) time",
    icon: "🎯",
  },
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Using two pointers to traverse data efficiently",
    icon: "👆👆",
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Maintaining a window of elements for subarray problems",
    icon: "🪟",
  },
  {
    slug: "sorting",
    name: "Sorting",
    description: "Arranging elements in a specific order",
    icon: "📶",
  },
  {
    slug: "math",
    name: "Math",
    description: "Mathematical concepts and number theory",
    icon: "🔢",
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    description: "Operations on binary representations of numbers",
    icon: "💻",
  },
  {
    slug: "trie",
    name: "Trie",
    description: "Tree-like structure for efficient string operations",
    icon: "🌿",
  },
  {
    slug: "union-find",
    name: "Union Find",
    description: "Disjoint set data structure for connectivity problems",
    icon: "🔀",
  },
  {
    slug: "divide-and-conquer",
    name: "Divide and Conquer",
    description: "Breaking problems into smaller subproblems recursively",
    icon: "✂️",
  },
];

export const getTopicBySlug = (slug: string): Topic | undefined => {
  return topics.find((topic) => topic.slug === slug);
};

export const getTopicsByCategory = (category: "data-structures" | "algorithms" | "techniques"): Topic[] => {
  const categories = {
    "data-structures": [
      "arrays", "strings", "hash-table", "linked-list", "stack", "queue",
      "tree", "binary-tree", "binary-search-tree", "heap", "graph", "trie"
    ],
    "algorithms": [
      "sorting", "binary-search", "dynamic-programming", "greedy", "backtracking"
    ],
    "techniques": [
      "two-pointers", "sliding-window", "recursion", "bit-manipulation",
      "union-find", "divide-and-conquer", "math"
    ],
  };

  return topics.filter((topic) => categories[category].includes(topic.slug));
};
