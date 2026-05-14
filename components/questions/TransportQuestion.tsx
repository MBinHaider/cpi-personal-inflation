import { Car, CarTaxiFront, TramFront } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import { PillList, type PillOption } from './PillList';
import type { TransportMode } from '../../lib/types';

interface Props { stepIndex: number; stepCount: number; value?: TransportMode; onAnswer: (v: TransportMode) => void; onBack: () => void; }

export function TransportQuestion({ stepIndex, stepCount, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  const options: PillOption[] = [
    { value: 'own-car',    icon: <Car className="w-5 h-5" />,             label: t('q5.own-car.label'),    sub: t('q5.own-car.sub') },
    { value: 'mixed',      icon: <CarTaxiFront className="w-5 h-5" />,    label: t('q5.mixed.label'),      sub: t('q5.mixed.sub') },
    { value: 'taxi-metro', icon: <CarTaxiFront className="w-5 h-5" />,    label: t('q5.taxi-metro.label'), sub: t('q5.taxi-metro.sub') },
    { value: 'metro-walk', icon: <TramFront className="w-5 h-5" />,       label: t('q5.metro-walk.label'), sub: t('q5.metro-walk.sub') },
  ];
  return (
    <QuestionScreen
      stepIndex={stepIndex} stepCount={stepCount}

      title={t('q5.title')} sub={t('q5.sub')}
      onBack={onBack}
      onNext={value ? () => onAnswer(value) : undefined}
      nextDisabled={!value}
    >
      <PillList options={options} selectedValue={value} onSelect={v => onAnswer(v as TransportMode)} />
    </QuestionScreen>
  );
}
