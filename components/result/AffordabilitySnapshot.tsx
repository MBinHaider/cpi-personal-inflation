import { Gauge, Home, Car, UtensilsCrossed, PiggyBank } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, AffordabilityMetric, AffordabilityKey } from '../../lib/types';

interface Props { result: CpiResult; }

const ICON: Record<AffordabilityKey, React.ReactElement> = {
  rent:      <Home className="w-3 h-3" />,
  transport: <Car className="w-3 h-3" />,
  eating:    <UtensilsCrossed className="w-3 h-3" />,
  headroom:  <PiggyBank className="w-3 h-3" />,
};

const LABEL_KEY: Record<AffordabilityKey, string> = {
  rent: 'result.afford.rent',
  transport: 'result.afford.transport',
  eating: 'result.afford.eating',
  headroom: 'result.afford.headroom',
};

export function AffordabilitySnapshot({ result }: Props) {
  const { t } = useLanguage();
  if (result.affordability.length === 0) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="text-[15px] font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Gauge className="w-4 h-4 text-[#0066cc]" /> {t('result.afford.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('result.afford.sub')}</p>
      <div className="flex flex-col gap-3.5">
        {result.affordability.map(m => <Row key={m.key} metric={m} t={t} />)}
      </div>
    </div>
  );
}

function Row({ metric, t }: { metric: AffordabilityMetric; t: (k: string) => string }) {
  const pct = Math.min(1, Math.max(0, metric.pctOfIncome));
  const fillCls =
    metric.status === 'alert' ? 'bg-[#ef4444]' :
    metric.status === 'warn' ? 'bg-[#f97316]' :
    'bg-[#0066cc]';
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
          <span className="text-gray-500">{ICON[metric.key]}</span>
          {t(LABEL_KEY[metric.key])}
        </span>
        <div className="flex gap-2.5 text-gray-500">
          <span>{t('result.afford.benchmark')} <strong className="text-gray-900 dark:text-gray-100">{Math.round(metric.benchmarkPct * 100)}%</strong></span>
          <strong className="text-gray-900 dark:text-gray-100">{Math.round(metric.pctOfIncome * 100)}%</strong>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-slate-700 rounded-full h-2 relative overflow-visible">
        <div className={`h-full rounded-full ${fillCls}`} style={{ width: `${pct * 100}%` }} />
        <div className="absolute -top-1 -bottom-1 w-0.5 bg-gray-900 dark:bg-gray-100" style={{ insetInlineStart: `${Math.min(1, metric.benchmarkPct) * 100}%` }} />
      </div>
    </div>
  );
}
