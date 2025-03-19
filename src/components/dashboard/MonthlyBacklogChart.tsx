import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface MonthlyBacklogData {
  month: string;
  backlog: number;
  is_active: boolean;
  withdrawn: number;
}

interface MonthlyBacklogChartProps {
  data: MonthlyBacklogData[];
}

export function MonthlyBacklogChart({ data }: MonthlyBacklogChartProps) {
  // Find the first active month
  const firstActiveIndex = data.findIndex(item => item.is_active);
  
  // If there's an active month, show from that month onward
  const processedData = firstActiveIndex >= 0
    ? data.slice(firstActiveIndex)
    : data.slice(-12);
    
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Backlog</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45} 
              textAnchor="end"
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => value.toLocaleString()} 
            />
            <Tooltip 
              formatter={(value) => value.toLocaleString()} 
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar 
              dataKey="backlog" 
              name="Backlog"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.is_active ? "#3b82f6" : "#93c5fd"} />
              ))}
            </Bar>
            <Bar 
              dataKey="withdrawn" 
              name="Withdrawn" 
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-withdrawn-${index}`} 
                  fill={entry.is_active ? "transparent" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Active Month</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-300 mr-1"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">To Be Processed Month</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Withdrawn (reduced from baclog)</span>
          </div>
        </div>
      </div>
    </div>
  );
} 