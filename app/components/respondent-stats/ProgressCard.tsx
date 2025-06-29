import { Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import ProgressRing from "./ProgressRing";
import { StatsData } from "@/app/types/assessment";

interface Props {
  stats: StatsData | null;
  loading: boolean;
}

const ProgressCard = ({ stats, loading }: Props) => {
  const total = stats?.totalQuestions ?? 0;
  const answered = stats?.answeredQuestions ?? 0;
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Assessment Progress
          </h3>
          <p className="text-sm text-gray-500">Track your completion status</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <ProgressRing progress={progress} />
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {answered}
                <span className="text-lg text-gray-500">/{total}</span>
              </div>
              <p className="text-sm text-gray-500">Questions Completed</p>
            </div>
          </div>

          <div className="space-y-3">
            <ProgressStatus
              label="Background Info"
              success={stats?.backgroundCompleted}
            />
            <ProgressStatus
              label="Questions"
              success={stats?.allQuestionsAnswered}
              pending
            />
          </div>
        </>
      )}
    </div>
  );
};

const ProgressStatus = ({
  label,
  success,
  pending = false,
}: {
  label: string;
  success?: boolean;
  pending?: boolean;
}) => (
  <div className="flex justify-between bg-gray-50 p-3 rounded-xl">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span
      className={`flex items-center gap-2 font-medium ${
        success ? "text-green-600" : pending ? "text-amber-600" : "text-red-500"
      }`}
    >
      {success ? (
        <CheckCircle className="w-4 h-4" />
      ) : pending ? (
        <Clock className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {success ? "Complete" : pending ? "In Progress" : "Incomplete"}
    </span>
  </div>
);

export default ProgressCard;
