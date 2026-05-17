import { useState } from 'react';
import { Home, Landmark, KeyRound, Banknote } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, CardGrid, PillList } from '@shared/quiz';
import type { Housing, Nationality, RentBracket, EmiratiHousingKind } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  nationality: Nationality;
  value?: Housing;
  onAnswer: (v: Housing) => void;
  onBack?: () => void;
}

const RENT_BRACKETS: Array<{ value: RentBracket; tKey: string }> = [
  { value: 'u3k',    tKey: 'q3.bracket.u3k' },
  { value: '3-6k',   tKey: 'q3.bracket.3-6k' },
  { value: '6-10k',  tKey: 'q3.bracket.6-10k' },
  { value: '10-18k', tKey: 'q3.bracket.10-18k' },
  { value: '18-30k', tKey: 'q3.bracket.18-30k' },
  { value: '30k+',   tKey: 'q3.bracket.30k+' },
];

export function HousingQuestion({
  progressPct, stepIndex, stepCount, nationality, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  // For Emirati branch: track which kind has been picked so we can show the rent sub-step.
  const [emiratiKind, setEmiratiKind] = useState<EmiratiHousingKind | undefined>(
    value?.branch === 'emirati' ? value.kind : undefined,
  );
  const caption = `${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`;

  if (nationality === 'emirati') {
    // Sub-step: rent bracket picker (only when the Emirati picked 'rent')
    if (emiratiKind === 'rent') {
      const rentValue = value?.branch === 'emirati' ? value.rentBracket : undefined;
      return (
        <QuizShell
          progressPct={progressPct}
          caption={caption}
          title={t('q3.expat.title')}
          sub={t('q3.expat.sub')}
          onBack={() => setEmiratiKind(undefined)}
          onContinue={() => rentValue && onAnswer({ branch: 'emirati', kind: 'rent', rentBracket: rentValue })}
          continueDisabled={!rentValue}
        >
          <PillList
            columns={3}
            value={rentValue}
            onChange={(id) => id && onAnswer({ branch: 'emirati', kind: 'rent', rentBracket: id as RentBracket })}
            options={RENT_BRACKETS.map(b => ({ id: b.value, label: t(b.tKey) }))}
          />
        </QuizShell>
      );
    }

    // Primary step: housing kind picker for Emirati
    return (
      <QuizShell
        progressPct={progressPct}
        caption={caption}
        title={t('q3.emirati.title')}
        sub={t('q3.emirati.sub')}
        onBack={onBack}
        onContinue={() => emiratiKind && onAnswer({ branch: 'emirati', kind: emiratiKind })}
        continueDisabled={!emiratiKind}
      >
        <CardGrid
          columns={1}
          value={emiratiKind}
          onChange={(id) => {
            const k = id as EmiratiHousingKind;
            setEmiratiKind(k);
            if (k !== 'rent') onAnswer({ branch: 'emirati', kind: k });
          }}
          options={[
            { id: 'family-home',  icon: <Home className="w-6 h-6" />,     label: t('q3.emirati.family-home.label'),  sub: t('q3.emirati.family-home.sub') },
            { id: 'gov-grant',    icon: <Landmark className="w-6 h-6" />, label: t('q3.emirati.gov-grant.label'),    sub: t('q3.emirati.gov-grant.sub') },
            { id: 'own-mortgage', icon: <KeyRound className="w-6 h-6" />, label: t('q3.emirati.own-mortgage.label'), sub: t('q3.emirati.own-mortgage.sub') },
            { id: 'rent',         icon: <Banknote className="w-6 h-6" />, label: t('q3.emirati.rent.label'),         sub: t('q3.emirati.rent.sub') },
          ]}
        />
      </QuizShell>
    );
  }

  // Expat branch: rent bracket picker with a skip pill for own-no-mortgage.
  const rentValue = value?.branch === 'expat' ? value.rentBracket : undefined;
  return (
    <QuizShell
      progressPct={progressPct}
      caption={caption}
      title={t('q3.expat.title')}
      sub={t('q3.expat.sub')}
      onBack={onBack}
      onContinue={() => rentValue && onAnswer({ branch: 'expat', kind: 'rent', rentBracket: rentValue })}
      continueDisabled={!rentValue}
    >
      <PillList
        columns={3}
        value={rentValue}
        skipLabel={t('q3.expat.skip')}
        onChange={(id) => {
          if (id === null) {
            onAnswer({ branch: 'expat', kind: 'own-no-mortgage' });
          } else {
            onAnswer({ branch: 'expat', kind: 'rent', rentBracket: id as RentBracket });
          }
        }}
        options={RENT_BRACKETS.map(b => ({ id: b.value, label: t(b.tKey) }))}
      />
    </QuizShell>
  );
}
