import { ReactNode } from 'react';

export interface PillOption {
  value: string;
  icon: ReactNode;
  label: string;
  sub: string;
}

interface Props {
  options: PillOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function PillList({ options, selectedValue, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map(opt => {
        const selected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            aria-pressed={selected}
            className={[
              'p-4 border-[1.5px] rounded-xl flex items-center gap-3 text-start transition-colors',
              selected
                ? 'border-[#0066cc] bg-[#0066cc] text-white'
                : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:border-[#0066cc] hover:bg-[#f0f7ff] dark:hover:bg-slate-600',
            ].join(' ')}
          >
            <div className={[
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              selected ? 'bg-white/20 text-white' : 'bg-[#f0f7ff] text-[#0066cc]',
            ].join(' ')}>
              {opt.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{opt.label}</div>
              <div className={['text-[11px] mt-0.5', selected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'].join(' ')}>
                {opt.sub}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
