"use client";

import { useEffect, useState } from "react";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import { Button } from "@/components/ui/button";
import CreateQuestionModal from "@/app/components/background/CreateQuestionModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

interface Question {
  id: string;
  text: string;
  position: number;
  options: {
    text: string;
    probability?: string;
    impact?: string;
    controlDescription?: string;
    residualProbability?: string;
    residualImpact?: string;
  }[];
}

export default function QuestionsPage() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/questions");
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the question.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        Swal.fire("Deleted!", "The question has been removed.", "success");
        fetchQuestions();
      } else {
        Swal.fire("Error", "Failed to delete the question.", "error");
      }
    }
  };

  useEffect(() => {
    setTitle("Questions");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Questions", href: "/dashboard/admin/questions" },
    ]);
    fetchQuestions();
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">
          🧠 Risk Assessment Questions
        </h1>
        <Button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white"
        >
          + Add Question
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-600">
          Loading questions...
        </div>
      ) : (
        <ul className="space-y-6">
          {questions.map((q) => (
            <li key={q.id} className="p-4 border rounded bg-gray-50 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{q.position}. </span>
                  <span>{q.text}</span>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditData(q);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-400"
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="ml-4 mt-2 space-y-2">
                <div className="font-semibold text-sm text-gray-700">
                  Answer Options:
                </div>
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="text-sm pl-2 border-l border-gray-300 space-y-1"
                  >
                    <div>
                      🔹 <strong>Text:</strong> {opt.text}
                    </div>
                    {opt.probability && (
                      <div>
                        📊 <strong>Probability:</strong> {opt.probability}
                      </div>
                    )}
                    {opt.impact && (
                      <div>
                        💥 <strong>Impact:</strong> {opt.impact}
                      </div>
                    )}
                    {opt.controlDescription && (
                      <div>
                        🛡️ <strong>Control:</strong> {opt.controlDescription}
                      </div>
                    )}
                    {opt.residualProbability && (
                      <div>
                        📉 <strong>Residual Probability:</strong>{" "}
                        {opt.residualProbability}
                      </div>
                    )}
                    {opt.residualImpact && (
                      <div>
                        📉 <strong>Residual Impact:</strong>{" "}
                        {opt.residualImpact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto my-8">
          <DialogHeader>
            <DialogTitle>
              {editData ? "Edit Question" : "Create New Question"}
            </DialogTitle>
            <DialogDescription>
              {editData
                ? "Update the question, its choices, and risk metrics."
                : "Fill in the details of the new question."}
            </DialogDescription>
          </DialogHeader>
          <CreateQuestionModal
            existing={editData ?? undefined}
            onSuccess={() => {
              fetchQuestions();
              setShowModal(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
