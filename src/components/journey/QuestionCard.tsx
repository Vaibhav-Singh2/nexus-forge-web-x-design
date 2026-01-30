"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
  className?: string;
}

export function QuestionCard({
  question,
  options,
  selectedOptionId,
  onSelect,
  className,
}: QuestionCardProps) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-8", className)}>
      {/* Question Stem */}
      <h2 className="text-2xl md:text-3xl font-serif text-deep-shale leading-tight animate-gentle-drift">
        {question}
      </h2>

      {/* Options Stack */}
      <div className="space-y-4" role="radiogroup">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(option.id)}
              className={cn(
                "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group touch-manipulation",
                isSelected
                  ? "border-horizon-blue bg-white shadow-md"
                  : "border-stone-gray/30 bg-white/40 hover:bg-white hover:border-stone-gray/60",
              )}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(option.id);
                }
              }}
            >
              <div className="flex items-center gap-4 relative z-10">
                {/* Custom Radio / Marker */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 shrink-0",
                    isSelected
                      ? "border-horizon-blue bg-horizon-blue text-white"
                      : "border-stone-gray group-hover:border-deep-shale/40",
                  )}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  )}
                </div>

                {/* Text */}
                <span
                  className={cn(
                    "text-lg font-medium transition-colors",
                    isSelected ? "text-deep-shale" : "text-deep-shale/80",
                  )}
                >
                  {option.text}
                </span>
              </div>

              {/* The Watercolor Watch (Bloom Effect) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    layoutId="watercolor-bloom"
                    className="absolute inset-0 bg-horizon-blue/5 rounded-xl -z-0 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
