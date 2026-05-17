import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  progressPct: number;
  caption?: string;
  title: string;
  sub?: string;
  children: ReactNode;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled: boolean;
}

export function QuizShell({
  progressPct, caption, title, sub, children,
  onBack, onContinue, continueLabel = 'Continue', continueDisabled,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(progressPct)));
  return (
    <div className="px-4 sm:px-6 py-6 max-w-[640px] mx-auto bg-white">
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 bg-gray-100 rounded-full overflow-hidden mb-6"
      >
        <div
          className="h-full bg-[#0066cc] rounded-full transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
        {caption && (
          <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500 font-semibold mb-2">
            {caption}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">{title}</h2>
        {sub && <p className="text-sm text-gray-600 leading-relaxed mb-5">{sub}</p>}
        <div className={sub ? '' : 'mt-4'}>{children}</div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled}
          className="bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}
