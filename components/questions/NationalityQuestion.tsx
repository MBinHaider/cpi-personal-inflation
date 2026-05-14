import { Star, Globe } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { QuestionScreen } from '../QuestionScreen';
import type { Nationality } from '../../lib/types';

interface Props {
  stepIndex: number;
  stepCount: number;
  value?: Nationality;
  onAnswer: (value: Nationality) => void;
  onBack?: () => void;
}

export function NationalityQuestion({ stepIndex, stepCount, value, onAnswer, onBack }: Props) {
  const { t } = useLanguage();
  return (
    <QuestionScreen
      stepIndex={stepIndex}
      stepCount={stepCount}
      questionNumberLabel="Question 1"
      title={t('q1.title')}
      sub={t('q1.sub')}
      onBack={onBack}
      onNext={value ? () => onAnswer(value) : undefined}
      nextDisabled={!value}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Big
          icon={<Star className="w-7 h-7" />}
          label={t('q1.emirati.label')}
          sub={t('q1.emirati.sub')}
          selected={value === 'emirati'}
          onClick={() => onAnswer('emirati')}
        />
        <Big
          icon={<Globe className="w-7 h-7" />}
          label={t('q1.expat.label')}
          sub={t('q1.expat.sub')}
          selected={value === 'expat'}
          onClick={() => onAnswer('expat')}
        />
      </div>
    </QuestionScreen>
  );
}

function Big({ icon, label, sub, selected, onClick }: { icon: React.ReactNode; label: string; sub: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'p-6 border-[1.5px] rounded-2xl flex flex-col items-center gap-3 text-center transition-colors',
        selected
          ? 'border-[#0066cc] bg-[#0066cc] text-white'
          : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:border-[#0066cc] hover:bg-[#f0f7ff] dark:hover:bg-slate-600',
      ].join(' ')}
    >
      <div className={[
        'w-14 h-14 rounded-2xl flex items-center justify-center',
        selected ? 'bg-white/20 text-white' : 'bg-[#f0f7ff] text-[#0066cc]',
      ].join(' ')}>
        {icon}
      </div>
      <div className="text-base font-semibold">{label}</div>
      <div className={['text-xs leading-snug', selected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'].join(' ')}>{sub}</div>
    </button>
  );
}
