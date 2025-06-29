"use client";

import React, { useEffect, useState } from "react";
import { Question } from "@/app/types";
import { getAverageRiskRating } from "@/app/lib/utils/utils";
import QuestionCard from "@/app/components/Questions/QuestionCard";
import {
  FileDown,
  Loader2,
  ShieldCheck,
  BarChart2,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function GeneralReport() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const averageRating = getAverageRiskRating(questions);
  const controlsCount = questions.filter(
    (q) => q.selectedOption.controlDescription
  ).length;

  useEffect(() => {
    async function fetchGeneralQuestions() {
      try {
        const res = await fetch("/api/assessment/responses");
        const data = await res.json();
        const generalQuestions = (data?.questions || []).filter(
          (q: Question) => !q.assetId
        );
        setQuestions(generalQuestions);
      } catch (err) {
        console.error("Failed to fetch general report data", err);
        setError("Unable to load general report data.");
      } finally {
        setLoading(false);
      }
    }

    fetchGeneralQuestions();
  }, []);

  const handleDownloadExcel = async () => {
    try {
      Swal.fire({
        title: "Preparing Excel...",
        text: "Generating your report...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      const res = await fetch("/api/reports/general/excel");

      if (!res.ok) {
        throw new Error("Excel generation failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "General_Risk_Report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Download Complete",
        text: "Your Excel report has been downloaded.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Excel download failed:", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Could not generate Excel file.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-gray-600 text-sm">Loading report...</span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-sm">{error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <Button variant="default" onClick={handleDownloadExcel}>
          <FileDown className="w-4 h-4 mr-2" />
          Download Excel
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-4 rounded-md shadow">
          <div className="flex items-center gap-3 mb-1">
            <ListChecks className="text-green-600 w-5 h-5" />
            <p className="text-sm text-gray-500">Total Questions</p>
          </div>
          <p className="text-xl font-bold text-gray-800">{questions.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-md shadow">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="text-blue-600 w-5 h-5" />
            <p className="text-sm text-gray-500">Control Measures</p>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {controlsCount} (
            {Math.round((controlsCount / (questions.length || 1)) * 100)}%)
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

      {/* Question Cards */}
      {questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <QuestionCard
              key={`general-${q.position ?? index}`}
              question={q}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">
          No general questions found in the latest submission.
        </p>
      )}
    </div>
  );
}
