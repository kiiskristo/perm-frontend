import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MostActiveMonthChartProps {
  data: {
    employer_first_letter: string;
    submit_month: number;
    case_count: number;
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

  // Sort data by case count descending
  const chartData = data
    .map(item => ({
      letter: item.employer_first_letter,
      count: item.case_count
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Most Active Month - {getMonthName(latestActiveMonth)}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Most Active Letter: {mostActiveLetter} | Total: {totalCertifiedCases.toLocaleString()} cases<br/>
        <span className="text-xs">Letters include numeric and special character company names</span>
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
            <Bar dataKey="count">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.letter === mostActiveLetter ? "#10B981" : "#6B7280"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 