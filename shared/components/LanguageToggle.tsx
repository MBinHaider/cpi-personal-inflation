import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'default' | 'lens';
}

export function LanguageToggle({ variant = 'default' }: LanguageToggleProps = {}) {
  const { language, toggleLanguage, t } = useLanguage();

  if (variant === 'lens') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full border border-[#00E5FF]/30 bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Toggle language"
      >
        <Globe className="w-5 h-5 text-white" />
        <span className="text-white font-medium">
          {language === 'en' ? t('language.arabic') : t('language.english')}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
      aria-label="Toggle language"
    >
      <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-gray-900 dark:text-gray-100 font-medium">
        {language === 'en' ? t('language.arabic') : t('language.english')}
      </span>
    </button>
  );
}
