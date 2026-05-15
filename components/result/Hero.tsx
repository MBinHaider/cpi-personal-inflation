import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatPercent, formatCurrencyAed, interpolate } from '../../lib/format';
import { pickAnchorKey } from '../../lib/anchorSentence';

interface Props { result: CpiResult; answers: QuizAnswers; }

export function Hero({ result, answers }: Props) {
  const { t, language } = useLanguage();
  const incomeSkipped = answers.income === 'skipped';
  const isPositive = result.difference >= 0;

  // Signed monthly AED delta: positive = paying more, negative = saving
  const signedMonthlyDelta = isPositive
    ? result.estMonthlyExtra
    : -result.estMonthlyExtra;

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

  // Anchor sentence: real-world equivalent for the AED delta
  const anchorKey = incomeSkipped ? null : pickAnchorKey(signedMonthlyDelta);
  const anchorText = anchorKey ? t(anchorKey) : null;

  // Big-number tint: red/amber for positive (paying more), green for negative (saving)
  const bigNumberTint = incomeSkipped
    ? ''
    : isPositive
      ? 'text-red-200'
      : 'text-emerald-300';

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl px-6 py-10 sm:px-10 sm:py-14 shadow-lg">
      <div className="max-w-2xl mx-auto text-center">
        {/* Small-caps context label */}
        <div className="text-xs uppercase tracking-[0.18em] text-white/70 font-medium mb-4">
          {heroLabel}
        </div>

        {/* Big number — fills the screen */}
        <div
          className={[
            'font-bold tracking-tight leading-none',
            'text-[64px] sm:text-[88px] lg:text-[104px]',
            bigNumberTint,
          ].join(' ')}
        >
          {incomeSkipped
            ? formatPercent(result.personalYoy, language, 2, 'always')
            : formatCurrencyAed(signedMonthlyDelta, language, 'always')}
        </div>

        {/* Anchor sentence — grounds the number in real life */}
        {anchorText !== null && (
          <p className="text-[15px] sm:text-base text-white/90 leading-relaxed mt-5">
            {anchorText}
          </p>
        )}

        {/* Skip-income note */}
        {incomeSkipped && (
          <p className="text-[14px] leading-relaxed text-white/85 italic mt-5">
            {t('result.hero.noIncomeNote')}
          </p>
        )}

        {/* Caption row: both % rates in faded text */}
        {rateCaption !== null && (
          <div className="text-[12px] text-white/55 mt-6 leading-snug">
            {rateCaption}
          </div>
        )}
      </div>
    </div>
  );
}
