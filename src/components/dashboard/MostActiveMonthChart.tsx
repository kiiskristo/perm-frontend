import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MostActiveMonthChartProps {
  data: {
    employer_first_letter: string;
    submit_month: number;
    case_count: number;
    total_count: number;
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

  // Sort data by total count descending
  const chartData = data
    .map(item => ({
      letter: item.employer_first_letter,
      certified: item.case_count,
      total: item.total_count
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
          <ComposedChart
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
              formatter={(value, name) => [`${value} cases`, name]}
              labelFormatter={(label) => `Letter: ${label}`}
            />
            {/* Background bar showing total submitted cases */}
            <Bar dataKey="total" fill="#E5E7EB" name="Total Submitted" />
            {/* Overlapping bar showing certified cases */}
            <Bar dataKey="certified" name="Certified">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.letter === mostActiveLetter ? "#10B981" : "#3B82F6"} 
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 