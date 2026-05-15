import type { Benchmark } from '../types';

type Props = Benchmark;

const FILL_BG: Record<Benchmark['tone'], string> = {
  ok:    'bg-[#0066cc]',
  warn:  'bg-amber-500',
  alert: 'bg-red-600',
};

const MARK_BG: Record<Benchmark['tone'], string> = {
  ok:    'bg-gray-700',
  warn:  'bg-gray-700',
  alert: 'bg-gray-700',
};

export function BenchmarkBar({ label, userValue, benchmarkValue, userValueLabel, benchmarkValueLabel, tone }: Props) {
  const userPct = Math.min(100, Math.max(0, userValue * 100));
  const benchPct = Math.min(100, Math.max(0, benchmarkValue * 100));
  return (
    <div className="py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="flex justify-between items-baseline mb-1.5 gap-3">
        <span className="text-[12px] text-gray-900 truncate">{label}</span>
        <span className="text-[10px] text-gray-500 shrink-0">
          Dubai avg <span className="tabular-nums">{benchmarkValueLabel}</span>
          <b className="text-gray-900 text-[11px] tabular-nums ms-1.5">{userValueLabel}</b>
        </span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full">
        <div
          data-role="fill"
          className={`absolute inset-y-0 start-0 rounded-full transition-[width,background-color] duration-300 ease-out ${FILL_BG[tone]}`}
          style={{ width: `${userPct}%` }}
        />
        <div
          className="absolute -top-1 bottom-[-4px] w-0.5 rounded-full pointer-events-none"
          style={{ insetInlineStart: `calc(${benchPct}% - 1px)` }}
          aria-hidden="true"
        >
          <div className={`absolute top-0 start-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ring-2 ring-white ${MARK_BG[tone]}`} />
          <div className={`w-full h-full ${MARK_BG[tone]}`} />
        </div>
      </div>
    </div>
  );
}
