import { Split } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';

interface Props { result: CpiResult; }

function interpolate(s: string, tokens: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in tokens ? String(tokens[k]) : `{${k}}`));
}

export function GapDecomposition({ result }: Props) {
  const { t } = useLanguage();
  const mix = Math.abs(result.decomposition.mixPp);
  const market = Math.abs(result.decomposition.marketPp);
  const total = Math.max(mix + market, 0.0001);
  const mixPct = Math.round((mix / total) * 100);
  const marketPct = 100 - mixPct;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="text-[15px] font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Split className="w-4 h-4 text-[#0066cc]" /> {t('result.decomp.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('result.decomp.sub')}</p>

      <div className="flex h-9 rounded-md overflow-hidden mb-3">
        <div className="bg-[#f97316] text-white text-xs font-semibold flex items-center justify-center" style={{ flex: mix || 0.0001 }}>
          {result.decomposition.mixPp >= 0 ? '+' : ''}{result.decomposition.mixPp.toFixed(2)}pp
        </div>
        <div className="bg-[#6366f1] text-white text-xs font-semibold flex items-center justify-center" style={{ flex: market || 0.0001 }}>
          {result.decomposition.marketPp >= 0 ? '+' : ''}{result.decomposition.marketPp.toFixed(2)}pp
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 text-xs text-gray-600 dark:text-gray-300 mb-3">
        <div className="flex-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#f97316] me-1.5 align-middle" />
          <strong className="text-gray-900 dark:text-gray-100">{t('result.decomp.mix.label')}</strong> — {t('result.decomp.mix.desc')}
        </div>
        <div className="flex-1">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#6366f1] me-1.5 align-middle" />
          <strong className="text-gray-900 dark:text-gray-100">{t('result.decomp.market.label')}</strong> — {t('result.decomp.market.desc')}
        </div>
      </div>

      <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-700/50 px-3.5 py-3 border-s-[3px] border-[#0066cc] rounded">
        {interpolate(t('result.decomp.narrative'), { mixPct, marketPct })}
      </div>
    </div>
  );
}
