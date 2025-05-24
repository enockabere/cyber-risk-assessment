"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTopbar } from "@/app/context/TopbarContext";
import { useBreadcrumbs } from "@/app/context/BreadcrumbContext";
import SectionTable from "@/app/components/layout/SectionTable";
import Swal from "sweetalert2";

interface Section {
  id: string;
  title: string;
  description: string | null;
  parentId?: string | null;
}

export default function SectionManagementPage() {
  const { setTitle } = useTopbar();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [sections, setSections] = useState<Section[]>([]);
  const [selected, setSelected] = useState<Section | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [parentIdInput, setParentIdInput] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle("Questionnaire Sections");
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      {
        label: "Questionnaire Sections",
        href: "/dashboard/admin/questionnaire/sections",
      },
    ]);
    fetchSections();
  }, []);

  async function fetchSections() {
    const res = await fetch("/api/admin/questionnaire/sections");
    const data = await res.json();
    setSections(data);
  }

  function handleEdit(section: Section) {
    setSelected(section);
    setTitleInput(section.title);
    setDescInput(section.description || "");
    setParentIdInput(section.parentId || null);
    setOpen(true);
  }

  function resetForm() {
    setTitleInput("");
    setDescInput("");
    setParentIdInput(null);
    setSelected(null);
    setOpen(false);
  }

  async function handleSave() {
    setSaving(true);
    const method = selected ? "PATCH" : "POST";
    const url = selected
      ? `/api/admin/questionnaire/sections/${selected.id}`
      : "/api/admin/questionnaire/sections";

    const payload = {
      title: titleInput,
      description: descInput,
      parentId: parentIdInput || null,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSaving(false);

      if (!res.ok) throw new Error("Request failed");

      await fetchSections();
      resetForm();

      Swal.fire({
        icon: "success",
        title: selected ? "Section updated" : "Section created",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      setSaving(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while saving the section.",
      });
    }
  }

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This section will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/admin/questionnaire/sections/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await fetchSections();
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The section has been removed.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete the section.",
      });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Questionnaire Sections</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <PlusCircle size={18} />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selected ? "Edit Section" : "New Section"}
              </DialogTitle>
              <DialogDescription>
                {selected
                  ? "Update the selected questionnaire section."
                  : "Fill in the details to create a new section."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Section Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="Optional: Add section description"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Parent Section (Optional)
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={parentIdInput || ""}
                  onChange={(e) => setParentIdInput(e.target.value || null)}
                >
                  <option value="">No parent (Top-level)</option>
                  {sections
                    .filter((s) => !selected || s.id !== selected.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
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
                    ? "Update Section"
                    : "Create Section"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <SectionTable
        data={sections}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
