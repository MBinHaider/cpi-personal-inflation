import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pencil, Share2, BarChart2, Gauge, GitCompareArrows, LineChart } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import monthlyData from '../../data/cpi-monthly.json';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatMonthYearLong, formatPercent, interpolate } from '../../lib/format';
import { Hero } from './Hero';
import { AnswersChips } from './AnswersChips';
import { CollapsibleSection } from './CollapsibleSection';
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
    <div className="flex flex-col gap-5">
      {/* Page title — concise, plain language */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{t('result.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('result.sub')}</p>
      </div>

      {/* Hero — dramatic gradient + status pill + big AED + comparison */}
      <Hero result={result} answers={answers} />

      {/* Recommendations — primary action + quick wins */}
      <Recommendations result={result} />

      {/* Analytical sections — collapsed by default for naive users */}
      <CollapsibleSection
        title={t('result.drivers.title')}
        icon={<BarChart2 className="w-4 h-4" />}
        summary={t('result.drivers.sub')}
      >
        <TopDrivers result={result} incomeSkipped={answers.income === 'skipped'} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('result.afford.title')}
        icon={<Gauge className="w-4 h-4" />}
        summary={t('result.afford.sub')}
      >
        <AffordabilitySnapshot result={result} onEdit={onEdit} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('result.decomp.title')}
        icon={<GitCompareArrows className="w-4 h-4" />}
        summary={t('result.decomp.sub')}
      >
        <GapDecomposition result={result} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t('result.trend.title')}
        icon={<LineChart className="w-4 h-4" />}
        summary={t('result.trend.sub')}
      >
        <TrendChart personalYoy={result.personalYoy} />
      </CollapsibleSection>

      {/* Answer chips at the bottom — "Based on: ..." summary, still clickable */}
      <div className="mt-3">
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
          {t('result.basedOn')}
        </div>
        <AnswersChips answers={answers} onEdit={onEdit} />
      </div>

      {/* Action row */}
      <div className="flex flex-col items-center gap-1.5 pt-3">
        <div className="flex gap-2.5 justify-center flex-wrap">
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

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4 text-[11px] text-gray-500 dark:text-gray-400 flex justify-between flex-wrap gap-2">
        <span>{t('result.footer.source')}</span>
        <span>{t('result.footer.updated').replace('{month}', lastDate)}</span>
      </div>
    </div>
  );
}
