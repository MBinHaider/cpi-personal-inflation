import { useLanguage } from '@shared/contexts/LanguageContext';

interface ImpactItem {
  id: string;
  name_en: string;
  name_ar: string;
  yoy_change: number;
  contribution: number;
  division_name_en: string;
  division_name_ar: string;
}

interface TopImpactItemsProps {
  items: ImpactItem[];
}

export function TopImpactItems({ items }: TopImpactItemsProps) {
  const { t, language } = useLanguage();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[8px] border border-gray-200 dark:border-slate-700 p-4">
      <h2 className="dd-h3 text-gray-900 dark:text-gray-100 mb-1">{t('impact.title')}</h2>
      <p className="dd-caption text-gray-500 dark:text-gray-400 mb-4">{t('impact.subtitle')}</p>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => {
          const name = language === 'ar' ? item.name_ar : item.name_en;
          const divName = language === 'ar' ? item.division_name_ar : item.division_name_en;
          const isPositive = item.yoy_change > 0;
          const isNeutral = item.yoy_change === 0;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/40"
            >
              {/* Rank */}
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{index + 1}</span>
              </div>

              {/* Name + division */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</p>
                <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-[#e6f2ff] dark:bg-[#0066cc]/20 text-[#0066cc] dark:text-[#60a5fa] mt-0.5 truncate max-w-full">
                  {divName}
                </span>
              </div>

              {/* YoY change */}
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-semibold ltr-numbers ${
                  isPositive ? 'text-[#ef4444]' : isNeutral ? 'text-gray-400' : 'text-[#10b981]'
                }`}>
                  {item.yoy_change > 0 ? '+' : ''}{item.yoy_change.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 ltr-numbers">
                  {item.contribution > 0 ? '+' : ''}{item.contribution.toFixed(2)}pp
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
