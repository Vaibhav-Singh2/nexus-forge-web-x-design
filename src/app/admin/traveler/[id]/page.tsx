"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  Activity,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CANDIDATES from "@/data/candidates.json";

const STAGES = [
  { id: "base_camp", label: "Base Camp", icon: Shield },
  { id: "trailhead", label: "The Trailhead", icon: MapPin },
  { id: "path", label: "The Path", icon: Activity },
  { id: "overlook", label: "The Overlook", icon: MapPin },
  { id: "summit", label: "The Summit", icon: CheckCircle2 },
];

import { useParams } from "next/navigation";

export default function TravelerLogPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Find candidate or use fallback
  const traveler = CANDIDATES.find((c) => c.id === id) || CANDIDATES[0];

  const getCurrentStageIndex = (stageLabel: string) => {
    return STAGES.findIndex((s) => s.label === stageLabel);
  };

  const currentStageIndex = getCurrentStageIndex(traveler.currentStage);

  return (
    <main className="min-h-screen bg-paper-mist p-6 md:p-12 animate-hero-reveal">
      {/* 1. Navigation */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-deep-shale/60 hover:text-horizon-blue mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Return to Command Center</span>
      </Link>

      {/* 2. Header Card */}
      <div className="bg-white rounded-2xl border border-stone-gray/20 p-6 md:p-8 mb-12 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-gray/10 flex items-center justify-center text-deep-shale/40">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-deep-shale mb-1">
              {traveler.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-deep-shale/60">
              <span className="bg-stone-gray/5 px-2 py-0.5 rounded border border-stone-gray/10 font-mono text-xs">
                ID: {traveler.id}
              </span>
              <span>•</span>
              <span>{traveler.exam}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-stone-gray/10 pt-4 md:pt-0 md:pl-8">
          <div>
            <div className="text-xs font-medium text-deep-shale/40 uppercase tracking-wider mb-1">
              Elapsed Time
            </div>
            <div className="flex items-center gap-2 text-xl font-medium text-deep-shale">
              <Clock className="w-5 h-5 text-horizon-blue" />
              {traveler.timeElapsed}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-deep-shale/40 uppercase tracking-wider mb-1">
              Velocity
            </div>
            <div className="flex items-center gap-2 text-xl font-medium text-deep-shale">
              <Activity className="w-5 h-5 text-sage-leaf" />
              Steady
            </div>
          </div>
        </div>
      </div>

      {/* 3. Journey Timeline */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-sm font-medium text-deep-shale/40 uppercase tracking-widest mb-8 pl-4">
          Expedition Log
        </h2>

        <div className="relative pl-4 md:pl-0">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6.75 top-4 bottom-12 w-0.5 bg-stone-gray/20" />

          <div className="space-y-12">
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isFuture = index > currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className="relative flex items-start gap-8 group"
                >
                  {/* Status Node */}
                  <div
                    className={cn(
                      "relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-paper-mist shrink-0",
                      isCompleted
                        ? "border-sage-leaf text-sage-leaf bg-white"
                        : isCurrent
                          ? "border-horizon-blue text-white bg-horizon-blue shadow-lg scale-110 ring-4 ring-horizon-blue/10"
                          : "border-stone-gray/20 text-stone-gray/30 bg-paper-mist",
                    )}
                  >
                    <stage.icon
                      className={cn("w-6 h-6", isCurrent && "animate-pulse")}
                      strokeWidth={isCurrent ? 2 : 1.5}
                    />

                    {/* Connector fix for bg overlap */}
                    {isCurrent && (
                      <div className="absolute -inset-1 rounded-full border border-horizon-blue/20 animate-ping opacity-20" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className={cn(
                      "flex-1 transition-all duration-500",
                      isFuture ? "opacity-30 blur-[0.5px]" : "opacity-100",
                    )}
                  >
                    <div
                      className={cn(
                        "p-6 rounded-2xl border transition-all duration-300",
                        isCurrent
                          ? "bg-white border-horizon-blue/30 shadow-md"
                          : isCompleted
                            ? "bg-white/60 border-stone-gray/10"
                            : "bg-transparent border-dashed border-stone-gray/20",
                      )}
                    >
                      <h3
                        className={cn(
                          "text-lg font-serif mb-1",
                          isCurrent ? "text-deep-shale" : "text-deep-shale/70",
                        )}
                      >
                        {stage.label}
                      </h3>

                      {/* Stage Details */}
                      {isCurrent && stage.id === "path" && (
                        <div className="mt-4">
                          <div className="w-full h-2 bg-stone-gray/10 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-horizon-blue transition-all duration-1000"
                              style={{ width: `${traveler.progress}%` }}
                            />
                          </div>
                          <p className="text-sm text-deep-shale/60 flex justify-between">
                            <span>
                              Waypoint {traveler.currentQuestion} of{" "}
                              {traveler.totalQuestions}
                            </span>
                            <span>{traveler.progress}% Ascended</span>
                          </p>
                        </div>
                      )}

                      {isCompleted && (
                        <p className="text-xs text-sage-leaf flex items-center gap-1 mt-2">
                          <CheckCircle2 className="w-3 h-3" /> Cleared at{" "}
                          {traveler.startTime}
                        </p>
                      )}

                      {isFuture && (
                        <p className="text-xs text-deep-shale/30 italic mt-1">
                          Pending arrival...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
