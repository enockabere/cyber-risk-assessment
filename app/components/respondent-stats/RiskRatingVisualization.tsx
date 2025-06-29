import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const riskConfig = {
  Sustainable: {
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    icon: CheckCircle,
    description: "Excellent security posture",
  },
  Moderate: {
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    icon: AlertTriangle,
    description: "Some areas need attention",
  },
  Severe: {
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: AlertTriangle,
    description: "Significant risks identified",
  },
  Critical: {
    color: "from-red-600 to-red-800",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    icon: XCircle,
    description: "Immediate action required",
  },
};

const RiskRatingVisualization = ({
  rating,
}: {
  rating: keyof typeof riskConfig;
}) => {
  const config = riskConfig[rating];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 text-center`}
    >
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className={`text-2xl font-bold ${config.textColor}`}>{rating}</div>
      <p className="text-sm text-gray-600">{config.description}</p>
    </div>
  );
};

export default RiskRatingVisualization;
