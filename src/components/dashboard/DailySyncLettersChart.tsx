import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailySyncLettersChartProps {
  data: {
    employer_first_letter: string;
    submit_month: number;
    certified_count: number;
  }[];
  dataDate: string;
}

export function DailySyncLettersChart({ data, dataDate }: DailySyncLettersChartProps) {
  // Utility function to safely format dates without timezone issues
  const formatDateSafely = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString();
  };

  // Convert month number to month name
  const getMonthName = (monthNum: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || 'Unknown';
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        letter: string;
        count: number;
        monthsActive: string;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-medium">{`Letter: ${label}`}</p>
          <p className="text-purple-600 dark:text-purple-400">{`Cases: ${data.count}`}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{`Active in: ${data.monthsActive}`}</p>
        </div>
      );
    }
    return null;
  };

  // Aggregate data by letter and collect month information
  const aggregatedData = data.reduce((acc, item) => {
    const letter = item.employer_first_letter;
    if (!acc[letter]) {
      acc[letter] = { count: 0, monthData: [] };
    }
    acc[letter].count += item.certified_count;
    acc[letter].monthData.push({ month: item.submit_month, cases: item.certified_count });
    return acc;
  }, {} as Record<string, { count: number; monthData: Array<{ month: number; cases: number }> }>);

  // Convert to array format and filter for at least 10 cases
  const chartData = Object.entries(aggregatedData)
    .filter(([, data]) => data.count >= 10)
    .map(([letter, data]) => {
      // Only show months that have at least 10% of the total cases for this letter
      const significantMonths = data.monthData
        .filter(monthData => monthData.cases >= data.count * 0.1)
        .map(monthData => getMonthName(monthData.month))
        .sort();
      
      return {
        letter,
        count: data.count,
        monthsActive: significantMonths.join(', ')
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Last Sync Letters Activity
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        As of {formatDateSafely(dataDate)} (10+ cases only)<br/>
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
            <Bar dataKey="count" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 