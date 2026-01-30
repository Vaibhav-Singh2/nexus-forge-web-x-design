import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const journeys = await db.journey.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        title: "asc",
      },
    });

    return NextResponse.json(journeys);
  } catch (error) {
    console.error("[JOURNEYS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
