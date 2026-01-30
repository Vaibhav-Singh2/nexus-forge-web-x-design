import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: sessionId } = await params;
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // params.id here is the USER ID or SESSION ID?
    // Route is /admin/traveler/[id]. Usually ID refers to User or specific Session.
    // Let's assume ID is Session ID to be specific, or User ID to find latest session.
    // The Admin UI links to /admin/traveler/[id] from the map Orb. The Orb has ID=sessionId usually.
    // Let's assume it's Session ID.

    // BUT wait, candidates.json used "1", "2" which looked like User IDs.
    // If we click an Orb, we want that specific Expedition.
    // const sessionId = params.id; // handled above

    const examSession = await db.examSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        journey: true,
        logs: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!examSession) {
      return new NextResponse("Session not found", { status: 404 });
    }

    return NextResponse.json(examSession);
  } catch (error) {
    console.error("[ADMIN_TRAVELER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
