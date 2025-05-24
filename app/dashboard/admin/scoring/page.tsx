"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";

interface Question {
  id: string;
  text: string;
  section: {
    title: string;
  };
  weight: number | null;
  scoringModel?: {
    thresholds: {
      low: number;
      medium: number;
      high: number;
    };
  };
}

type ThresholdValues = {
  [questionId: string]: {
    low: string | number;
    medium: string | number;
    high: string | number;
  };
};

export default function ScoringModelPage() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdValues>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle("Assign Scoring Models");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Scoring Models", href: "/dashboard/admin/scoring" },
    ]);
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    await fetch("/api/admin/scoring/prefill", { method: "POST" });
    const res = await fetch(
      "/api/admin/questionnaire/questions?include=section,scoringModel"
    );
    const data = await res.json();
    setQuestions(data);

    const initialThresholds: ThresholdValues = {};
    data.forEach((q: Question) => {
      initialThresholds[q.id] = {
        low: q.scoringModel?.thresholds.low ?? 1,
        medium: q.scoringModel?.thresholds.medium ?? 2,
        high: q.scoringModel?.thresholds.high ?? 3,
      };
    });
    setThresholds(initialThresholds);
  }

  function updateThreshold(
    questionId: string,
    level: "low" | "medium" | "high",
    value: string
  ) {
    setThresholds((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [level]: value,
      },
    }));
  }

  async function handleSaveThresholds(questionId: string) {
    const { low, medium, high } = thresholds[questionId];

    if (isNaN(Number(low)) || isNaN(Number(medium)) || isNaN(Number(high))) {
      Swal.fire({
        icon: "error",
        title: "Invalid input",
        text: "All thresholds must be valid numbers.",
      });
      return;
    }

    setSaving(true);

    const res = await fetch(`/api/admin/scoring/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thresholds: {
          low: Number(low),
          medium: Number(medium),
          high: Number(high),
        },
      }),
    });

    if (res.ok) {
      const updatedRes = await fetch(
        "/api/admin/questionnaire/questions?include=section,scoringModel",
        { cache: "no-store" }
      );
      const updatedData = await updatedRes.json();
      setQuestions(updatedData);

      const refreshedThresholds: ThresholdValues = {};
      updatedData.forEach((q: Question) => {
        refreshedThresholds[q.id] = {
          low: q.scoringModel?.thresholds.low ?? 1,
          medium: q.scoringModel?.thresholds.medium ?? 2,
          high: q.scoringModel?.thresholds.high ?? 3,
        };
      });
      setThresholds(refreshedThresholds);

      Swal.fire({
        icon: "success",
        title: "Thresholds updated",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not save thresholds.",
      });
    }

    setSaving(false);
  }

  const grouped = questions.reduce((acc, q) => {
    const section = q.section?.title ?? "Unassigned";
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Assign Scoring to Questions</h2>

      {Object.entries(grouped).map(([section, sectionQuestions]) => (
        <div key={section} className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-700">{section}</h3>
          {sectionQuestions.map((q) => (
            <div key={q.id} className="border rounded p-4 shadow-sm space-y-2">
              <div className="text-md font-semibold">{q.text}</div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Score
                  </label>
                  <Input
                    type="number"
                    value={thresholds[q.id]?.low ?? ""}
                    onChange={(e) =>
                      updateThreshold(q.id, "low", e.target.value)
                    }
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medium Score
                  </label>
                  <Input
                    type="number"
                    value={thresholds[q.id]?.medium ?? ""}
                    onChange={(e) =>
                      updateThreshold(q.id, "medium", e.target.value)
                    }
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    High Score
                  </label>
                  <Input
                    type="number"
                    value={thresholds[q.id]?.high ?? ""}
                    onChange={(e) =>
                      updateThreshold(q.id, "high", e.target.value)
                    }
                    placeholder="e.g. 3"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveThresholds(q.id)}
                disabled={saving}
                className="bg-indigo-600 text-white hover:bg-indigo-700 mt-2"
              >
                Save Thresholds
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
