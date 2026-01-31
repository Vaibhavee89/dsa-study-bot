import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
      include: {
        problemProgress: true,
        topicProgress: true,
      },
    });

    if (!userProgress) {
      // Create initial progress if doesn't exist
      const newProgress = await prisma.userProgress.create({
        data: { userId: session.user.id },
        include: {
          problemProgress: true,
          topicProgress: true,
        },
      });
      return NextResponse.json(formatProgress(newProgress));
    }

    return NextResponse.json(formatProgress(userProgress));
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { dayStreak, lastActiveDate, totalProblemsAttempted, totalProblemsCompleted, problems, topicProgress } = data;

    // Upsert user progress
    const userProgress = await prisma.userProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        dayStreak: dayStreak || 0,
        lastActiveDate: lastActiveDate || null,
        totalProblemsAttempted: totalProblemsAttempted || 0,
        totalProblemsCompleted: totalProblemsCompleted || 0,
      },
      update: {
        dayStreak: dayStreak || 0,
        lastActiveDate: lastActiveDate || null,
        totalProblemsAttempted: totalProblemsAttempted || 0,
        totalProblemsCompleted: totalProblemsCompleted || 0,
      },
    });

    // Sync problem progress
    if (problems && typeof problems === "object") {
      for (const [problemId, progress] of Object.entries(problems)) {
        const p = progress as {
          status?: string;
          attempts?: number;
          lastAttempted?: string;
          notes?: string;
          hintsUsed?: number[];
          completedAt?: string;
        };
        
        await prisma.problemProgress.upsert({
          where: {
            userProgressId_problemId: {
              userProgressId: userProgress.id,
              problemId,
            },
          },
          create: {
            userProgressId: userProgress.id,
            problemId,
            status: p.status || "not_started",
            attempts: p.attempts || 0,
            lastAttempted: p.lastAttempted || null,
            notes: p.notes || null,
            hintsUsed: JSON.stringify(p.hintsUsed || []),
            completedAt: p.completedAt || null,
          },
          update: {
            status: p.status || "not_started",
            attempts: p.attempts || 0,
            lastAttempted: p.lastAttempted || null,
            notes: p.notes || null,
            hintsUsed: JSON.stringify(p.hintsUsed || []),
            completedAt: p.completedAt || null,
          },
        });
      }
    }

    // Sync topic progress
    if (topicProgress && typeof topicProgress === "object") {
      for (const [topic, progress] of Object.entries(topicProgress)) {
        const t = progress as { attempted?: number; completed?: number };
        
        await prisma.topicProgress.upsert({
          where: {
            userProgressId_topic: {
              userProgressId: userProgress.id,
              topic,
            },
          },
          create: {
            userProgressId: userProgress.id,
            topic,
            attempted: t.attempted || 0,
            completed: t.completed || 0,
          },
          update: {
            attempted: t.attempted || 0,
            completed: t.completed || 0,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface DbUserProgress {
  id: string;
  userId: string;
  dayStreak: number;
  lastActiveDate: string | null;
  totalProblemsAttempted: number;
  totalProblemsCompleted: number;
  problemProgress: Array<{
    problemId: string;
    status: string;
    attempts: number;
    lastAttempted: string | null;
    notes: string | null;
    hintsUsed: string;
    completedAt: string | null;
  }>;
  topicProgress: Array<{
    topic: string;
    attempted: number;
    completed: number;
  }>;
}

function formatProgress(dbProgress: DbUserProgress) {
  const problems: Record<string, {
    problemId: string;
    status: string;
    attempts: number;
    lastAttempted: string;
    notes?: string;
    hintsUsed: number[];
    completedAt?: string;
  }> = {};
  
  for (const p of dbProgress.problemProgress) {
    problems[p.problemId] = {
      problemId: p.problemId,
      status: p.status,
      attempts: p.attempts,
      lastAttempted: p.lastAttempted || "",
      notes: p.notes || undefined,
      hintsUsed: JSON.parse(p.hintsUsed || "[]"),
      completedAt: p.completedAt || undefined,
    };
  }

  const topicProgress: Record<string, { attempted: number; completed: number }> = {};
  for (const t of dbProgress.topicProgress) {
    topicProgress[t.topic] = {
      attempted: t.attempted,
      completed: t.completed,
    };
  }

  return {
    dayStreak: dbProgress.dayStreak,
    lastActiveDate: dbProgress.lastActiveDate || "",
    totalProblemsAttempted: dbProgress.totalProblemsAttempted,
    totalProblemsCompleted: dbProgress.totalProblemsCompleted,
    problems,
    topicProgress,
  };
}
