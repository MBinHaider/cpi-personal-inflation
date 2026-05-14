import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  rightContent?: React.ReactNode;
}

export function Header({ title = "Price", subtitle = "Insights", badge = "DUBAI", rightContent }: HeaderProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <Logo variant="compact" theme={theme} language={language} title={title} subtitle={subtitle} badge={badge} />
      <div className="flex items-center gap-3">
        {rightContent}
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
