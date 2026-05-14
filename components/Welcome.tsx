import { BarChart3, Timer, Hand, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';

interface Props { onStart: () => void; }

export function Welcome({ onStart }: Props) {
  const { t, language } = useLanguage();
  const Forward = language === 'ar' ? null : ArrowRight;

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-7 shadow-sm text-center">
      <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#0066cc] to-[#0052a3] flex items-center justify-center text-white">
        <BarChart3 className="w-9 h-9" strokeWidth={1.8} />
      </div>
      <h1 className="text-[26px] font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
        {t('welcome.title')}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed mb-6">
        {t('welcome.sub')}
      </p>

      <div className="flex justify-center gap-6 px-6 py-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl max-w-lg mx-auto mb-6">
        <Stat icon={<Timer className="w-4 h-4" />} num={t('welcome.stat.time')} lbl={t('welcome.stat.time_lbl')} />
        <Stat icon={<Hand className="w-4 h-4" />} num={t('welcome.stat.taps')} lbl={t('welcome.stat.taps_lbl')} />
        <Stat icon={<ShieldCheck className="w-4 h-4" />} num={t('welcome.stat.privacy')} lbl={t('welcome.stat.privacy_lbl')} />
      </div>

      <button
        onClick={onStart}
        className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
      >
        {t('welcome.cta')}
        {Forward && <Forward className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Stat({ icon, num, lbl }: { icon: React.ReactNode; num: string; lbl: string }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-[#0066cc]">{icon}</div>
      <div className="text-lg font-bold text-[#0066cc]">{num}</div>
      <div className="text-[11px] text-gray-500 uppercase tracking-wider">{lbl}</div>
    </div>
  );
}
