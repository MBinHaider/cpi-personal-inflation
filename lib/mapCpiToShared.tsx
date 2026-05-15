import type { ReactNode } from 'react';
import {
  Home,
  Car,
  UtensilsCrossed,
  Apple,
  Shirt,
  HeartPulse,
  Smartphone,
  GraduationCap,
  Cigarette,
  Music,
  Sofa,
  ShieldCheck,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import type { CpiResult, QuizAnswers } from './types';
import type { Driver, Benchmark, DataPoint, ChipItem } from '@shared/result-page';
import { formatCurrencyAed, formatPercent, formatNumber, interpolate } from './format';

const DIV_ICON: Record<string, ReactNode> = {
  '01': <Apple className="w-4 h-4" />,
  '02': <Cigarette className="w-4 h-4" />,
  '03': <Shirt className="w-4 h-4" />,
  '04': <Home className="w-4 h-4" />,
  '05': <Sofa className="w-4 h-4" />,
  '06': <HeartPulse className="w-4 h-4" />,
  '07': <Car className="w-4 h-4" />,
  '08': <Smartphone className="w-4 h-4" />,
  '09': <Music className="w-4 h-4" />,
  '10': <GraduationCap className="w-4 h-4" />,
  '11': <UtensilsCrossed className="w-4 h-4" />,
  '12': <ShieldCheck className="w-4 h-4" />,
  '13': <Sparkles className="w-4 h-4" />,
};

export function mapDrivers(
  result: CpiResult,
  answers: QuizAnswers,
  t: (k: string) => string,
  language: 'en' | 'ar',
): Driver[] {
  const incomeSkipped = answers.income === 'skipped';
  const basket = result.estMonthlyBasket;
  const useAed = !incomeSkipped && basket > 0;

  return result.drivers.slice(0, 5).map(d => {
    const name = language === 'ar' ? d.divisionName_ar : d.divisionName_en;
    const negative = d.contributionPp < 0;
    const monthlySpent = d.basketPct * basket;
    const monthlyExtra = (d.contributionPp / 100) * basket;

    const metaLine = useAed
      ? interpolate(t('result.drivers.shareMetaAed'), {
          spent: formatCurrencyAed(Math.round(monthlySpent), language),
          yoy: formatPercent(d.yoy, language),
        })
      : interpolate(t('result.drivers.shareMeta'), {
          share: formatPercent(Math.round(d.basketPct * 100), language, 0, 'never'),
          yoy: formatPercent(d.yoy, language),
        });

    const value = useAed
      ? formatCurrencyAed(Math.round(monthlyExtra), language, 'always') +
        t('result.drivers.perMonth')
      : formatNumber(d.contributionPp, language, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          signDisplay: 'always',
        }) + 'pp';

    const shareSubtitle = negative
      ? t('result.drivers.offset')
      : interpolate(t('result.drivers.share'), {
          share: formatPercent(d.shareOfTotal * 100, language, 0, 'never'),
        });

    return {
      id: d.divisionId,
      icon: DIV_ICON[d.divisionId] ?? <BarChart2 className="w-4 h-4" />,
      name,
      metaLine,
      value,
      valueTone: negative ? 'negative' : 'positive',
      shareSubtitle,
    };
  });
}

export function mapBenchmarks(
  result: CpiResult,
  t: (k: string) => string,
  language: 'en' | 'ar',
): Benchmark[] {
  return result.affordability.map(m => ({
    id: m.key,
    label: t(`result.afford.${m.key}`),
    userValue: m.pctOfIncome,
    benchmarkValue: m.benchmarkPct,
    userValueLabel: formatPercent(m.pctOfIncome * 100, language, 0, 'never'),
    benchmarkValueLabel: formatPercent(m.benchmarkPct * 100, language, 0, 'never'),
    tone: m.status,
  }));
}

export function mapChips(
  answers: QuizAnswers,
  t: (k: string) => string,
  onEdit: (stepKey?: string) => void,
): ChipItem[] {
  const chips: ChipItem[] = [];

  // Income chip
  chips.push({
    id: 'income',
    label: t('result.chip.income'),
    value: answers.income === 'skipped' ? '—' : `AED ${t(`q2.bracket.${answers.income}`)}`,
    stepKey: 'income',
    onClick: () => onEdit('income'),
  });

  // Housing chip — branch-aware label
  const isRenter = answers.housing.kind === 'rent';
  const housingLabelKey = isRenter ? 'result.chip.rent' : 'result.chip.housing';
  const housingValue = answers.housing.rentBracket
    ? `AED ${t(`q3.bracket.${answers.housing.rentBracket}`)}`
    : t(`q3.${answers.housing.branch}.${answers.housing.kind}.label`);

  chips.push({
    id: 'housing',
    label: t(housingLabelKey),
    value: housingValue,
    stepKey: 'housing',
    onClick: () => onEdit('housing'),
  });

  // Household chip
  chips.push({
    id: 'household',
    label: t('result.chip.household'),
    value: `${answers.household.adults} + ${answers.household.kids}`,
    stepKey: 'household',
    onClick: () => onEdit('household'),
  });

  // Transport chip
  chips.push({
    id: 'transport',
    label: t('result.chip.transport'),
    value: t(`q5.${answers.transport}.label`),
    stepKey: 'transport',
    onClick: () => onEdit('transport'),
  });

  // Eating out chip
  chips.push({
    id: 'eating',
    label: t('result.chip.eating'),
    value: t(`q6.${answers.eatingOut}.label`),
    stepKey: 'eatingOut',
    onClick: () => onEdit('eatingOut'),
  });

  // Schooling chip — only when there are kids and schooling is set
  if (answers.household.kids > 0 && answers.schooling !== 'none') {
    chips.push({
      id: 'schooling',
      label: t('result.chip.schooling'),
      value: t(`q7.${answers.schooling}.label`),
      stepKey: 'schooling',
      onClick: () => onEdit('schooling'),
    });
  }

  return chips;
}

export function mapMonthlyToDataPoints(
  monthly: Array<{ date: string; officialYoy: number }>,
  personalYoy: number,
): DataPoint[] {
  // Illustrative — backward-applied multiplier (matches existing v6 trend behavior)
  const officialNow = monthly[monthly.length - 1]?.officialYoy ?? 1;
  const ratio = officialNow !== 0 ? personalYoy / officialNow : 1;
  return monthly.map(m => ({
    period: m.date.slice(5),
    yourValue: m.officialYoy * ratio,
    benchmarkValue: m.officialYoy,
  }));
}
