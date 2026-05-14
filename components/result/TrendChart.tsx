import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';
import { ChartWrapper } from '@shared/components/ChartWrapper';
import { PeriodFilter } from '@shared/components/PeriodFilter';
import { useLanguage } from '@shared/contexts/LanguageContext';
import monthlyData from '../../data/cpi-monthly.json';

interface MonthRow { date: string; officialCpi: number; officialYoy: number; }

interface Props { personalYoy: number; }

const PERIODS = ['3M', '6M', '12M'];

function formatLabel(date: string) {
  const [y, m] = date.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function TrendChart({ personalYoy }: Props) {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState('12M');
  const months: MonthRow[] = monthlyData.months;
  const count = period === '3M' ? 3 : period === '6M' ? 6 : 12;
  const sliced = months.slice(-count);

  const n = sliced.length;
  const startOffset = personalYoy > 0 ? Math.max(personalYoy - 1.5, 0) : personalYoy + 1.5;
  const chartData = sliced.map((m, i) => {
    const progress = n > 1 ? i / (n - 1) : 1;
    const personal = startOffset + (personalYoy - startOffset) * progress;
    return { label: formatLabel(m.date), official: m.officialYoy, personal: Math.round(personal * 100) / 100 };
  });

  const isRtl = language === 'ar';

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-[15px] font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <LineChartIcon className="w-4 h-4 text-[#0066cc]" /> {t('result.trend.title')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('result.trend.sub')}</p>
        </div>
        <PeriodFilter periods={PERIODS} selected={period} onChange={setPeriod} />
      </div>
      <ChartWrapper height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.15)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} reversed={isRtl} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={['auto', 'auto']} orientation={isRtl ? 'right' : 'left'} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e0e4e8', background: 'white' }} formatter={(value: number) => [`${value.toFixed(2)}%`]} />
          <Legend iconType="line" wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="personal" name={t('result.trend.yours')} stroke="#0066cc" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="official" name={t('result.trend.official')} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ChartWrapper>
    </div>
  );
}
