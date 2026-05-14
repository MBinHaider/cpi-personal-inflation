import { Salad, Utensils, UtensilsCrossed, Pizza } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import { PillList, type PillOption } from './PillList';
import type { EatingOut } from '../../lib/types';

interface Props { stepIndex: number; stepCount: number; value?: EatingOut; onAnswer: (v: EatingOut) => void; onBack: () => void; }

export function EatingOutQuestion({ stepIndex, stepCount, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  const options: PillOption[] = [
    { value: 'rarely',     icon: <Salad className="w-5 h-5" />,            label: t('q6.rarely.label'),     sub: t('q6.rarely.sub') },
    { value: 'sometimes',  icon: <Utensils className="w-5 h-5" />,         label: t('q6.sometimes.label'),  sub: t('q6.sometimes.sub') },
    { value: 'often',      icon: <UtensilsCrossed className="w-5 h-5" />,  label: t('q6.often.label'),      sub: t('q6.often.sub') },
    { value: 'very-often', icon: <Pizza className="w-5 h-5" />,            label: t('q6.very-often.label'), sub: t('q6.very-often.sub') },
  ];
  return (
    <QuestionScreen
      stepIndex={stepIndex} stepCount={stepCount}
      questionNumberLabel="Question 6"
      title={t('q6.title')} sub={t('q6.sub')}
      onBack={onBack}
      onNext={value ? () => onAnswer(value) : undefined}
      nextDisabled={!value}
    >
      <PillList options={options} selectedValue={value} onSelect={v => onAnswer(v as EatingOut)} />
    </QuestionScreen>
  );
}
