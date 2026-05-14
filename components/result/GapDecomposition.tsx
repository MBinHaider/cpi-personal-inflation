import { Split } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';
import { formatNumber, interpolate } from '../../lib/format';

interface Props { result: CpiResult; }

/** Pure predicate — exposed for unit testing. pctOfIncome is a 0–1 fraction. */
export function selectGapNarrativeKey(rentPctOfIncome: number): 'result.decomp.narrative.renter' | 'result.decomp.narrative.noRent' {
  return rentPctOfIncome >= 0.01 ? 'result.decomp.narrative.renter' : 'result.decomp.narrative.noRent';
}

export function GapDecomposition({ result }: Props) {
  const { t, language } = useLanguage();
  const mix = Math.abs(result.decomposition.mixPp);
  const market = Math.abs(result.decomposition.marketPp);
  const total = Math.max(mix + market, 0.0001);
  const mixPct = Math.round((mix / total) * 100);
  const marketPct = 100 - mixPct;

  const rentMetric = result.affordability.find((m) => m.key === 'rent');
  const narrativeKey = selectGapNarrativeKey(rentMetric?.pctOfIncome ?? 0);

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="text-[15px] font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Split className="w-4 h-4 text-[#0066cc]" /> {t('result.decomp.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('result.decomp.sub')}</p>

      <div className="flex h-9 rounded-md overflow-hidden mb-3">
        <div className="bg-[#f97316] text-white text-xs font-semibold flex items-center justify-center" style={{ flex: mix || 0.0001 }}>
          {formatNumber(result.decomposition.mixPp, language, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' })}pp
        </div>
        <div className="bg-[#6366f1] text-white text-xs font-semibold flex items-center justify-center" style={{ flex: market || 0.0001 }}>
          {formatNumber(result.decomposition.marketPp, language, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' })}pp
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

      <div className="bg-gray-50 dark:bg-slate-700/50 px-3.5 py-3 border-s-[3px] border-[#0066cc] rounded">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
          {interpolate(t(`${narrativeKey}.lede`), {
            mixPct: formatNumber(mixPct, language),
            marketPct: formatNumber(marketPct, language),
          })}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {t(`${narrativeKey}.detail`)}
        </p>
      </div>
    </div>
  );
}
