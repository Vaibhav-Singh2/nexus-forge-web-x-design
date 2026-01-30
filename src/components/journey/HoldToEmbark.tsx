"use client";

import React, { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface HoldToEmbarkProps {
  onComplete: () => void;
  className?: string;
}

export function HoldToEmbark({ onComplete, className }: HoldToEmbarkProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (isComplete) return;
    setIsHolding(true);

    // Start the fill animation
    controls.start({
      width: "100%",
      transition: { duration: 1.5, ease: "linear" },
    });

    // Set the trigger for completion
    timeoutRef.current = setTimeout(() => {
      setIsComplete(true);
      if (typeof window.navigator.vibrate === "function") {
        window.navigator.vibrate(50); // Haptic feedback
      }
      onComplete();
    }, 1500);
  };

  const cancelHold = () => {
    if (isComplete) return;
    setIsHolding(false);
    controls.stop();
    controls.start({ width: "0%", transition: { duration: 0.2 } });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <div
        className="relative overflow-hidden rounded-full bg-stone-gray/20 select-none touch-none cursor-pointer active:scale-95 transition-transform duration-200"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        role="button"
        tabIndex={0}
        aria-label="Hold to start exam"
      >
        {/* Background Fill Layer */}
        <motion.div
          className="absolute inset-0 bg-horizon-blue"
          initial={{ width: "0%" }}
          animate={controls}
        />

        {/* Text / Label Layer */}
        <div className="relative px-8 py-4 flex items-center justify-center gap-3 text-deep-shale font-medium z-10 sm:min-w-[280px]">
          {isComplete ? (
            <span className="text-white flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading Chapter...
            </span>
          ) : (
            <span
              className={cn(
                "transition-colors duration-200",
                isHolding ? "text-white" : "text-deep-shale",
              )}
            >
              Hold to Embark
            </span>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-3 text-center text-sm text-deep-shale/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Press and hold for 1.5 seconds
      </p>
    </div>
  );
}
