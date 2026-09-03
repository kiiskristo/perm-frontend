import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

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
  dayDistribution?: {
    day: number;
    certified_count: number;
    review_count: number;
  }[];
  mostActiveDay?: number;
}

export function MostActiveMonthChart({
  data,
  mostActiveLetter,
  latestActiveMonth,
  totalCertifiedCases,
  dayDistribution,
  mostActiveDay,
}: MostActiveMonthChartProps) {
  const [view, setView] = useState<'letter' | 'day'>('letter');

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
          <p className="font-medium">{view === 'letter' ? `Letter: ${label}` : `Day of Month: ${label}`}</p>
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

  // Sort data alphabetically by letter (A-Z)
  const chartData = data
    .map(item => ({
      letter: item.employer_first_letter,
      certified: item.certified_count,
      review: item.review_count,
      total: item.certified_count + item.review_count
    }))
    .sort((a, b) => a.letter.localeCompare(b.letter));

  // Transform day distribution data
  const dayChartData = (dayDistribution ?? [])
    .map(item => ({
      day: item.day,
      certified: item.certified_count,
      review: item.review_count,
    }))
    .sort((a, b) => a.day - b.day);

  const hasDayDistribution = !!dayDistribution && dayDistribution.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h3 className="text-lg font-semibold dark:text-white">
          Most Active Month - {getMonthName(latestActiveMonth)}
        </h3>
        {hasDayDistribution && (
          <SegmentedControl
            size="sm"
            className="w-auto"
            value={view}
            onChange={(v) => setView(v as 'letter' | 'day')}
            options={[
              { value: 'letter', label: 'By Letter' },
              { value: 'day', label: 'By Day' },
            ]}
          />
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Most Active Letter: {mostActiveLetter} | Total: {totalCertifiedCases.toLocaleString()} cases
        {view === 'letter' && (
          <>
            <br />
            <span className="text-xs">X -letter includes numeric and special character company names</span>
          </>
        )}
        {view === 'day' && mostActiveDay !== undefined && (
          <>
            <br />
            <span className="text-xs">Most active submission day: {mostActiveDay}</span>
          </>
        )}
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={view === 'letter' ? chartData : dayChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey={view === 'letter' ? 'letter' : 'day'}
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
