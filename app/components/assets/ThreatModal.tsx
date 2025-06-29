"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RiskLevel } from "@/app/lib/utils/risk-rating";
import { predefinedThreats } from "@/app/data/predefinedThreats";

interface ThreatModalProps {
  open: boolean;
  onClose: () => void;
  assetName: string;
  threats: {
    id: string;
    title: string;
    description?: string;
    riskLevel: RiskLevel;
    mitigations: { id: string; description: string }[];
  }[];
  onAddThreat: (data: {
    title: string;
    description?: string;
    riskLevel: RiskLevel;
  }) => void;
}

export default function ThreatModal({
  open,
  onClose,
  assetName,
  threats,
  onAddThreat,
}: ThreatModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "">("");
  const selectInputStyle =
    "w-full bg-green-50 border border-green-200 text-sm rounded-md focus:ring-green-500 focus:border-green-500";

  const handleSubmit = () => {
    if (!title.trim() || !riskLevel) return;
    onAddThreat({ title, description, riskLevel: riskLevel as RiskLevel });
    setTitle("");
    setDescription("");
    setRiskLevel("");
  };

  const handlePredefinedSelect = (value: string) => {
    const selected = predefinedThreats[assetName]?.find(
      (t) => t.title === value
    );
    if (selected) {
      setTitle(selected.title);
      setDescription(selected.description);
      setRiskLevel(selected.riskLevel);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Manage Threats for:{" "}
            <span className="text-green-700">{assetName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Existing Threats */}
        <div className="space-y-2 max-h-60 overflow-auto border border-gray-100 p-2 rounded">
          {threats.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No threats defined yet.
            </p>
          ) : (
            threats.map((threat) => (
              <div
                key={threat.id}
                className="border border-gray-100 rounded-md p-2"
              >
                <div className="font-semibold text-gray-800">
                  {threat.title}
                </div>
                <div className="text-sm text-gray-600">
                  {threat.description}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  Risk: {threat.riskLevel}
                </div>
                {threat.mitigations.length > 0 && (
                  <ul className="text-xs text-green-700 list-disc ml-5 mt-1">
                    {threat.mitigations.map((m) => (
                      <li key={m.id}>{m.description}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        {/* Predefined Threat Dropdown */}
        {predefinedThreats[assetName] && (
          <div className="pt-4">
            <Label className="text-sm text-gray-600">
              Select Predefined Threat
            </Label>
            <Select onValueChange={handlePredefinedSelect}>
              <SelectTrigger className={selectInputStyle}>
                <SelectValue placeholder="Choose a threat..." />
              </SelectTrigger>
              <SelectContent className="bg-green-50 border border-green-200 rounded-md shadow-md text-sm">
                {predefinedThreats[assetName].map((t) => (
                  <SelectItem key={t.title} value={t.title}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Add New Threat */}
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title" className="text-sm text-gray-600">
              Threat Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unauthorized Access"
              className="text-sm"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm text-gray-600">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about the threat"
              className="text-sm"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-600">Risk Level</Label>
            <Select
              onValueChange={(value) => setRiskLevel(value as RiskLevel)}
              value={riskLevel}
            >
              <SelectTrigger className={selectInputStyle}>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent className="bg-green-50 border border-green-200 rounded-md shadow-md text-sm">
                {["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"].map(
                  (level) => (
                    <SelectItem key={level} value={level}>
                      {level.replace("_", " ")}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Add Threat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
