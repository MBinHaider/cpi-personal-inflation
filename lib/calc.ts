import type {
  Profiles,
  QuizAnswers,
  NationalityAdjustment,
  CpiDivision,
  TransportShape,
  AffordabilityMetric,
  CpiItemsData,
  CpiResult,
  DriverContribution,
} from './types';
import { generateRecommendations } from './recommendations';

// ─── Task 3: resolve anchors ───

export interface ResolvedAnchors {
  incomeAED: number | null;
  rentAED: number | null;
  hhSize: number;
  adults: number;
  kids: number;
  isSingleParent: boolean;
  adj: NationalityAdjustment;
}

export function resolveAnchors(answers: QuizAnswers, profiles: Profiles): ResolvedAnchors {
  const incomeAED =
    answers.income === 'skipped' ? null : profiles.bracketMidpoints.income[answers.income];

  const rentAED =
    answers.housing.rentBracket ? profiles.bracketMidpoints.rent[answers.housing.rentBracket] : null;

  const { adults, kids } = answers.household;
  return {
    incomeAED,
    rentAED,
    hhSize: adults + kids,
    adults,
    kids,
    isSingleParent: adults === 1 && kids > 0,
    adj: profiles.nationalityAdjustments[answers.nationality],
  };
}

// ─── Task 4: division weight vector ───

const DIV_FOOD = '01';
const DIV_CLOTHING = '03';
const DIV_HOUSING = '04';
const DIV_FURNISHINGS = '05';        // contains utility / cleaning items
const DIV_HEALTH = '06';
const DIV_TRANSPORT = '07';
const DIV_COMMUNICATION = '08';
const DIV_EDUCATION = '10';
const DIV_RESTAURANTS = '11';

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function housingScalerFor(answers: QuizAnswers, anchors: ResolvedAnchors, profiles: Profiles): number {
  const h = answers.housing;
  if (h.branch === 'emirati') {
    switch (h.kind) {
      case 'family-home':  return 0.10;
      case 'gov-grant':    return 0.40;
      case 'own-mortgage': return 1.0;
      case 'rent':         return anchors.rentAED
                                 ? clamp(anchors.rentAED / profiles.dubaiAverages.averageRentAED, 0.4, 2.5)
                                 : 1.0;
    }
  }
  if (h.kind === 'own-no-mortgage') return 0.20;
  return anchors.rentAED
    ? clamp(anchors.rentAED / profiles.dubaiAverages.averageRentAED, 0.4, 2.5)
    : 1.0;
}

function educationScalerFor(answers: QuizAnswers, anchors: ResolvedAnchors, profiles: Profiles): number {
  if (anchors.kids <= 0) return 0;
  const adj = anchors.adj;
  switch (answers.schooling) {
    case 'public':     return adj.educationPublic;
    case 'university': return adj.educationUni;
    case 'private':    return profiles.schoolFeeIndex.private;
    case 'none':       return 0;
  }
}

export function buildDivisionWeights(
  answers: QuizAnswers,
  anchors: ResolvedAnchors,
  divisions: CpiDivision[],
  profiles: Profiles
): Record<string, number> {
  const adj = anchors.adj;
  const avgHh = profiles.dubaiAverages.averageHouseholdSize;
  const hhSize = anchors.hhSize;
  const adults = anchors.adults;
  const kids = anchors.kids;

  const housingScaler      = housingScalerFor(answers, anchors, profiles);
  const foodScaler         = (adults + kids * 0.7) / avgHh;
  const restaurantScaler   = profiles.eatingOutMultiplier[answers.eatingOut] * hhSize / 3;
  const educationScaler    = educationScalerFor(answers, anchors, profiles);
  const clothingScaler     = 0.6 + 0.2 * hhSize;
  const utilityScaler      = adj.utilityScaler;
  const healthScaler       = adj.healthScaler;
  const communicationScaler = 0.5 + 0.5 * (adults / 2);

  // Apply per-division scalers to raw weights
  const scaled: Record<string, number> = {};
  for (const div of divisions) {
    let s = 1.0;
    switch (div.id) {
      case DIV_FOOD:           s = foodScaler; break;
      case DIV_CLOTHING:       s = clothingScaler; break;
      case DIV_HOUSING:        s = housingScaler * utilityScaler; break; // housing items + utility lines
      case DIV_FURNISHINGS:    s = utilityScaler; break;
      case DIV_HEALTH:         s = healthScaler; break;
      case DIV_TRANSPORT:      s = 1.0; break;     // shape adjusted in item distribution (Task 5)
      case DIV_COMMUNICATION:  s = communicationScaler; break;
      case DIV_EDUCATION:      s = educationScaler; break;
      case DIV_RESTAURANTS:    s = restaurantScaler; break;
      default:                 s = 1.0;
    }
    scaled[div.id] = (div.weight / 100) * s;
  }

  // Renormalize so weights sum to 1.0
  const total = Object.values(scaled).reduce((s, v) => s + v, 0);
  if (total <= 0) return scaled;
  const normalized: Record<string, number> = {};
  for (const id of Object.keys(scaled)) normalized[id] = scaled[id] / total;
  return normalized;
}

// ─── Task 5: item-level weights + YoY/MoM ───

const TRANSPORT_ITEM_TO_SHAPE_KEY: Record<string, keyof TransportShape> = {
  '07-01': 'petrol',
  '07-02': 'taxi',
  '07-03': 'metro',
  '07-04': 'car-insurance',
  '07-05': 'car-maint',
};

export function distributeItemWeights(
  answers: QuizAnswers,
  divisionWeights: Record<string, number>,
  divisions: CpiDivision[],
  profiles: Profiles
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const div of divisions) {
    const divWeight = divisionWeights[div.id] ?? 0;
    if (divWeight === 0) {
      for (const item of div.items) out[item.id] = 0;
      continue;
    }

    if (div.id === DIV_TRANSPORT) {
      const shape = profiles.transportShape[answers.transport];
      for (const item of div.items) {
        const shapeKey = TRANSPORT_ITEM_TO_SHAPE_KEY[item.id];
        const share = shapeKey ? shape[shapeKey] : 0;
        out[item.id] = divWeight * share;
      }
      continue;
    }

    const intraDivTotal = div.items.reduce((s, i) => s + i.weight, 0);
    if (intraDivTotal === 0) {
      for (const item of div.items) out[item.id] = 0;
      continue;
    }
    for (const item of div.items) {
      out[item.id] = divWeight * (item.weight / intraDivTotal);
    }
  }
  return out;
}

export function computeRates(
  itemWeights: Record<string, number>,
  divisions: CpiDivision[]
): { personalYoy: number; personalMom: number } {
  let yoy = 0;
  let mom = 0;
  for (const div of divisions) {
    for (const item of div.items) {
      const w = itemWeights[item.id] ?? 0;
      yoy += item.yoy_change * w;
      mom += item.mom_change * w;
    }
  }
  return { personalYoy: yoy, personalMom: mom };
}

// ─── Task 6: gap decomposition (mix vs market) ───

export function buildDubaiBaselineItemWeights(divisions: CpiDivision[]): Record<string, number> {
  const out: Record<string, number> = {};
  let total = 0;
  for (const div of divisions) {
    for (const item of div.items) {
      out[item.id] = item.weight / 100;
      total += out[item.id];
    }
  }
  // Renormalize defensively (raw weights should already sum to ~1)
  if (total > 0) {
    for (const id of Object.keys(out)) out[id] = out[id] / total;
  }
  return out;
}

export function decomposeGap(
  personalItemWeights: Record<string, number>,
  baselineItemWeights: Record<string, number>,
  divisions: CpiDivision[],
  personalYoy: number,
  officialYoy: number
): { mixPp: number; marketPp: number } {
  let mixPp = 0;
  for (const div of divisions) {
    for (const item of div.items) {
      const wp = personalItemWeights[item.id] ?? 0;
      const wb = baselineItemWeights[item.id] ?? 0;
      mixPp += (wp - wb) * item.yoy_change;
    }
  }
  const marketPp = (personalYoy - officialYoy) - mixPp;
  return { mixPp, marketPp };
}

// ─── Task 7: drivers + affordability + computeCpi entry ───

export function buildDrivers(
  itemWeights: Record<string, number>,
  divisionWeights: Record<string, number>,
  divisions: CpiDivision[],
  _personalYoy: number
): DriverContribution[] {
  // Aggregate item-level contribution to division level
  const byDiv: Record<string, { contrib: number; yoy: number; topItem: { name_en: string; name_ar: string; yoy: number } }> = {};
  for (const div of divisions) {
    let divContrib = 0;
    let yoySum = 0;
    let yoyCount = 0;
    let topItem: { name_en: string; name_ar: string; yoy: number } | null = null;
    for (const item of div.items) {
      const w = itemWeights[item.id] ?? 0;
      const c = w * item.yoy_change;
      divContrib += c;
      yoySum += item.yoy_change;
      yoyCount += 1;
      if (topItem === null || Math.abs(item.yoy_change) > Math.abs(topItem.yoy)) {
        topItem = { name_en: item.name_en, name_ar: item.name_ar, yoy: item.yoy_change };
      }
    }
    if (topItem === null) topItem = { name_en: '', name_ar: '', yoy: 0 };
    // Division's approximate YoY: simple average of its items' YoY (intuitive "category-level rate").
    const divYoy = yoyCount > 0 ? yoySum / yoyCount : 0;
    byDiv[div.id] = { contrib: divContrib, yoy: divYoy, topItem };
  }

  const sortedDivs = divisions
    .map(d => ({
      divisionId: d.id,
      divisionName_en: d.name_en,
      divisionName_ar: d.name_ar,
      basketPct: divisionWeights[d.id] ?? 0,
      yoy: byDiv[d.id].yoy,
      contributionPp: byDiv[d.id].contrib,
      topItem: byDiv[d.id].topItem,
    }))
    .filter(d => d.basketPct > 0)
    .sort((a, b) => Math.abs(b.contributionPp) - Math.abs(a.contributionPp))
    .slice(0, 5);

  const totalAbs = sortedDivs.reduce((s, d) => s + Math.abs(d.contributionPp), 0) || 1;
  return sortedDivs.map(d => ({ ...d, shareOfTotal: Math.abs(d.contributionPp) / totalAbs }));
}

function divisionShareOfIncome(
  divisionId: string,
  divisions: CpiDivision[],
  itemWeights: Record<string, number>,
  estMonthlyBasket: number,
  income: number
): number {
  const div = divisions.find(d => d.id === divisionId);
  if (!div || income <= 0) return 0;
  let divBasketShare = 0;
  for (const item of div.items) divBasketShare += itemWeights[item.id] ?? 0;
  return (divBasketShare * estMonthlyBasket) / income;
}

function statusFor(pct: number, threshold: { warn: number; alert: number }): 'ok' | 'warn' | 'alert' {
  if (pct >= threshold.alert) return 'alert';
  if (pct >= threshold.warn) return 'warn';
  return 'ok';
}

export function buildAffordability(
  answers: QuizAnswers,
  anchors: ResolvedAnchors,
  divisions: CpiDivision[],
  itemWeights: Record<string, number>,
  profiles: Profiles
): AffordabilityMetric[] {
  if (anchors.incomeAED == null) return [];
  const income = anchors.incomeAED;
  const estMonthlyBasket = income * profiles.dubaiAverages.trackedSpendRatio;

  const rentPct = anchors.rentAED != null ? anchors.rentAED / income : 0;
  const transportPct = divisionShareOfIncome(DIV_TRANSPORT, divisions, itemWeights, estMonthlyBasket, income);
  const eatingPct = divisionShareOfIncome(DIV_RESTAURANTS, divisions, itemWeights, estMonthlyBasket, income);
  const headroomPct = Math.max(0, 1 - (estMonthlyBasket / income));

  const t = profiles.affordabilityThresholds;
  const out: AffordabilityMetric[] = [
    { key: 'rent',      pctOfIncome: rentPct,      benchmarkPct: profiles.dubaiAverages.rentPctOfIncome,       status: statusFor(rentPct, t.rentPctOfIncome) },
    { key: 'transport', pctOfIncome: transportPct, benchmarkPct: profiles.dubaiAverages.transportPctOfIncome,  status: statusFor(transportPct, t.transportPctOfIncome) },
    { key: 'eating',    pctOfIncome: eatingPct,    benchmarkPct: profiles.dubaiAverages.restaurantPctOfIncome, status: statusFor(eatingPct, t.restaurantPctOfIncome) },
    { key: 'headroom',  pctOfIncome: headroomPct,  benchmarkPct: profiles.dubaiAverages.savingsHeadroomPct,    status: headroomPct < profiles.dubaiAverages.savingsHeadroomPct * 0.5 ? 'alert' : headroomPct < profiles.dubaiAverages.savingsHeadroomPct ? 'warn' : 'ok' },
  ];
  return out;
}

export function computeCpi(answers: QuizAnswers, items: CpiItemsData, profiles: Profiles): CpiResult {
  const anchors = resolveAnchors(answers, profiles);
  const divisions = items.divisions;
  const officialYoy = items.officialCpi.yoyChange;

  const divisionWeights = buildDivisionWeights(answers, anchors, divisions, profiles);
  const itemWeights = distributeItemWeights(answers, divisionWeights, divisions, profiles);
  const baselineItemWeights = buildDubaiBaselineItemWeights(divisions);

  const { personalYoy, personalMom } = computeRates(itemWeights, divisions);
  const difference = personalYoy - officialYoy;
  const decomposition = decomposeGap(itemWeights, baselineItemWeights, divisions, personalYoy, officialYoy);
  const drivers = buildDrivers(itemWeights, divisionWeights, divisions, personalYoy);

  const incomeAED = anchors.incomeAED;
  const estMonthlyBasket = incomeAED != null
    ? incomeAED * profiles.dubaiAverages.trackedSpendRatio
    : 2500 * anchors.hhSize;                                   // fallback when income skipped
  const estMonthlyExtra = (difference / 100) * estMonthlyBasket;

  const affordability = buildAffordability(answers, anchors, divisions, itemWeights, profiles);

  return {
    personalYoy: round2(personalYoy),
    personalMom: round2(personalMom),
    officialYoy,
    difference: round2(difference),
    estMonthlyBasket: Math.round(estMonthlyBasket),
    estMonthlyExtra: Math.round(estMonthlyExtra),
    basketWeights: divisionWeights,
    decomposition: { mixPp: round2(decomposition.mixPp), marketPp: round2(decomposition.marketPp) },
    drivers,
    affordability,
    recommendations: [],
  };
}

function round2(v: number) { return Math.round(v * 100) / 100; }

export function computeCpiWithRecommendations(
  answers: QuizAnswers,
  items: CpiItemsData,
  profiles: Profiles,
  t: (key: string) => string
): CpiResult {
  const result = computeCpi(answers, items, profiles);
  const recommendations = generateRecommendations(answers, result, items, profiles, t);
  return { ...result, recommendations };
}
