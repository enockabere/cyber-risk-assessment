"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";

interface BackgroundField {
  id: string;
  label: string;
  fieldType: string;
  options: string[];
  response: string | null;
}

export default function AssessmentPage() {
  const [fields, setFields] = useState<BackgroundField[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setTitle("Cybersecurity Assessment");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assessment", href: "/dashboard/assessment" },
    ]);
  }, []);

  useEffect(() => {
    async function fetchBackgroundData() {
      try {
        const res = await fetch("/api/assessment/background");
        const data = await res.json();

        setCompleted(data.completed);
        setFields(data.fields);

        const initial: Record<string, string> = {};
        data.fields.forEach((f: BackgroundField) => {
          if (f.response) initial[f.id] = f.response;
        });
        setResponses(initial);
      } catch (err) {
        toast.error("Failed to load assessment data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBackgroundData();
  }, []);

  const handleChange = (id: string, value: string) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = Object.entries(responses).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));

    const res = await fetch("/api/assessment/background/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: payload }),
    });

    if (res.ok) {
      toast.success("Background info submitted.");
      router.push("/dashboard/questions");
    } else {
      toast.error("Failed to submit background info.");
    }
    setSubmitting(false);
  };

  const today = new Date();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">
        🛡️ Cybersecurity Risk Assessment
      </h1>

      <div className="border-t pt-4 space-y-1">
        <p className="text-sm text-gray-500">
          Created At:{" "}
          {today.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <p className="text-sm text-gray-500">
          Status: <span className="text-green-600 font-medium">Active</span>
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : completed ? (
        <div className="text-center space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-green-700">
            ✅ Background Information Completed
          </h2>
          <p className="text-gray-600">
            You can now begin your cybersecurity risk assessment questionnaire.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => router.push("/dashboard/questions")}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              className="border-indigo-600 text-indigo-700 hover:bg-indigo-50"
              onClick={() => setCompleted(false)}
            >
              Edit Background Info
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-md font-semibold text-indigo-800 italic">
            Please complete the background information to begin your assessment:
          </h3>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {field.label}
                </label>
                {field.fieldType === "DROPDOWN" ? (
                  <select
                    className="w-full border p-2 rounded"
                    value={responses[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.fieldType === "NUMBER" ? "number" : "text"}
                    value={responses[field.id] || ""}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="pt-2">
              <Button
                className="bg-indigo-600 text-white w-full flex items-center justify-center"
                onClick={handleSubmit}
                disabled={
                  Object.keys(responses).length < fields.length || submitting
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Background Info"
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
