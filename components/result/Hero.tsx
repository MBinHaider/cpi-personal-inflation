import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatPercent, formatCurrencyAed } from '../../lib/format';
import { pickAnchorKey } from '../../lib/anchorSentence';
import { useCountUp } from '../../lib/useCountUp';
import { deriveAffordabilityStatus } from '../../lib/affordabilityStatus';
import type { AffordabilityStatus, AffordabilityStatusKind } from '../../lib/affordabilityStatus';
import { interpolate } from '../../lib/format';

interface Props { result: CpiResult; answers: QuizAnswers; }

function statusPillClasses(kind: AffordabilityStatusKind): string {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm';
  switch (kind) {
    case 'alert': return `${base} bg-red-500/20 text-red-100 ring-1 ring-red-300/30`;
    case 'warn':  return `${base} bg-amber-500/20 text-amber-100 ring-1 ring-amber-300/30`;
    case 'ok':    return `${base} bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-300/30`;
    default:      return base;
  }
}

function statusText(
  status: AffordabilityStatus,
  t: (k: string) => string,
  language: 'en' | 'ar',
): string {
  if (status.kind === 'ok') return t('result.status.ok');
  if (status.kind === 'noData') return '';
  const metricKey = status.metricKey ?? 'rent';
  const pctFormatted = formatPercent((status.pct ?? 0) * 100, language, 0, 'never');
  return interpolate(t(`result.status.${status.kind}.${metricKey}`), { pct: pctFormatted });
}

export function Hero({ result, answers }: Props) {
  const { t, language } = useLanguage();
  const incomeSkipped = answers.income === 'skipped';
  const isPositive = result.difference >= 0;

  const signedMonthlyDelta = isPositive
    ? result.estMonthlyExtra
    : -result.estMonthlyExtra;

  // Animated count-up: number rises from 0 to actual on mount
  const animatedAed = useCountUp(signedMonthlyDelta);
  const animatedPersonal = useCountUp(result.personalYoy);

  const heroLabel = incomeSkipped
    ? t('result.hero.label')
    : isPositive
      ? t('result.hero.aedLabel.positive')
      : t('result.hero.aedLabel.negative');

  const anchorKey = incomeSkipped ? null : pickAnchorKey(signedMonthlyDelta);
  const anchorText = anchorKey ? t(anchorKey) : null;

  const status = deriveAffordabilityStatus(result.affordability);

  const StatusIcon =
    status.kind === 'alert' ? AlertTriangle :
    status.kind === 'warn'  ? AlertCircle :
    CheckCircle2;

  const bigTint = incomeSkipped
    ? 'text-white'
    : isPositive
      ? 'text-red-200'
      : 'text-emerald-300';

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
      {/* Dramatic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3d] via-[#0a4a8a] to-[#0066cc]" />

      {/* Animated glow halos behind the number */}
      <div className="absolute -top-32 -end-24 w-[420px] h-[420px] rounded-full bg-[#2b8af0]/30 blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute -bottom-24 -start-24 w-[320px] h-[320px] rounded-full bg-[#7c3aed]/20 blur-3xl animate-pulse-slower pointer-events-none" />

      {/* Top-edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative px-6 py-10 sm:px-12 sm:py-16 text-white">
        <div className="max-w-2xl mx-auto text-center">
          {/* Status pill — integrated into hero */}
          {status.kind !== 'noData' && (
            <div className="flex justify-center mb-6">
              <div className={statusPillClasses(status.kind)}>
                <StatusIcon className="w-3 h-3 shrink-0" />
                <span>{statusText(status, t, language)}</span>
              </div>
            </div>
          )}

          {/* Small-caps label */}
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/65 font-medium mb-4">
            {heroLabel}
          </div>

          {/* Big animated number with subtle text-shadow glow */}
          <div
            className={[
              'font-bold tracking-tight leading-none tabular-nums',
              'text-[68px] sm:text-[96px] lg:text-[120px]',
              'drop-shadow-[0_4px_30px_rgba(255,255,255,0.18)]',
              bigTint,
            ].join(' ')}
          >
            {incomeSkipped
              ? formatPercent(animatedPersonal, language, 2, 'always')
              : formatCurrencyAed(animatedAed, language, 'always')}
          </div>

          {/* Anchor sentence */}
          {anchorText !== null && (
            <p className="text-[15px] sm:text-base text-white/90 leading-relaxed mt-6 max-w-md mx-auto">
              {anchorText}
            </p>
          )}

          {incomeSkipped && (
            <p className="text-[14px] leading-relaxed text-white/85 italic mt-6 max-w-md mx-auto">
              {t('result.hero.noIncomeNote')}
            </p>
          )}

          {/* Rate comparison row */}
          {!incomeSkipped && (
            <div className="mt-10 flex items-stretch justify-center gap-6 sm:gap-10 text-start">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/55 mb-1">
                  {t('result.hero.yourRate')}
                </div>
                <div className={`text-2xl sm:text-3xl font-bold tabular-nums ${isPositive ? 'text-red-200' : 'text-emerald-300'}`}>
                  {formatPercent(result.personalYoy, language, 2, 'always')}
                </div>
              </div>
              <div className="w-px bg-white/20 self-stretch" aria-hidden="true" />
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/55 mb-1">
                  {t('result.hero.dubaiAvg')}
                </div>
                <div className="text-2xl sm:text-3xl font-bold tabular-nums text-white/90">
                  {formatPercent(result.officialYoy, language, 2, 'always')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Local keyframes (Tailwind doesn't ship slow pulses by default) */}
      <style>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.5 } 50% { opacity: 0.9 } }
        @keyframes pulse-slower { 0%, 100% { opacity: 0.3 } 50% { opacity: 0.6 } }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 9s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
