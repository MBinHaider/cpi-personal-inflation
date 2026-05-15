import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pencil, Share2 } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import monthlyData from '../../data/cpi-monthly.json';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatMonthYearLong, formatPercent, interpolate } from '../../lib/format';
import { Hero } from './Hero';
import { AnswersChips } from './AnswersChips';
import { GapDecomposition } from './GapDecomposition';
import { TopDrivers } from './TopDrivers';
import { AffordabilitySnapshot } from './AffordabilitySnapshot';
import { Recommendations } from './Recommendations';
import { TrendChart } from './TrendChart';

interface Props {
  answers: QuizAnswers;
  result: CpiResult;
  onRetake: () => void;
  onEdit: (stepKey?: string) => void;
}

const SHARE_URL = 'https://cpi-personal-inflation.vercel.app';

export function ResultPage({ answers, result, onRetake, onEdit }: Props) {
  const { t, language } = useLanguage();
  const [showCopied, setShowCopied] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const lastDate = (() => {
    const last = monthlyData.months[monthlyData.months.length - 1]?.date;
    if (!last) return '';
    const [y, m] = last.split('-');
    return formatMonthYearLong(new Date(Number(y), Number(m) - 1, 1), language);
  })();

  const handleShare = async () => {
    const shareText = interpolate(t('result.share.text'), {
      cpi: formatPercent(result.personalYoy, language),
      official: formatPercent(result.officialYoy, language),
      url: SHARE_URL,
    });
    const shareTitle = t('result.share.title');

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: SHARE_URL });
      } catch (err) {
        // AbortError = user cancelled — silent. Re-throw unexpected errors.
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      // Clipboard not available — do nothing
      return;
    }

    if (toastTimerRef.current !== null) {
      clearTimeout(toastTimerRef.current);
    }
    setShowCopied(true);
    toastTimerRef.current = setTimeout(() => {
      setShowCopied(false);
      toastTimerRef.current = null;
    }, 2500);
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{t('result.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t('result.sub')}</p>
        <AnswersChips answers={answers} onEdit={onEdit} />
      </div>
      <Hero result={result} answers={answers} />
      <Recommendations result={result} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopDrivers result={result} incomeSkipped={answers.income === 'skipped'} />
        <AffordabilitySnapshot result={result} onEdit={onEdit} />
      </div>
      <GapDecomposition result={result} />
      <TrendChart personalYoy={result.personalYoy} />

      <div className="flex flex-col items-center gap-1.5 py-5">
        <div className="flex gap-2.5 justify-center">
          <button onClick={onRetake} className="text-xs px-3.5 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
            <RotateCcw className="w-3.5 h-3.5" /> {t('result.cta.retake')}
          </button>
          <button onClick={() => onEdit()} className="text-xs px-3.5 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
            <Pencil className="w-3.5 h-3.5" /> {t('result.cta.edit')}
          </button>
          <button className="text-xs px-3.5 py-2 bg-[#0066cc] text-white border border-[#0066cc] rounded-lg inline-flex items-center gap-1.5 hover:bg-[#0052a3]" onClick={handleShare}>
            <Share2 className="w-3.5 h-3.5" /> {t('result.cta.share')}
          </button>
        </div>
        {showCopied && (
          <span className="text-[11px] text-green-600 dark:text-green-400 transition-opacity duration-200 ease-out">
            {t('result.share.copied')}
          </span>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-2 text-[11px] text-gray-500 dark:text-gray-400 flex justify-between flex-wrap gap-2">
        <span>{t('result.footer.source')}</span>
        <span>{t('result.footer.updated').replace('{month}', lastDate)}</span>
      </div>
    </div>
  );
}
