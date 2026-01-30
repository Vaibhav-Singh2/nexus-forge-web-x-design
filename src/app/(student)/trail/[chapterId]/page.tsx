"use client";

import { Map, Clock, FileText, CheckCircle2, LucideIcon } from "lucide-react";
import { HoldToEmbark } from "@/components/journey/HoldToEmbark";
import { useRouter, useParams } from "next/navigation";
import JOURNEYS from "@/data/journeys.json";

// Map string labels to Lucide icons
const ICONS: Record<string, LucideIcon> = {
  "Est. Duration": Clock,
  Waypoints: FileText,
  Terrain: Map,
};

export default function TrailheadPage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = Array.isArray(params.chapterId)
    ? params.chapterId[0]
    : params.chapterId;

  // Find the journey or fallback to the first one
  const journey = JOURNEYS.find((j) => j.id === chapterId) || JOURNEYS[0];

  const handleEmbark = () => {
    // Navigate to the first question (e.g., waypoint 1)
    setTimeout(() => {
      router.push(`/exam/1`); // In a real app, this might be dynamic based on journey start
    }, 500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* A. The Horizon (Header) */}
      <div
        className="w-full max-w-2xl text-center space-y-4 mb-12 animate-gentle-drift"
        style={{ animationDelay: "0ms" }}
      >
        <h2 className="text-sm font-medium tracking-widest text-deep-shale/60 uppercase">
          Chapter {journey.id}
        </h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-deep-shale">
          {journey.title}
        </h1>
        <p className="text-lg text-deep-shale/80 font-light max-w-lg mx-auto leading-relaxed">
          {journey.description}
        </p>
      </div>

      {/* B. The Route Map (Stats) */}
      <div
        className="flex flex-wrap justify-center gap-6 mb-12 animate-gentle-drift opacity-0"
        style={{ animationDelay: "200ms" }}
      >
        {journey.stats.map((stat, idx) => {
          const Icon = ICONS[stat.label] || Map;
          return (
            <div
              key={idx}
              className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-stone-gray/30 min-w-30"
            >
              <Icon
                className="w-6 h-6 text-horizon-blue mb-2"
                strokeWidth={1.5}
              />
              <span className="text-sm text-deep-shale/60">{stat.label}</span>
              <span className="text-lg font-medium text-deep-shale">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* C. The Gear Check & Commitment */}
      <div
        className="w-full max-w-md space-y-8 animate-gentle-drift opacity-0"
        style={{ animationDelay: "400ms" }}
      >
        {/* Status List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-gray/20">
          <ul className="space-y-4">
            {journey.gearChecks.map((check, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-deep-shale/80"
              >
                <CheckCircle2 className="w-5 h-5 text-sage-leaf" />
                <span>{check.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* D. The Commitment */}
        <div className="flex justify-center pt-4">
          <HoldToEmbark onComplete={handleEmbark} />
        </div>

        <p className="text-xs text-center text-deep-shale/40 pt-8">
          Your time begins only after you cross the threshold.
        </p>
      </div>
    </main>
  );
}
