// Curated DSA problems for Discord bot
export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  description: string;
  hints: string[];
  leetcodeUrl?: string;
}

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    topics: ["arrays", "hash-table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    hints: [
      "Think about what information you need to store as you iterate through the array.",
      "A hash map can help you find complements in O(1) time.",
      "For each number, check if (target - number) exists in your hash map."
    ],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "easy",
    topics: ["stack", "string"],
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    hints: [
      "What data structure allows you to match opening and closing brackets in order?",
      "A stack follows LIFO - last in, first out.",
      "Push opening brackets, pop and compare for closing brackets."
    ],
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/"
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    topics: ["linked-list", "recursion"],
    description: "Merge two sorted linked lists and return it as a sorted list.",
    hints: [
      "Compare the heads of both lists at each step.",
      "You can solve this iteratively or recursively.",
      "Use a dummy node to simplify edge cases."
    ],
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/"
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    topics: ["arrays", "dynamic-programming"],
    description: "Find the maximum profit you can achieve from buying and selling a stock once.",
    hints: [
      "Track the minimum price seen so far.",
      "At each price, calculate potential profit if you sold today.",
      "Keep track of the maximum profit found."
    ],
    leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topics: ["sliding-window", "hash-table", "string"],
    description: "Find the length of the longest substring without repeating characters.",
    hints: [
      "Use a sliding window approach.",
      "A set or hash map can track characters in current window.",
      "When you find a duplicate, shrink the window from the left."
    ],
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "medium",
    topics: ["arrays", "two-pointers"],
    description: "Find two lines that together with the x-axis form a container that holds the most water.",
    hints: [
      "Use two pointers starting from both ends.",
      "The area is limited by the shorter line.",
      "Move the pointer pointing to the shorter line inward."
    ],
    leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/"
  },
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "medium",
    topics: ["arrays", "two-pointers", "sorting"],
    description: "Find all unique triplets in the array which gives the sum of zero.",
    hints: [
      "Sort the array first to enable two-pointer technique.",
      "Fix one element and use two pointers for the remaining two.",
      "Skip duplicates to avoid duplicate triplets."
    ],
    leetcodeUrl: "https://leetcode.com/problems/3sum/"
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "medium",
    topics: ["graph", "dfs", "bfs"],
    description: "Count the number of islands in a 2D grid where '1' is land and '0' is water.",
    hints: [
      "Use DFS or BFS to explore connected land cells.",
      "Mark visited cells to avoid counting them twice.",
      "Each time you start a new DFS/BFS, you've found a new island."
    ],
    leetcodeUrl: "https://leetcode.com/problems/number-of-islands/"
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "medium",
    topics: ["arrays", "sorting"],
    description: "Merge all overlapping intervals and return an array of non-overlapping intervals.",
    hints: [
      "Sort intervals by start time first.",
      "Compare each interval with the last merged interval.",
      "If they overlap, merge them; otherwise, add as new interval."
    ],
    leetcodeUrl: "https://leetcode.com/problems/merge-intervals/"
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "hard",
    topics: ["arrays", "two-pointers", "dynamic-programming"],
    description: "Calculate how much water can be trapped after raining given an elevation map.",
    hints: [
      "Water at each position depends on min(maxLeft, maxRight) - height.",
      "You can precompute max heights from left and right.",
      "Or use two pointers to solve in O(1) space."
    ],
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/"
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    topics: ["arrays", "binary-search"],
    description: "Find the median of two sorted arrays in O(log(m+n)) time.",
    hints: [
      "Binary search on the smaller array.",
      "Partition both arrays such that left half equals right half.",
      "The median is at the partition boundary."
    ],
    leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    difficulty: "hard",
    topics: ["graph", "bfs", "string"],
    description: "Find the shortest transformation sequence from beginWord to endWord.",
    hints: [
      "Model this as a graph problem - words are nodes.",
      "BFS finds the shortest path in an unweighted graph.",
      "Generate all possible one-letter transformations."
    ],
    leetcodeUrl: "https://leetcode.com/problems/word-ladder/"
  }
];

export function getDailyProblem(): Problem {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return problems[dayOfYear % problems.length];
}

export function getRandomProblem(difficulty?: "easy" | "medium" | "hard"): Problem {
  const filtered = difficulty ? problems.filter(p => p.difficulty === difficulty) : problems;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getProblemByTopic(topic: string): Problem | undefined {
  const filtered = problems.filter(p => p.topics.includes(topic.toLowerCase()));
  return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : undefined;
}
