"use client";

import { useEffect, useState } from "react";
import ProgressCard from "../respondent-stats/ProgressCard";
import RiskRatingCard from "../respondent-stats/RiskRatingCard";
import CTASection from "../respondent-stats/CTASection";
import MaturityGauge from "../respondent-stats/MaturityGauge";
import { StatsData, RiskLevel } from "@/app/types/assessment";
import { calculateMaturityIndex } from "@/app/lib/utils/assessment-utils";

export default function RespondentStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [averageRating, setAverageRating] = useState<RiskLevel>(null);
  const [maturityIndex, setMaturityIndex] = useState<number>(0); // ✅ Add this
  const [loading, setLoading] = useState(true);
  const [loadingRedirect, setLoadingRedirect] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/assessment/stats");
        const data = await res.json();
        setStats(data);
        setAverageRating(data.averageRating);
        setMaturityIndex(calculateMaturityIndex(data));
      } catch (error) {
        console.error("❌ Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-4">
      <div className="max-w-6xl mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-stretch">
          <ProgressCard stats={stats} loading={loading} />
          <RiskRatingCard
            rating={averageRating}
            loading={loading}
            lastSubmissionDate={stats?.lastSubmissionDate ?? null}
          />
          <MaturityGauge
            value={maturityIndex}
            assetCount={stats?.assetCount ?? 0}
          />
        </div>
        <CTASection
          stats={stats}
          loadingRedirect={loadingRedirect}
          onContinue={() => {
            setLoadingRedirect(true);
            window.location.href = "/dashboard/assessment";
          }}
        />
      </div>
    </div>
  );
}
