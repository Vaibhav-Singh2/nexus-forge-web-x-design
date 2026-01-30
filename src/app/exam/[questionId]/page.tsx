"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { JourneyProgress } from "@/components/journey/JourneyProgress";
import { QuestionCard } from "@/components/journey/QuestionCard";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Sun, Map } from "lucide-react";
import QUESTIONS_DB from "@/data/questions.json";
import JOURNEYS from "@/data/journeys.json";

export default function QuestionPage() {
  const router = useRouter();
  const params = useParams(); // Using hook for safer client-side access
  const questionId = Array.isArray(params.questionId)
    ? params.questionId[0]
    : params.questionId;
  const currentId = parseInt(questionId || "1");

  // Find current question or fallback
  const questionData =
    QUESTIONS_DB.find((q) => q.id === questionId) || QUESTIONS_DB[0];

  // Get Journey context (assuming all questions belong to the same active journey for this mock)
  // In a real app, we'd fetch the journey based on the question's journeyId or a URL param
  const journey =
    JOURNEYS.find((j) => j.id === questionData.journeyId) || JOURNEYS[0];
  const totalQuestions = journey.totalQuestions;

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Define handleNext before usage
  const handleNext = React.useCallback(() => {
    if (!selectedOption) return;

    setIsTransitioning(true);

    // Simulate "Drift" Transition delay
    setTimeout(() => {
      const nextId = currentId + 1;

      // Insight: The Overlook (Section Break) logic
      // Hardcoded for now as "after 10" or "halfway"
      if (nextId === 11 && totalQuestions > 10) {
        router.push("/exam/overlook");
      } else if (nextId > totalQuestions) {
        router.push("/summit");
      } else {
        router.push(`/exam/${nextId}`);
      }
    }, 400);
  }, [selectedOption, currentId, totalQuestions, router]);

  // Keyboard Navigation: Enter to Lock In
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedOption && !isTransitioning) {
        handleNext(); // Now safe to use
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOption, isTransitioning, handleNext]);

  const handleBack = () => {
    if (currentId > 1) {
      router.back();
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col bg-paper-mist relative transition-opacity duration-300"
      style={{ opacity: isTransitioning ? 0 : 1 }}
    >
      {/* A. The Sky (Header) */}
      <header className="fixed top-0 left-0 right-0 bg-paper-mist/90 backdrop-blur-sm z-50 border-b border-stone-gray/20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-deep-shale/60 text-sm font-medium">
            <Map className="w-4 h-4" />
            <span>
              Chapter {journey.id}: {journey.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-deep-shale/60">
            <Sun className="w-4 h-4" />
            <span className="text-sm">Daylight Remaining</span>
          </div>
        </div>

        {/* Topographic Line Progress */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 pb-2">
          <JourneyProgress
            currentStep={currentId}
            totalSteps={totalQuestions}
          />
        </div>
      </header>

      {/* B. The Focus (Content) */}
      <section className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 flex flex-col justify-center mt-20 mb-20">
        <QuestionCard
          question={questionData.question}
          options={questionData.options}
          selectedOptionId={selectedOption}
          onSelect={setSelectedOption}
        />
      </section>

      {/* C. The Compass (Navigation Footer) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-paper-mist/90 backdrop-blur-md border-t border-stone-gray/20 p-4 md:p-6 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Back (Retrace) */}
          <button
            onClick={handleBack}
            disabled={currentId === 1}
            className="flex items-center gap-2 text-deep-shale/40 hover:text-deep-shale transition-colors disabled:opacity-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retrace</span>
          </button>

          {/* Next (Commit Step) */}
          <button
            onClick={handleNext}
            disabled={!selectedOption || isTransitioning}
            className={cn(
              "flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-sm",
              selectedOption
                ? "bg-horizon-blue text-white hover:bg-horizon-blue/90 hover:shadow-md translate-y-0"
                : "bg-stone-gray/20 text-deep-shale/20 cursor-not-allowed translate-y-1",
            )}
          >
            <span>Commit Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}
