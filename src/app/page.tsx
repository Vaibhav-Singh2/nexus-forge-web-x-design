"use client";

import Link from "next/link";
import { Compass, Shield, Map } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-paper-mist p-6 text-center animate-hero-reveal">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-8">
        {/* Icon / Logo */}
        <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-gray/20 mb-8">
          <Compass className="w-10 h-10 text-horizon-blue" strokeWidth={1.5} />
        </div>

        <h1 className="text-5xl md:text-7xl font-serif text-deep-shale tracking-tight">
          The Intellectual Ascent
        </h1>

        <p className="text-xl text-deep-shale/70 font-light max-w-xl mx-auto leading-relaxed">
          The exam is not a barrier, but a route to be traversed. Your guide is
          ready.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-12">
          {/* Student Entry */}
          <Link
            href="/trail/1"
            className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-stone-gray/20 hover:border-horizon-blue hover:shadow-md transition-all duration-300"
          >
            <Map className="w-8 h-8 text-deep-shale/80 group-hover:text-horizon-blue mb-4 transition-colors" />
            <span className="text-lg font-medium text-deep-shale">
              Begin Journey
            </span>
            <span className="text-sm text-deep-shale/50 mt-2 group-hover:text-deep-shale/70">
              Candidate Access
            </span>
          </Link>

          {/* Admin Entry */}
          <Link
            href="/admin"
            className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-stone-gray/20 hover:border-deep-shale hover:shadow-md transition-all duration-300"
          >
            <Shield className="w-8 h-8 text-deep-shale/80 mb-4 transition-colors" />
            <span className="text-lg font-medium text-deep-shale">
              Command Center
            </span>
            <span className="text-sm text-deep-shale/50 mt-2 group-hover:text-deep-shale/70">
              Operations & Oversight
            </span>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 text-xs text-deep-shale/30">
        System Status: Operational • Visibility: Clear
      </footer>
    </main>
  );
}
