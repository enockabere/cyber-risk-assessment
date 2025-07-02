import { useEffect, useState } from "react";
import { ShieldCheck, Target, Clock } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import RiskRatingVisualization from "./RiskRatingVisualization";
import { RiskLevel } from "@/app/types/assessment";

interface Props {
  rating: RiskLevel;
  loading: boolean;
  lastSubmissionDate: string | null;
}

const RiskRatingCard = ({ rating, loading, lastSubmissionDate }: Props) => {
  const [complianceStatus, setComplianceStatus] = useState<string | null>(null);

  const formattedDate = lastSubmissionDate
    ? new Date(lastSubmissionDate).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No submission yet";

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await fetch("/api/framework-check");
        const data = await res.json();

        console.log(data)

        if (!data.answered) {
          setComplianceStatus(null); // unanswered
        } else if (
          data.selectedOption.toLowerCase().includes("none") ||
          data.selectedOption.toLowerCase().includes("other")
        ) {
          setComplianceStatus("Not compliant with global security standards");
        } else {
          setComplianceStatus("Compliant with global security standards");
        }
      } catch (err) {
        console.error("❌ Error fetching compliance status", err);
      }
    };

    fetchCompliance();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Assessment
          </h3>
          <p className="text-sm text-gray-500">Your overall security rating</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : rating ? (
        <>
          <RiskRatingVisualization rating={rating} />
          {complianceStatus && (
            <div className="mt-4 text-sm text-center font-medium text-gray-700">
              ✅ {complianceStatus}
            </div>
          )}
          <div className="mt-6 text-sm text-gray-500 text-center flex justify-center items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {formattedDate}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            Complete the assessment to see your risk rating
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskRatingCard;
