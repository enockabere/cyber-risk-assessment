"use client";

import { useEffect, useState } from "react";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  text: string;
  position: number;
}

export default function QuestionsPage() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setTitle("Questions");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Questions", href: "/dashboard/admin/questions" },
    ]);

    fetch("/api/admin/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-700">
        🧠 Risk Assessment Questions
      </h1>

      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="p-4 border rounded bg-gray-50">
            <span className="font-semibold">{q.position}. </span>
            {q.text}
          </li>
        ))}
      </ul>

      <div className="pt-4">
        <Button className="bg-indigo-600 text-white">Submit Responses</Button>
      </div>
    </div>
  );
}
