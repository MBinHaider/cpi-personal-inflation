import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

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
