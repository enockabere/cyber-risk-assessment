"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // ✅ Spinner icon

interface AssetModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => Promise<void>; // Ensure it's awaited
  initialData?: { name: string; description?: string };
}

const predefinedAssets = [
  {
    name: "Server Room",
    description:
      "A secure room housing critical servers, networking, and data center equipment.",
  },
  {
    name: "Computer Lab",
    description:
      "Room equipped with multiple computers for student or staff use.",
  },
  {
    name: "Firewall Appliance",
    description:
      "Hardware or software that monitors and controls incoming/outgoing traffic.",
  },
  {
    name: "CCTV System",
    description: "Security camera system for surveillance and monitoring.",
  },
  {
    name: "Wi-Fi Access Points",
    description: "Devices providing wireless internet access across campus.",
  },
  {
    name: "Student Information System",
    description:
      "Core software system managing student records and enrollment.",
  },
  {
    name: "Library Database System",
    description:
      "Digital catalog and access system for the university library.",
  },
  {
    name: "Learning Management System",
    description: "Online platform for course materials and assessments.",
  },
  {
    name: "Biometric Attendance System",
    description: "System for staff/student attendance using biometric input.",
  },
  {
    name: "Backup Storage Server",
    description: "Dedicated server for storing data backups securely.",
  },
  {
    name: "Administrative Laptops",
    description: "Laptops issued to staff and administrative offices.",
  },
  {
    name: "Printers & Scanners",
    description: "Devices used for printing and scanning documents.",
  },
];

export default function AssetModal({
  open,
  onClose,
  onSave,
  initialData,
}: AssetModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await onSave({ name, description });
      setName("");
      setDescription("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (value: string) => {
    const selected = predefinedAssets.find((asset) => asset.name === value);
    if (selected) {
      setName(selected.name);
      setDescription(selected.description || "");
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Asset" : "Add New Asset"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-sm text-gray-600">
              Select from predefined
            </Label>
            <Select onValueChange={handleAssetSelect}>
              <SelectTrigger className="w-full bg-green-50 border border-green-200 text-sm rounded-md focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="Choose an asset..." />
              </SelectTrigger>
              <SelectContent className="bg-green-50 border border-green-200 rounded-md shadow-md text-sm">
                {predefinedAssets.map((asset) => (
                  <SelectItem
                    key={asset.name}
                    value={asset.name}
                    className="hover:bg-green-100 rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm text-gray-600">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Server Room"
              className="bg-gray-50 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-sm text-gray-600">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              className="bg-gray-50 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Asset"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
