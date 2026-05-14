import { Wallet, Home, UsersRound, Car, UtensilsCrossed, School, Pencil } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { QuizAnswers } from '../../lib/types';
import { isRenterHousing } from '../../lib/types';
import { formatNumber, interpolate } from '../../lib/format';

interface Props { answers: QuizAnswers; onEdit: (stepKey?: string) => void; }

export function AnswersChips({ answers, onEdit }: Props) {
  const { t, language } = useLanguage();
  const income = answers.income === 'skipped' ? '—' : `AED ${t(`q2.bracket.${answers.income}`)}`;
  const rent = answers.housing.rentBracket
    ? `AED ${t(`q3.bracket.${answers.housing.rentBracket}`)}`
    : answers.housing.branch === 'emirati'
      ? t(`q3.emirati.${answers.housing.kind}.label`)
      : t('q3.expat.skip');
  const household = `${formatNumber(answers.household.adults, language)} + ${formatNumber(answers.household.kids, language)}`;
  const transport = t(`q5.${answers.transport}.label`);
  const eating = t(`q6.${answers.eatingOut}.label`);
  const schooling = answers.schooling === 'none' ? '—' : t(`q7.${answers.schooling}.label`);

  const incomeLabel = t('result.chip.income');
  const housingLabel = t(isRenterHousing(answers.housing) ? 'result.chip.rent' : 'result.chip.housing');
  const householdLabel = t('result.chip.household');
  const transportLabel = t('result.chip.transport');
  const eatingLabel = t('result.chip.eating');
  const schoolingLabel = t('result.chip.schooling');

  return (
    <div className="flex flex-wrap gap-1.5 mb-6">
      <Chip
        icon={<Wallet />} label={incomeLabel} value={income}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: incomeLabel })}
        onClick={() => onEdit('income')}
      />
      <Chip
        icon={<Home />} label={housingLabel} value={rent}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: housingLabel })}
        onClick={() => onEdit('housing')}
      />
      <Chip
        icon={<UsersRound />} label={householdLabel} value={household}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: householdLabel })}
        onClick={() => onEdit('household')}
      />
      <Chip
        icon={<Car />} label={transportLabel} value={transport}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: transportLabel })}
        onClick={() => onEdit('transport')}
      />
      <Chip
        icon={<UtensilsCrossed />} label={eatingLabel} value={eating}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: eatingLabel })}
        onClick={() => onEdit('eatingOut')}
      />
      <Chip
        icon={<School />} label={schoolingLabel} value={schooling}
        ariaLabel={interpolate(t('result.chip.editAria'), { label: schoolingLabel })}
        onClick={() => onEdit('schooling')}
      />
    </div>
  );
}

function Chip({
  icon, label, value, ariaLabel, onClick,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
  ariaLabel: string;
  onClick: () => void;
}) {
  const sized = { ...icon, props: { ...icon.props, className: 'w-3 h-3 text-gray-500 group-hover:text-[#0066cc] transition-colors' } };
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="group text-[11px] px-3 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full text-gray-600 dark:text-gray-300 inline-flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-[#0066cc] cursor-pointer transition-colors"
    >
      {sized} {label} <strong className="text-gray-900 dark:text-gray-100 font-semibold group-hover:text-[#0066cc] transition-colors">{value}</strong>
      <Pencil className="w-2.5 h-2.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ms-0.5" />
    </button>
  );
}
