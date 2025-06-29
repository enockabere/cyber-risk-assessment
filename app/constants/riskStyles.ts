export const riskMatrix: Record<string, Record<string, string>> = {
  VERY_LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Sustainable",
    HIGH: "Moderate",
    VERY_HIGH: "Severe",
  },
  LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  MEDIUM: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Moderate",
    HIGH: "Severe",
    VERY_HIGH: "Critical",
  },
  HIGH: {
    VERY_LOW: "Sustainable",
    LOW: "Moderate",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
  VERY_HIGH: {
    VERY_LOW: "Moderate",
    LOW: "Severe",
    MEDIUM: "Severe",
    HIGH: "Critical",
    VERY_HIGH: "Critical",
  },
};

export const riskColors = {
  Sustainable: "#00D2AA",
  Moderate: "#FFB020",
  Severe: "#FF6B35",
  Critical: "#FF1744",
};

export const riskStyles: Record<
  string,
  { bg: string; tooltip: string; icon: string }
> = {
  Critical: {
    bg: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
    tooltip: "Immediate action required",
    icon: "🔴",
  },
  Severe: {
    bg: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
    tooltip: "High priority for mitigation",
    icon: "🟠",
  },
  Moderate: {
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
    tooltip: "Monitor and address as needed",
    icon: "🟡",
  },
  Sustainable: {
    bg: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
    tooltip: "Low risk, maintain controls",
    icon: "🟢",
  },
  "Not Rated": {
    bg: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg",
    tooltip: "No rating available",
    icon: "⚪",
  },
};

export const levelLabels = ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"];
export const displayLabels = ["Very Low", "Low", "Medium", "High", "Very High"];

export const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  red: "from-red-500 to-red-600",
  orange: "from-orange-500 to-orange-600",
  purple: "from-purple-500 to-purple-600",
};
