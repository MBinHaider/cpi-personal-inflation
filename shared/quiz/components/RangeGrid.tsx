import { Minus, Plus } from 'lucide-react';
import type { RangeAxis } from '../types';

interface Props {
  axes: RangeAxis[];
}

export function RangeGrid({ axes }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {axes.map(a => {
        const atMin = a.value <= a.min;
        const atMax = a.value >= a.max;
        return (
          <div
            key={a.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900">{a.label}</div>
              {a.hint && <div className="text-xs text-gray-500 mt-0.5">{a.hint}</div>}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                aria-label={`Decrease ${a.label}`}
                disabled={atMin}
                onClick={() => a.onChange(a.value - 1)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-8 text-center text-base font-bold tabular-nums text-gray-900">{a.value}</div>
              <button
                type="button"
                aria-label={`Increase ${a.label}`}
                disabled={atMax}
                onClick={() => a.onChange(a.value + 1)}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
