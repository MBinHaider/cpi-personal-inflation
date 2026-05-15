import { useLanguage } from '@shared/contexts/LanguageContext';
import {
  Hero, ActionPlan, PrimaryActionCard, QuickWinsGrid, QuickWinCard,
  DriversList, BenchmarksList, TrendChart, Methodology, AnswersChips,
  ActionRow, PageTitle, Footer,
} from '@shared/result-page';
import type { ReactNode } from 'react';
import { Lightbulb, Home, Car, Wifi, Smartphone, Shirt, Sparkles, Fuel, GraduationCap } from 'lucide-react';
import type { CpiResult, QuizAnswers } from '../../lib/types';
import { mapDrivers, mapBenchmarks, mapChips, mapMonthlyToDataPoints } from '../../lib/mapCpiToShared';
import { deriveAffordabilityStatus } from '../../lib/affordabilityStatus';
import { pickAnchorKey } from '../../lib/anchorSentence';
import { formatCurrencyAed, formatPercent, formatMonthYearLong, formatNumber, interpolate } from '../../lib/format';
import { GapDecomposition } from './GapDecomposition';
import monthlyData from '../../data/cpi-monthly.json';

interface Props {
  answers: QuizAnswers;
  result: CpiResult;
  onRetake: () => void;
  onEdit: (stepKey?: string) => void;
}

const SHARE_URL = 'https://cpi-personal-inflation.vercel.app';

const REC_ICON: Record<string, ReactNode> = {
  'rent-very-high':       <Home className="w-4 h-4" />,
  'internet-deflating':   <Wifi className="w-4 h-4" />,
  'mobile-deflating':     <Smartphone className="w-4 h-4" />,
  'clothing-deflating':   <Shirt className="w-4 h-4" />,
  'petrol-fast-rising':   <Fuel className="w-4 h-4" />,
  'private-school-major': <GraduationCap className="w-4 h-4" />,
};

export function ResultPage({ answers, result, onRetake, onEdit }: Props) {
  const { t, language } = useLanguage();
  const incomeSkipped = answers.income === 'skipped';
  const isPositive = result.difference >= 0;
  const signedDelta = isPositive ? result.estMonthlyExtra : -result.estMonthlyExtra;

  const heroLabel = incomeSkipped
    ? t('result.hero.label')
    : isPositive ? t('result.hero.aedLabel.positive') : t('result.hero.aedLabel.negative');
  const primaryValue = incomeSkipped
    ? formatPercent(result.personalYoy, language, 2, 'always')
    : formatCurrencyAed(signedDelta, language, 'always');
  const anchor = incomeSkipped ? undefined : (() => {
    const k = pickAnchorKey(signedDelta);
    return k ? t(k) : undefined;
  })();
  const status = deriveAffordabilityStatus(result.affordability);
  const heroStatus = status.kind === 'noData' ? undefined : {
    kind: status.kind,
    label: status.kind === 'ok'
      ? t('result.status.ok')
      : interpolate(t(`result.status.${status.kind}.${status.metricKey ?? 'rent'}`), {
          pct: formatPercent((status.pct ?? 0) * 100, language, 0, 'never'),
        }),
  } as const;
  const comparison = incomeSkipped ? undefined : {
    yours: { label: t('result.hero.yourRate'), value: formatPercent(result.personalYoy, language, 2, 'always') },
    benchmark: { label: t('result.hero.dubaiAvg'), value: formatPercent(result.officialYoy, language, 2, 'always') },
  };

  const [primary, ...rest] = result.recommendations;
  const quickWins = rest.slice(0, 3);

  const trendData = mapMonthlyToDataPoints(monthlyData.months, result.personalYoy);

  const lastDate = (() => {
    const last = monthlyData.months[monthlyData.months.length - 1]?.date;
    if (!last) return '';
    const [y, m] = last.split('-');
    return formatMonthYearLong(new Date(Number(y), Number(m) - 1, 1), language);
  })();

  return (
    <div className="px-4 sm:px-6 py-5 max-w-[900px] mx-auto bg-white">
      <PageTitle title={t('result.title')} subtitle={t('result.sub')} />

      <Hero
        status={heroStatus}
        primaryLabel={heroLabel}
        primaryValue={primaryValue}
        anchor={anchor}
        comparison={comparison}
      />

      {primary && (
        <ActionPlan
          title={t('result.rec.title')}
          primary={
            <PrimaryActionCard
              icon={REC_ICON[primary.id] ?? <Lightbulb className="w-4 h-4" />}
              tagLabel={t('result.recs.tag.major')}
              title={primary.title}
              why={primary.why}
              savingLabel={primary.savingLow > 0
                ? interpolate(t('result.rec.saving'), { low: formatNumber(primary.savingLow, language), high: formatNumber(primary.savingHigh, language) })
                : undefined}
            />
          }
          quickWins={quickWins.length > 0 ? (
            <QuickWinsGrid title={t('result.recs.quickWinsTitle')}>
              {quickWins.map(r => (
                <QuickWinCard
                  key={r.id}
                  icon={REC_ICON[r.id] ?? <Sparkles className="w-4 h-4" />}
                  title={r.title}
                  savingLabel={r.savingLow > 0 ? interpolate(t('result.rec.saving'), {
                    low: formatNumber(r.savingLow, language), high: formatNumber(r.savingHigh, language)
                  }) : undefined}
                />
              ))}
            </QuickWinsGrid>
          ) : undefined}
        />
      )}

      <DriversList
        title={t('result.drivers.title')}
        metaLine={t('result.drivers.sub')}
        drivers={mapDrivers(result, answers, t, language)}
      />

      <BenchmarksList
        title={t('result.afford.title')}
        benchmarks={mapBenchmarks(result, t, language)}
      />

      <GapDecomposition result={result} />

      <TrendChart
        title={t('result.trend.title')}
        data={trendData}
        direction="backward"
        yAxisFormatter={v => formatPercent(v, language, 1, 'never')}
        yourLabel={t('result.trend.yours')}
        benchmarkLabel={t('result.trend.official')}
      />

      <Methodology
        toggleLabel={t('result.methodology.toggle')}
        title={t('result.methodology.title')}
        formula={t('result.methodology.formula')}
        layers={[
          { label: t('result.methodology.layer1.label'), body: t('result.methodology.layer1.body') },
          { label: t('result.methodology.layer2.label'), body: t('result.methodology.layer2.body') },
          { label: t('result.methodology.layer3.label'), body: t('result.methodology.layer3.body') },
        ]}
        caveat={t('result.methodology.estimateCaveat')}
      />

      <AnswersChips
        basedOnLabel={t('result.basedOn')}
        editAriaLabel={(label) => interpolate(t('result.chip.editAria'), { label })}
        chips={mapChips(answers, t, onEdit)}
      />

      <ActionRow
        retakeLabel={t('result.cta.retake')}
        editLabel={t('result.cta.edit')}
        shareLabel={t('result.cta.share')}
        copiedLabel={t('result.share.copied')}
        onRetake={onRetake}
        onEdit={() => onEdit()}
        shareTitle={t('result.share.title')}
        shareText={interpolate(t('result.share.text'), {
          cpi: formatPercent(result.personalYoy, language),
          official: formatPercent(result.officialYoy, language),
          url: SHARE_URL,
        })}
        shareUrl={SHARE_URL}
      />

      <Footer
        source={t('result.footer.source')}
        updatedLabel={interpolate(t('result.footer.updated'), { month: lastDate })}
      />
    </div>
  );
}
