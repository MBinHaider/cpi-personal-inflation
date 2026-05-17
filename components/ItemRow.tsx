import { useLanguage } from '@shared/contexts/LanguageContext';

interface ItemRowProps {
  id: string;
  name_en: string;
  name_ar: string;
  price_aed: number;
  mom_change: number;
  yoy_change: number;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function ItemRow({ id, name_en, name_ar, price_aed, mom_change, yoy_change, selected, onToggle }: ItemRowProps) {
  const { language } = useLanguage();
  const name = language === 'ar' ? name_ar : name_en;

  const formatChange = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  };

  return (
    <label className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(id)}
        className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-[#0066cc] focus:ring-[#0066cc]"
      />
      <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">{name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400 ltr-numbers tabular-nums w-20 text-right">
        AED {price_aed.toLocaleString()}
      </span>
      <span className={`text-xs ltr-numbers tabular-nums w-14 text-right ${mom_change > 0 ? 'text-[#ef4444]' : mom_change < 0 ? 'text-[#10b981]' : 'text-gray-400'}`}>
        {formatChange(mom_change)}
      </span>
      <span className={`text-xs ltr-numbers tabular-nums w-14 text-right ${yoy_change > 0 ? 'text-[#ef4444]' : yoy_change < 0 ? 'text-[#10b981]' : 'text-gray-400'}`}>
        {formatChange(yoy_change)}
      </span>
    </label>
  );
}
