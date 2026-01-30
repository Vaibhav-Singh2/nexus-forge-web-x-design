import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import OverlookClient from "./OverlookClient";

export default async function OverlookPage() {
  const session = await auth();
  if (!session?.user?.email) return redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return redirect("/login");

  const examSession = await db.examSession.findFirst({
    where: { userId: user.id, status: "IN_PROGRESS" },
    include: { journey: true },
  });

  if (!examSession) return redirect("/atlas");

  // TODO: Validate if they should be at overlook
  // e.g. if currentStep !== 11 return redirect(...)

  return (
    <OverlookClient
      sessionId={examSession.id}
      currentStep={examSession.currentStep}
      totalQuestions={examSession.journey.totalQuestions || 30}
    />
  );
}
