import { describe, it, expect } from "vitest";
import {
  problems,
  getProblemById,
  getProblemsByDifficulty,
  getProblemsByTopic,
  getProblemCount,
  filterProblems,
  getRandomProblem,
  getDailyProblem,
  getHintForProblem,
  getRelatedProblems,
  searchProblems,
  getTopicStats,
} from "@/data";

describe("Problem Database", () => {
  describe("problems array", () => {
    it("should have problems defined", () => {
      expect(problems).toBeDefined();
      expect(problems.length).toBeGreaterThan(0);
    });

    it("should have valid structure for all problems", () => {
      problems.forEach((problem) => {
        expect(problem.id).toBeDefined();
        expect(problem.title).toBeDefined();
        expect(problem.difficulty).toMatch(/^(easy|medium|hard)$/);
        expect(problem.topics.length).toBeGreaterThan(0);
        expect(problem.hints.length).toBeGreaterThan(0);
        expect(problem.timeComplexity).toBeDefined();
        expect(problem.spaceComplexity).toBeDefined();
      });
    });

    it("should have unique problem IDs", () => {
      const ids = problems.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("getProblemById", () => {
    it("should return problem by ID", () => {
      const problem = getProblemById("two-sum");
      expect(problem).toBeDefined();
      expect(problem?.title).toBe("Two Sum");
    });

    it("should return undefined for non-existent ID", () => {
      const problem = getProblemById("non-existent");
      expect(problem).toBeUndefined();
    });
  });

  describe("getProblemsByDifficulty", () => {
    it("should filter by easy difficulty", () => {
      const easyProblems = getProblemsByDifficulty("easy");
      expect(easyProblems.length).toBeGreaterThan(0);
      easyProblems.forEach((p) => expect(p.difficulty).toBe("easy"));
    });

    it("should filter by medium difficulty", () => {
      const mediumProblems = getProblemsByDifficulty("medium");
      expect(mediumProblems.length).toBeGreaterThan(0);
      mediumProblems.forEach((p) => expect(p.difficulty).toBe("medium"));
    });

    it("should filter by hard difficulty", () => {
      const hardProblems = getProblemsByDifficulty("hard");
      expect(hardProblems.length).toBeGreaterThan(0);
      hardProblems.forEach((p) => expect(p.difficulty).toBe("hard"));
    });
  });

  describe("getProblemsByTopic", () => {
    it("should filter by topic", () => {
      const arrayProblems = getProblemsByTopic("arrays");
      expect(arrayProblems.length).toBeGreaterThan(0);
      arrayProblems.forEach((p) => expect(p.topics).toContain("arrays"));
    });
  });

  describe("getProblemCount", () => {
    it("should return correct counts", () => {
      const counts = getProblemCount();
      expect(counts.total).toBe(problems.length);
      expect(counts.easy + counts.medium + counts.hard).toBe(counts.total);
    });
  });

  describe("filterProblems", () => {
    it("should filter by difficulty", () => {
      const result = filterProblems({ difficulty: "easy" });
      result.forEach((p) => expect(p.difficulty).toBe("easy"));
    });

    it("should filter by topics", () => {
      const result = filterProblems({ topics: ["arrays", "hash-table"] });
      result.forEach((p) => {
        const hasMatchingTopic = p.topics.some((t) =>
          ["arrays", "hash-table"].includes(t)
        );
        expect(hasMatchingTopic).toBe(true);
      });
    });

    it("should filter by search term", () => {
      const result = filterProblems({ search: "sum" });
      expect(result.length).toBeGreaterThan(0);
    });

    it("should combine filters", () => {
      const result = filterProblems({
        difficulty: "easy",
        topics: ["arrays"],
      });
      result.forEach((p) => {
        expect(p.difficulty).toBe("easy");
        expect(p.topics).toContain("arrays");
      });
    });
  });

  describe("getRandomProblem", () => {
    it("should return a problem", () => {
      const problem = getRandomProblem();
      expect(problem).toBeDefined();
      expect(problem.id).toBeDefined();
    });

    it("should respect difficulty filter", () => {
      const problem = getRandomProblem("easy");
      expect(problem.difficulty).toBe("easy");
    });
  });

  describe("getDailyProblem", () => {
    it("should return a problem", () => {
      const problem = getDailyProblem();
      expect(problem).toBeDefined();
      expect(problem.id).toBeDefined();
    });

    it("should return same problem on same day", () => {
      const problem1 = getDailyProblem();
      const problem2 = getDailyProblem();
      expect(problem1.id).toBe(problem2.id);
    });
  });

  describe("getHintForProblem", () => {
    it("should return hint for valid problem and level", () => {
      const hint = getHintForProblem("two-sum", 1);
      expect(hint).toBeDefined();
      expect(typeof hint).toBe("string");
    });

    it("should return null for invalid problem", () => {
      const hint = getHintForProblem("non-existent", 1);
      expect(hint).toBeNull();
    });
  });

  describe("getRelatedProblems", () => {
    it("should return related problems", () => {
      const related = getRelatedProblems("two-sum");
      expect(related.length).toBeGreaterThan(0);
      expect(related.length).toBeLessThanOrEqual(3);
    });

    it("should not include the original problem", () => {
      const related = getRelatedProblems("two-sum");
      const ids = related.map((p) => p.id);
      expect(ids).not.toContain("two-sum");
    });
  });

  describe("searchProblems", () => {
    it("should find problems by title", () => {
      const results = searchProblems("Two Sum");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain("Two Sum");
    });

    it("should find problems by LeetCode ID", () => {
      const results = searchProblems("1");
      expect(results.some((p) => p.leetcodeId === 1)).toBe(true);
    });

    it("should return empty array for empty query", () => {
      const results = searchProblems("");
      expect(results).toEqual([]);
    });
  });

  describe("getTopicStats", () => {
    it("should return topic statistics", () => {
      const stats = getTopicStats();
      expect(stats.length).toBeGreaterThan(0);
      stats.forEach((stat) => {
        expect(stat.slug).toBeDefined();
        expect(stat.name).toBeDefined();
        expect(stat.count).toBeGreaterThan(0);
      });
    });
  });
});
