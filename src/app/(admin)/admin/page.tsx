"use client";

import React from "react";
import { ExpeditionMap } from "@/components/admin/ExpeditionMap";
import { Activity, Users, AlertTriangle } from "lucide-react";
import CANDIDATES from "@/data/candidates.json";
import { CandidateStatus } from "@/components/admin/MomentumOrb";

export default function AdminPage() {
  return (
    <div className="bg-paper-mist min-h-screen text-deep-shale overflow-hidden animate-hero-reveal">
      {/* 1. Command Center Header */}
      <header className="fixed top-0 inset-x-0 h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-stone-gray/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-lg font-medium tracking-widest uppercase text-deep-shale">
            Expedition Command
          </h1>
        </div>

        <div className="flex items-center gap-6 text-sm text-deep-shale/60">
          <span>Active Journeys: {CANDIDATES.length}</span>
          <span>•</span>
          <span>Network: Stable</span>
        </div>
      </header>

      {/* 2. Key Performance Indicators */}
      <main className="pt-24 px-6 h-screen flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto w-full">
          <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-sm text-deep-shale/60 mb-1">
                Total Travelers
              </span>
              <span className="text-3xl font-medium text-deep-shale">
                {CANDIDATES.length}
              </span>
            </div>
            <Users className="w-8 h-8 text-stone-gray/30" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-sm text-deep-shale/60 mb-1">
                Avg. Ascent Velocity
              </span>
              <span className="text-3xl font-medium text-deep-shale">
                Steady
              </span>
            </div>
            <Activity className="w-8 h-8 text-sage-leaf" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between relative overflow-hidden">
            {CANDIDATES.some((c) => c.status === "distress") && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 animate-pulse" />
            )}
            <div>
              <span className="block text-sm text-deep-shale/60 mb-1">
                Distress Signals
              </span>
              <span className="text-3xl font-medium text-deep-shale">
                {CANDIDATES.filter((c) => c.status === "distress").length}
              </span>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* 3. Central Map Visualization */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex items-center justify-center relative min-h-100">
          <ExpeditionMap
            candidates={CANDIDATES as unknown as CandidateStatus[]}
          />
        </div>

        {/* 4. Footer Placeholder */}
        <div className="mt-auto pb-6 opacity-30 text-center text-xs text-deep-shale/40 uppercase tracking-widest">
          System Operational • Monitoring Active
        </div>
      </main>
    </div>
  );
}
