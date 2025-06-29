import { ArrowRight, TrendingUp, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsData } from "@/app/types/assessment";

interface Props {
  stats: StatsData | null;
  onContinue: () => void;
  loadingRedirect: boolean;
}

const CTASection = ({ stats, onContinue, loadingRedirect }: Props) => {
  const total = stats?.totalQuestions ?? 0;
  const answered = stats?.answeredQuestions ?? 0;
  const assetCount = stats?.assetCount ?? 0;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Handle different states based on assets and progress
  if (assetCount === 0) {
    return (
      <div className="col-span-full mt-12">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <div className="max-w-xl mx-auto space-y-4">
            <Package className="w-10 h-10 mx-auto" />
            <h2 className="text-2xl font-bold">Assign Your Assets First</h2>
            <p className="text-purple-100">
              Select the IT assets your organization owns to begin your
              cybersecurity risk assessment.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/assets")}
              className="bg-white text-purple-700 hover:bg-purple-50"
              disabled={loadingRedirect}
            >
              <Settings className="w-4 h-4 mr-2" />
              Assign Assets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="col-span-full mt-12">
        <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl p-8 text-white text-center shadow-xl">
          <div className="max-w-xl mx-auto space-y-4">
            <TrendingUp className="w-10 h-10 mx-auto" />
            <h2 className="text-2xl font-bold">Assessment Setup in Progress</h2>
            <p className="text-gray-300">
              No questions are available yet for your assigned assets. Please
              check back later or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  let title = "Start Your Cybersecurity Assessment";
  let description = `Answer ${total} questions about your ${assetCount} assigned asset${
    assetCount !== 1 ? "s" : ""
  }.`;
  let buttonLabel = "Begin Assessment";
  let gradient = "from-blue-600 to-purple-600";

  if (answered > 0 && progress < 100) {
    title = "Continue Your Assessment";
    description = `You're ${progress}% done (${answered}/${total} questions). Complete your assessment for ${assetCount} asset${
      assetCount !== 1 ? "s" : ""
    }.`;
    buttonLabel = "Continue Assessment";
    gradient = "from-amber-500 to-orange-600";
  } else if (progress === 100) {
    title = "Assessment Complete!";
    description = `You've completed all ${total} questions for your ${assetCount} asset${
      assetCount !== 1 ? "s" : ""
    }. Retake to update your security posture.`;
    buttonLabel = "Retake Assessment";
    gradient = "from-green-500 to-teal-600";
  }

  return (
    <div className="col-span-full mt-12">
      <div
        className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white text-center shadow-xl`}
      >
        <div className="max-w-xl mx-auto space-y-4">
          <TrendingUp className="w-10 h-10 mx-auto" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/90">{description}</p>
          <Button
            onClick={onContinue}
            className="bg-white text-gray-800 hover:bg-gray-100"
            disabled={loadingRedirect}
          >
            {loadingRedirect ? (
              "Redirecting..."
            ) : (
              <>
                {buttonLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
          {assetCount > 0 && (
            <div className="mt-4 text-sm text-white/80">
              <Package className="w-4 h-4 inline mr-1" />
              {assetCount} asset{assetCount !== 1 ? "s" : ""} • {total}{" "}
              questions total
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTASection;
