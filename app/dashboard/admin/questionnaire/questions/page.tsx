"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import Swal from "sweetalert2";
import DataTable, { TableColumn } from "react-data-table-component";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  id: string;
  text: string;
  type: string;
  weight: number | null;
  sectionId: string;
  section?: {
    title: string;
  };
}

interface Section {
  id: string;
  title: string;
}

export default function QuestionManagementPage() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [text, setText] = useState("");
  const [type, setType] = useState("TEXT");
  const [weight, setWeight] = useState<number | null>(null);
  const [sectionId, setSectionId] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weightInput, setWeightInput] = useState<number | "">("");

  useEffect(() => {
    setTitle("Questionnaire Questions");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      {
        label: "Questionnaire Questions",
        href: "/dashboard/admin/questionnaire/questions",
      },
    ]);
    fetchData();
  }, []);

  async function fetchData() {
    const [questionsRes, sectionsRes] = await Promise.all([
      fetch("/api/admin/questionnaire/questions"),
      fetch("/api/admin/questionnaire/sections"),
    ]);
    setQuestions(await questionsRes.json());
    setSections(await sectionsRes.json());
  }

  function resetForm() {
    setSelected(null);
    setText("");
    setType("TEXT");
    setWeight(null);
    setWeightInput("");
    setSectionId("");
    setOpen(false);
  }

  function handleEdit(q: Question) {
    setSelected(q);
    setText(q.text);
    setType(q.type);
    setWeight(q.weight ?? null);
    setWeightInput(q.weight ?? "");
    setSectionId(q.sectionId);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const method = selected ? "PATCH" : "POST";
    const url = selected
      ? `/api/admin/questionnaire/questions/${selected.id}`
      : "/api/admin/questionnaire/questions";

    const actualWeight = weightInput === "" ? null : Number(weightInput);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, type, weight: actualWeight, sectionId }),
    });

    setSaving(false);

    if (res.ok) {
      await fetchData();
      resetForm();
      Swal.fire({
        icon: "success",
        title: selected ? "Updated!" : "Created!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save question.",
      });
    }
  }

  function formatWeight(weight: number | null): string {
    switch (weight) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "-";
    }
  }

  async function handleDelete(id: string) {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This question will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/admin/questionnaire/questions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }

  const columns: TableColumn<Question>[] = [
    { name: "Text", selector: (row) => row.text, sortable: true, wrap: true },
    { name: "Type", selector: (row) => row.type },
    { name: "Weight", selector: (row) => formatWeight(row.weight) },
    {
      name: "Section",
      selector: (row) => row.section?.title ?? "Unassigned",
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <span
            onClick={() => handleEdit(row)}
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </span>
          <span
            onClick={() => handleDelete(row.id)}
            className="cursor-pointer text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </span>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Questions</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <PlusCircle size={18} />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selected ? "Edit Question" : "New Question"}
              </DialogTitle>
              <DialogDescription>
                {selected
                  ? "Update the question details below."
                  : "Fill in the details to add a new question."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Question Text *</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter the question"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Question Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="TEXT">Text</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="RATING">Rating</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>
              </div>

              <select
                value={weightInput}
                onChange={(e) => setWeightInput(Number(e.target.value))}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">Select weight</option>
                <option value={3}>High</option>
                <option value={2}>Medium</option>
                <option value={1}>Low</option>
              </select>
              <div>
                <label className="text-sm font-medium">Section *</label>
                <select
                  className="w-full p-2 border rounded"
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={saving}
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {saving
                    ? "Saving..."
                    : selected
                    ? "Update Question"
                    : "Create Question"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={questions}
        pagination
        highlightOnHover
        noDataComponent={
          <div className="text-gray-500 py-6">No questions found</div>
        }
      />
    </div>
  );
}
