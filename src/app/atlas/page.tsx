"use client";

import Link from "next/link";
import { Map, Mountain, Clock, Lock, ArrowRight, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

import JOURNEYS from "@/data/journeys.json";

export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-paper-mist p-6 md:p-12 animate-hero-reveal">
      {/* 1. Header: Orientation */}
      <header className="max-w-4xl mx-auto mb-12 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-deep-shale/60 text-sm font-medium tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>The Atlas</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-deep-shale">
            Choose Your Route
          </h1>
          <p className="text-deep-shale/70 font-light max-w-lg">
            Every journey begins with a choice. Select a path to view its
            details.
          </p>
        </div>

        {/* User Status / Weather (Decorative) */}
        <div className="hidden md:flex items-center gap-4 text-xs text-deep-shale/40 bg-white/50 px-4 py-2 rounded-full border border-stone-gray/10">
          <span>Visibility: Excellent</span>
          <span>•</span>
          <span>Temp: 72°F</span>
        </div>
      </header>

      {/* 2. Journey Grid */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {JOURNEYS.map((journey) => {
          const isLocked = journey.status === "locked";

          return (
            <Link
              key={journey.id}
              href={isLocked ? "#" : `/trail/${journey.id}`}
              className={cn(
                "group relative p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-70",
                isLocked
                  ? "bg-stone-gray/5 border-stone-gray/20 cursor-not-allowed opacity-70"
                  : "bg-white border-stone-gray/20 hover:border-horizon-blue hover:shadow-lg hover:-translate-y-1",
              )}
              aria-disabled={isLocked}
            >
              {/* Background Decor */}
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mountain
                  className="w-24 h-24 text-deep-shale"
                  strokeWidth={0.5}
                />
              </div>

              {/* Top: Metadata */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wider uppercase px-2 py-1 rounded",
                      isLocked
                        ? "bg-stone-gray/20 text-deep-shale/50"
                        : "bg-horizon-blue/10 text-horizon-blue",
                    )}
                  >
                    {journey.type}
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
                </div>
              </div>

              {/* Bottom: Stats & Action */}
              <div className="relative z-10 pt-8 flex items-center justify-between border-t border-stone-gray/10 mt-6">
                <div className="flex items-center gap-4 text-sm text-deep-shale/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {journey.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Map className="w-4 h-4" /> {journey.difficulty}
                  </span>
                </div>

                {!isLocked ? (
                  <div className="flex items-center gap-2 text-horizon-blue font-medium text-sm group-hover:translate-x-1 transition-transform">
                    <span>View Trail</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-sm text-deep-shale/40 italic">
                    Route Closed
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
