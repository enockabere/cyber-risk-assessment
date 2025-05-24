"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  weight: number | null;
  position: number;
  section: {
    title: string;
    position: string;
  };
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
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("Assign Scoring Models");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Scoring Models", href: "/dashboard/admin/scoring" },
    ]);
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      await fetch("/api/admin/scoring/prefill", { method: "POST" });

      const res = await fetch(
        "/api/admin/questionnaire/questions?include=section,scoringModel"
      );
      const data: Question[] = await res.json();

      const sorted = [...data].sort((a, b) => {
        const secPosA = a.section?.position ?? "0";
        const secPosB = b.section?.position ?? "0";

        const sectionCmp = secPosA.localeCompare(secPosB, undefined, {
          numeric: true,
        });

        return sectionCmp !== 0
          ? sectionCmp
          : (a.position ?? 0) - (b.position ?? 0);
      });

      setQuestions(sorted);

      const initialThresholds: ThresholdValues = {};
      sorted.forEach((q) => {
        initialThresholds[q.id] = {
          low: q.scoringModel?.thresholds.low ?? 1,
          medium: q.scoringModel?.thresholds.medium ?? 2,
          high: q.scoringModel?.thresholds.high ?? 3,
        };
      });

      setThresholds(initialThresholds);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      Swal.fire({
        icon: "error",
        title: "Loading Failed",
        text: "Could not load questions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
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

    setSaving((prev) => ({ ...prev, [questionId]: true }));

    try {
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
          toast: true,
          position: "top-right",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not save thresholds.",
      });
    } finally {
      setSaving((prev) => ({ ...prev, [questionId]: false }));
    }
  }

  const grouped = questions.reduce((acc, q) => {
    const section = q.section?.title ?? "Unassigned";
    if (!acc[section]) acc[section] = [];
    acc[section].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-100px)]">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Assign Scoring to Questions
          </CardTitle>
          <p className="text-sm text-gray-500">
            Set thresholds for low, medium, and high scores for each question
          </p>
        </CardHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <CardContent className="p-6 space-y-8">
            {Object.entries(grouped).map(([section, sectionQuestions]) => (
              <div key={section} className="space-y-4">
                <div className="sticky top-0 z-10 bg-gray-50 py-2">
                  <h3 className="text-lg font-semibold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-md inline-flex items-center">
                    <span className="mr-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {sectionQuestions[0].section?.position}
                    </span>
                    {section}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {sectionQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="border rounded-lg p-4 bg-white shadow-xs hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            Q{q.position}
                          </div>
                          <div className="text-md font-medium text-gray-800">
                            {q.text}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => handleSaveThresholds(q.id)}
                            disabled={saving[q.id]}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            size="sm"
                          >
                            {saving[q.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Low Score
                          </label>
                          <Input
                            type="number"
                            value={thresholds[q.id]?.low ?? ""}
                            onChange={(e) =>
                              updateThreshold(q.id, "low", e.target.value)
                            }
                            className="focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Medium Score
                          </label>
                          <Input
                            type="number"
                            value={thresholds[q.id]?.medium ?? ""}
                            onChange={(e) =>
                              updateThreshold(q.id, "medium", e.target.value)
                            }
                            className="focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            High Score
                          </label>
                          <Input
                            type="number"
                            value={thresholds[q.id]?.high ?? ""}
                            onChange={(e) =>
                              updateThreshold(q.id, "high", e.target.value)
                            }
                            className="focus:ring-indigo-500 focus:border-indigo-500"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
