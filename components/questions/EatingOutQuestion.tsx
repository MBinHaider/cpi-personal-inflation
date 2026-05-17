import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, PillList } from '@shared/quiz';
import type { EatingOut } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  value?: EatingOut;
  onAnswer: (v: EatingOut) => void;
  onBack?: () => void;
}

export function EatingOutQuestion({
  progressPct, stepIndex, stepCount, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q6.title')}
      sub={t('q6.sub')}
      onBack={onBack}
      onContinue={() => value && onAnswer(value)}
      continueDisabled={!value}
    >
      <PillList
        columns={2}
        value={value}
        onChange={(id) => id && onAnswer(id as EatingOut)}
        options={[
          { id: 'rarely',     label: t('q6.rarely.label'),     sub: t('q6.rarely.sub') },
          { id: 'sometimes',  label: t('q6.sometimes.label'),  sub: t('q6.sometimes.sub') },
          { id: 'often',      label: t('q6.often.label'),      sub: t('q6.often.sub') },
          { id: 'very-often', label: t('q6.very-often.label'), sub: t('q6.very-often.sub') },
        ]}
      />
    </QuizShell>
  );
}
