import { Compass } from "lucide-react";
import { getJourneys } from "@/lib/data";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { JourneyCard } from "@/components/JourneyCard";

export default async function AtlasPage() {
  const journeys = await getJourneys();
  const session = await auth();

  // Fetch active session if user is logged in
  let activeSession = null;
  let completedSessions: Array<{
    id: string;
    journeyId: string;
    score: number;
    totalPoints: number;
    status: string;
    journey: { id: string; prerequisiteId: string | null };
  }> = [];

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        sessions: {
          where: {
            status: "COMPLETED",
          },
          include: {
            journey: true,
          },
        },
      },
    });

    if (user) {
      completedSessions = user.sessions;
      activeSession = await db.examSession.findFirst({
        where: {
          userId: user.id,
          status: { in: ["IN_PROGRESS", "DISTRESS"] },
        },
      });
    }
  }

  // Helper function to check if journey is unlocked
  const isJourneyUnlocked = (journey: {
    id: string;
    prerequisiteId: string | null;
    minScoreToUnlock: number | null;
  }) => {
    // No prerequisite = always unlocked
    if (!journey.prerequisiteId) return true;

    // Find if prerequisite journey was completed
    const prerequisiteCompletion = completedSessions.find(
      (s) => s.journeyId === journey.prerequisiteId && s.status === "COMPLETED",
    );

    if (!prerequisiteCompletion) return false;

    // Check score requirement (percentage based)
    const scorePercent =
      prerequisiteCompletion.totalPoints > 0
        ? (prerequisiteCompletion.score / prerequisiteCompletion.totalPoints) *
          100
        : 0;

    return scorePercent >= (journey.minScoreToUnlock ?? 0);
  };

  return (
    <main className="min-h-screen bg-paper-mist p-6 md:p-12 animate-hero-reveal">
      {/* 1. Header: Orientation */}
      <header className="max-w-4xl mx-auto mb-12 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-deep-shale/60 text-sm font-medium tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>The Atlas</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-deep-shale">
            Choose Your Route
          </h1>
          <p className="text-deep-shale/70 font-light max-w-lg">
            Every journey begins with a choice. Select a path to view its
            details.
          </p>
        </div>

        {/* User Status / Weather (Decorative) */}
        <div className="hidden md:flex items-center gap-4 text-xs text-deep-shale/40 bg-white/50 px-4 py-2 rounded-full border border-stone-gray/10">
          <span>Visibility: Excellent</span>
          <span>•</span>
          <span>Temp: 72°F</span>
        </div>
      </header>

      {/* 2. Journey Grid */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {journeys.map((journey) => {
          const isLocked = !isJourneyUnlocked(journey);
          const type = "Expedition"; // Default type

          const isActive = activeSession?.journeyId === journey.id;

          // Determine Link Href
          let href = `/trail/${journey.id}`;
          if (isLocked) href = "#";
          if (isActive && activeSession) {
            // If active, go to current step (or overlook/summit logic)
            // Simplified: Go to current step
            // Needs logic: if session.currentStep > total -> Summit?
            // But for now, direct to current step is safe. QuestionPage handles redirects.
            href = `/exam/${activeSession.currentStep}`;
          }

          // Find prerequisite journey for displaying unlock message
          const prerequisiteJourney = journeys.find(
            (j) => j.id === journey.prerequisiteId,
          );
          const unlockMessage = prerequisiteJourney
            ? `Complete "${prerequisiteJourney.title}" with ${journey.minScoreToUnlock}%+ to unlock`
            : null;

          return (
            <JourneyCard
              key={journey.id}
              journey={journey}
              type={type}
              isActive={isActive}
              isLocked={isLocked}
              href={href}
              journeys={journeys}
            />
          );
        })}
      </section>
    </main>
  );
}
