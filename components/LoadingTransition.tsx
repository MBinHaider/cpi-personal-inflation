import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';

interface Props { onDone: () => void; previewYoy?: number; }

export function LoadingTransition({ onDone, previewYoy }: Props) {
  const { t } = useLanguage();
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduceMotion ? 0 : 600;
    const timer = setTimeout(onDone, ms);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl p-8 text-center">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 flex items-center justify-center">
        <Loader className="w-7 h-7 motion-safe:animate-spin" strokeWidth={1.8} />
      </div>
      <div className="text-base font-medium opacity-90 mb-1">{t('loading.title')}</div>
      {previewYoy != null && (
        <div className="text-[44px] font-semibold tracking-tight my-1">
          {previewYoy > 0 ? '+' : ''}{previewYoy.toFixed(2)}%
        </div>
      )}
      <div className="text-sm opacity-90">{t('loading.sub')}</div>
    </div>
  );
}
