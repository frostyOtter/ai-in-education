import { Check } from "lucide-react";
import { FC } from "react";

type CircularProgressProps = {
  progress: number;
  completed: boolean;
};

const CircularProgress: FC<CircularProgressProps> = (props) => {
  const { progress, completed } = props;

  if (completed) {
    return (
      <div className="w-12 h-12 rounded-full  flex items-center justify-center">
        <Check className="w-6 h-6 text-green-500" />
      </div>
    );
  }

  if (progress > 0) {
    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-green-500"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${progress}, 100`}
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-green-600">
            {progress}%
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default CircularProgress;
