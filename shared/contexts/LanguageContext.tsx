import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const commonTranslations: Record<Language, Record<string, string>> = {
  en: {
    'language.english': 'English',
    'language.arabic': 'العربية',
  },
  ar: {
    'language.english': 'English',
    'language.arabic': 'العربية',
  },
};

let appTranslations: Record<Language, Record<string, string>> = { en: {}, ar: {} };

export function mergeTranslations(translations: Record<Language, Record<string, string>>) {
  appTranslations = {
    en: { ...appTranslations.en, ...translations.en },
    ar: { ...appTranslations.ar, ...translations.ar },
  };
}

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string): string => {
    return appTranslations[language]?.[key]
      ?? commonTranslations[language]?.[key]
      ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
