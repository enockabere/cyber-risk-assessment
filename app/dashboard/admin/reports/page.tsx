"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import AdminReportView from "@/app/components/reports/AdminReportView";

interface Respondent {
  id: string;
  name: string;
  email: string;
}

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

export default function AdminReportsPage() {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetch("/api/admin/reports/respondents")
      .then((res) => res.json())
      .then(setRespondents);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);

    fetch(`/api/admin/reports/${selectedId}`)
      .then((res) => res.json())
      .then(setSubmission)
      .finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          View Respondent Submissions
        </h1>
        <p className="text-sm text-gray-600">
          Select a university/respondent to view their latest submission.
        </p>
      </div>

      <Select onValueChange={(id) => setSelectedId(id)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a respondent" />
        </SelectTrigger>
        <SelectContent>
          {respondents.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading report...
        </div>
      )}

      {submission && <AdminReportView submission={submission} />}
    </div>
  );
}
