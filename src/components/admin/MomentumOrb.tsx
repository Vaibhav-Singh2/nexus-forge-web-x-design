"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface CandidateStatus {
  id: string;
  name: string;
  progress: number; // 0-100
  velocity: "high" | "steady" | "stalled";
  status: "active" | "distress" | "idle";
}

interface MomentumOrbProps {
  candidate: CandidateStatus;
  onClick: (id: string) => void;
}

export function MomentumOrb({ candidate, onClick }: MomentumOrbProps) {
  // Determine color based on status/velocity
  const isDistress = candidate.status === "distress";
  // baseColor removed as it was unused and logic is handled inline below

  // Tail length based on velocity
  const tailWidth =
    candidate.velocity === "high"
      ? "w-16"
      : candidate.velocity === "steady"
        ? "w-8"
        : "w-0";

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
      style={{ left: `${candidate.progress}%` }}
    >
      <div
        className="relative group cursor-pointer"
        onClick={() => onClick(candidate.id)}
      >
        {/* The Momentum Tail (Comet Effect) */}
        {!isDistress && (
          <div
            className={cn(
              "absolute right-full top-1/2 -translate-y-1/2 h-0.5 rounded-l-full bg-linear-to-r from-transparent to-horizon-blue opacity-60 transition-all duration-500",
              tailWidth,
            )}
          />
        )}

        {/* Distress Beacon Pulse */}
        {isDistress && (
          <div className="absolute inset-0 -m-4 rounded-full border border-red-500/50 animate-ping" />
        )}

        {/* The Orb */}
        <motion.div
          className={cn(
            "relative z-10 rounded-full shadow-sm border-2 border-paper-mist transition-colors",
            isDistress ? "w-5 h-5 bg-red-500" : "w-4 h-4 bg-horizon-blue",
          )}
          layoutId={`orb-${candidate.id}`}
        >
          {isDistress && (
            <AlertCircle className="w-3 h-3 text-white absolute inset-0 m-auto" />
          )}
        </motion.div>

        {/* Tooltip (Name Tag) */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-deep-shale text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
          {candidate.name}
          <span className="opacity-60 ml-1">({candidate.progress}%)</span>
        </div>
      </div>
    </div>
  );
}
