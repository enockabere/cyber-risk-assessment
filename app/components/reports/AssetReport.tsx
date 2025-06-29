"use client";

import React, { useEffect, useState } from "react";
import QuestionCard from "@/app/components/Questions/QuestionCard";
import {
  FileDown,
  Loader2,
  ShieldCheck,
  BarChart2,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question as BaseQuestion } from "@/app/types";
import { getAverageRiskRating } from "@/app/lib/utils/utils";

interface QuestionWithAsset extends BaseQuestion {
  assetId: string;
  assetName?: string;
}

interface AssetGroup {
  assetId: string;
  assetName: string;
  questions: QuestionWithAsset[];
}

export default function AssetReport() {
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssetQuestions() {
      try {
        const res = await fetch("/api/assessment/responses");
        const data = await res.json();

        const rawQuestions = data?.questions || [];
        const assetQuestions: QuestionWithAsset[] = rawQuestions.filter(
          (q: BaseQuestion): q is QuestionWithAsset => !!q.assetId
        );

        const grouped = Object.values(
          assetQuestions.reduce<Record<string, AssetGroup>>((acc, q) => {
            const assetId = q.assetId;
            if (!acc[assetId]) {
              acc[assetId] = {
                assetId,
                assetName: q.assetName ?? `Asset (${assetId})`,
                questions: [],
              };
            }
            acc[assetId].questions.push(q);
            return acc;
          }, {})
        );

        setAssetGroups(grouped);
      } catch (err) {
        console.error("Failed to load asset-linked questions:", err);
        setError("Could not load asset questions.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssetQuestions();
  }, []);

  const allQuestions = assetGroups.flatMap((group) => group.questions);
  const totalAssetQuestions = allQuestions.length;
  const totalControls = allQuestions.filter(
    (q) => q.selectedOption?.controlDescription
  ).length;
  const averageRating = getAverageRiskRating(allQuestions);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-gray-600 text-sm">Loading asset report...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-sm">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-md shadow">
          <div className="flex items-center gap-3 mb-1">
            <ListChecks className="text-green-600 w-5 h-5" />
            <p className="text-sm text-gray-500">Total Asset Questions</p>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {totalAssetQuestions}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-md shadow">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="text-blue-600 w-5 h-5" />
            <p className="text-sm text-gray-500">Control Measures</p>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {totalControls} (
            {Math.round((totalControls / (totalAssetQuestions || 1)) * 100)}%)
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-md shadow">
          <div className="flex items-center gap-3 mb-1">
            <BarChart2 className="text-yellow-600 w-5 h-5" />
            <p className="text-sm text-gray-500">Average Risk Rating</p>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {averageRating ?? "N/A"}
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={() => alert("Export to Excel logic goes here")}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download Excel
        </Button>
      </div>

      {/* Asset Question Groups */}
      {assetGroups.length > 0 ? (
        assetGroups.map((group) => (
          <div key={`asset-section-${group.assetId}`} className="space-y-4">
            <h3 className="text-lg font-bold text-indigo-700 border-b pb-1">
              {group.assetName}
            </h3>
            {group.questions.map((q, i) => (
              <QuestionCard
                key={`asset-${group.assetId}-${q.position}-${i}`}
                question={q}
                index={i}
              />
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-sm">
          No asset-linked questions found.
        </p>
      )}
    </div>
  );
}
