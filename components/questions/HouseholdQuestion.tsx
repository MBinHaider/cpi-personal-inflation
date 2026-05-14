import { useState, useEffect } from 'react';
import { Users, Baby, Plus, Minus, UsersRound } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { formatNumber } from '../../lib/format';
import { QuestionScreen } from '../QuestionScreen';
import type { Household } from '../../lib/types';

const ADULTS_MIN = 1, ADULTS_MAX = 8;
const KIDS_MIN = 0, KIDS_MAX = 8;

interface Props {
  stepIndex: number;
  stepCount: number;
  value?: Household;
  onAnswer: (value: Household) => void;
  onBack: () => void;
}

export function HouseholdQuestion({ stepIndex, stepCount, value, onAnswer, onBack }: Props) {
  const { t, language } = useLanguage();
  const [adults, setAdults] = useState(value?.adults ?? 2);
  const [kids, setKids] = useState(value?.kids ?? 0);

  useEffect(() => {
    if (value) { setAdults(value.adults); setKids(value.kids); }
  }, [value]);

  const summary = t('q4.summary')
    .replace('{adults}', formatNumber(adults, language))
    .replace('{kids}', formatNumber(kids, language))
    .replace('{total}', formatNumber(adults + kids, language));

  return (
    <QuestionScreen
      stepIndex={stepIndex}
      stepCount={stepCount}

      title={t('q4.title')}
      sub={t('q4.sub')}
      onBack={onBack}
      onNext={() => onAnswer({ adults, kids })}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Stepper
          icon={<Users className="w-5 h-5" />}
          label={t('q4.adults')}
          sub={t('q4.adults.sub')}
          value={adults}
          min={ADULTS_MIN}
          max={ADULTS_MAX}
          onChange={setAdults}
          ariaLabelInc="Add adult"
          ariaLabelDec="Remove adult"
        />
        <Stepper
          icon={<Baby className="w-5 h-5" />}
          label={t('q4.kids')}
          sub={t('q4.kids.sub')}
          value={kids}
          min={KIDS_MIN}
          max={KIDS_MAX}
          onChange={setKids}
          ariaLabelInc="Add child"
          ariaLabelDec="Remove child"
        />
      </div>

      <div className="mt-4 px-5 py-3 bg-[#f0f7ff] dark:bg-slate-700 rounded-xl text-center flex items-center justify-center gap-2 text-sm text-gray-900 dark:text-gray-100">
        <UsersRound className="w-4 h-4 text-[#0066cc]" />
        {summary}
      </div>
    </QuestionScreen>
  );
}

function Stepper({ icon, label, sub, value, min, max, onChange, ariaLabelInc, ariaLabelDec }: {
  icon: React.ReactNode; label: string; sub: string;
  value: number; min: number; max: number;
  onChange: (v: number) => void;
  ariaLabelInc: string; ariaLabelDec: string;
}) {
  return (
    <div className="p-5 border-[1.5px] border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-2xl flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#f0f7ff] dark:bg-slate-600 flex items-center justify-center text-[#0066cc]">
          {icon}
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={ariaLabelDec}
          className="w-11 h-11 rounded-full border-[1.5px] border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-600 text-[#0066cc] hover:bg-[#f0f7ff] disabled:text-gray-300 dark:disabled:text-slate-500 disabled:hover:bg-white flex items-center justify-center"
        >
          <Minus className="w-5 h-5" strokeWidth={2.2} />
        </button>
        <div
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          className="text-4xl font-semibold tracking-tight min-w-[56px] text-center text-gray-900 dark:text-gray-100"
        >
          {value}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={ariaLabelInc}
          className="w-11 h-11 rounded-full border-[1.5px] border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-600 text-[#0066cc] hover:bg-[#f0f7ff] disabled:text-gray-300 dark:disabled:text-slate-500 disabled:hover:bg-white flex items-center justify-center"
        >
          <Plus className="w-5 h-5" strokeWidth={2.2} />
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{sub}</div>
    </div>
  );
}
