import type { QuizStat } from '../types';

interface Props {
  title: string;
  intro: string;
  stats: QuizStat[];
  ctaLabel: string;
  onStart: () => void;
}

export function WelcomeScreen({ title, intro, stats, ctaLabel, onStart }: Props) {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-[640px] mx-auto bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">{title}</h1>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">{intro}</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.caption} className="bg-white border border-gray-200 rounded-lg px-3 py-4 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{s.caption}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-3.5 rounded-lg text-sm transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
