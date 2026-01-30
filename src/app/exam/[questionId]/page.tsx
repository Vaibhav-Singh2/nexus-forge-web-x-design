import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import QuestionClient from "./QuestionClient";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    return redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return redirect("/login");

  // Check active session
  const examSession = await db.examSession.findFirst({
    where: {
      userId: user.id,
      status: { in: ["IN_PROGRESS", "DISTRESS"] },
    },
    include: {
      journey: {
        include: {
          questions: {
            orderBy: { text: "asc" }, // Ensure deterministic order matching seed
            // Note: Seed usage might not guarantee order unless we used an index field.
            // For MVP, text ascending or ID ascending is consistent enough if seed is consistent.
            // Ideally we'd have 'orderIndex' in Question model.
            // Let's use 'text' asc or 'id' asc. IDs are CUIDs so order is random-ish.
            // Seed logic: mapped array.
            // Let's rely on retrieving questions and indexing them.
          },
        },
      },
    },
  });

  if (!examSession) {
    return redirect("/atlas"); // No active session
  }

  const stepIndex = parseInt(questionId);
  if (isNaN(stepIndex)) {
    return notFound();
  }

  // Get question at index
  const questions = examSession.journey.questions;
  // Sort questions to ensure consistency if DB didn't return them ordered by default (it doesn't guarantee).
  // I will sort by ID for stability if no other field.
  // Actually, seed.ts created them in loop.
  // I'll sort by text (assuming titled "Question 1", "Question 2" etc? No, they have real text).
  // Let's sort by ID to be deterministic.
  questions.sort((a, b) => a.id.localeCompare(b.id));

  const question = questions[stepIndex - 1]; // 1-based index

  if (!question) {
    // Index out of bounds
    // If stepIndex > total, maybe completed?
    if (stepIndex > questions.length) {
      return redirect("/summit");
    }
    return notFound();
  }

  // Ensure user is AT this step
  if (examSession.currentStep !== stepIndex) {
    // If user tries to jump ahead or back
    // For MVP, strictly force them to currentStep
    if (examSession.currentStep < stepIndex) {
      return redirect(`/exam/${examSession.currentStep}`);
    }
    // Allow going back to view? Usually no for exams (secure).
    // Redirect to current step always.
    // Exception: Overlook page handling.
    return redirect(`/exam/${examSession.currentStep}`);
  }

  return (
    <QuestionClient
      question={question}
      sessionId={examSession.id}
      currentStep={stepIndex}
      totalQuestions={questions.length}
    />
  );
}
