import { useLanguage } from '@shared/contexts/LanguageContext';
import { WelcomeScreen } from '@shared/quiz';

interface Props {
  onStart: () => void;
}

export function Welcome({ onStart }: Props) {
  const { t } = useLanguage();
  return (
    <WelcomeScreen
      title={t('welcome.title')}
      intro={t('welcome.sub')}
      stats={[
        { value: t('welcome.stat.time'), caption: t('welcome.stat.time_lbl') },
        { value: t('welcome.stat.taps'), caption: t('welcome.stat.taps_lbl') },
        { value: t('welcome.stat.privacy'), caption: t('welcome.stat.privacy_lbl') },
      ]}
      ctaLabel={t('welcome.cta')}
      onStart={onStart}
    />
  );
}
