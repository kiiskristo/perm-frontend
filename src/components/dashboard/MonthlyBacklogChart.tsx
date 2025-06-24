import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';

interface MonthlyBacklogData {
  month: string;
  year: number;
  backlog: number;
  is_active: boolean;
  withdrawn: number;
  denied: number;
  rfi: number;
}

interface MonthlyBacklogChartProps {
  data: MonthlyBacklogData[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonthlyBacklogData;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{`Month: ${label}`}</p>
        <p className="text-blue-600 dark:text-blue-400">{`Backlog: ${data.backlog.toLocaleString()}`}</p>
        {data.withdrawn > 0 && (
          <p className="text-yellow-600 dark:text-yellow-400">{`Withdrawn: ${data.withdrawn.toLocaleString()}`}</p>
        )}
        {data.denied > 0 && (
          <p className="text-red-600 dark:text-red-400">{`Denied: ${data.denied.toLocaleString()}`}</p>
        )}
        {data.rfi > 0 && (
          <p className="text-orange-600 dark:text-orange-400">{`RFI: ${data.rfi.toLocaleString()}`}</p>
        )}
      </div>
    );
  }
  return null;
};

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
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="backlog" 
              name="Backlog"
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.is_active ? "#3b82f6" : "#93c5fd"} />
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
        </div>
      </div>
    </div>
  );
} 