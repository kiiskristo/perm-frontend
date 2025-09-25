import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyVolumeChartProps {
  data: { date: string; volume: number }[];
}

export function DailyVolumeChart({ data }: DailyVolumeChartProps) {
  // Format date consistently for both tooltip and x-axis
  const formatDate = (dateString: string) => {
    // Ensure consistent date handling by explicitly parsing the date parts
    const [year, month, day] = dateString.split('-').map(Number);
    // Create date using local time (avoid timezone issues)
    return new Date(year, month - 1, day).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Daily Case Volume</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={formatDate}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [`${value} cases`, 'Volume']}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)', // gray-800
                border: '1px solid rgb(75 85 99)', // gray-600
                borderRadius: '6px',
                color: 'white'
              }}
              labelStyle={{ color: 'white' }}
            />
            <Line type="monotone" dataKey="volume" stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 