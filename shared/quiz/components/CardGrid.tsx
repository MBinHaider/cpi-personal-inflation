import type { CardOption } from '../types';

interface Props {
  columns?: 1 | 2;
  options: CardOption[];
  value?: string;
  onChange: (id: string) => void;
}

export function CardGrid({ columns = 2, options, value, onChange }: Props) {
  const gridCls = columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  return (
    <div className={`grid ${gridCls} gap-3`}>
      {options.map(opt => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={[
              'p-5 border-[1.5px] rounded-xl flex flex-col items-center gap-3 text-center transition-colors',
              selected
                ? 'border-[#0066cc] bg-[#0066cc] text-white'
                : 'border-gray-200 bg-white text-gray-900 hover:border-[#0066cc] hover:bg-[#f0f7ff]',
            ].join(' ')}
          >
            <div className={[
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
              selected ? 'bg-white/20 text-white' : 'bg-[#f0f7ff] text-[#0066cc]',
            ].join(' ')}>
              {opt.icon}
            </div>
            <div className="text-base font-semibold leading-tight">{opt.label}</div>
            {opt.sub && (
              <div className={selected ? 'text-xs text-white/90 leading-snug' : 'text-xs text-gray-500 leading-snug'}>
                {opt.sub}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
