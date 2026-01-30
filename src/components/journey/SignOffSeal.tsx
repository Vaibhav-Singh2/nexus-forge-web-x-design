"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {  ShieldCheck } from "lucide-react";

interface SignOffSealProps {
  onComplete: () => void;
  className?: string;
}

export function SignOffSeal({ onComplete, className }: SignOffSealProps) {
  const [isSigned, setIsSigned] = useState(false);

  const handleSign = () => {
    if (isSigned) return;
    setIsSigned(true);
    // Slight delay for the stamp animation to hit before callback
    setTimeout(onComplete, 800);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <motion.button
        onClick={handleSign}
        disabled={isSigned}
        className={cn(
          "relative w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-300",
          isSigned
            ? "border-sage-leaf bg-sage-leaf/10 dark:bg-sage-leaf/20 shadow-inner"
            : "border-stone-gray hover:border-horizon-blue hover:bg-white cursor-pointer active:scale-95",
        )}
        aria-label="Sign off and complete journey"
        whileTap={!isSigned ? { scale: 0.9 } : {}}
      >
        {!isSigned ? (
          <div className="text-center">
            <span className="block text-xs font-serif text-deep-shale/60 uppercase tracking-widest mb-1">
              Sign
            </span>
            <span className="block text-2xl font-serif text-deep-shale">
              Here
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 2, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <ShieldCheck
              className="w-16 h-16 text-sage-leaf"
              strokeWidth={1.5}
            />
          </motion.div>
        )}
      </motion.button>

      <p className="text-sm text-deep-shale/50 italic">
        {isSigned
          ? "Journey Verified"
          : "Click to officially complete your ascent"}
      </p>
    </div>
  );
}
