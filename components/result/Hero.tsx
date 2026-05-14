import { Building2, ArrowUpRight, Banknote } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatPercent, formatCurrencyAed, formatNumber, interpolate } from '../../lib/format';

interface Props { result: CpiResult; answers: QuizAnswers; }

export function Hero({ result, answers }: Props) {
  const { t, language } = useLanguage();
  const incomeSkipped = answers.income === 'skipped';
  const isPositive = result.difference >= 0;
  const verdictKey = isPositive ? 'result.hero.verdict.more' : 'result.hero.verdict.less';
  const verdict = incomeSkipped
    ? null
    : interpolate(t(verdictKey), {
        ppDiff: formatNumber(Math.abs(result.difference), language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        basket: formatNumber(result.estMonthlyBasket, language),
        extra: formatNumber(Math.abs(result.estMonthlyExtra), language),
      });

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 items-center shadow-lg">
      <div>
        <div className="text-xs uppercase tracking-widest text-white/80 font-medium mb-1.5">
          {t('result.hero.label')}
        </div>
        <div className="text-[56px] font-semibold tracking-tight leading-none mb-2">
          {formatPercent(result.personalYoy, language, 2, 'always')}
        </div>
        {verdict !== null && (
          <div className="text-[15px] leading-relaxed text-white/95">{verdict}</div>
        )}
        {incomeSkipped && (
          <p className="text-[13px] leading-relaxed text-white/80 italic mt-1">
            {t('result.hero.noIncomeNote')}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Stat icon={<Building2 className="w-4 h-4" />} label={t('result.hero.stat.official')} value={formatPercent(result.officialYoy, language, 2, 'always')} />
        <Stat icon={<ArrowUpRight className="w-4 h-4" />} label={t('result.hero.stat.difference')} value={`${formatNumber(result.difference, language, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' })} pp`} />
        {!incomeSkipped && <Stat icon={<Banknote className="w-4 h-4" />} label={t('result.hero.stat.basket')} value={formatCurrencyAed(result.estMonthlyBasket, language)} />}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/15 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-white/80">{icon}</span>
        <span className="text-xs text-white/85">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
