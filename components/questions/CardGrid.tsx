import { ReactNode } from 'react';

export interface CardOption {
  value: string;
  icon: ReactNode;
  label: string;
  sub?: string;
  badge?: string;
}

interface Props {
  options: CardOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  cols?: 2 | 3 | 4;
}

export function CardGrid({ options, selectedValue, onSelect, cols = 3 }: Props) {
  const gridCls = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3';
  return (
    <div className={`grid ${gridCls} gap-2.5`}>
      {options.map(opt => {
        const selected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            aria-pressed={selected}
            className={[
              'relative p-4 border-[1.5px] rounded-xl flex flex-col items-center gap-2 text-center transition-colors',
              selected
                ? 'border-[#0066cc] bg-[#0066cc] text-white'
                : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:border-[#0066cc] hover:bg-[#f0f7ff] dark:hover:bg-slate-600',
            ].join(' ')}
          >
            {opt.badge && (
              <span className={[
                'absolute top-1.5 end-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                selected ? 'bg-white text-[#0066cc]' : 'bg-[#0066cc] text-white',
              ].join(' ')}>{opt.badge}</span>
            )}
            <div className={[
              'w-11 h-11 rounded-xl flex items-center justify-center',
              selected ? 'bg-white/20 text-white' : 'bg-[#f0f7ff] text-[#0066cc]',
            ].join(' ')}>
              {opt.icon}
            </div>
            <span className="text-sm font-semibold">{opt.label}</span>
            {opt.sub && (
              <span className={['text-[11px]', selected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'].join(' ')}>
                {opt.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
