import { Lightbulb, Home, UtensilsCrossed, Fuel, Wifi, Car, Sparkles, TrendingDown, Zap, Smartphone, GraduationCap, PiggyBank, Shirt } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult, Recommendation, RecCategory } from '../../lib/types';
import { interpolate } from '../../lib/format';

interface Props { result: CpiResult; }

const CAT_ICON: Record<RecCategory, React.ReactNode> = {
  housing:   <Home className="w-[18px] h-[18px]" />,
  transport: <Car className="w-[18px] h-[18px]" />,
  food:      <UtensilsCrossed className="w-[18px] h-[18px]" />,
  utilities: <Wifi className="w-[18px] h-[18px]" />,
  lifestyle: <Sparkles className="w-[18px] h-[18px]" />,
  savings:   <PiggyBank className="w-[18px] h-[18px]" />,
};

const RULE_ICON_OVERRIDE: Record<string, React.ReactNode> = {
  'petrol-fast-rising': <Fuel className="w-[18px] h-[18px]" />,
  'internet-deflating': <Wifi className="w-[18px] h-[18px]" />,
  'mobile-deflating':   <Smartphone className="w-[18px] h-[18px]" />,
  'private-school-major': <GraduationCap className="w-[18px] h-[18px]" />,
  'university-grant-info': <GraduationCap className="w-[18px] h-[18px]" />,
  'clothing-deflating': <Shirt className="w-[18px] h-[18px]" />,
};

export function Recommendations({ result }: Props) {
  const { t } = useLanguage();
  if (result.recommendations.length === 0) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="text-[15px] font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Lightbulb className="w-4 h-4 text-[#0066cc]" /> {t('result.rec.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('result.rec.sub')}</p>
      <div className="flex flex-col gap-2.5">
        {result.recommendations.map(r => <Card key={r.id} rec={r} t={t} />)}
      </div>
    </div>
  );
}

function Card({ rec, t }: { rec: Recommendation; t: (k: string) => string }) {
  const icon = RULE_ICON_OVERRIDE[rec.id] ?? CAT_ICON[rec.category];
  const isEasyWin = rec.priority === 'easy-win';
  const isInfo = rec.savingLow === 0 && rec.savingHigh === 0;
  const savingKey = isEasyWin ? 'result.rec.easywin' : 'result.rec.saving';
  const savingText = interpolate(t(savingKey), { low: rec.savingLow, high: rec.savingHigh });
  return (
    <div className="flex gap-3.5 p-4 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-[#0066cc] transition-colors">
      <div className="w-9 h-9 rounded-lg bg-[#0066cc] text-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{rec.title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{rec.why}</div>
        {!isInfo && (
          <span className={[
            'inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold',
            isEasyWin ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-[#d1fae5] text-[#065f46]',
          ].join(' ')}>
            {isEasyWin ? <Zap className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {savingText}
          </span>
        )}
      </div>
    </div>
  );
}
