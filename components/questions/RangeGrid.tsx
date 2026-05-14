interface RangeOption { value: string; label: string; }

interface Props {
  options: RangeOption[];
  currency?: string;                    // shown above the amount, e.g. 'AED'
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export function RangeGrid({ options, currency, selectedValue, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {options.map(opt => {
        const selected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            aria-pressed={selected}
            className={[
              'p-4 border-[1.5px] rounded-xl flex flex-col items-center gap-1 transition-colors',
              selected
                ? 'border-[#0066cc] bg-[#0066cc] text-white'
                : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:border-[#0066cc] hover:bg-[#f0f7ff] dark:hover:bg-slate-600',
            ].join(' ')}
          >
            {currency && (
              <span className={['text-[10px] uppercase tracking-wider', selected ? 'text-white/80' : 'text-gray-400'].join(' ')}>
                {currency}
              </span>
            )}
            <span className="text-base font-semibold">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
