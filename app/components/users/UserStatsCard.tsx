import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface UserStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor:
    | "indigo"
    | "emerald"
    | "amber"
    | "violet"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple";
  bgColor:
    | "indigo"
    | "emerald"
    | "amber"
    | "violet"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple";
  borderColor:
    | "indigo"
    | "emerald"
    | "amber"
    | "violet"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple";
}

const colorMap = {
  indigo: {
    bgFrom: "from-green-50",
    bgTo: "to-green-50/50",
    border: "border-green-200/60 hover:border-green-300/80",
    gradientFrom: "from-green-500/5",
    gradientTo: "to-green-600/5",
    iconBgFrom: "from-green-100",
    iconBgTo: "to-green-200/80",
    iconColor: "text-green-600",
    textColor: "text-green-700/80",
    dotColor: "bg-green-500",
  },
  emerald: {
    bgFrom: "from-emerald-50",
    bgTo: "to-emerald-50/50",
    border: "border-emerald-200/60 hover:border-emerald-300/80",
    gradientFrom: "from-emerald-500/5",
    gradientTo: "to-emerald-600/5",
    iconBgFrom: "from-emerald-100",
    iconBgTo: "to-emerald-200/80",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-700/80",
    dotColor: "bg-emerald-500",
  },
  amber: {
    bgFrom: "from-amber-50",
    bgTo: "to-amber-50/50",
    border: "border-amber-200/60 hover:border-amber-300/80",
    gradientFrom: "from-amber-500/5",
    gradientTo: "to-amber-600/5",
    iconBgFrom: "from-amber-100",
    iconBgTo: "to-amber-200/80",
    iconColor: "text-amber-600",
    textColor: "text-amber-700/80",
    dotColor: "bg-amber-500",
  },
  violet: {
    bgFrom: "from-violet-50",
    bgTo: "to-violet-50/50",
    border: "border-violet-200/60 hover:border-violet-300/80",
    gradientFrom: "from-violet-500/5",
    gradientTo: "to-violet-600/5",
    iconBgFrom: "from-violet-100",
    iconBgTo: "to-violet-200/80",
    iconColor: "text-violet-600",
    textColor: "text-violet-700/80",
    dotColor: "bg-violet-500",
  },
  blue: {
    bgFrom: "from-blue-50",
    bgTo: "to-blue-50/50",
    border: "border-blue-200/60 hover:border-blue-300/80",
    gradientFrom: "from-blue-500/5",
    gradientTo: "to-blue-600/5",
    iconBgFrom: "from-blue-100",
    iconBgTo: "to-blue-200/80",
    iconColor: "text-blue-600",
    textColor: "text-blue-700/80",
    dotColor: "bg-blue-500",
  },
  red: {
    bgFrom: "from-red-50",
    bgTo: "to-red-50/50",
    border: "border-red-200/60 hover:border-red-300/80",
    gradientFrom: "from-red-500/5",
    gradientTo: "to-red-600/5",
    iconBgFrom: "from-red-100",
    iconBgTo: "to-red-200/80",
    iconColor: "text-red-600",
    textColor: "text-red-700/80",
    dotColor: "bg-red-500",
  },
  green: {
    bgFrom: "from-green-50",
    bgTo: "to-green-50/50",
    border: "border-green-200/60 hover:border-green-300/80",
    gradientFrom: "from-green-500/5",
    gradientTo: "to-green-600/5",
    iconBgFrom: "from-green-100",
    iconBgTo: "to-green-200/80",
    iconColor: "text-green-600",
    textColor: "text-green-700/80",
    dotColor: "bg-green-500",
  },
  yellow: {
    bgFrom: "from-yellow-50",
    bgTo: "to-yellow-50/50",
    border: "border-yellow-200/60 hover:border-yellow-300/80",
    gradientFrom: "from-yellow-500/5",
    gradientTo: "to-yellow-600/5",
    iconBgFrom: "from-yellow-100",
    iconBgTo: "to-yellow-200/80",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-700/80",
    dotColor: "bg-yellow-500",
  },
  purple: {
    bgFrom: "from-purple-50",
    bgTo: "to-purple-50/50",
    border: "border-purple-200/60 hover:border-purple-300/80",
    gradientFrom: "from-purple-500/5",
    gradientTo: "to-purple-600/5",
    iconBgFrom: "from-purple-100",
    iconBgTo: "to-purple-200/80",
    iconColor: "text-purple-600",
    textColor: "text-purple-700/80",
    dotColor: "bg-purple-500",
  },
};

export function UserStatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
}: UserStatsCardProps) {
  const colors = colorMap[iconColor]; // Using iconColor for all colors to maintain consistency

  return (
    <Card
      className={`group relative overflow-hidden bg-gradient-to-br ${colors.bgFrom} via-white ${colors.bgTo} ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-transparent ${colors.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p
              className={`text-sm font-medium ${colors.textColor} tracking-wide uppercase`}
            >
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 tabular-nums">
              {value}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div
                className={`w-2 h-2 ${colors.dotColor} rounded-full animate-pulse`}
              />
              {description}
            </div>
          </div>
          <div className="relative">
            <div
              className={`h-14 w-14 bg-gradient-to-br ${colors.iconBgFrom} ${colors.iconBgTo} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105`}
            >
              <Icon className={`h-7 w-7 ${colors.iconColor}`} />
            </div>
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 ${colors.dotColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
