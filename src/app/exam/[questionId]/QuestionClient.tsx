"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitAnswer } from "@/app/actions/journey";
import { Question } from "@prisma/client";

type QuestionClientProps = {
  question: Question;
  sessionId: string;
  currentStep: number;
  totalQuestions: number;
};

export default function QuestionClient({
  question,
  sessionId,
  currentStep,
  totalQuestions,
}: QuestionClientProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse options if they are stringified JSON
  type Option = { id: string; text: string };
  let options: Option[] = [];
  try {
    if (typeof question.options === "string") {
      const parsed = JSON.parse(question.options);
      if (Array.isArray(parsed)) {
        options = parsed as Option[];
      } else {
        // Handle legacy/fallback object format if needed, but primary is Array
        options = Object.entries(parsed as Record<string, string>).map(
          ([id, text]) => ({ id, text }),
        );
      }
    }
  } catch (e) {
    console.error("Failed to parse options", e);
  }

  const handleOptionSelect = (key: string) => {
    if (isSubmitting) return;
    setSelectedOption(key);
  };

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await submitAnswer(sessionId, question.id, selectedOption);

      // Navigation Logic
      // If step 10, go to Overlook
      // If last step, go to Summit? No, usually summit is after last question.
      // Let's mirror the mock logic:
      // Mock: if (q.id === "10") -> /exam/overlook
      // Mock: if (nextId > 15) -> /exam/summit

      if (currentStep === 10) {
        router.push("/exam/overlook");
      } else if (currentStep >= totalQuestions) {
        router.push("/summit");
      } else {
        router.push(`/exam/${currentStep + 1}`);
      }
    } catch (e) {
      console.error("Submission failed", e);
      setIsSubmitting(false); // Enable retry
    }
  };

  return (
    <main className="min-h-screen bg-paper-mist flex flex-col pt-10 p-6 md:p-12 relative overflow-hidden justify-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-horizon-blue/20 to-sage-leaf/20" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Progress Header */}
        <header className="flex items-center justify-between mb-8 text-deep-shale/40 text-xs font-medium tracking-widest uppercase animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="text-horizon-blue">Waypoint {currentStep}</span>
            <span className="text-deep-shale/20">/</span>
            <span>{totalQuestions}</span>
          </div>
          <div>Altitude: {1000 + currentStep * 500}ft</div>
        </header>

        {/* Question Area */}
        <div
          className="space-y-8 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className="text-2xl md:text-3xl font-serif text-deep-shale leading-tight">
            {question.text}
          </h1>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {options.map((option, idx) => {
              const key = option.id;
              const value = option.text;
              const isSelected = selectedOption === key;

              return (
                <button
                  key={key}
                  onClick={() => handleOptionSelect(key)}
                  disabled={isSubmitting}
                  className={cn(
                    "group relative w-full p-4 text-left rounded-xl border transition-all duration-300 flex items-start gap-4",
                    isSelected
                      ? "bg-deep-shale text-paper-mist border-deep-shale shadow-lg scale-[1.01]"
                      : "bg-white border-stone-gray/20 hover:border-horizon-blue hover:shadow-md text-deep-shale",
                    isSubmitting &&
                      !isSelected &&
                      "opacity-50 cursor-not-allowed",
                  )}
                  style={{ animationDelay: `${200 + idx * 50}ms` }}
                >
                  <div className="mt-1 shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-paper-mist" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-gray/40 group-hover:text-horizon-blue transition-colors" />
                    )}
                  </div>
                  <div className="leading-relaxed font-light text-base">
                    {value}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inline Action Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300",
                selectedOption && !isSubmitting
                  ? "bg-horizon-blue text-white shadow-lg shadow-horizon-blue/20 hover:bg-horizon-blue/90 hover:scale-105"
                  : "bg-stone-gray/10 text-deep-shale/30 cursor-not-allowed",
              )}
            >
              <span>{isSubmitting ? "Ascending..." : "Confirm Choice"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
