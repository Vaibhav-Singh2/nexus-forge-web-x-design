import Link from "next/link";
import {
  Map,
  Mountain,
  Clock,
  Lock,
  ArrowRight,
  Compass,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getJourneys } from "@/lib/data";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
            <Link
              key={journey.id}
              href={href}
              className={cn(
                "group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-70",
                isActive
                  ? "bg-white border-horizon-blue shadow-lg ring-1 ring-horizon-blue/20"
                  : isLocked
                    ? "bg-stone-gray/5 border-stone-gray/20 cursor-not-allowed opacity-70"
                    : "bg-white border-stone-gray/20 hover:border-horizon-blue hover:shadow-lg hover:-translate-y-1",
              )}
              aria-disabled={isLocked}
              onClick={(e) => {
                if (isLocked) e.preventDefault();
              }}
            >
              {/* Background Decor */}
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mountain
                  className={cn(
                    "w-24 h-24",
                    isActive ? "text-horizon-blue" : "text-deep-shale",
                  )}
                  strokeWidth={0.5}
                />
              </div>

              {/* Top: Metadata */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wider uppercase px-2 py-1 rounded",
                      isActive
                        ? "bg-horizon-blue text-white shadow-sm"
                        : isLocked
                          ? "bg-stone-gray/20 text-deep-shale/50"
                          : "bg-horizon-blue/10 text-horizon-blue",
                    )}
                  >
                    {isActive ? "In Progress" : type}
                  </span>
                  {isLocked && <Lock className="w-4 h-4 text-deep-shale/40" />}
                </div>

                <div>
                  <h2 className="text-2xl font-serif text-deep-shale mb-2 group-hover:text-horizon-blue transition-colors">
                    {journey.title}
                  </h2>
                  <p className="text-sm text-deep-shale/70 leading-relaxed">
                    {journey.description}
                  </p>
                  {isLocked && unlockMessage && (
                    <p className="text-xs text-deep-shale/50 italic mt-2 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {unlockMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom: Stats & Action */}
              <div className="relative z-10 pt-8 flex items-center justify-between border-t border-stone-gray/10 mt-6">
                <div className="flex items-center gap-4 text-sm text-deep-shale/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {journey.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Map className="w-4 h-4" /> {journey.difficulty}
                  </span>
                </div>

                {!isLocked ? (
                  <div
                    className={cn(
                      "flex items-center gap-2 font-medium text-sm group-hover:translate-x-1 transition-transform",
                      isActive
                        ? "text-horizon-blue"
                        : "text-deep-shale/60 group-hover:text-horizon-blue",
                    )}
                  >
                    <span>{isActive ? "Resume Expedition" : "View Trail"}</span>
                    {isActive ? (
                      <PlayCircle className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-deep-shale/40 italic">
                    Route Closed
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
