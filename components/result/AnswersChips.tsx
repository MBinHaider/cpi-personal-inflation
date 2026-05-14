import { Wallet, Home, UsersRound, Car, UtensilsCrossed, School, Pencil } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { QuizAnswers } from '../../lib/types';

interface Props { answers: QuizAnswers; onEdit: () => void; }

export function AnswersChips({ answers, onEdit }: Props) {
  const { t } = useLanguage();
  const income = answers.income === 'skipped' ? '—' : `AED ${t(`q2.bracket.${answers.income}`)}`;
  const rent = answers.housing.rentBracket
    ? `AED ${t(`q3.bracket.${answers.housing.rentBracket}`)}`
    : answers.housing.branch === 'emirati'
      ? t(`q3.emirati.${answers.housing.kind}.label`)
      : t('q3.expat.skip');
  const household = `${answers.household.adults} + ${answers.household.kids}`;
  const transport = t(`q5.${answers.transport}.label`);
  const eating = t(`q6.${answers.eatingOut}.label`);
  const schooling = answers.schooling === 'none' ? '—' : t(`q7.${answers.schooling}.label`);

  return (
    <div className="flex flex-wrap gap-1.5 mb-6">
      <Chip icon={<Wallet />} label={t('result.chip.income')} value={income} />
      <Chip icon={<Home />} label={t('result.chip.rent')} value={rent} />
      <Chip icon={<UsersRound />} label={t('result.chip.household')} value={household} />
      <Chip icon={<Car />} label={t('result.chip.transport')} value={transport} />
      <Chip icon={<UtensilsCrossed />} label={t('result.chip.eating')} value={eating} />
      <Chip icon={<School />} label={t('result.chip.schooling')} value={schooling} />
      <button onClick={onEdit} className="text-[11px] px-3 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full text-[#0066cc] inline-flex items-center gap-1.5 hover:bg-gray-50">
        <Pencil className="w-3 h-3" /> {t('result.chip.edit')}
      </button>
    </div>
  );
}

function Chip({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
  const sized = { ...icon, props: { ...icon.props, className: 'w-3 h-3 text-gray-500' } };
  return (
    <span className="text-[11px] px-3 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full text-gray-600 dark:text-gray-300 inline-flex items-center gap-1.5">
      {sized} {label} <strong className="text-gray-900 dark:text-gray-100 font-semibold">{value}</strong>
    </span>
  );
}
