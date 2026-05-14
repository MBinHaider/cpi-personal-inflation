import { School, GraduationCap, BookOpenCheck } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import { CardGrid, type CardOption } from './CardGrid';
import type { Schooling, Nationality } from '../../lib/types';

interface Props {
  stepIndex: number;
  stepCount: number;
  nationality: Nationality;
  value?: Schooling;
  onAnswer: (v: Schooling) => void;
  onBack: () => void;
}

export function SchoolingQuestion({ stepIndex, stepCount, nationality, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  const isEmirati = nationality === 'emirati';

  const options: CardOption[] = [
    { value: 'public',     icon: <School className="w-5 h-5" />,         label: t('q7.public.label'),     sub: isEmirati ? t('q7.emirati.public.sub')     : t('q7.expat.public.sub') },
    { value: 'private',    icon: <GraduationCap className="w-5 h-5" />,  label: t('q7.private.label'),    sub: isEmirati ? t('q7.emirati.private.sub')    : t('q7.expat.private.sub') },
    { value: 'university', icon: <BookOpenCheck className="w-5 h-5" />,  label: t('q7.university.label'), sub: isEmirati ? t('q7.emirati.university.sub') : t('q7.expat.university.sub') },
  ];

  return (
    <QuestionScreen
      stepIndex={stepIndex}
      stepCount={stepCount}

      title={t('q7.title')}
      sub={isEmirati ? t('q7.emirati.sub') : t('q7.expat.sub')}
      onBack={onBack}
      onNext={value ? () => onAnswer(value) : undefined}
      nextDisabled={!value}
      nextLabel={t('common.seeResult')}
      skipLabel={t('q7.skip')}
      onSkip={() => onAnswer('none')}
    >
      <CardGrid options={options} cols={3} selectedValue={value === 'none' ? undefined : value} onSelect={v => onAnswer(v as Schooling)} />
    </QuestionScreen>
  );
}
