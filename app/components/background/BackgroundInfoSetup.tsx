"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface BackgroundFieldInput {
  label: string;
  fieldType: "TEXT" | "DROPDOWN" | "DATE" | "NUMBER";
  options: string;
}

const defaultBackgroundFields: BackgroundFieldInput[] = [
  {
    label: "1. Indicate your institution type",
    fieldType: "DROPDOWN",
    options: "Public,Private",
  },
  {
    label:
      "2. Which one of the following best describes your position at the University?",
    fieldType: "DROPDOWN",
    options:
      "Senior management,ICT manager,Database Administrator,Network Administrator,System administrator,ICT student support,Cyber security",
  },
  {
    label: "3. Highest Qualification",
    fieldType: "DROPDOWN",
    options: "Certificate,Diploma,BSc/BA,MSc/MA,PhD,Other",
  },
  {
    label: "4. Years of service in the Higher Learning Industry",
    fieldType: "DROPDOWN",
    options: "0-1 year,1-2 years,2-5 years,5-10 years,> 10 years",
  },
  {
    label: "5. Years of service in your current position",
    fieldType: "DROPDOWN",
    options: "0-1 year,1-2 years,2-5 years,5-10 years,> 10 years",
  },
];

export default function BackgroundInfoSetup() {
  const router = useRouter();

  const [fields, setFields] = useState<BackgroundFieldInput[]>(
    defaultBackgroundFields
  );
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (
    index: number,
    key: keyof BackgroundFieldInput,
    value: string
  ) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const addField = () => {
    setFields([...fields, { label: "", fieldType: "TEXT", options: "" }]);
  };

  const saveFields = async () => {
    setSaving(true);

    const payload = fields.map((f) => ({
      label: f.label,
      fieldType: f.fieldType,
      options:
        f.fieldType === "DROPDOWN"
          ? f.options.split(",").map((opt) => opt.trim())
          : [],
    }));

    const res = await fetch(`/api/admin/background`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      Swal.fire("Success", "Background info saved", "success").then(() => {
        router.push(`/dashboard/admin/questions`);
      });
    } else {
      Swal.fire("Error", "Failed to save background info", "error");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Background Information Setup</h2>
      {fields.map((field, index) => (
        <div key={index} className="border p-4 rounded space-y-2">
          <Input
            value={field.label}
            onChange={(e) => handleFieldChange(index, "label", e.target.value)}
            placeholder="Field Label (e.g. Institution Name)"
          />
          <select
            value={field.fieldType}
            onChange={(e) =>
              handleFieldChange(
                index,
                "fieldType",
                e.target.value as BackgroundFieldInput["fieldType"]
              )
            }
            className="w-full p-2 border rounded"
          >
            <option value="TEXT">Text</option>
            <option value="DROPDOWN">Dropdown</option>
            <option value="DATE">Date</option>
            <option value="NUMBER">Number</option>
          </select>
          {field.fieldType === "DROPDOWN" && (
            <Textarea
              value={field.options}
              onChange={(e) =>
                handleFieldChange(index, "options", e.target.value)
              }
              placeholder="Enter dropdown options, comma separated"
            />
          )}
        </div>
      ))}

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={addField}>
          + Add Field
        </Button>
        <Button
          disabled={saving}
          onClick={saveFields}
          className="bg-indigo-600 text-white"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
