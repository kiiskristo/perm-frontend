import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyAverageChartProps {
  data: { day: string; average: number }[];
}

export function WeeklyAverageChart({ data }: WeeklyAverageChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Weekly Average Processing</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => [`${value} cases`, 'Average']}
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)', // gray-800
                border: '1px solid rgb(75 85 99)', // gray-600
                borderRadius: '6px',
                color: 'white'
              }}
              labelStyle={{ color: 'white' }}
            />
            <Bar dataKey="average" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 