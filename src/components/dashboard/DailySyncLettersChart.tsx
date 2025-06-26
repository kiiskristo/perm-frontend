import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  // Color palette for different months
  const monthColors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#A855F7', // Violet
  ];

  // Get color for a month
  const getMonthColor = (monthNum: number) => {
    return monthColors[(monthNum - 1) % monthColors.length];
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        letterMonth: string;
        letter: string;
        month: number;
        monthName: string;
        count: number;
      };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{`Letter: ${data.letter}`}</p>
          <p className="text-gray-700 dark:text-gray-300">{`Month: ${data.monthName}`}</p>
          <p style={{ color: getMonthColor(data.month) }}>{`Cases: ${data.count.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  // Transform data to show individual letter-month combinations
  const chartData = data
    .filter(item => item.certified_count >= 10) // Filter for meaningful data (10+ cases)
    .map(item => ({
      letterMonth: `${item.employer_first_letter}-${getMonthName(item.submit_month).slice(0, 3)}`,
      letter: item.employer_first_letter,
      month: item.submit_month,
      monthName: getMonthName(item.submit_month),
      count: item.certified_count,
      color: getMonthColor(item.submit_month)
    }))
    .sort((a, b) => {
      // Sort by letter first, then by month
      if (a.letter !== b.letter) {
        return a.letter.localeCompare(b.letter);
      }
      return a.month - b.month;
    });

  // Get unique months for legend
  const uniqueMonths = [...new Set(data.map(item => item.submit_month))]
    .sort((a, b) => a - b)
    .map(month => ({
      month,
      name: getMonthName(month),
      color: getMonthColor(month)
    }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Last Sync Letters Activity by Month
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        As of {formatDateSafely(dataDate)} (10+ cases only)<br/>
        <span className="text-xs">X -letter includes numeric and special character company names</span>
      </p>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {uniqueMonths.map(month => (
          <div key={month.month} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: month.color }}
            ></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">{month.name.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="letterMonth" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 