import { Lightbulb, Home, UtensilsCrossed, Fuel, Wifi, Car, Sparkles, TrendingDown, Zap, Smartphone, GraduationCap, PiggyBank, Shirt, ArrowRight } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, Recommendation, RecCategory } from '../../lib/types';
import { formatNumber, interpolate } from '../../lib/format';

interface Props { result: CpiResult; }

const CAT_ICON: Record<RecCategory, React.ReactNode> = {
  housing:   <Home className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
  food:      <UtensilsCrossed className="w-5 h-5" />,
  utilities: <Wifi className="w-5 h-5" />,
  lifestyle: <Sparkles className="w-5 h-5" />,
  savings:   <PiggyBank className="w-5 h-5" />,
};

const RULE_ICON_OVERRIDE: Record<string, React.ReactNode> = {
  'petrol-fast-rising': <Fuel className="w-5 h-5" />,
  'internet-deflating': <Wifi className="w-5 h-5" />,
  'mobile-deflating':   <Smartphone className="w-5 h-5" />,
  'private-school-major': <GraduationCap className="w-5 h-5" />,
  'university-grant-info': <GraduationCap className="w-5 h-5" />,
  'clothing-deflating': <Shirt className="w-5 h-5" />,
};

function iconFor(rec: Recommendation): React.ReactNode {
  return RULE_ICON_OVERRIDE[rec.id] ?? CAT_ICON[rec.category];
}

function savingText(rec: Recommendation, t: (k: string) => string, language: 'en' | 'ar'): string {
  const key = rec.priority === 'easy-win' ? 'result.rec.easywin' : 'result.rec.saving';
  return interpolate(t(key), {
    low: formatNumber(rec.savingLow, language),
    high: formatNumber(rec.savingHigh, language),
  });
}

export function Recommendations({ result }: Props) {
  const { t, language } = useLanguage();
  if (result.recommendations.length === 0) return null;

  const [primary, ...quickWins] = result.recommendations;

  return (
    <div className="flex flex-col gap-3">
      <PrimaryActionCard rec={primary} t={t} language={language} />
      {quickWins.length > 0 && (
        <QuickWinsRow recs={quickWins} t={t} language={language} />
      )}
    </div>
  );
}

function PrimaryActionCard({ rec, t, language }: { rec: Recommendation; t: (k: string) => string; language: 'en' | 'ar' }) {
  const isInfo = rec.savingLow === 0 && rec.savingHigh === 0;
  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/15 dark:to-orange-900/15 border-2 border-amber-200 dark:border-amber-900/40 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          {iconFor(rec)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/40 px-2 py-0.5 rounded">
              <Lightbulb className="w-3 h-3 inline mr-1 -mt-0.5" />
              {t('result.recs.tag.major')}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-snug">
            {rec.title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            {rec.why}
          </p>
          {!isInfo && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              {savingText(rec, t, language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickWinsRow({ recs, t, language }: { recs: Recommendation[]; t: (k: string) => string; language: 'en' | 'ar' }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2 ps-1">
        {t('result.recs.quickWinsTitle')}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recs.slice(0, 3).map(rec => <QuickWinCard key={rec.id} rec={rec} t={t} language={language} />)}
      </div>
    </div>
  );
}

function QuickWinCard({ rec, t, language }: { rec: Recommendation; t: (k: string) => string; language: 'en' | 'ar' }) {
  const isInfo = rec.savingLow === 0 && rec.savingHigh === 0;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 hover:border-[#0066cc] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#e8f2ff] dark:bg-[#0066cc]/20 text-[#0066cc] dark:text-blue-300 flex items-center justify-center shrink-0">
          {iconFor(rec)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 leading-snug">
            {rec.title}
          </div>
          {!isInfo && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3" />
              {savingText(rec, t, language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
