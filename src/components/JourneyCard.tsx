"use client";

import Link from "next/link";
import { Lock, Mountain, Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Journey = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  totalQuestions: number;
  prerequisiteId: string | null;
  minScoreToUnlock: number;
};

type JourneyCardProps = {
  journey: Journey;
  type: string;
  isActive: boolean;
  isLocked: boolean;
  href: string;
  journeys: Journey[];
};

export function JourneyCard({
  journey,
  type,
  isActive,
  isLocked,
  href,
  journeys,
}: JourneyCardProps) {
  const prerequisiteJourney = journeys.find(
    (j) => j.id === journey.prerequisiteId,
  );
  const unlockMessage = prerequisiteJourney
    ? `Complete "${prerequisiteJourney.title}" with ${journey.minScoreToUnlock}%+ to unlock`
    : null;

  return (
    <Link
      href={href}
      className={cn(
        "group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-70",
        isActive
          ? "bg-white border-horizon-blue shadow-lg ring-1 ring-horizon-blue/20"
          : isLocked
            ? "bg-stone-gray/5 border-stone-gray/20 cursor-not-allowed opacity-70"
            : "bg-white border-stone-gray/20 hover:border-horizon-blue hover:shadow-lg hover:-translate-y-1",
      )}
      aria-disabled={isLocked}
      onClick={(e) => {
        if (isLocked) e.preventDefault();
      }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Mountain
          className={cn(
            "w-24 h-24",
            isActive ? "text-horizon-blue" : "text-deep-shale",
          )}
          strokeWidth={0.5}
        />
      </div>

      {/* Top: Metadata */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-semibold tracking-wider uppercase px-2 py-1 rounded",
              isActive
                ? "bg-horizon-blue text-white shadow-sm"
                : isLocked
                  ? "bg-stone-gray/20 text-deep-shale/50"
                  : "bg-horizon-blue/10 text-horizon-blue",
            )}
          >
            {isActive ? "In Progress" : type}
          </span>
          {isLocked && <Lock className="w-4 h-4 text-deep-shale/40" />}
        </div>

        <div>
          <h2 className="text-2xl font-serif text-deep-shale mb-2 group-hover:text-horizon-blue transition-colors">
            {journey.title}
          </h2>
          <p className="text-sm text-deep-shale/70 leading-relaxed">
            {journey.description}
          </p>
          {isLocked && unlockMessage && (
            <p className="text-xs text-deep-shale/50 italic mt-2 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {unlockMessage}
            </p>
          )}
        </div>
      </div>

      {/* Bottom: Stats & Action */}
      <div className="relative z-10 pt-8 flex items-center justify-between border-t border-stone-gray/10 mt-6">
        <div className="flex items-center gap-4 text-sm text-deep-shale/60">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{journey.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{journey.totalQuestions} waypoints</span>
          </div>
        </div>

        {!isLocked && (
          <ArrowRight
            className={cn(
              "w-5 h-5 transition-transform group-hover:translate-x-1",
              isActive ? "text-horizon-blue" : "text-deep-shale/40",
            )}
          />
        )}
      </div>
    </Link>
  );
}
