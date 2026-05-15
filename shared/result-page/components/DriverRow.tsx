import type { Driver } from '../types';

type Props = Driver;

export function DriverRow({ icon, name, metaLine, value, valueTone, shareSubtitle }: Props) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="w-8 h-8 rounded-md bg-[#f0f9ff] text-[#0066cc] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-gray-900 truncate">{name}</div>
        <div className="text-[10px] text-gray-500">{metaLine}</div>
      </div>
      <div className="text-end shrink-0 tabular-nums">
        <div
          data-tone={valueTone}
          className={`text-[13px] font-bold ${valueTone === 'positive' ? 'text-[#dc2626]' : 'text-[#059669]'}`}
        >
          {value}
        </div>
        <div className="text-[9px] text-gray-500">{shareSubtitle}</div>
      </div>
    </div>
  );
}
