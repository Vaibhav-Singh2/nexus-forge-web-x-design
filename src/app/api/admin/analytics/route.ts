import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch analytics data
    const [
      totalSessions,
      activeSessions,
      completedSessions,
      totalUsers,
      allCompletedSessions,
    ] = await Promise.all([
      // Total sessions count
      db.examSession.count(),

      // Active sessions count
      db.examSession.count({
        where: {
          status: { in: ["IN_PROGRESS", "DISTRESS"] },
        },
      }),

      // Completed sessions count
      db.examSession.count({
        where: {
          status: "COMPLETED",
        },
      }),

      // Total users
      db.user.count({
        where: {
          role: "STUDENT",
        },
      }),

      // All completed sessions with scores
      db.examSession.findMany({
        where: {
          status: "COMPLETED",
        },
        select: {
          score: true,
          totalPoints: true,
          journeyId: true,
        },
      }),
    ]);

    // Calculate average score
    const totalScore = allCompletedSessions.reduce(
      (sum, s) => sum + s.score,
      0,
    );
    const totalPossiblePoints = allCompletedSessions.reduce(
      (sum, s) => sum + s.totalPoints,
      0,
    );
    const averageScorePercent =
      totalPossiblePoints > 0
        ? Math.round((totalScore / totalPossiblePoints) * 100)
        : 0;

    // Calculate completion rate
    const completionRate =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    // Get journey names for analytics
    const journeys = await db.journey.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    const journeyMap = new Map(journeys.map((j) => [j.id, j.title]));

    // Journey-wise statistics
    const journeyStats = allCompletedSessions.reduce(
      (
        acc: Record<
          string,
          { count: number; totalScore: number; totalPoints: number }
        >,
        session,
      ) => {
        const journeyName = journeyMap.get(session.journeyId) || "Unknown";
        if (!acc[journeyName]) {
          acc[journeyName] = { count: 0, totalScore: 0, totalPoints: 0 };
        }
        acc[journeyName].count++;
        acc[journeyName].totalScore += session.score;
        acc[journeyName].totalPoints += session.totalPoints;
        return acc;
      },
      {},
    );

    const journeyAnalytics = Object.entries(journeyStats).map(
      ([name, stats]) => ({
        name,
        completions: stats.count,
        averageScore:
          stats.totalPoints > 0
            ? Math.round((stats.totalScore / stats.totalPoints) * 100)
            : 0,
      }),
    );

    return NextResponse.json({
      totalSessions,
      activeSessions,
      completedSessions,
      totalUsers,
      averageScorePercent,
      completionRate,
      journeyAnalytics,
    });
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
