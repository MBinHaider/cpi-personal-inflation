import { useState } from 'react';
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
import { ChartWrapper } from '@shared/components/ChartWrapper';
import { PeriodFilter } from '@shared/components/PeriodFilter';
import { useLanguage } from '@shared/contexts/LanguageContext';

interface MonthData {
  date: string;
  officialCpi: number;
  officialYoy: number;
}

interface PersonalTrendChartProps {
  monthlyData: MonthData[];
  personalYoy: number;
}

const PERIODS = ['3M', '6M', '12M'];

function formatDateLabel(date: string): string {
  const [year, month] = date.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function PersonalTrendChart({ monthlyData, personalYoy }: PersonalTrendChartProps) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('12M');

  const periodCount = period === '3M' ? 3 : period === '6M' ? 6 : 12;
  const sliced = monthlyData.slice(-periodCount);

  // Interpolate personal CPI: start slightly lower and trend toward current personalYoy
  const n = sliced.length;
  const startOffset = personalYoy > 0 ? Math.max(personalYoy - 1.5, 0) : personalYoy + 1.5;

  const chartData = sliced.map((m, i) => {
    const progress = n > 1 ? i / (n - 1) : 1;
    const personalVal = startOffset + (personalYoy - startOffset) * progress;
    return {
      label: formatDateLabel(m.date),
      official: m.officialYoy,
      personal: Math.round(personalVal * 100) / 100,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[8px] border border-gray-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="dd-h3 text-gray-900 dark:text-gray-100">{t('chart.title')}</h2>
        <PeriodFilter periods={PERIODS} selected={period} onChange={setPeriod} />
      </div>
      <ChartWrapper height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.15)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid #e0e4e8',
              background: 'white',
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`]}
          />
          <Legend
            iconType="line"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="personal"
            name="Your CPI"
            stroke="#0066cc"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="official"
            name="Official CPI"
            stroke="#6b7280"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ChartWrapper>
    </div>
  );
}
