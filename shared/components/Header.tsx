import { Logo } from './Logo';
import { LensLogo } from './LensLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  // New (Lens-family) props — when appName is provided, the violet Lens header renders
  appName?: string;
  appType?: string;
  glyph?: 'inflation' | 'construction';
  tagline?: string;
  // Legacy props — used by existing dashboards that haven't migrated to the Lens identity
  title?: string;
  subtitle?: string;
  badge?: string;
  rightContent?: React.ReactNode;
}

export function Header({
  appName,
  appType = '',
  glyph = 'inflation',
  tagline = 'Dubai Statistics Centre',
  title = 'Price',
  subtitle = 'Insights',
  badge = 'DUBAI',
  rightContent,
}: HeaderProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();

  if (appName) {
    return (
      <div className="flex items-center justify-between gap-2 px-4 py-4 sm:p-6 bg-[#1E0D45] border-b border-[#2E1A6B]">
        <div className="flex items-center gap-3 min-w-0">
          <LensLogo glyph={glyph} size={44} />
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-base sm:text-lg leading-tight tracking-tight truncate">
              {appName}
            </span>
            {appType && (
              <span className="text-[#00E5FF] font-medium text-[11px] leading-tight">
                {appType}
              </span>
            )}
            <span className="text-white/60 text-[10px] leading-tight mt-0.5 truncate">
              {tagline}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {rightContent}
          <LanguageToggle variant="lens" />
          <ThemeToggle variant="lens" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <Logo variant="compact" theme={theme} language={language} title={title} subtitle={subtitle} badge={badge} />
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {rightContent}
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
