import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  bgColorClass?: string;
  icon: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  bgColorClass = "bg-blue-100 dark:bg-blue-900/30", 
  icon: Icon,
  iconColor = "text-blue-600 dark:text-blue-400",
  children 
}: MetricsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold dark:text-white">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </div>
          )}
          {children}
        </div>
        <div className={`h-12 w-12 ${bgColorClass} rounded-full flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
} 