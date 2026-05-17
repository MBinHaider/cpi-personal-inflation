import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, PillList } from '@shared/quiz';
import type { IncomeBracket } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  value?: IncomeBracket;
  onAnswer: (v: IncomeBracket) => void;
  onBack?: () => void;
}

const BRACKETS: Exclude<IncomeBracket, 'skipped'>[] =
  ['u10k', '10-20k', '20-40k', '40-80k', '80-150k', '150k+'];

export function IncomeQuestion({
  progressPct, stepIndex, stepCount, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q2.title')}
      sub={t('q2.sub')}
      onBack={onBack}
      onContinue={() => value && onAnswer(value)}
      continueDisabled={!value}
    >
      <PillList
        columns={3}
        value={value === 'skipped' ? undefined : value}
        onChange={(id) => onAnswer((id ?? 'skipped') as IncomeBracket)}
        skipLabel={t('q2.skip')}
        options={BRACKETS.map((b) => ({ id: b, label: t(`q2.bracket.${b}`) }))}
      />
    </QuizShell>
  );
}
