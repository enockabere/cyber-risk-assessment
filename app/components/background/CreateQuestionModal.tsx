"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RiskOption {
  text: string;
  probability?: string;
  impact?: string;
  controlDescription?: string;
  residualProbability?: string;
  residualImpact?: string;
}

interface Props {
  onSuccess: () => void;
  existing?: {
    id: string;
    text: string;
    position: number;
    options: RiskOption[];
  };
}

export default function CreateQuestionModal({ onSuccess, existing }: Props) {
  const [text, setText] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [options, setOptions] = useState<RiskOption[]>([
    {
      text: "",
      probability: "",
      impact: "",
      controlDescription: "",
      residualProbability: "",
      residualImpact: "",
    },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setText(existing.text);
      setPosition(existing.position);
      setOptions(
        existing.options.length
          ? existing.options
          : [
              {
                text: "",
                probability: "",
                impact: "",
                controlDescription: "",
                residualProbability: "",
                residualImpact: "",
              },
            ]
      );
    }
  }, [existing]);

  const addOption = () => {
    setOptions([
      ...options,
      {
        text: "",
        probability: "",
        impact: "",
        controlDescription: "",
        residualProbability: "",
        residualImpact: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    setSaving(true);

    const payload = {
      text,
      position,
      options,
    };

    const res = await fetch(
      existing?.id
        ? `/api/admin/questions/${existing.id}`
        : "/api/admin/questions",
      {
        method: existing?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (res.ok) {
      onSuccess();
    } else {
      alert("❌ Failed to save question.");
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <label className="text-sm font-medium">Question Text</label>
        <Input
          placeholder="e.g. Is access to the database restricted?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Position</label>
        <Input
          type="number"
          placeholder="e.g. 1"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold">Answer Options</label>
        {options.map((opt, i) => (
          <div key={i} className="border p-3 rounded-md bg-gray-50 space-y-3">
            <Input
              placeholder="Option text"
              value={opt.text}
              onChange={(e) => {
                const copy = [...options];
                copy[i].text = e.target.value;
                setOptions(copy);
              }}
            />
            <div className="flex gap-2">
              <select
                className="w-1/2 p-2 border rounded"
                value={opt.probability}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i].probability = e.target.value;
                  setOptions(copy);
                }}
              >
                <option value="">Risk Probability (optional)</option>
                <option>VERY_LOW</option>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>VERY_HIGH</option>
              </select>

              <select
                className="w-1/2 p-2 border rounded"
                value={opt.impact}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i].impact = e.target.value;
                  setOptions(copy);
                }}
              >
                <option value="">Risk Impact (optional)</option>
                <option>VERY_LOW</option>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>VERY_HIGH</option>
              </select>
            </div>

            <Input
              placeholder="Control Description (optional)"
              value={opt.controlDescription || ""}
              onChange={(e) => {
                const copy = [...options];
                copy[i].controlDescription = e.target.value;
                setOptions(copy);
              }}
            />

            <div className="flex gap-2">
              <select
                className="w-1/2 p-2 border rounded"
                value={opt.residualProbability || ""}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i].residualProbability = e.target.value;
                  setOptions(copy);
                }}
              >
                <option value="">Residual Probability</option>
                <option>VERY_LOW</option>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>VERY_HIGH</option>
              </select>

              <select
                className="w-1/2 p-2 border rounded"
                value={opt.residualImpact || ""}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i].residualImpact = e.target.value;
                  setOptions(copy);
                }}
              >
                <option value="">Residual Impact</option>
                <option>VERY_LOW</option>
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>VERY_HIGH</option>
              </select>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addOption}>
          + Add Option
        </Button>
      </div>

      <Button
        className="mt-6 w-full bg-green-600 text-white"
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving
          ? existing
            ? "Updating..."
            : "Saving..."
          : existing
          ? "Update Question"
          : "Save Question"}
      </Button>
    </div>
  );
}
