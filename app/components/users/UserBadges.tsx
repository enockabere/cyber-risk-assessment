import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
  return (
    <Badge variant="outline" className="font-medium">
      <Shield size={12} className="mr-1" />
      {role}
    </Badge>
  );
}

export function StatusBadge({ status = "active" }: { status?: string }) {
  const statusMap: Record<string, { label: string; bg: string; text: string }> =
    {
      active: {
        label: "Active",
        bg: "bg-green-500",
        text: "text-white",
      },
      inactive: {
        label: "Inactive",
        bg: "bg-red-500",
        text: "text-white",
      },
      pending: {
        label: "Pending",
        bg: "bg-yellow-400",
        text: "text-gray-800",
      },
    };

  const { label, bg, text } = statusMap[status] || {
    label: status,
    bg: "bg-gray-400",
    text: "text-white",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <span className="w-2 h-2 rounded-full bg-white opacity-70" />
      {label}
    </div>
  );
}
