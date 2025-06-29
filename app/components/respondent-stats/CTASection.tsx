import { ArrowRight, TrendingUp } from "lucide-react";
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
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  let title = "Start Your Cybersecurity Assessment";
  let description = "Get personalized insights into your security posture.";
  let buttonLabel = "Begin Assessment";
  let gradient = "from-blue-600 to-purple-600";

  if (answered > 0 && progress < 100) {
    title = "Continue Your Assessment";
    description = `You're ${progress}% done. Complete to see your full risk analysis.`;
    buttonLabel = "Continue Assessment";
    gradient = "from-amber-500 to-orange-600";
  } else if (progress === 100) {
    title = "Update Your Security Assessment";
    description = "Retake the assessment to stay up to date.";
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
        </div>
      </div>
    </div>
  );
};

export default CTASection;
