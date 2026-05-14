import { ReactNode, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { formatNumber, formatStepIndicator } from '../lib/format';

interface Props {
  stepIndex: number;                                    // 0-based position in active steps
  stepCount: number;                                    // total active steps
  title: string;
  sub?: string;
  children: ReactNode;                                  // the answer options grid
  onBack?: () => void;                                  // hidden on first step
  onNext?: () => void;                                  // disabled until valid
  nextDisabled?: boolean;
  nextLabel?: string;                                   // override "Next"
  skipLabel?: string;
  onSkip?: () => void;
}

export function QuestionScreen({
  stepIndex, stepCount, title, sub, children,
  onBack, onNext, nextDisabled, nextLabel, skipLabel, onSkip,
}: Props) {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, [stepIndex]);

  const Forward = isRtl ? ArrowLeft : ArrowRight;
  const Backward = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-7 shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        {onBack ? (
          <button onClick={onBack} aria-label={t('common.back')} className="h-8 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center px-2 text-gray-500 hover:border-[#0066cc] hover:text-[#0066cc]">
            <Backward className="w-4 h-4" />
            <span className="hidden sm:inline ms-1.5 text-xs font-medium">{t('common.back')}</span>
          </button>
        ) : <span className="w-8 h-8" />}

        <div className="flex gap-1.5" role="presentation">
          {Array.from({ length: stepCount }).map((_, i) => (
            <span
              key={i}
              className={[
                'h-2 rounded-full transition-all',
                i === stepIndex ? 'w-6 bg-[#0066cc]' : i < stepIndex ? 'w-2 bg-[#93c5fd]' : 'w-2 bg-gray-200 dark:bg-slate-600',
              ].join(' ')}
            />
          ))}
        </div>

        <span className="text-xs text-gray-400" aria-live="polite">{formatStepIndicator(stepIndex + 1, stepCount, language)}</span>
      </div>

      <div className="text-[11px] font-semibold tracking-[0.14em] text-[#0066cc] uppercase mb-1">
        {t('wizard.questionLabel').replace('{n}', formatNumber(stepIndex + 1, language))}
      </div>
      <h2 ref={titleRef} tabIndex={-1} className="text-[22px] font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-2 outline-none">
        {title}
      </h2>
      {sub && <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">{sub}</p>}

      <div>{children}</div>

      <div className="flex items-center justify-between mt-7">
        {onSkip ? (
          <button onClick={onSkip} className="text-xs text-gray-500 underline hover:text-[#0066cc]">
            {skipLabel}
          </button>
        ) : <span />}
        {onNext ? (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
          >
            {nextLabel ?? t('common.next')}
            <Forward className="w-4 h-4" />
          </button>
        ) : <span />}
      </div>
    </div>
  );
}
