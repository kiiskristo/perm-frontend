'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type CountryKey = 'o' | 'cn' | 'in' | 'mx' | 'ph';

interface CountryDates {
  o: string;
  cn: string;
  in: string;
  mx: string;
  ph: string;
}

interface Section {
  [cat: string]: CountryDates;
}

interface BulletinMonth {
  date: string;
  fad: Section;
  dff?: Section;
}

interface BulletinData {
  last_updated: string;
  months: BulletinMonth[];
}

const CAT_LABELS: Record<string, string> = {
  '1st': '1st Preference',
  '2nd': '2nd Preference (EB-2)',
  '3rd': '3rd Preference (EB-3)',
  ow: 'Other Workers',
  '4th': '4th Preference',
  crw: 'Certain Religious Workers',
  '5u': '5th Unreserved',
};

const ALL_CATS = ['1st', '2nd', '3rd', 'ow', '4th', 'crw', '5u'];
const COUNTRIES: CountryKey[] = ['o', 'cn', 'in', 'mx', 'ph'];

const COUNTRY_LABELS: Record<CountryKey, string> = {
  o: 'All Other',
  cn: 'China',
  in: 'India',
  mx: 'Mexico',
  ph: 'Philippines',
};

const COUNTRY_COLORS: Record<CountryKey, string> = {
  o: '#6366f1',
  cn: '#ef4444',
  in: '#f97316',
  mx: '#22c55e',
  ph: '#3b82f6',
};

const MON: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function parseVD(s: string): number | null {
  if (!s || s === 'C') return null;
  const d = parseInt(s.slice(0, 2));
  const m = MON[s.slice(2, 5).toUpperCase()];
  const y = 2000 + parseInt(s.slice(5, 7));
  if (isNaN(d) || m === undefined || isNaN(y)) return null;
  return new Date(y, m, d).getTime();
}

function fmtVD(s: string): string {
  if (!s || s === 'C') return 'Current';
  const ts = parseVD(s);
  if (!ts) return s;
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fmtYAxis(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function fmtBulletinMonth(s: string): string {
  const parts = s.split(' ');
  if (parts.length !== 2) return s;
  return parts[0].slice(0, 3) + " '" + parts[1].slice(2);
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  chartData: Record<string, string | number | null>[];
}

function CustomTooltip({ active, payload, label, chartData }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const pt = chartData.find((d) => d.label === label);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg min-w-[200px]">
      <p className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">{label}</p>
      {COUNTRIES.map((c) => {
        const raw = (pt?.[`${c}_raw`] as string) || '';
        return (
          <div key={c} className="flex justify-between gap-6 text-xs py-0.5">
            <span style={{ color: COUNTRY_COLORS[c] }} className="font-medium">
              {COUNTRY_LABELS[c]}
            </span>
            <span className="text-gray-700 dark:text-gray-300">{fmtVD(raw)}</span>
          </div>
        );
      })}
    </div>
  );
}

function SectionTable({
  section,
  month,
}: {
  section: 'fad' | 'dff';
  month: BulletinMonth;
}) {
  const sec = section === 'fad' ? month.fad : month.dff;
  if (!sec) {
    return <p className="text-gray-500 dark:text-gray-400 italic text-sm">Not available for this month.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="text-left px-4 py-2.5 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 min-w-[200px]">
              Category
            </th>
            {COUNTRIES.map((c) => (
              <th
                key={c}
                className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 text-center min-w-[110px]"
              >
                {COUNTRY_LABELS[c]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_CATS.map((cat, i) => {
            const row = sec[cat];
            if (!row) return null;
            return (
              <tr
                key={cat}
                className={
                  i % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }
              >
                <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  {CAT_LABELS[cat] || cat}
                </td>
                {COUNTRIES.map((c) => {
                  const val = row[c];
                  const isCurrent = val === 'C';
                  return (
                    <td
                      key={c}
                      className={`px-4 py-2.5 text-center border border-gray-200 dark:border-gray-600 ${
                        isCurrent
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {fmtVD(val)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function BulletinPage() {
  const [data, setData] = useState<BulletinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartCat, setChartCat] = useState('2nd');
  const [chartSection, setChartSection] = useState<'fad' | 'dff'>('fad');
  const [monthRange, setMonthRange] = useState(24);
  const [tableMonthIdx, setTableMonthIdx] = useState(0);

  useEffect(() => {
    fetch('/bulletin.json')
      .then((r) => r.json())
      .then((d: BulletinData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Loading visa bulletin data…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-600 dark:text-red-400">Failed to load bulletin data.</p>
      </div>
    );
  }

  // months[0] = newest; reverse for chart so oldest is on the left
  const chartMonths = [...data.months].reverse().slice(-monthRange);

  const chartData = chartMonths.map((m) => {
    const sec = chartSection === 'fad' ? m.fad : m.dff;
    const cat = sec && sec[chartCat];
    const pt: Record<string, string | number | null> = {
      month: m.date,
      label: fmtBulletinMonth(m.date),
    };
    COUNTRIES.forEach((c) => {
      const raw = cat ? cat[c] : '';
      pt[c] = parseVD(raw);
      pt[`${c}_raw`] = raw || '';
    });
    return pt;
  });

  const hasAnyData = chartData.some((pt) => COUNTRIES.some((c) => pt[c] !== null));
  const tableMonth = data.months[tableMonthIdx];
  const xInterval = Math.max(1, Math.floor(monthRange / 7));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Visa Bulletin Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Track employment-based priority date movements over time
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Last updated:{' '}
          {new Date(data.last_updated).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* ── CHART ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
            Priority Date Trends
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Category */}
            <select
              value={chartCat}
              onChange={(e) => setChartCat(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {ALL_CATS.map((c) => (
                <option key={c} value={c}>
                  {CAT_LABELS[c] || c}
                </option>
              ))}
            </select>

            {/* FAD / DFF toggle */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden text-sm">
              {(['fad', 'dff'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setChartSection(s)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    chartSection === s
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {s === 'fad' ? 'Final Action' : 'Filing Dates'}
                </button>
              ))}
            </div>

            {/* Month range */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden text-sm">
              {[12, 24, 36].map((n) => (
                <button
                  key={n}
                  onClick={() => setMonthRange(n)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    monthRange === n
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {n}mo
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasAnyData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  interval={xInterval}
                />
                <YAxis
                  tickFormatter={fmtYAxis}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  width={68}
                />
                <Tooltip content={({ active, payload, label }) => (
                  <CustomTooltip active={active} payload={payload} label={label as string} chartData={chartData} />
                )} />
                <Legend
                  formatter={(val: string) => COUNTRY_LABELS[val as CountryKey] || val}
                />
                {COUNTRIES.map((c) => (
                  <Line
                    key={c}
                    type="monotone"
                    dataKey={c}
                    stroke={COUNTRY_COLORS[c]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="text-4xl">✓</span>
            <p className="text-lg font-medium">All countries are Current</p>
            <p className="text-sm">No visa backlog for this category — everyone can file regardless of priority date.</p>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Countries at <strong>Current (C)</strong> have no backlog and are not shown on the chart. Click legend items to toggle countries.
        </p>
      </div>

      {/* ── TABLES ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
            Bulletin Details
          </h2>
          <select
            value={tableMonthIdx}
            onChange={(e) => setTableMonthIdx(Number(e.target.value))}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {data.months.map((m, i) => (
              <option key={m.date} value={i}>
                {m.date}
                {i === 0 ? ' (Latest)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Final Action Dates */}
        <div className="mb-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Final Action Dates (FAD)
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              The Final Action Date is the cutoff date a visa must reach before USCIS can approve and issue it.
              Your <strong>priority date</strong> (the date your PERM or I-140 was filed) must be{' '}
              <strong>earlier than</strong> the FAD for your category and country of birth. If it&apos;s not,
              you must wait — even if your petition is otherwise approved.{' '}
              <strong>Current</strong> means there is no backlog; anyone in that category can proceed immediately.
            </p>
          </div>
          <SectionTable section="fad" month={tableMonth} />
        </div>

        {/* Dates for Filing */}
        <div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Dates for Filing (DFF)
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
              The Dates for Filing show when you may <strong>submit</strong> your I-485 adjustment of status
              application — even before a visa is immediately available. Filing early lets you obtain a work permit
              (EAD) and advance parole while you wait. Note: USCIS must separately announce each month whether DFF
              can be used; it is not always authorized even when published in the bulletin.{' '}
              <strong>Current</strong> means filing is open with no date restriction.
            </p>
          </div>
          <SectionTable section="dff" month={tableMonth} />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
          <span>
            <strong>Current</strong> — no backlog; visa available (or filing open) for all priority dates in this
            category
          </span>
        </div>
      </div>
    </div>
  );
}
