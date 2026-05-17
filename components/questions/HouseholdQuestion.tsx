import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, RangeGrid } from '@shared/quiz';
import type { Household } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  value?: Household;
  onAnswer: (v: Household) => void;
  onBack?: () => void;
}

export function HouseholdQuestion({
  progressPct, stepIndex, stepCount, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  const adults = value?.adults ?? 1;
  const kids = value?.kids ?? 0;
  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q4.title')}
      sub={t('q4.sub')}
      onBack={onBack}
      onContinue={() => onAnswer({ adults, kids })}
      continueDisabled={false}
    >
      <RangeGrid
        axes={[
          {
            id: 'adults',
            label: t('q4.adults'),
            hint: t('q4.adults.sub'),
            min: 1,
            max: 8,
            value: adults,
            onChange: (v) => onAnswer({ adults: v, kids }),
          },
          {
            id: 'kids',
            label: t('q4.kids'),
            hint: t('q4.kids.sub'),
            min: 0,
            max: 8,
            value: kids,
            onChange: (v) => onAnswer({ adults, kids: v }),
          },
        ]}
      />
    </QuizShell>
  );
}
