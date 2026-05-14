import type {
  QuizAnswers, CpiResult, CpiItemsData, Profiles, Recommendation,
} from './types';
import { RULES, type RuleContext } from './recommendations.rules';

export type TranslateFn = (key: string, tokens?: Record<string, string | number>) => string;

function interpolate(s: string, tokens: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in tokens ? String(tokens[k]) : `{${k}}`));
}

export function generateRecommendations(
  answers: QuizAnswers,
  result: CpiResult,
  items: CpiItemsData,
  profiles: Profiles,
  t: (key: string) => string
): Recommendation[] {
  // Build a fast item-YoY lookup
  const itemYoyMap: Record<string, number> = {};
  for (const div of items.divisions) for (const item of div.items) itemYoyMap[item.id] = item.yoy_change;

  const incomeMid = answers.income === 'skipped' ? 30000 : profiles.bracketMidpoints.income[answers.income];
  const rentMid = answers.housing.rentBracket ? profiles.bracketMidpoints.rent[answers.housing.rentBracket] : 0;
  const rentPctOfIncome = incomeMid > 0 ? rentMid / incomeMid : 0;

  const restaurantDiv = items.divisions.find(d => d.id === '11');
  let restaurantBasketShare = 0;
  if (restaurantDiv) for (const it of restaurantDiv.items) restaurantBasketShare += result.basketWeights['11'] != null ? (result.basketWeights['11'] * (it.weight / restaurantDiv.items.reduce((s, i) => s + i.weight, 0))) : 0;
  const estBasket = incomeMid * profiles.dubaiAverages.trackedSpendRatio;
  const restaurantPctOfIncome = incomeMid > 0 ? (restaurantBasketShare * estBasket) / incomeMid : 0;

  const ctx: RuleContext = {
    answers, result, items, profiles,
    itemYoy: id => itemYoyMap[id] ?? 0,
    rentPctOfIncome,
    restaurantPctOfIncome,
    isSingleParent: answers.household.adults === 1 && answers.household.kids > 0,
  };

  // Evaluate all rules
  const matched = RULES.filter(r => r.trigger(ctx))
    .map(r => {
      const saving = r.estimateSaving(ctx);
      const midpoint = (saving.low + saving.high) / 2;
      const score = midpoint * r.confidence;
      return { rule: r, saving, score };
    })
    .sort((a, b) => b.score - a.score);

  // Apply diversity guard (max 2 per category) and reserve slot 4 for easy-win
  const out: Recommendation[] = [];
  const perCat: Record<string, number> = {};
  const standardSlots: typeof matched = [];
  const easyWinSlot: typeof matched = [];

  for (const m of matched) {
    if (m.rule.priority === 'easy-win') easyWinSlot.push(m);
    else standardSlots.push(m);
  }

  function add(m: typeof matched[number]) {
    if (out.length >= 4) return;
    const cat = m.rule.category;
    if ((perCat[cat] ?? 0) >= 2) return;
    perCat[cat] = (perCat[cat] ?? 0) + 1;
    const title = t(`rec.${m.rule.id}.title`);
    const why = interpolate(t(`rec.${m.rule.id}.why`), {
      rentPct: Math.round(rentPctOfIncome * 100),
      restaurantPct: Math.round(restaurantPctOfIncome * 100),
      yoy: result.personalYoy.toFixed(2),
      savingLow: m.saving.low,
      savingHigh: m.saving.high,
    });
    out.push({
      id: m.rule.id,
      category: m.rule.category,
      priority: m.rule.priority,
      title,
      why,
      savingLow: m.saving.low,
      savingHigh: m.saving.high,
    });
  }

  // First fill 3 non-easy-win slots by score
  for (const m of standardSlots) {
    if (out.length >= 3) break;
    add(m);
  }
  // Then reserve slot 4 for top easy-win if any
  if (easyWinSlot.length > 0) add(easyWinSlot[0]);
  // If still under 4, top up with remaining matched
  for (const m of [...standardSlots, ...easyWinSlot]) {
    if (out.length >= 4) break;
    if (!out.some(o => o.id === m.rule.id)) add(m);
  }

  return out;
}
