import { TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  tagLabel: string;          // e.g. "BIGGEST IMPACT"
  title: string;
  why: string;
  savingLabel?: string;      // e.g. "Estimated saving: AED 2,100–3,500 / mo"
}

export function PrimaryActionCard({ icon, tagLabel, title, why, savingLabel }: Props) {
  return (
    <div className="bg-white border border-gray-200 border-s-[3px] border-s-[#0066cc] rounded-lg p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
      <div className="w-10 h-10 rounded-lg bg-[#e8f2ff] text-[#0066cc] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0066cc] mb-1.5">
          {tagLabel}
        </div>
        <h4 className="text-[15px] sm:text-base font-bold text-gray-900 mb-1.5 leading-snug tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">{why}</p>
        {savingLabel && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 ps-2 pe-2.5 py-1 rounded-full">
            <TrendingDown className="w-3 h-3" />
            {savingLabel}
          </span>
        )}
      </div>
    </div>
  );
}
