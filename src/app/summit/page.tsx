import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import SummitClient from "./SummitClient";

export default async function SummitPage() {
  const session = await auth();
  if (!session?.user?.email) return redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return redirect("/login");

  // Check for session (IN_PROGRESS or COMPLETED?)
  // If we are showing this page, status might still be IN_PROGRESS or just COMPLETED.
  // But strictly, we arrive here when last step done.
  const examSession = await db.examSession.findFirst({
    where: { userId: user.id, status: { in: ["IN_PROGRESS", "COMPLETED"] } },
    include: { journey: true },
    orderBy: { startTime: "desc" },
  });

  if (!examSession) return redirect("/atlas");

  return (
    <SummitClient
      sessionId={examSession.id}
      totalQuestions={examSession.journey.totalQuestions || 30}
      score={examSession.score}
      totalPoints={examSession.totalPoints}
    />
  );
}
