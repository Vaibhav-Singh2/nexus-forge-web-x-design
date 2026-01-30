import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    // In real app, check role === 'ADMIN'
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch active sessions
    const activeSessions = await db.examSession.findMany({
      where: {
        status: { in: ["IN_PROGRESS", "DISTRESS"] },
      },
      include: {
        user: { select: { name: true, image: true, email: true } },
        journey: { select: { title: true, totalQuestions: true } },
      },
      orderBy: { startTime: "desc" },
    });

    // Transform for UI
    const mapData = activeSessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      name: s.user.name || "Traveler",
      exam: s.journey.title,
      progress: Math.round(
        (s.currentStep / (s.journey.totalQuestions || 1)) * 100,
      ),
      status: s.status === "DISTRESS" ? "distress" : "active",
      velocity: "steady", // Mock velocity for now
      lastActive: s.startTime, // approximate
    }));

    return NextResponse.json(mapData);
  } catch (error) {
    console.error("[ADMIN_MAP_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
