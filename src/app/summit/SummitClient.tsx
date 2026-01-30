"use client";

import { useRouter } from "next/navigation";
import { SummitMap } from "@/components/journey/SummitMap";
import { SignOffSeal } from "@/components/journey/SignOffSeal";
import { Trophy, Footprints } from "lucide-react";
import { signSummit } from "@/app/actions/journey";

type SummitClientProps = {
  sessionId: string;
  totalQuestions: number;
  score: number;
  totalPoints: number;
};

export default function SummitClient({
  sessionId,
  totalQuestions,
  score,
  totalPoints,
}: SummitClientProps) {
  const router = useRouter();

  const handleReturnToBase = () => {
    router.push("/atlas");
  };

  const handleSignOff = async () => {
    try {
      await signSummit(sessionId);
      handleReturnToBase();
    } catch (e) {
      console.error("Sign off failed", e);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-6 bg-paper-mist animate-hero-reveal">
      {/* 1. Header: The Peak */}
      <div className="w-full max-w-2xl text-center space-y-4 mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-deep-shale">
          Ascent Complete
        </h1>
        <p className="text-lg text-deep-shale/70 font-light">
          You have successfully navigated all chapters.
        </p>
      </div>

      {/* 2. Completion Visuals */}
      <div className="w-full max-w-2xl space-y-8 mb-12">
        {/* The Map Recap */}
        <SummitMap />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-gray/10 flex flex-col items-center">
            <Footprints className="w-6 h-6 text-horizon-blue mb-2" />
            <span className="text-sm text-deep-shale/60">Distance</span>
            <span className="text-lg font-medium">
              {totalQuestions}/{totalQuestions} Waypoints
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-gray/10 flex flex-col items-center">
            <Trophy className="w-6 h-6 text-sage-leaf mb-2" />
            <span className="text-sm text-deep-shale/60">Score</span>
            <span className="text-lg font-medium">
              {score}/{totalPoints}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-gray/10 flex flex-col items-center">
            <Trophy className="w-6 h-6 text-sage-leaf mb-2" />
            <span className="text-sm text-deep-shale/60">Performance</span>
            <span className="text-lg font-medium">
              {totalPoints > 0
                ? Math.round((score / totalPoints) * 100) >= 80
                  ? "Excellent"
                  : Math.round((score / totalPoints) * 100) >= 60
                    ? "Good"
                    : "Fair"
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. The Endorsement (Closing) */}
      <div className="w-full max-w-md bg-white/50 border border-stone-gray/20 rounded-2xl p-8 text-center space-y-8 backdrop-blur-sm">
        <p className="text-deep-shale italic font-serif text-lg leading-relaxed">
          {`"The path is behind you. Your progress has been securely recorded.
          Take pride in the climb."`}
        </p>

        {/* The Signature Interaction */}
        <div className="flex justify-center pb-4">
          <SignOffSeal onComplete={handleSignOff} />
        </div>

        <button
          onClick={handleReturnToBase}
          className="text-sm text-horizon-blue hover:text-deep-shale underline underline-offset-4 transition-colors"
        >
          Return to Base Camp without Signing
        </button>
      </div>
    </main>
  );
}
