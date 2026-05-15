import { Pencil } from 'lucide-react';
import type { ChipItem } from '../types';

interface Props {
  basedOnLabel: string;
  editAriaLabel: (label: string) => string;
  chips: ChipItem[];
}

export function AnswersChips({ basedOnLabel, editAriaLabel, chips }: Props) {
  return (
    <div className="mt-6">
      <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
        {basedOnLabel}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={c.onClick}
            aria-label={editAriaLabel(c.label)}
            className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[10px] text-gray-600 hover:border-[#0066cc] hover:text-[#0066cc] inline-flex items-center gap-1.5 group transition-colors"
          >
            <span><b className="text-gray-900">{c.label}:</b> {c.value}</span>
            <Pencil className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
