import { useState } from 'react';
import { Home, Landmark, KeyRound, Banknote } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import { CardGrid, type CardOption } from './CardGrid';
import { RangeGrid } from './RangeGrid';
import type { Housing, Nationality, RentBracket, EmiratiHousingKind } from '../../lib/types';

interface Props {
  stepIndex: number;
  stepCount: number;
  nationality: Nationality;
  value?: Housing;
  onAnswer: (value: Housing) => void;
  onBack: () => void;
}

const RENT_BRACKETS: Array<{ value: RentBracket; tKey: string }> = [
  { value: 'u3k',    tKey: 'q3.bracket.u3k' },
  { value: '3-6k',   tKey: 'q3.bracket.3-6k' },
  { value: '6-10k',  tKey: 'q3.bracket.6-10k' },
  { value: '10-18k', tKey: 'q3.bracket.10-18k' },
  { value: '18-30k', tKey: 'q3.bracket.18-30k' },
  { value: '30k+',   tKey: 'q3.bracket.30k+' },
];

export function HousingQuestion({ stepIndex, stepCount, nationality, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  // For Emirati branch: if 'rent' picked, show the same rent-bracket pad as expat
  const [emiratiKind, setEmiratiKind] = useState<EmiratiHousingKind | undefined>(
    value?.branch === 'emirati' ? value.kind : undefined
  );

  const submit = (housing: Housing) => onAnswer(housing);

  if (nationality === 'emirati') {
    const kindOptions: CardOption[] = [
      { value: 'family-home',  icon: <Home className="w-5 h-5" />,        label: t('q3.emirati.family-home.label'),  sub: t('q3.emirati.family-home.sub') },
      { value: 'gov-grant',    icon: <Landmark className="w-5 h-5" />,    label: t('q3.emirati.gov-grant.label'),    sub: t('q3.emirati.gov-grant.sub') },
      { value: 'own-mortgage', icon: <KeyRound className="w-5 h-5" />,    label: t('q3.emirati.own-mortgage.label'), sub: t('q3.emirati.own-mortgage.sub') },
      { value: 'rent',         icon: <Banknote className="w-5 h-5" />,    label: t('q3.emirati.rent.label'),         sub: t('q3.emirati.rent.sub') },
    ];

    if (emiratiKind === 'rent') {
      const rentValue = value?.branch === 'emirati' && value.rentBracket ? value.rentBracket : undefined;
      return (
        <QuestionScreen
          stepIndex={stepIndex}
          stepCount={stepCount}
          title={t('q3.expat.title')}
          sub={t('q3.expat.sub')}
          onBack={() => setEmiratiKind(undefined)}
          onNext={rentValue ? () => submit({ branch: 'emirati', kind: 'rent', rentBracket: rentValue }) : undefined}
          nextDisabled={!rentValue}
        >
          <RangeGrid
            options={RENT_BRACKETS.map(b => ({ value: b.value, label: t(b.tKey) }))}
            currency="AED"
            selectedValue={rentValue}
            onSelect={v => submit({ branch: 'emirati', kind: 'rent', rentBracket: v as RentBracket })}
          />
        </QuestionScreen>
      );
    }

    return (
      <QuestionScreen
        stepIndex={stepIndex}
        stepCount={stepCount}
        title={t('q3.emirati.title')}
        sub={t('q3.emirati.sub')}
        onBack={onBack}
        onNext={emiratiKind && emiratiKind !== 'rent' ? () => submit({ branch: 'emirati', kind: emiratiKind }) : undefined}
        nextDisabled={!emiratiKind || emiratiKind === 'rent'}
      >
        <CardGrid
          options={kindOptions}
          cols={2}
          selectedValue={emiratiKind}
          onSelect={v => {
            const k = v as EmiratiHousingKind;
            setEmiratiKind(k);
            if (k !== 'rent') submit({ branch: 'emirati', kind: k });
          }}
        />
      </QuestionScreen>
    );
  }

  // Expat branch
  const rentValue = value?.branch === 'expat' && value.rentBracket ? value.rentBracket : undefined;
  return (
    <QuestionScreen
      stepIndex={stepIndex}
      stepCount={stepCount}
      title={t('q3.expat.title')}
      sub={t('q3.expat.sub')}
      onBack={onBack}
      onNext={rentValue ? () => submit({ branch: 'expat', kind: 'rent', rentBracket: rentValue }) : undefined}
      nextDisabled={!rentValue}
      skipLabel={t('q3.expat.skip')}
      onSkip={() => submit({ branch: 'expat', kind: 'own-no-mortgage' })}
    >
      <RangeGrid
        options={RENT_BRACKETS.map(b => ({ value: b.value, label: t(b.tKey) }))}
        currency="AED"
        selectedValue={rentValue}
        onSelect={v => submit({ branch: 'expat', kind: 'rent', rentBracket: v as RentBracket })}
      />
    </QuestionScreen>
  );
}
