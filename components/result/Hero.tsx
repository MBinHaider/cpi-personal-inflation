import { Building2, ArrowUpRight, Banknote, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatPercent, formatCurrencyAed, formatNumber, interpolate } from '../../lib/format';
import { deriveAffordabilityStatus } from '../../lib/affordabilityStatus';
import type { AffordabilityStatus, AffordabilityStatusKind } from '../../lib/affordabilityStatus';

interface Props { result: CpiResult; answers: QuizAnswers; }

function getBadgeClasses(kind: AffordabilityStatusKind): string {
  const base = 'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium w-fit mb-3';
  switch (kind) {
    case 'alert': return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
    case 'warn':  return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300`;
    case 'ok':    return `${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300`;
    default:      return base;
  }
}

function getBadgeLabel(
  status: AffordabilityStatus,
  t: (key: string) => string,
  language: 'en' | 'ar',
): string {
  if (status.kind === 'ok') return t('result.status.ok');
  if (status.kind === 'noData') return '';
  // alert or warn — metricKey is guaranteed when kind is alert/warn
  const metricKey = status.metricKey ?? 'rent';
  const translationKey = `result.status.${status.kind}.${metricKey}`;
  const pctFormatted = formatPercent((status.pct ?? 0) * 100, language, 0, 'never');
  return interpolate(t(translationKey), { pct: pctFormatted });
}

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

  // Signed monthly AED delta: positive = paying more, negative = saving
  const signedMonthlyDelta = isPositive
    ? result.estMonthlyExtra
    : -result.estMonthlyExtra;

  const status = deriveAffordabilityStatus(result.affordability);

  const BadgeIcon =
    status.kind === 'alert' ? AlertTriangle :
    status.kind === 'warn'  ? AlertCircle :
    CheckCircle2;

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 items-center shadow-lg">
      <div>
        {status.kind !== 'noData' && (
          <div className={getBadgeClasses(status.kind)}>
            <BadgeIcon className="size-3.5 shrink-0" />
            <span>{getBadgeLabel(status, t, language)}</span>
          </div>
        )}
        <div className="text-xs uppercase tracking-widest text-white/80 font-medium mb-1.5">
          {t('result.hero.label')}
        </div>
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2 mb-2">
          <div className="text-[56px] font-semibold tracking-tight leading-none">
            {formatPercent(result.personalYoy, language, 2, 'always')}
          </div>
          {!incomeSkipped && (
            <div className="flex flex-col justify-end pb-1">
              <span className="text-[28px] font-semibold tracking-tight leading-tight">
                {formatCurrencyAed(signedMonthlyDelta, language, 'always')}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-white/75 leading-tight">
                {t('result.hero.aedDeltaLabel')}
              </span>
            </div>
          )}
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
