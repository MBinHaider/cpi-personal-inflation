import { Car, CarTaxiFront, TramFront } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, CardGrid } from '@shared/quiz';
import type { TransportMode } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  value?: TransportMode;
  onAnswer: (v: TransportMode) => void;
  onBack?: () => void;
}

export function TransportQuestion({
  progressPct, stepIndex, stepCount, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q5.title')}
      sub={t('q5.sub')}
      onBack={onBack}
      onContinue={() => value && onAnswer(value)}
      continueDisabled={!value}
    >
      <CardGrid
        columns={2}
        value={value}
        onChange={(id) => onAnswer(id as TransportMode)}
        options={[
          { id: 'own-car',    icon: <Car className="w-6 h-6" />,           label: t('q5.own-car.label'),    sub: t('q5.own-car.sub') },
          { id: 'mixed',      icon: <CarTaxiFront className="w-6 h-6" />,  label: t('q5.mixed.label'),      sub: t('q5.mixed.sub') },
          { id: 'taxi-metro', icon: <CarTaxiFront className="w-6 h-6" />,  label: t('q5.taxi-metro.label'), sub: t('q5.taxi-metro.sub') },
          { id: 'metro-walk', icon: <TramFront className="w-6 h-6" />,     label: t('q5.metro-walk.label'), sub: t('q5.metro-walk.sub') },
        ]}
      />
    </QuizShell>
  );
}
