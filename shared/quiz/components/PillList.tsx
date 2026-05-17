import type { PillOption } from '../types';

interface Props {
  columns?: 2 | 3 | 4;
  options: PillOption[];
  value?: string;
  onChange: (id: string | null) => void;
  skipLabel?: string;
}

export function PillList({ columns = 3, options, value, onChange, skipLabel }: Props) {
  const gridCls = columns === 2 ? 'grid-cols-2'
    : columns === 4 ? 'grid-cols-2 sm:grid-cols-4'
    : 'grid-cols-2 sm:grid-cols-3';
  return (
    <div className={`grid ${gridCls} gap-2.5`}>
      {options.map(opt => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={[
              'border rounded-lg px-3 py-3 text-sm font-semibold transition-colors',
              selected
                ? 'border-[#0066cc] bg-blue-50 text-[#0066cc]'
                : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300',
            ].join(' ')}
          >
            {opt.label}
            {opt.sub && <div className="text-[11px] font-normal text-gray-500 mt-0.5">{opt.sub}</div>}
          </button>
        );
      })}
      {skipLabel && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
