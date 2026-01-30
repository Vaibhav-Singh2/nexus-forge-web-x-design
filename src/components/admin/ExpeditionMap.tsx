import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MomentumOrb, CandidateStatus } from "./MomentumOrb";
import { Radio, Search } from "lucide-react";

interface ExpeditionMapProps {
  candidates: CandidateStatus[];
}

export function ExpeditionMap({ candidates }: ExpeditionMapProps) {
  const router = useRouter();
  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = () => {
    setBroadcasting(true);
    setTimeout(() => setBroadcasting(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-stone-gray/20 shadow-sm p-6 space-y-8">
      {/* Controls Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-deep-shale">
          Live Expedition Map
        </h3>
        <div className="flex gap-2">
          <button className="p-2 text-deep-shale/40 hover:text-horizon-blue transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={handleBroadcast}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-horizon-blue bg-horizon-blue/10 rounded-full hover:bg-horizon-blue/20 transition-colors"
          >
            <Radio className={broadcasting ? "animate-pulse" : ""} size={14} />
            Broadcast Signal
          </button>
        </div>
      </div>

      {/* The Map Track */}
      <div className="relative h-32 w-full flex items-center overflow-hidden">
        {/* Global Signal Ripple */}
        {broadcasting && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen rounded-full border-4 border-horizon-blue/5 animate-ping duration-2000 pointer-events-none" />
        )}

        {/* Topographic Terrain Lines (Background) */}
        <svg
          className="absolute inset-0 w-full h-full text-stone-gray/10 pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q300,20 600,80 T1200,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0,100 Q400,120 800,40 T1200,100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {/* The Main Path Line */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-stone-gray/30" />

        {/* Start / End Labels */}
        <span className="absolute left-0 top-1/2 mt-4 text-xs font-medium text-deep-shale/40 uppercase tracking-widest">
          Base
        </span>
        <span className="absolute right-0 top-1/2 mt-4 text-xs font-medium text-deep-shale/40 uppercase tracking-widest">
          Summit
        </span>

        {/* Candidates */}
        <div className="absolute inset-x-8 top-1/2 h-0">
          {" "}
          {/* Inset provides padding for start/end */}
          {candidates.map((candidate) => (
            <MomentumOrb
              key={candidate.id}
              candidate={candidate}
              onClick={(id) => router.push(`/admin/traveler/${id}`)}
            />
          ))}
        </div>
      </div>

      {/* Legend / Stats Footer */}
      <div className="flex items-center gap-6 text-xs text-deep-shale/50 border-t border-stone-gray/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-horizon-blue" />
          <span>
            Active ({candidates.filter((c) => c.status === "active").length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>
            Broadcast Distress (
            {candidates.filter((c) => c.status === "distress").length})
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-8 h-0.5 bg-linear-to-r from-transparent to-horizon-blue opacity-60" />
          <span>Visual Velocity Trail</span>
        </div>
      </div>
    </div>
  );
}
