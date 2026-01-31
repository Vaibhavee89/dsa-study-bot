import { Problem, ProblemFilter, TopicSlug, Difficulty } from "./types";
import { problems, getProblemById, getProblemsByDifficulty, getProblemsByTopic, getProblemCount } from "./problems";
import { topics, getTopicBySlug, getTopicsByCategory } from "./topics";

export * from "./types";
export * from "./problems";
export * from "./topics";

export function filterProblems(filter: ProblemFilter): Problem[] {
  let result = [...problems];

  if (filter.difficulty) {
    result = result.filter((p) => p.difficulty === filter.difficulty);
  }

  if (filter.topics && filter.topics.length > 0) {
    result = result.filter((p) =>
      filter.topics!.some((topic) => p.topics.includes(topic))
    );
  }

  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.patterns.some((pattern) => pattern.toLowerCase().includes(searchLower))
    );
  }

  return result;
}

export function getRandomProblem(difficulty?: Difficulty): Problem {
  let pool = problems;
  if (difficulty) {
    pool = problems.filter((p) => p.difficulty === difficulty);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDailyProblem(): Problem {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return problems[dayOfYear % problems.length];
}

export function getHintForProblem(problemId: string, level: 1 | 2 | 3 | 4): string | null {
  const problem = getProblemById(problemId);
  if (!problem) return null;
  
  const hint = problem.hints.find((h) => h.level === level);
  return hint ? hint.content : null;
}

export function getRelatedProblems(problemId: string, limit: number = 3): Problem[] {
  const problem = getProblemById(problemId);
  if (!problem) return [];

  return problems
    .filter((p) => p.id !== problemId)
    .map((p) => ({
      problem: p,
      score: p.topics.filter((t) => problem.topics.includes(t)).length +
             (p.difficulty === problem.difficulty ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.problem);
}

export function getTopicStats(): { slug: TopicSlug; name: string; count: number; icon: string }[] {
  return topics.map((topic) => ({
    slug: topic.slug,
    name: topic.name,
    icon: topic.icon,
    count: problems.filter((p) => p.topics.includes(topic.slug)).length,
  })).filter((t) => t.count > 0);
}

export function searchProblems(query: string): Problem[] {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  
  return problems
    .map((p) => {
      let score = 0;
      
      if (p.title.toLowerCase().includes(queryLower)) score += 10;
      if (p.description.toLowerCase().includes(queryLower)) score += 5;
      if (p.topics.some((t) => t.includes(queryLower))) score += 3;
      if (p.patterns.some((pat) => pat.includes(queryLower))) score += 2;
      if (p.leetcodeId?.toString() === query) score += 15;
      
      return { problem: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.problem);
}
