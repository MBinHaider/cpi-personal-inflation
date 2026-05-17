import { School, GraduationCap, BookOpenCheck } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuizShell, CardGrid } from '@shared/quiz';
import type { Schooling, Nationality } from '../../lib/types';

interface Props {
  progressPct: number;
  stepIndex: number;
  stepCount: number;
  nationality: Nationality;
  value?: Schooling;
  onAnswer: (v: Schooling) => void;
  onBack?: () => void;
}

export function SchoolingQuestion({
  progressPct, stepIndex, stepCount, nationality, value, onAnswer, onBack,
}: Props) {
  const { t } = useLanguage();
  const isEmirati = nationality === 'emirati';

  return (
    <QuizShell
      progressPct={progressPct}
      caption={`${t('quiz.questionLabel')} ${stepIndex + 1} ${t('quiz.of')} ${stepCount}`}
      title={t('q7.title')}
      sub={isEmirati ? t('q7.emirati.sub') : t('q7.expat.sub')}
      onBack={onBack}
      onContinue={() => value && value !== 'none' && onAnswer(value)}
      continueLabel={t('common.seeResult')}
      continueDisabled={!value || value === 'none'}
    >
      <CardGrid
        columns={2}
        value={value === 'none' ? undefined : value}
        onChange={(id) => onAnswer(id as Schooling)}
        options={[
          { id: 'public',     icon: <School className="w-6 h-6" />,        label: t('q7.public.label'),     sub: isEmirati ? t('q7.emirati.public.sub')     : t('q7.expat.public.sub') },
          { id: 'private',    icon: <GraduationCap className="w-6 h-6" />, label: t('q7.private.label'),    sub: isEmirati ? t('q7.emirati.private.sub')    : t('q7.expat.private.sub') },
          { id: 'university', icon: <BookOpenCheck className="w-6 h-6" />, label: t('q7.university.label'), sub: isEmirati ? t('q7.emirati.university.sub') : t('q7.expat.university.sub') },
        ]}
      />
    </QuizShell>
  );
}
