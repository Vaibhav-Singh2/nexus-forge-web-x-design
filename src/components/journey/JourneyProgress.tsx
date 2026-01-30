"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface JourneyProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  label?: string; // Optional narrative label e.g. "Distance Covered"
}

export function JourneyProgress({
  currentStep,
  totalSteps,
  className,
  label = "Journey Progress",
}: JourneyProgressProps) {
  // Ensure we don't divide by zero and clamp progress
  const safeTotal = Math.max(totalSteps, 1);
  const progressPercent = Math.min(
    Math.max((currentStep / safeTotal) * 100, 0),
    100,
  );

  return (
    <div
      className={cn("relative w-full flex flex-col gap-2", className)}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={0}
      aria-valuemax={totalSteps}
      aria-label={label}
    >
      {/* Narrative Label (Screen Reader Only usually, or subtle UI) */}
      <span className="sr-only">
        {label}: {currentStep} of {totalSteps} waypoints reached
      </span>

      {/* The Track (Future Path) */}
      <div className="relative h-1 w-full overflow-visible flex items-center">
        {/* Background Line (Dashed/Gray for unexplored terrain) */}
        <div className="absolute inset-0 h-[2px] w-full bg-stone-gray/50 lg:h-[3px]" />

        {/* The Path Traveled (Solid Blue) */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-horizon-blue lg:h-[3px]"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />

        {/* The Traveler (Dot Indicator) */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10"
          initial={{ left: "0%" }}
          animate={{ left: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="relative">
            {/* Core Dot */}
            <div className="h-3 w-3 rounded-full bg-horizon-blue ring-2 ring-paper-mist shadow-sm lg:h-4 lg:w-4" />

            {/* Pulse Effect (Breathing Life) */}
            <div className="absolute inset-0 animate-ping rounded-full bg-horizon-blue opacity-20 duration-1000" />

            {/* Momentum Trail (Subtle comet tail) */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent to-horizon-blue opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Waypoint Markers (Subtle Ticks) */}
      <div className="relative h-2 w-full mt-1 flex justify-between px-[1px] opacity-30">
        {Array.from({ length: totalSteps + 1 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 w-[1px] transition-colors duration-500",
              index <= currentStep ? "bg-horizon-blue" : "bg-deep-shale",
            )}
          />
        ))}
      </div>
    </div>
  );
}
