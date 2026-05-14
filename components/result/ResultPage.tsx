import { RotateCcw, Pencil, Share2 } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import monthlyData from '../../data/cpi-monthly.json';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { formatMonthYearLong } from '../../lib/format';
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
  onEdit: () => void;
}

export function ResultPage({ answers, result, onRetake, onEdit }: Props) {
  const { t, language } = useLanguage();
  const lastDate = (() => {
    const last = monthlyData.months[monthlyData.months.length - 1]?.date;
    if (!last) return '';
    const [y, m] = last.split('-');
    return formatMonthYearLong(new Date(Number(y), Number(m) - 1, 1), language);
  })();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">{t('result.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{t('result.sub')}</p>
        <AnswersChips answers={answers} onEdit={onEdit} />
      </div>
      <Hero result={result} answers={answers} />
      <GapDecomposition result={result} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopDrivers result={result} />
        <AffordabilitySnapshot result={result} onEdit={onEdit} />
      </div>
      <Recommendations result={result} />
      <TrendChart personalYoy={result.personalYoy} />

      <div className="flex gap-2.5 justify-center py-5">
        <button onClick={onRetake} className="text-xs px-3.5 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
          <RotateCcw className="w-3.5 h-3.5" /> {t('result.cta.retake')}
        </button>
        <button onClick={onEdit} className="text-xs px-3.5 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
          <Pencil className="w-3.5 h-3.5" /> {t('result.cta.edit')}
        </button>
        <button className="text-xs px-3.5 py-2 bg-[#0066cc] text-white border border-[#0066cc] rounded-lg inline-flex items-center gap-1.5 hover:bg-[#0052a3]" onClick={() => { /* v1.1 share stub */ }}>
          <Share2 className="w-3.5 h-3.5" /> {t('result.cta.share')}
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 pt-4 mt-2 text-[11px] text-gray-500 dark:text-gray-400 flex justify-between flex-wrap gap-2">
        <span>{t('result.footer.source')}</span>
        <span>{t('result.footer.updated').replace('{month}', lastDate)}</span>
      </div>
    </div>
  );
}
