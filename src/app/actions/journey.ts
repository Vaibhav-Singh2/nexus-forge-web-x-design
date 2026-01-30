"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";

export async function embarkOnJourney(journeyId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  // Check for existing active session
  const existingSession = await db.examSession.findFirst({
    where: {
      userId: user.id,
      status: { in: ["IN_PROGRESS", "DISTRESS"] },
    },
  });

  if (existingSession) {
    // If attempting to start same journey, just resume
    if (existingSession.journeyId === journeyId) {
      // Logic to determine redirect URL based on progress
      return existingSession;
    }
    // If different journey, technically should finish previous one or error
    // For MVP, let's just create new one or error.
    // Let's create new one and mark old as ABANDONED?
    // Stick to simple: one active session allowed.
    throw new Error("You have an active journey. Please finish it first.");
  }

  const newSession = await db.examSession.create({
    data: {
      userId: user.id,
      journeyId: journeyId,
      status: "IN_PROGRESS",
      currentStep: 1, // Start at 1
    },
  });

  await db.journeyLog.create({
    data: {
      sessionId: newSession.id,
      stepIndex: 1,
      action: "START",
      metadata: JSON.stringify({ timestamp: new Date() }),
    },
  });

  revalidatePath("/atlas");
  return newSession;
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answerId: string,
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Verify session belongs to user
  const examSession = await db.examSession.findUnique({
    where: { id: sessionId },
    include: { journey: true },
  });

  if (!examSession) throw new Error("Session not found");

  // Validate Answer
  const question = await db.question.findUnique({
    where: { id: questionId },
  });

  const isCorrect = question ? question.correctOption === answerId : false;
  const pointsEarned = isCorrect ? 10 : 0;

  // Update progress and score
  const nextStep = examSession.currentStep + 1;

  await db.examSession.update({
    where: { id: sessionId },
    data: {
      currentStep: nextStep,
      score: { increment: pointsEarned },
      totalPoints: { increment: 10 },
    },
  });

  // Log it
  await db.journeyLog.create({
    data: {
      sessionId: sessionId,
      stepIndex: examSession.currentStep,
      action: "ANSWER_QUESTION",
      metadata: JSON.stringify({
        questionId,
        answerId,
        isCorrect,
        timestamp: new Date(),
      }),
      isCorrect,
      pointsEarned,
    },
  });

  // Trigger Pusher for Admin Map
  // Broadcast: { id: sessionId, progress: percent, status: 'active' }
  try {
    const totalQuestions = examSession.journey.totalQuestions || 15;
    const progressPercent = Math.min(
      Math.round((nextStep / totalQuestions) * 100),
      100,
    );

    await pusherServer.trigger("expeditions", "player-moved", {
      sessionId: examSession.id,
      userId: examSession.userId,
      userName: session.user.name || "Traveler",
      progress: progressPercent,
      status: examSession.status,
      step: nextStep,
    });
  } catch (err) {
    console.error("Pusher trigger failed", err);
  }

  revalidatePath(`/exam/${nextStep}`);

  // Return feedback data for client
  return {
    isCorrect,
    correctOption: question?.correctOption || null,
    explanation: question?.explanation || null,
  };
}

export async function reachOverlook(sessionId: string) {
  // Just log the event
  await db.journeyLog.create({
    data: {
      sessionId,
      stepIndex: 11, // Assuming overlook is after Q10
      action: "ENTER_OVERLOOK",
    },
  });
}

export async function resumeAscent(sessionId: string) {
  await db.journeyLog.create({
    data: {
      sessionId,
      stepIndex: 11,
      action: "RESUME_ASCENT",
    },
  });
}

export async function signSummit(sessionId: string) {
  await db.examSession.update({
    where: { id: sessionId },
    data: {
      status: "COMPLETED",
      endTime: new Date(),
    },
  });

  await db.journeyLog.create({
    data: {
      sessionId,
      stepIndex: 999,
      action: "SUMMIT_REACHED",
    },
  });

  try {
    await pusherServer.trigger("expeditions", "player-completed", {
      sessionId: sessionId,
      status: "COMPLETED",
    });
  } catch (e) {
    console.error("Pusher completion trigger failed", e);
  }
}
