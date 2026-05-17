import { Star, Globe } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, CardGrid } from '@shared/quiz';
import type { Nationality } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  value?: Nationality;
  onAnswer: (value: Nationality) => void;
  onBack?: () => void;
}

export function NationalityQuestion({
  progressPct, stepIndex, stepCount, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q1.title')}
      sub={t('q1.sub')}
      onBack={onBack}
      onContinue={() => value && onAnswer(value)}
      continueDisabled={!value}
    >
      <CardGrid
        columns={2}
        value={value}
        onChange={(id) => onAnswer(id as Nationality)}
        options={[
          { id: 'emirati', icon: <Star className="w-6 h-6" />, label: t('q1.emirati.label'), sub: t('q1.emirati.sub') },
          { id: 'expat',   icon: <Globe className="w-6 h-6" />, label: t('q1.expat.label'),   sub: t('q1.expat.sub')   },
        ]}
      />
    </QuizShell>
  );
}
