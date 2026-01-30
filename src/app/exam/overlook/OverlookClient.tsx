"use client";

import { useRouter } from "next/navigation";
import { JourneyProgress } from "@/components/journey/JourneyProgress";
import { HoldToEmbark } from "@/components/journey/HoldToEmbark";
import { Mountain, Wind, Map } from "lucide-react";
import { resumeAscent } from "@/app/actions/journey";

type OverlookClientProps = {
  sessionId: string;
  currentStep: number;
  totalQuestions: number;
};

export default function OverlookClient({
  sessionId,
  currentStep,
  totalQuestions,
}: OverlookClientProps) {
  const router = useRouter();

  const handleResume = async () => {
    try {
      await resumeAscent(sessionId);
      // Navigate to next chapter/question
      // Assuming Overlook is always after Q10, so next is 11.
      // Or generic: currentStep.
      // If user is at Step 11 (waiting to start), we go to 11.
      router.push(`/exam/${currentStep}`);
    } catch (e) {
      console.error("Resume failed", e);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-warm-sand relative overflow-hidden transition-colors duration-1000">
      {/* 1. Breathing Space Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-150 rounded-full bg-white/40 animate-pulse-slow blur-3xl opacity-60" />
        <div className="absolute w-100 h-100 rounded-full bg-white/60 animate-pulse-slow blur-2xl opacity-40 delay-700" />
      </div>

      {/* 2. The Look Back (Content) */}
      <div className="relative z-10 w-full max-w-2xl px-6 space-y-12 text-center animate-gentle-drift">
        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-sm text-horizon-blue mb-6">
          <Mountain className="w-8 h-8" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-deep-shale">
            The Overlook
          </h1>
          <p className="text-lg text-deep-shale/70 font-light max-w-lg mx-auto">
            Leg 1 complete. Take a breath. The terrain changes ahead.
          </p>
        </div>

        {/* Progress Snapshot */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-stone-gray/10 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-sm text-deep-shale/60">
            <span className="flex items-center gap-2">
              <Map className="w-4 h-4" /> Waypoints Secured
            </span>
            <span>
              {currentStep - 1} / {totalQuestions}
            </span>
          </div>
          <JourneyProgress
            currentStep={currentStep - 1}
            totalSteps={totalQuestions}
            className="mb-2"
          />
        </div>

        {/* 3. The Look Ahead (Next Steps) */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-center gap-2 text-deep-shale/50 text-sm">
            <Wind className="w-4 h-4 animate-pulse" />
            <span>Next: Abstract Reasoning • ~15 Mins</span>
          </div>

          <div className="flex justify-center">
            <HoldToEmbark
              onComplete={handleResume}
              className="scale-110" // Make it slightly more prominent
            />
          </div>

          <p className="text-xs text-deep-shale/40">
            Slide or Hold to Resume Ascent
          </p>
        </div>
      </div>
    </main>
  );
}
