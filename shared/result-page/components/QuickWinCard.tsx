import { Zap } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
  savingLabel?: string;
}

export function QuickWinCard({ icon, title, savingLabel }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="w-6 h-6 rounded-md bg-[#f0f9ff] text-[#0066cc] flex items-center justify-center mb-1.5">
        {icon}
      </div>
      <div className="text-[11px] font-semibold text-gray-900 mb-1 leading-snug">{title}</div>
      {savingLabel && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-700 bg-[#ecfdf5] px-2 py-0.5 rounded-full">
          <Zap className="w-2.5 h-2.5" />
          {savingLabel}
        </span>
      )}
    </div>
  );
}
