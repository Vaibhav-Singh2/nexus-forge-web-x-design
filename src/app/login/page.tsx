"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, User, Key, Shield, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<"student" | "admin" | null>(
    null,
  );

  const handleLogin = (role: "student" | "admin") => {
    setLoadingRole(role);

    // Simulate auth delay for "realism"
    setTimeout(() => {
      // Mock Auth State
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", role);
        localStorage.setItem(
          "userName",
          role === "student" ? "Alex Rover" : "Admin User",
        );
      }

      // Redirect
      if (role === "student") {
        router.push("/atlas");
      } else {
        router.push("/admin");
      }
    }, 800);
  };

  return (
    <main className="min-h-screen bg-paper-mist flex items-center justify-center p-6 animate-hero-reveal">
      <div className="w-full max-w-md bg-white rounded-2xl border border-stone-gray/20 shadow-sm p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-horizon-blue/10 rounded-full flex items-center justify-center text-horizon-blue mb-4">
            <Key className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-deep-shale">
            Checkpoint Access
          </h1>
          <p className="text-sm text-deep-shale/60 leading-relaxed">
            Identify your role to proceed to the secure area.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          {/* Student Button */}
          <button
            onClick={() => handleLogin("student")}
            disabled={loadingRole !== null}
            className={cn(
              "w-full group relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left",
              loadingRole === "student"
                ? "bg-stone-gray/5 border-stone-gray/20"
                : "bg-white border-stone-gray/20 hover:border-horizon-blue hover:shadow-md",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-stone-gray/10 flex items-center justify-center text-deep-shale/60 group-hover:bg-horizon-blue/10 group-hover:text-horizon-blue transition-colors mr-4">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-deep-shale">Candidate</div>
              <div className="text-xs text-deep-shale/50">
                Access The Atlas & Journey
              </div>
            </div>
            <div className="text-horizon-blue opacity-0 group-hover:opacity-100 transition-opacity">
              {loadingRole === "student" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Admin Button */}
          <button
            onClick={() => handleLogin("admin")}
            disabled={loadingRole !== null}
            className={cn(
              "w-full group relative flex items-center p-4 rounded-xl border transition-all duration-300 text-left",
              loadingRole === "admin"
                ? "bg-stone-gray/5 border-stone-gray/20"
                : "bg-white border-stone-gray/20 hover:border-deep-shale hover:shadow-md",
            )}
          >
            <div className="w-10 h-10 rounded-full bg-stone-gray/10 flex items-center justify-center text-deep-shale/60 group-hover:bg-deep-shale/10 group-hover:text-deep-shale transition-colors mr-4">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-deep-shale">
                Expedition Leader
              </div>
              <div className="text-xs text-deep-shale/50">
                Access Command Center
              </div>
            </div>
            <div className="text-deep-shale opacity-0 group-hover:opacity-100 transition-opacity">
              {loadingRole === "admin" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </div>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 border-t border-stone-gray/10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-gray/5 text-[10px] font-medium text-deep-shale/40 uppercase tracking-widest">
            <Compass className="w-3 h-3" />
            Mock Authentication
          </div>
          <p className="text-xs text-deep-shale/30 italic">
            No password required for prototype access.
          </p>
        </div>
      </div>
    </main>
  );
}
