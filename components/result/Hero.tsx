import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
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

  // Signed monthly AED delta: positive = paying more, negative = saving
  const signedMonthlyDelta = isPositive
    ? result.estMonthlyExtra
    : -result.estMonthlyExtra;

  // Verdict: short declarative sentence, only when income is known
  const verdictKey = isPositive ? 'result.hero.verdict.more' : 'result.hero.verdict.less';
  const verdict = incomeSkipped
    ? null
    : interpolate(t(verdictKey), {
        ppDiff: formatNumber(Math.abs(result.difference), language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      });

  // Context-dependent small-caps label above the big number
  const heroLabel = incomeSkipped
    ? t('result.hero.label')
    : isPositive
      ? t('result.hero.aedLabel.positive')
      : t('result.hero.aedLabel.negative');

  // Caption row: personal % and official % — shown only when income is known
  const rateCaption = incomeSkipped
    ? null
    : interpolate(t('result.hero.rateCaption'), {
        personal: formatPercent(result.personalYoy, language, 2, 'always'),
        official: formatPercent(result.officialYoy, language, 2, 'always'),
      });

  const status = deriveAffordabilityStatus(result.affordability);

  const BadgeIcon =
    status.kind === 'alert' ? AlertTriangle :
    status.kind === 'warn'  ? AlertCircle :
    CheckCircle2;

  // Big-number tint: red/amber for positive (paying more), green for negative (saving)
  const bigNumberClass = incomeSkipped
    ? 'text-[56px] font-semibold tracking-tight leading-none'
    : isPositive
      ? 'text-[56px] font-semibold tracking-tight leading-none text-red-200'
      : 'text-[56px] font-semibold tracking-tight leading-none text-emerald-300';

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl p-8 shadow-lg">
      <div className="max-w-2xl">
        {status.kind !== 'noData' && (
          <div className={getBadgeClasses(status.kind)}>
            <BadgeIcon className="size-3.5 shrink-0" />
            <span>{getBadgeLabel(status, t, language)}</span>
          </div>
        )}

        {/* Small-caps context label */}
        <div className="text-xs uppercase tracking-widest text-white/80 font-medium mb-1.5">
          {heroLabel}
        </div>

        {/* Big number: AED when income known, % when skipped */}
        <div className={bigNumberClass}>
          {incomeSkipped
            ? formatPercent(result.personalYoy, language, 2, 'always')
            : formatCurrencyAed(signedMonthlyDelta, language, 'always')}
        </div>

        {/* Verdict sentence */}
        {verdict !== null && (
          <div className="text-[15px] leading-relaxed text-white/95 mt-2">{verdict}</div>
        )}

        {/* Skip-income note */}
        {incomeSkipped && (
          <p className="text-[13px] leading-relaxed text-white/80 italic mt-1">
            {t('result.hero.noIncomeNote')}
          </p>
        )}

        {/* Caption row: both % rates in faded text — replaces stat pills */}
        {rateCaption !== null && (
          <div className="text-[12px] text-white/55 mt-3 leading-snug">
            {rateCaption}
          </div>
        )}
      </div>
    </div>
  );
}
