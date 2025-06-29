// AdminReportView.tsx

"use client";

import { Question } from "@/app/types";
import QuestionCard from "../Questions/QuestionCard";
import { BarChart2, ListChecks, ShieldCheck } from "lucide-react";
import { getAverageRiskRating } from "@/app/lib/utils/utils";

interface Submission {
  id: string;
  createdAt: string;
  userId: string;
  answers: {
    question: {
      id: string;
      text: string;
      position: number;
      assetId?: string | null;
      assetName?: string | null;
    };
    selectedOption: {
      id: string;
      text: string;
      controlDescription?: string | null;
    };
  }[];
}

export default function AdminReportView({
  submission,
}: {
  submission: Submission;
}) {
  const { answers } = submission;

  const generalQuestions = answers.filter((a) => !a.question.assetId);
  const assetQuestions = answers.filter((a) => a.question.assetId);
  const controlMeasures = answers.filter(
    (a) => a.selectedOption.controlDescription
  ).length;

  const formatted: Question[] = answers.map((a) => ({
    ...a.question,
    selectedOption: a.selectedOption,
  }));

  const averageRating = getAverageRiskRating(formatted);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Questions"
          value={answers.length}
          icon={<ListChecks />}
        />
        <StatCard
          label="Control Measures"
          value={`${controlMeasures} (${Math.round(
            (controlMeasures / answers.length) * 100
          )}%)`}
          icon={<ShieldCheck />}
        />
        <StatCard
          label="Avg. Risk Rating"
          value={averageRating ?? "N/A"}
          icon={<BarChart2 />}
        />
      </div>

      {/* General Questions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-3">
          General Questions
        </h3>
        {generalQuestions.length > 0 ? (
          generalQuestions.map((a, i) => (
            <QuestionCard
              key={`general-${i}`}
              question={{
                ...a.question,
                selectedOption: a.selectedOption,
              }}
              index={i}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No general questions found.</p>
        )}
      </div>

      {/* Asset-Based Questions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1 mb-3">
          Asset-Based Questions
        </h3>
        {assetQuestions.length > 0 ? (
          assetQuestions.map((a, i) => (
            <QuestionCard
              key={`asset-${i}`}
              question={{
                ...a.question,
                selectedOption: a.selectedOption,
              }}
              index={i}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No asset-based questions found.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 shadow rounded-md flex gap-4 items-center border">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
