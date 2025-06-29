"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertTriangle, Shield, FileText, Activity } from "lucide-react";
import Header from "@/app/components/layout/Header";
import { LoadingSkeleton } from "@/app/components/layout/LoadingSkeleton";
import RiskMatrixChart from "@/app/components/RiskMatrix/RiskMatrixChart";
import RiskDistributionChart from "@/app/components/RiskDistribution/RiskDistributionChart";
import MetricCard from "@/app/components/Metrics/MetricCard";
import QuestionCard from "@/app/components/Questions/QuestionCard";
import { BackgroundResponse, Question } from "@/app/types";
import {
  calculateRiskRating,
  getAverageRiskRating,
  getHighestRisk,
} from "@/app/lib/utils/utils";

import { riskColors } from "@/app/constants/riskStyles";

export default function ResponsesPage() {
  useSession();
  const [backgroundResponses, setBackgroundResponses] = useState<
    BackgroundResponse[]
  >([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const averageRating = getAverageRiskRating(questions);
  const highestRisk = getHighestRisk(questions);
  const controlsCount = questions.filter(
    (q) => q.selectedOption.controlDescription
  ).length;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/assessment/responses");
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setBackgroundResponses(data.backgroundResponses || []);
          setQuestions(data.questions || []);
        }
      } catch (err) {
        setError("Failed to load assessment responses.");
        console.error("Error fetching responses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Header averageRating={averageRating} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {error}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Assessments"
            value={questions.length}
            subtitle="Risk scenarios evaluated"
            icon={FileText}
            color="blue"
          />
          <MetricCard
            title="Highest Risk Level"
            value={highestRisk}
            subtitle="Requires immediate attention"
            icon={AlertTriangle}
            color="red"
            badge={true}
            riskRating={highestRisk}
          />
          <MetricCard
            title="Control Measures"
            value={controlsCount}
            subtitle={`${Math.round(
              (controlsCount / questions.length) * 100
            )}% coverage`}
            icon={Shield}
            color="green"
          />
          <MetricCard
            title="Risk Categories"
            value={
              new Set(
                questions
                  .map((q) =>
                    calculateRiskRating(
                      q.selectedOption.probability,
                      q.selectedOption.impact
                    )
                  )
                  .filter((rating) =>
                    ["Sustainable", "Moderate", "Severe", "Critical"].includes(
                      rating
                    )
                  )
              ).size
            }
            subtitle="Distinct risk levels identified"
            icon={Activity}
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Risk Matrix Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Risk Assessment Matrix
                </h2>
                <p className="text-gray-600 text-sm">
                  Visual mapping of probability vs impact
                </p>
              </div>
            </div>
            <RiskMatrixChart questions={questions} />
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(riskColors).map(([rating, color]) => (
                <div key={rating} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Risk Distribution
                </h2>
                <p className="text-gray-600 text-sm">Breakdown by severity</p>
              </div>
            </div>
            <RiskDistributionChart questions={questions} />
          </div>
        </div>

        {/* Background Information */}
        {backgroundResponses.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Background Information
                </h2>
                <p className="text-gray-600 text-sm">
                  Contextual details for the assessment
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {backgroundResponses.map((item, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.field.label}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {item.value || (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Risk Assessment Details */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Risk Assessment Details
              </h2>
              <p className="text-gray-600 text-sm">
                Individual risk scenarios and their evaluations
              </p>
            </div>
          </div>

          {/* No questions fallback */}
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No risk assessments completed yet</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Asset-linked Questions */}
              {questions.some((q) => q.assetId) && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Questions by Asset
                  </h3>
                  {[
                    ...new Set(
                      questions.filter((q) => q.assetId).map((q) => q.assetId)
                    ),
                  ].map((assetId) => {
                    const assetQuestions = questions.filter(
                      (q) => q.assetId === assetId
                    );
                    const assetName =
                      assetQuestions[0]?.assetName || `Asset (${assetId})`;

                    return (
                      <div key={assetId}>
                        <h4 className="text-md font-bold text-indigo-700 mb-2">
                          {assetName}
                        </h4>
                        <div className="space-y-4">
                          {assetQuestions.map((q, index) => (
                            <QuestionCard
                              key={`asset-${q.assetId}-${q.position}-${index}`}
                              question={q}
                              index={index}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* General Questions (non-asset linked) */}
              {questions.some((q) => !q.assetId) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 mt-6">
                    General Risk Questions
                  </h3>
                  {questions
                    .filter((q) => !q.assetId)
                    .map((q, index) => (
                      <QuestionCard
                        key={`general-${q.position}-${index}`}
                        question={q}
                        index={index}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
