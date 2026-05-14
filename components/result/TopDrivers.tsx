import { BarChart2, Home, Car, UtensilsCrossed, Apple, Shirt, HeartPulse, Smartphone, GraduationCap, Wine, Sofa, Landmark } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';
import { formatPercent, formatNumber, formatCurrencyAed } from '../../lib/format';

interface Props { result: CpiResult; incomeSkipped?: boolean; }

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

export function TopDrivers({ result, incomeSkipped = false }: Props) {
  const { t, language } = useLanguage();
  const basket = result.estMonthlyBasket;
  const useAed = !incomeSkipped && basket > 0;
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
          const monthlySpent = d.basketPct * basket;
          const monthlyExtra = (d.contributionPp / 100) * basket;
          const basketPct = Math.round(d.basketPct * 100);

          const shareMeta = useAed
            ? t('result.drivers.shareMetaAed')
                .replace('{spent}', formatCurrencyAed(Math.round(monthlySpent), language))
                .replace('{yoy}', formatPercent(d.yoy, language))
            : t('result.drivers.shareMeta')
                .replace('{share}', formatPercent(basketPct, language, 0, 'never'))
                .replace('{yoy}', formatPercent(d.yoy, language));

          const bigValue = useAed
            ? formatCurrencyAed(Math.round(monthlyExtra), language, 'always') + t('result.drivers.perMonth')
            : formatNumber(d.contributionPp, language, { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' }) + 'pp';

          return (
            <div key={d.divisionId} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
              <div className="w-9 h-9 rounded-lg bg-[#e8f2ff] text-[#0066cc] flex items-center justify-center shrink-0">
                {DIV_ICON[d.divisionId] ?? <BarChart2 className="w-[18px] h-[18px]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {shareMeta}
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className={[
                  'text-sm font-semibold',
                  negative ? 'text-[#10b981]' : 'text-[#ef4444]',
                ].join(' ')}>
                  {bigValue}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {negative ? t('result.drivers.offset') : t('result.drivers.share').replace('{share}', formatPercent(d.shareOfTotal * 100, language, 0, 'never'))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
