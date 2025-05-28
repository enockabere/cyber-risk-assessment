"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";

interface Question {
  id: string;
  text: string;
  position: number;
  options: {
    id: string;
    text: string;
  }[];
  selectedOptionId?: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setTitle("Assessment Questions");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assessment", href: "/dashboard/assessment" },
      { label: "Questions", href: "/dashboard/questions" },
    ]);
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/assessment/questions");
        const data = await res.json();

        setQuestions(data.questions);

        const initialAnswers: Record<string, string> = {};
        data.questions.forEach((q: Question) => {
          if (q.selectedOptionId) {
            initialAnswers[q.id] = q.selectedOptionId;
          }
        });
        setAnswers(initialAnswers);
      } catch (error) {
        toast.error("Failed to load questions");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitAnswers = async () => {
    setSubmitting(true);

    const payload = Object.entries(answers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    const res = await fetch("/api/assessment/questions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });

    if (res.ok) {
      toast.success("Assessment submitted successfully");
      router.push("/dashboard/responses");
    } else {
      toast.error("Failed to submit assessment");
    }

    setSubmitting(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white rounded-md shadow">
      <h1 className="text-2xl font-bold text-green-700">
        📋 Assessment Questions
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : (
        <>
          {questions.map((q) => (
            <div key={q.id} className="space-y-2 border-b pb-4">
              <p className="font-medium text-gray-800">
                {q.position}. {q.text}
              </p>
              <div className="space-y-1">
                {q.options.map((opt) => (
                  <label key={opt.id} className="block text-sm">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt.id}
                      checked={answers[q.id] === opt.id}
                      onChange={() => handleAnswerChange(q.id, opt.id)}
                      className="mr-2"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmitAnswers}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Answers"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
