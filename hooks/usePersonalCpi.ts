import { useMemo } from 'react';

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

interface PersonalCpiResult {
  personalYoy: number;
  personalMom: number;
  officialYoy: number;
  difference: number;
  topImpactItems: Array<CpiItem & { contribution: number; division_name_en: string; division_name_ar: string }>;
}

export function usePersonalCpi(divisions: Division[], officialYoy: number): PersonalCpiResult {
  return useMemo(() => {
    const selectedItems: Array<CpiItem & { division_name_en: string; division_name_ar: string }> = [];

    for (const div of divisions) {
      for (const item of div.items) {
        if (item.selected) {
          selectedItems.push({ ...item, division_name_en: div.name_en, division_name_ar: div.name_ar });
        }
      }
    }

    if (selectedItems.length === 0) {
      return { personalYoy: 0, personalMom: 0, officialYoy, difference: -officialYoy, topImpactItems: [] };
    }

    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

    const personalYoy = selectedItems.reduce((sum, item) => {
      return sum + (item.yoy_change * item.weight / totalWeight);
    }, 0);

    const personalMom = selectedItems.reduce((sum, item) => {
      return sum + (item.mom_change * item.weight / totalWeight);
    }, 0);

    const difference = personalYoy - officialYoy;

    const itemsWithContribution = selectedItems.map(item => ({
      ...item,
      contribution: (item.yoy_change * item.weight / totalWeight),
    }));

    const topImpactItems = [...itemsWithContribution]
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, 5);

    return {
      personalYoy: Math.round(personalYoy * 100) / 100,
      personalMom: Math.round(personalMom * 100) / 100,
      officialYoy,
      difference: Math.round(difference * 100) / 100,
      topImpactItems,
    };
  }, [divisions, officialYoy]);
}
