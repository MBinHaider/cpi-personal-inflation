import { BarChart2, Home, Car, UtensilsCrossed, Apple, Shirt, HeartPulse, Smartphone, GraduationCap, Wine, Sofa, Landmark } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';

interface Props { result: CpiResult; }

const DIV_ICON: Record<string, React.ReactNode> = {
  '01': <Apple className="w-[18px] h-[18px]" />,
  '02': <Wine className="w-[18px] h-[18px]" />,
  '03': <Shirt className="w-[18px] h-[18px]" />,
  '04': <Home className="w-[18px] h-[18px]" />,
  '05': <Sofa className="w-[18px] h-[18px]" />,
  '06': <HeartPulse className="w-[18px] h-[18px]" />,
  '07': <Car className="w-[18px] h-[18px]" />,
  '08': <Smartphone className="w-[18px] h-[18px]" />,
  '10': <GraduationCap className="w-[18px] h-[18px]" />,
  '11': <UtensilsCrossed className="w-[18px] h-[18px]" />,
  '12': <Landmark className="w-[18px] h-[18px]" />,
};

export function TopDrivers({ result }: Props) {
  const { t, language } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5">
      <h3 className="text-[15px] font-semibold mb-1 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <BarChart2 className="w-4 h-4 text-[#0066cc]" /> {t('result.drivers.title')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('result.drivers.sub')}</p>

      <div className="flex flex-col">
        {result.drivers.map(d => {
          const name = language === 'ar' ? d.divisionName_ar : d.divisionName_en;
          const negative = d.contributionPp < 0;
          const sharePct = Math.round(d.shareOfTotal * 100);
          return (
            <div key={d.divisionId} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
              <div className="w-9 h-9 rounded-lg bg-[#e8f2ff] text-[#0066cc] flex items-center justify-center shrink-0">
                {DIV_ICON[d.divisionId] ?? <BarChart2 className="w-[18px] h-[18px]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {Math.round(d.basketPct * 100)}% of your basket · YoY {d.yoy >= 0 ? '+' : ''}{d.yoy.toFixed(1)}%
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className={[
                  'text-sm font-semibold ltr-numbers',
                  negative ? 'text-[#10b981]' : 'text-[#ef4444]',
                ].join(' ')}>
                  {d.contributionPp >= 0 ? '+' : ''}{d.contributionPp.toFixed(2)}pp
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 ltr-numbers">
                  {negative ? t('result.drivers.offset') : t('result.drivers.share').replace('{share}', String(sharePct))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
