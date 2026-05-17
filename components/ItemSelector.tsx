import { useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { ItemRow } from './ItemRow';

interface CpiItem {
  id: string;
  name_en: string;
  name_ar: string;
  price_aed: number;
  mom_change: number;
  yoy_change: number;
  weight: number;
  selected: boolean;
}

interface Division {
  id: string;
  name_en: string;
  name_ar: string;
  weight: number;
  items: CpiItem[];
}

interface ItemSelectorProps {
  divisions: Division[];
  onToggleItem: (itemId: string) => void;
}

const DIVISION_ICONS: Record<string, string> = {
  '01': '🍎',
  '02': '🍷',
  '03': '👔',
  '04': '🏠',
  '05': '🛋️',
  '06': '❤️',
  '07': '🚗',
  '08': '📱',
  '09': '🎮',
  '10': '🎓',
  '11': '🍽️',
  '12': '🏛️',
};

export function ItemSelector({ divisions, onToggleItem }: ItemSelectorProps) {
  const { t, language } = useLanguage();
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set(['01']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDivision = (divId: string) => {
    setExpandedDivisions(prev => {
      const next = new Set(prev);
      if (next.has(divId)) {
        next.delete(divId);
      } else {
        next.add(divId);
      }
      return next;
    });
  };

  const filteredDivisions = divisions.map(div => {
    const query = searchQuery.toLowerCase();
    const filteredItems = searchQuery
      ? div.items.filter(item =>
          item.name_en.toLowerCase().includes(query) ||
          item.name_ar.includes(searchQuery)
        )
      : div.items;
    return { ...div, items: filteredItems };
  }).filter(div => div.items.length > 0);

  const divisionsToShow = searchQuery
    ? filteredDivisions.map(div => ({ ...div, forceExpanded: true }))
    : filteredDivisions.map(div => ({ ...div, forceExpanded: false }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[8px] border border-gray-200 dark:border-slate-700 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <h2 className="dd-h3 text-gray-900 dark:text-gray-100 mb-3">{t('selector.title')}</h2>
        {/* Column labels */}
        <div className="flex items-center gap-3 px-3 mb-1">
          <div className="w-4" />
          <span className="flex-1 text-xs text-gray-400 dark:text-gray-500">{t('selector.typical')}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 w-20 text-right">Price</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 w-14 text-right">MoM</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 w-14 text-right">YoY</span>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('selector.search')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
        {divisionsToShow.map(div => {
          const isExpanded = div.forceExpanded || expandedDivisions.has(div.id);
          const selectedCount = div.items.filter(i => i.selected).length;
          const divName = language === 'ar' ? div.name_ar : div.name_en;
          const icon = DIVISION_ICONS[div.id] ?? '📦';

          return (
            <div key={div.id} className="border-b border-gray-100 dark:border-slate-700/50 last:border-b-0">
              {/* Division header */}
              <button
                onClick={() => toggleDivision(div.id)}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors text-left"
              >
                <span className="text-base leading-none">{icon}</span>
                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{divName}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                  {selectedCount}/{div.items.length}
                </span>
                {isExpanded
                  ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                }
              </button>

              {/* Items */}
              {isExpanded && (
                <div className="pb-1 px-2">
                  {div.items.map(item => (
                    <ItemRow
                      key={item.id}
                      {...item}
                      onToggle={onToggleItem}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
