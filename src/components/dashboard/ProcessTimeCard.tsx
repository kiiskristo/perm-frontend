import { Clock } from 'lucide-react';

interface ProcessTimeCardProps {
  medianDays: number;
  lowerEstimate: number;
  upperEstimate: number;
  asOfDate: string;
}

export function ProcessTimeCard({ medianDays, lowerEstimate, upperEstimate, asOfDate }: ProcessTimeCardProps) {
  // Simple date formatting - timestamp is already in ET
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">Average Process Time</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold dark:text-white">
            {medianDays} days
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Range: {lowerEstimate}-{upperEstimate} days
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            As of {formatDate(asOfDate)}
          </p>
        </div>
        <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
      </div>
    </div>
  );
} 