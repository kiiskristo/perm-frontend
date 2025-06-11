import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MostActiveMonthChartProps {
  data: {
    employer_first_letter: string;
    submit_month: number;
    certified_count: number;
    review_count: number;
  }[];
  mostActiveLetter: string;
  latestActiveMonth: number;
  totalCertifiedCases: number;
}

export function MostActiveMonthChart({ 
  data, 
  mostActiveLetter, 
  latestActiveMonth, 
  totalCertifiedCases 
}: MostActiveMonthChartProps) {
  // Convert month number to month name
  const getMonthName = (monthNum: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || 'Unknown';
  };

  // Custom tooltip component with nice colors
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      name: string;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-medium">{`Letter: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Sort data by total volume (certified + review) descending
  const chartData = data
    .map(item => ({
      letter: item.employer_first_letter,
      certified: item.certified_count,
      review: item.review_count,
      total: item.certified_count + item.review_count
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Most Active Month - {getMonthName(latestActiveMonth)}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Most Active Letter: {mostActiveLetter} | Total: {totalCertifiedCases.toLocaleString()} cases<br/>
        <span className="text-xs">X -letter includes numeric and special character company names</span>
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="letter" 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Bottom stack - Certified cases */}
            <Bar dataKey="certified" stackId="a" fill="#3B82F6" name="Certified" />
            {/* Top stack - Under review cases */}
            <Bar dataKey="review" stackId="a" fill="#10B981" name="Under Review" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 