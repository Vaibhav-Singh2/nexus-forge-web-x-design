import { db } from "@/lib/db";
import { cache } from "react";

// Cached data fetchers for Server Components

export const getJourneys = cache(async () => {
  return await db.journey.findMany({
    include: {
      _count: {
        select: { questions: true },
      },
      // If we had an 'image' field, we'd include it.
      // For now, mapping handled in UI or added to DB.
    },
    orderBy: {
      title: "asc",
    },
  });
});

export const getJourney = cache(async (id: string) => {
  return await db.journey.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { text: "asc" }, // or by some order field
      },
    },
  });
});

export const getQuestion = cache(async (id: string) => {
  return await db.question.findUnique({
    where: { id },
  });
});
