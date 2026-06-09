'use client';

import { useState, useEffect } from 'react';
import { AdCard } from '@/components/ui/AdCard';
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

// ── Constants ──────────────────────────────────────────────────────────────

const CAT_LABELS: Record<string, string> = {
  '1st': 'EB-1',
  '2nd': 'EB-2',
  '3rd': 'EB-3',
  ow:    'Other Workers',
  '4th': 'EB-4',
  crw:   'Religious Workers',
  '5u':  'EB-5',
};

const TABLE_CAT_LABELS: Record<string, string> = {
  '1st': '1st Preference (EB-1)',
  '2nd': '2nd Preference (EB-2)',
  '3rd': '3rd Preference (EB-3)',
  ow:    'Other Workers',
  '4th': '4th Preference (EB-4)',
  crw:   'Certain Religious Workers',
  '5u':  '5th Unreserved',
};

const ALL_CATS = ['1st', '2nd', '3rd', 'ow', '4th', 'crw', '5u'];
const COUNTRIES: CountryKey[] = ['o', 'cn', 'in', 'mx', 'ph'];

const COUNTRY_LABELS: Record<CountryKey, string> = {
  o:  'All Other',
  cn: 'China',
  in: 'India',
  mx: 'Mexico',
  ph: 'Philippines',
};

const COUNTRY_COLORS: Record<CountryKey, string> = {
  o:  '#3b82f6',
  cn: '#ef4444',
  in: '#f59e0b',
  mx: '#22c55e',
  ph: '#a855f7',
};

const TIME_RANGES = [
  { label: '1Y', months: 12 },
  { label: '2Y', months: 24 },
  { label: '5Y', months: 60 },
  { label: 'All', months: 120 },
];

// ── Date utilities ──────────────────────────────────────────────────────────

const MON: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

const BULLETIN_MON: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

function parseCutoff(s: string): number | null {
  if (!s || s === 'C') return null;
  const d = parseInt(s.slice(0, 2));
  const m = MON[s.slice(2, 5).toUpperCase()];
  const y = 2000 + parseInt(s.slice(5, 7));
  if (isNaN(d) || m === undefined || isNaN(y)) return null;
  return new Date(y, m, d).getTime();
}

function parseBulletinDate(dateStr: string): number {
  const [month, year] = dateStr.split(' ');
  return new Date(parseInt(year), BULLETIN_MON[month] ?? 0, 1).getTime();
}

/** Returns backlog in fractional years. 0 = Current. */
function calcBacklogYears(bulletinDateStr: string, cutoffStr: string): number {
  if (!cutoffStr || cutoffStr === 'C') return 0;
  const bulletinTs = parseBulletinDate(bulletinDateStr);
  const cutoffTs = parseCutoff(cutoffStr);
  if (cutoffTs === null) return 0;
  const diffMs = bulletinTs - cutoffTs;
  return Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
}

function fmtBacklogYears(years: number): string {
  if (years === 0) return 'Current';
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  if (y === 0) return `${m}m`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}m`;
}

function fmtCutoff(s: string): string {
  if (!s || s === 'C') return 'Current';
  const ts = parseCutoff(s);
  if (!ts) return s;
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────

interface TooltipInnerProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  chartData: Record<string, string | number>[];
  visibleCountries: CountryKey[];
}

function CustomTooltip({ active, payload, label, chartData, visibleCountries }: TooltipInnerProps) {
  if (!active || !payload || !payload.length) return null;
  const pt = chartData.find((d) => d.month === label);
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[220px]">
      <p className="font-semibold text-white mb-2 text-sm">{label}</p>
      {visibleCountries.map((c) => {
        const raw = (pt?.[`${c}_raw`] as string) || '';
        const years = pt?.[c] as number;
        return (
          <div key={c} className="flex justify-between gap-6 text-xs py-0.5">
            <span style={{ color: COUNTRY_COLORS[c] }} className="font-medium">
              {COUNTRY_LABELS[c]}
            </span>
            <span className="text-gray-300">
              {raw === 'C' || !raw ? 'Current' : `${fmtBacklogYears(years)} (${fmtCutoff(raw)})`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Table ───────────────────────────────────────────────────────────────────

function SectionTable({ section, month }: { section: 'fad' | 'dff'; month: BulletinMonth }) {
  const sec = section === 'fad' ? month.fad : month.dff;
  if (!sec) return <p className="text-gray-500 dark:text-gray-400 italic text-sm">Not available for this month.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="text-left px-4 py-2.5 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 min-w-[220px]">
              Category
            </th>
            {COUNTRIES.map((c) => (
              <th key={c} className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 text-center min-w-[110px]">
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
              <tr key={cat} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}>
                <td className="px-4 py-2.5 font-medium text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                  {TABLE_CAT_LABELS[cat] || cat}
                </td>
                {COUNTRIES.map((c) => {
                  const val = row[c];
                  const isCurrent = val === 'C';
                  return (
                    <td key={c} className={`px-4 py-2.5 text-center border border-gray-200 dark:border-gray-600 ${
                      isCurrent
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {fmtCutoff(val)}
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

// ── Main Page ────────────────────────────────────────────────────────────────

export default function BulletinPage() {
  const [data, setData] = useState<BulletinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartCat, setChartCat] = useState('2nd');
  const [chartSection, setChartSection] = useState<'fad' | 'dff'>('fad');
  const [monthRange, setMonthRange] = useState(24);
  const [selectedCountry, setSelectedCountry] = useState<'all' | CountryKey>('all');
  const [tableMonthIdx, setTableMonthIdx] = useState(0);

  useEffect(() => {
    fetch('/bulletin.json')
      .then((r) => r.json())
      .then((d: BulletinData) => { setData(d); setLoading(false); })
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

  // months[0] = newest — reverse for chart so oldest is left
  const chartMonths = [...data.months].reverse().slice(-monthRange);

  const visibleCountries: CountryKey[] = selectedCountry === 'all' ? COUNTRIES : [selectedCountry];

  const chartData = chartMonths.map((m) => {
    const sec = chartSection === 'fad' ? m.fad : m.dff;
    const cat = sec && sec[chartCat];
    const pt: Record<string, string | number> = { month: m.date };
    COUNTRIES.forEach((c) => {
      const raw = cat ? cat[c] : '';
      pt[c] = calcBacklogYears(m.date, raw || '');
      pt[`${c}_raw`] = raw || '';
    });
    return pt;
  });

  const tableMonth = data.months[tableMonthIdx];

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
            month: 'long', day: 'numeric', year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Chart ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Priority Date Backlog Over Time
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            How many years behind each country&apos;s cutoff date is — lower is better
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4 mb-6">
          {/* FAD / DFF */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden text-sm">
            {(['fad', 'dff'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setChartSection(s)}
                className={`px-4 py-2 font-medium transition-colors ${
                  chartSection === s
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {s === 'fad' ? 'Final Action Dates' : 'Dates for Filing'}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden text-sm">
            {TIME_RANGES.map(({ label, months }) => (
              <button
                key={label}
                onClick={() => setMonthRange(months)}
                className={`px-3 py-2 font-medium transition-colors ${
                  monthRange === months
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category */}
          <select
            value={chartCat}
            onChange={(e) => setChartCat(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[100px]"
          >
            {ALL_CATS.map((c) => (
              <option key={c} value={c}>{CAT_LABELS[c] || c}</option>
            ))}
          </select>

          {/* Country */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as 'all' | CountryKey)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[140px]"
          >
            <option value="all">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{COUNTRY_LABELS[c]}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={90}
              />
              <YAxis
                tickFormatter={fmtBacklogYears}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={72}
                domain={[0, 'auto']}
              />
              <Tooltip
                content={({ active, payload, label }) => (
                  <CustomTooltip
                    active={active}
                    payload={payload}
                    label={label as string}
                    chartData={chartData}
                    visibleCountries={visibleCountries}
                  />
                )}
              />
              <Legend
                formatter={(val: string) => COUNTRY_LABELS[val as CountryKey] || val}
                wrapperStyle={{ paddingTop: '8px' }}
              />
              {visibleCountries.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2}
                  dot={{ r: 3, fill: COUNTRY_COLORS[c] }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Y-axis = years of backlog between the bulletin month and the priority date cutoff.
          <strong> Current</strong> = no wait — the cutoff has caught up to today.
        </p>
      </div>

      <AdCard adSlot="2964232736" />

      {/* ── Tables ── */}
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
                {m.date}{i === 0 ? ' (Latest)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Final Action Dates */}
        <div className="mb-10">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Final Action Dates (FAD)</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              Your <strong>priority date</strong> must be <strong>earlier than</strong> the Final Action Date for
              USCIS to approve and issue your visa. If your date hasn&apos;t been reached yet, you must wait —
              even if your petition is otherwise approved. <strong>Current</strong> means no backlog; anyone in
              that category can proceed immediately.
            </p>
          </div>
          <SectionTable section="fad" month={tableMonth} />
        </div>

        {/* Dates for Filing */}
        <div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">Dates for Filing (DFF)</h3>
            <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
              When your priority date is past the Dates for Filing cutoff, you may <strong>submit your I-485</strong>{' '}
              adjustment of status application early — even before a visa is immediately available. This lets you
              get a work permit (EAD) and advance parole while waiting. USCIS must authorize DFF use each month
              separately. <strong>Current</strong> means filing is open with no date restriction.
            </p>
          </div>
          <SectionTable section="dff" month={tableMonth} />
        </div>

        <div className="flex items-center gap-2 mt-6 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
          <span><strong>Current</strong> — no backlog; this category has no waiting line</span>
        </div>
      </div>
    </div>
  );
}
