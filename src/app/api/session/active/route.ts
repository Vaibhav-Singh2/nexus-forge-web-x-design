import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the user by email to get ID
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check for active exam session
    const activeSession = await db.examSession.findFirst({
      where: {
        userId: user.id,
        status: { in: ["IN_PROGRESS", "DISTRESS"] },
      },
      include: {
        journey: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(activeSession || null);
  } catch (error) {
    console.error("[SESSION_ACTIVE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
