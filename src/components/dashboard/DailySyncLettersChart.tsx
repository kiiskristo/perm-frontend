import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailySyncLettersChartProps {
  data: {
    employer_first_letter: string;
    submit_month: number;
    case_count: number;
  }[];
  dataDate: string;
}

export function DailySyncLettersChart({ data, dataDate }: DailySyncLettersChartProps) {
  // Aggregate data by letter and filter for at least 10 cases
  const aggregatedData = data.reduce((acc, item) => {
    const letter = item.employer_first_letter;
    if (!acc[letter]) {
      acc[letter] = 0;
    }
    acc[letter] += item.case_count;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format and filter for at least 10 cases
  const chartData = Object.entries(aggregatedData)
    .filter(([, count]) => count >= 10)
    .map(([letter, count]) => ({
      letter,
      count
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Last Sync Letters Activity
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        As of {new Date(dataDate).toLocaleDateString()} (10+ cases only)
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
            <Tooltip 
              formatter={(value) => [`${value} cases`, 'Cases']}
              labelFormatter={(label) => `Letter: ${label}`}
            />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 