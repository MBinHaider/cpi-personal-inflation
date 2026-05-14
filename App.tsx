import { ThemeProvider } from '@shared/contexts/ThemeContext';
import { LanguageProvider, mergeTranslations } from '@shared/contexts/LanguageContext';
import { cpiInteractiveTranslations } from './translations/cpi-interactive';
import { CpiInteractive } from './components/CpiInteractive';

mergeTranslations(cpiInteractiveTranslations);

export default function App() {
  return (
    <ThemeProvider storageKey="cpi-interactive-theme">
      <LanguageProvider>
        <CpiInteractive />
      </LanguageProvider>
    </ThemeProvider>
  );
}
