import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import { RangeGrid } from './RangeGrid';
import type { IncomeBracket } from '../../lib/types';

interface Props {
  stepIndex: number;
  stepCount: number;
  value?: IncomeBracket;
  onAnswer: (value: IncomeBracket) => void;
  onBack: () => void;
}

const BRACKETS: Array<{ value: Exclude<IncomeBracket, 'skipped'>; tKey: string }> = [
  { value: 'u10k',    tKey: 'q2.bracket.u10k' },
  { value: '10-20k',  tKey: 'q2.bracket.10-20k' },
  { value: '20-40k',  tKey: 'q2.bracket.20-40k' },
  { value: '40-80k',  tKey: 'q2.bracket.40-80k' },
  { value: '80-150k', tKey: 'q2.bracket.80-150k' },
  { value: '150k+',   tKey: 'q2.bracket.150k+' },
];

export function IncomeQuestion({ stepIndex, stepCount, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  const options = BRACKETS.map(b => ({ value: b.value, label: t(b.tKey) }));
  return (
    <QuestionScreen
      stepIndex={stepIndex}
      stepCount={stepCount}
      questionNumberLabel="Question 2"
      title={t('q2.title')}
      sub={t('q2.sub')}
      onBack={onBack}
      onNext={value && value !== 'skipped' ? () => onAnswer(value) : undefined}
      nextDisabled={!value || value === 'skipped'}
      skipLabel={t('q2.skip')}
      onSkip={() => onAnswer('skipped')}
    >
      <RangeGrid
        options={options}
        currency="AED"
        selectedValue={value === 'skipped' ? undefined : value}
        onSelect={v => onAnswer(v as IncomeBracket)}
      />
    </QuestionScreen>
  );
}
