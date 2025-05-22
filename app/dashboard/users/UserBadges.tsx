import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function RoleBadge({ role }: { role: string }) {
  const getVariant = (): BadgeVariant => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Badge variant={getVariant()} className="font-medium">
      <Shield size={12} className="mr-1" />
      {role}
    </Badge>
  );
}

export function StatusBadge({ status = "active" }: { status?: string }) {
  const getVariant = (): BadgeVariant => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const statusColor =
    {
      active: "bg-green-500",
      inactive: "bg-red-500",
      pending: "bg-yellow-500",
    }[status] || "bg-gray-500";

  return (
    <Badge
      variant={getVariant()}
      className={`font-medium flex items-center gap-1 ${
        status === "active" ? "text-white" : "text-gray-800"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${statusColor}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
