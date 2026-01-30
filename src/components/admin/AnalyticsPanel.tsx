"use client";

import { useEffect, useState } from "react";
import { Activity, Users, TrendingUp, BarChart3 } from "lucide-react";

type AnalyticsData = {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalUsers: number;
  averageScorePercent: number;
  completionRate: number;
  journeyAnalytics: Array<{
    name: string;
    completions: number;
    averageScore: number;
  }>;
};

export function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-stone-gray/20 animate-pulse"
          >
            <div className="h-12 bg-stone-gray/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm text-deep-shale/60 mb-1">
              Total Students
            </span>
            <span className="text-3xl font-medium text-deep-shale">
              {analytics.totalUsers}
            </span>
          </div>
          <Users className="w-8 h-8 text-stone-gray/30" />
        </div>

        {/* Active Sessions */}
        <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm text-deep-shale/60 mb-1">
              Active Now
            </span>
            <span className="text-3xl font-medium text-horizon-blue">
              {analytics.activeSessions}
            </span>
          </div>
          <Activity className="w-8 h-8 text-horizon-blue" />
        </div>

        {/* Average Score */}
        <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm text-deep-shale/60 mb-1">
              Avg. Score
            </span>
            <span className="text-3xl font-medium text-sage-leaf">
              {analytics.averageScorePercent}%
            </span>
          </div>
          <TrendingUp className="w-8 h-8 text-sage-leaf" />
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm text-deep-shale/60 mb-1">
              Completion Rate
            </span>
            <span className="text-3xl font-medium text-deep-shale">
              {analytics.completionRate}%
            </span>
          </div>
          <BarChart3 className="w-8 h-8 text-deep-shale/30" />
        </div>
      </div>

      {/* Journey-wise Analytics */}
      {analytics.journeyAnalytics.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-stone-gray/20 shadow-sm">
          <h3 className="text-lg font-medium text-deep-shale mb-4">
            Journey Performance
          </h3>
          <div className="space-y-3">
            {analytics.journeyAnalytics.map((journey, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-stone-gray/5 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-deep-shale text-sm">
                    {journey.name}
                  </p>
                  <p className="text-xs text-deep-shale/60 mt-1">
                    {journey.completions} completion
                    {journey.completions !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-sage-leaf">
                    {journey.averageScore}%
                  </p>
                  <p className="text-xs text-deep-shale/60">avg. score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
