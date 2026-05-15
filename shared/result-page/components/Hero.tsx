import type { StatusInfo, HeroComparison } from '../types';
import { StatusPill } from './StatusPill';

interface Props {
  status?: StatusInfo;
  primaryLabel: string;
  primaryValue: string;
  anchor?: string;
  comparison?: HeroComparison;
}

export function Hero({ status, primaryLabel, primaryValue, anchor, comparison }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-8 sm:px-6 sm:py-12 text-center">
      {/* Soft radial accent above the number */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: 'radial-gradient(ellipse at top, rgba(0,102,204,0.06), transparent 70%)' }}
      />

      <div className="relative max-w-2xl mx-auto">
        {status && (
          <div className="mb-4">
            <StatusPill kind={status.kind} label={status.label} />
          </div>
        )}

        <div className="text-[9px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">
          {primaryLabel}
        </div>

        <div
          className="text-[56px] sm:text-[72px] font-bold tracking-tight leading-none tabular-nums"
          style={{
            background: 'linear-gradient(135deg, #0066cc, #0a4a8a)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {primaryValue}
        </div>

        {anchor && (
          <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto">{anchor}</p>
        )}

        {comparison && (
          <div className="mt-6 flex items-stretch justify-center gap-6 sm:gap-10">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                {comparison.yours.label}
              </div>
              <div className="text-sm sm:text-base font-bold tabular-nums" style={{ color: '#0066cc' }}>
                {comparison.yours.value}
              </div>
            </div>
            <div className="w-px bg-gray-200 self-stretch" aria-hidden="true" />
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                {comparison.benchmark.label}
              </div>
              <div className="text-sm sm:text-base font-bold tabular-nums text-gray-900">
                {comparison.benchmark.value}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
