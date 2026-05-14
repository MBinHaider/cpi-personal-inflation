import { useState, useCallback } from 'react';
import { PageShell } from '@shared/components/PageShell';
import { Header } from '@shared/components/Header';
import { KpiCard } from '@shared/components/KpiCard';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { usePersonalCpi } from '../hooks/usePersonalCpi';
import { HeroSection } from './HeroSection';
import { ItemSelector } from './ItemSelector';
import { PersonalTrendChart } from './PersonalTrendChart';
import { TopImpactItems } from './TopImpactItems';
import cpiItemsRaw from '../data/cpi-items.json';
import cpiMonthlyData from '../data/cpi-monthly.json';

interface CpiItem {
  id: string;
  name_en: string;
  name_ar: string;
  price_aed: number;
  mom_change: number;
  yoy_change: number;
  weight: number;
  selected: boolean;
}

interface Division {
  id: string;
  name_en: string;
  name_ar: string;
  weight: number;
  items: CpiItem[];
}

// Deep clone the JSON data to make it mutable state
function cloneDivisions(raw: typeof cpiItemsRaw.divisions): Division[] {
  return raw.map(div => ({
    ...div,
    items: div.items.map(item => ({ ...item })),
  }));
}

export function CpiInteractive() {
  const { t } = useLanguage();
  const [divisions, setDivisions] = useState<Division[]>(() => cloneDivisions(cpiItemsRaw.divisions));

  const officialYoy = cpiItemsRaw.officialCpi.yoyChange;
  const officialMom = cpiItemsRaw.officialCpi.momChange;

  const { personalYoy, personalMom, difference, topImpactItems } = usePersonalCpi(divisions, officialYoy);

  const handleToggleItem = useCallback((itemId: string) => {
    setDivisions(prev =>
      prev.map(div => ({
        ...div,
        items: div.items.map(item =>
          item.id === itemId ? { ...item, selected: !item.selected } : item
        ),
      }))
    );
  }, []);

  const formatCpi = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  const formatChange = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(2)}% MoM`;

  const differenceDirection: 'up' | 'down' | 'neutral' =
    difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral';

  return (
    <PageShell>
      <Header title="CPI" subtitle="Interactive" />

      <HeroSection />

      {/* KPI Strip */}
      <div className="px-6 pb-4 grid grid-cols-3 gap-4">
        <KpiCard
          label={t('kpi.personalCpi')}
          value={formatCpi(personalYoy)}
          change={formatChange(personalMom)}
          changeDirection={personalMom > 0 ? 'up' : personalMom < 0 ? 'down' : 'neutral'}
          variant="primary"
        />
        <KpiCard
          label={t('kpi.officialCpi')}
          value={formatCpi(officialYoy)}
          change={formatChange(officialMom)}
          changeDirection={officialMom > 0 ? 'up' : 'neutral'}
        />
        <KpiCard
          label={t('kpi.difference')}
          value={`${difference > 0 ? '+' : ''}${difference.toFixed(2)}pp`}
          change={difference > 0 ? 'You pay more than average' : difference < 0 ? 'You pay less than average' : 'In line with average'}
          changeDirection={differenceDirection}
        />
      </div>

      {/* Two-column layout */}
      <div className="px-6 pb-8 flex gap-4 items-start">
        {/* Left: Item Selector — 45% */}
        <div className="w-[45%] flex-shrink-0">
          <ItemSelector divisions={divisions} onToggleItem={handleToggleItem} />
        </div>

        {/* Right: Chart + Impact — 55% */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <PersonalTrendChart
            monthlyData={cpiMonthlyData.months}
            personalYoy={personalYoy}
          />
          <TopImpactItems items={topImpactItems} />
        </div>
      </div>
    </PageShell>
  );
}
