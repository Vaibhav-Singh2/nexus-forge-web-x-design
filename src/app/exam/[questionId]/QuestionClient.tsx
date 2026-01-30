"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctOption: string | null;
  } | null>(null);

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
    if (isSubmitting || feedback) return;
    setSelectedOption(key);
  };

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting || feedback) return;

    setIsSubmitting(true);

    try {
      const result = await submitAnswer(sessionId, question.id, selectedOption);

      // Show feedback
      setFeedback({
        isCorrect: result.isCorrect,
        correctOption: result.correctOption,
      });

      // Wait 2 seconds before navigating
      setTimeout(() => {
        // Navigation Logic
        if (currentStep === 10) {
          router.push("/exam/overlook");
        } else if (currentStep >= totalQuestions) {
          router.push("/summit");
        } else {
          router.push(`/exam/${currentStep + 1}`);
        }
      }, 2000);
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

          {/* Options */}
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const is Correct = feedback && opt.id === feedback.correctOption;
              const isIncorrect = feedback && isSelected && !feedback.isCorrect;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={isSubmitting || !!feedback}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3",
                    isCorrect
                      ? "border-green-500 bg-green-50 text-green-900"
                      : isIncorrect
                        ? "border-red-500 bg-red-50 text-red-900"
                        : isSelected
                          ? "border-horizon-blue bg-horizon-blue/5 text-deep-shale"
                          : "border-stone-gray/20 hover:border-horizon-blue/50 text-deep-shale/80",
                    (isSubmitting || feedback) && "cursor-not-allowed",
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  ) : isIncorrect ? (
                    <Circle className="w-5 h-5 text-red-600 shrink-0" />
                  ) : isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-horizon-blue shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-gray shrink-0" />
                  )}
                  <span className="flex-1 font-medium">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={cn(
                "p-4 rounded-lg border-2 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                feedback.isCorrect
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900"
              )}
            >
              {feedback.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Correct!</p>
                    <p className="text-sm mt-1 text-green-800">
                      Well done. Moving to next question...
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Incorrect</p>
                    <p className="text-sm mt-1 text-red-800">
                      The correct answer was option {feedback.correctOption?.toUpperCase()}. Moving to next question...
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

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
