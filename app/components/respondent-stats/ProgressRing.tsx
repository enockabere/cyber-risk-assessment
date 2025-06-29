interface ProgressRingProps {
  progress: number;
  size?: number;
}

const ProgressRing = ({ progress, size = 120 }: ProgressRingProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          className="text-blue-600 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-2xl font-bold text-gray-900">
        {progress}%
      </div>
    </div>
  );
};

export default ProgressRing;
