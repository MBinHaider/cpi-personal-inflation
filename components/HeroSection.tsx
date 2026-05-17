import { useLanguage } from '@shared/contexts/LanguageContext';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <div className="px-6 pt-8 pb-4 max-w-[700px]">
      <h1 className="dd-h1 text-gray-900 dark:text-gray-100">{t('hero.title')}</h1>
      <p className="dd-body text-gray-500 dark:text-gray-400 mt-3">{t('hero.subtitle')}</p>
    </div>
  );
}
