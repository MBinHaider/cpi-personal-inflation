import type {
  QuizAnswers, CpiResult, CpiItemsData, Profiles, Recommendation, RecCategory, RecPriority,
} from './types';

export interface RuleContext {
  answers: QuizAnswers;
  result: CpiResult;
  items: CpiItemsData;
  profiles: Profiles;
  itemYoy: (itemId: string) => number;
  rentPctOfIncome: number;
  restaurantPctOfIncome: number;
  isSingleParent: boolean;
}

export interface Rule {
  id: string;
  category: RecCategory;
  priority: RecPriority;
  confidence: number;
  trigger: (ctx: RuleContext) => boolean;
  estimateSaving: (ctx: RuleContext) => { low: number; high: number };
}

const PETROL = '07-01';
const INTERNET = '08-02';
const MOBILE = '08-01';

/**
 * Ordered fallback pool — IDs surface unconditionally when fewer than 4
 * recommendations survive the diversity guard.  Entries are easy-win rules
 * that are useful to almost any profile (utilities review, deflation tips).
 * IDs must match existing Rule.id values so their text/savings copy is reused.
 */
export const FALLBACK_POOL: ReadonlyArray<string> = [
  'mobile-deflating',
  'internet-deflating',
  'clothing-deflating',
  'dewa-savings',
];

export const RULES: Rule[] = [
  {
    id: 'rent-high', category: 'housing', priority: 'major-lever', confidence: 0.85,
    trigger: ctx => ctx.rentPctOfIncome > 0.34 && ctx.rentPctOfIncome <= 0.45,
    estimateSaving: ctx => {
      const r = ctx.answers.housing.rentBracket
        ? ctx.profiles.bracketMidpoints.rent[ctx.answers.housing.rentBracket]
        : 0;
      return { low: Math.round(r * 0.08), high: Math.round(r * 0.12) };
    },
  },
  {
    id: 'rent-very-high', category: 'housing', priority: 'major-lever', confidence: 0.9,
    trigger: ctx => ctx.rentPctOfIncome > 0.45,
    estimateSaving: ctx => {
      const r = ctx.answers.housing.rentBracket
        ? ctx.profiles.bracketMidpoints.rent[ctx.answers.housing.rentBracket]
        : 0;
      return { low: Math.round(r * 0.15), high: Math.round(r * 0.25) };
    },
  },
  {
    id: 'family-home-investment', category: 'savings', priority: 'standard', confidence: 0.6,
    trigger: ctx => ctx.answers.nationality === 'emirati' && ctx.answers.housing.branch === 'emirati' && ctx.answers.housing.kind === 'family-home',
    estimateSaving: () => ({ low: 0, high: 0 }),                  // informational
  },
  {
    id: 'eating-out-high', category: 'food', priority: 'standard', confidence: 0.75,
    trigger: ctx => (ctx.answers.eatingOut === 'often' || ctx.answers.eatingOut === 'very-often') && ctx.restaurantPctOfIncome > 0.06,
    estimateSaving: ctx => {
      const hh = ctx.answers.household.adults + ctx.answers.household.kids;
      return { low: 400 * hh, high: 700 * hh };
    },
  },
  {
    id: 'petrol-fast-rising', category: 'transport', priority: 'standard', confidence: 0.7,
    trigger: ctx => ctx.answers.transport === 'own-car' && ctx.itemYoy(PETROL) > 5,
    estimateSaving: () => ({ low: 80, high: 180 }),
  },
  {
    id: 'transit-savings', category: 'transport', priority: 'standard', confidence: 0.6,
    trigger: ctx => ctx.answers.transport === 'own-car' && ctx.rentPctOfIncome > 0.35,
    estimateSaving: () => ({ low: 200, high: 400 }),
  },
  {
    id: 'internet-deflating', category: 'utilities', priority: 'easy-win', confidence: 0.8,
    trigger: ctx => ctx.itemYoy(INTERNET) < -1,
    estimateSaving: () => ({ low: 60, high: 120 }),
  },
  {
    id: 'mobile-deflating', category: 'utilities', priority: 'easy-win', confidence: 0.75,
    trigger: ctx => ctx.itemYoy(MOBILE) < -1,
    estimateSaving: () => ({ low: 40, high: 80 }),
  },
  {
    id: 'dewa-savings', category: 'utilities', priority: 'easy-win', confidence: 0.6,
    trigger: ctx => ctx.answers.nationality === 'expat',
    estimateSaving: () => ({ low: 40, high: 80 }),
  },
  {
    id: 'private-school-major', category: 'lifestyle', priority: 'major-lever', confidence: 0.7,
    trigger: ctx => ctx.answers.schooling === 'private' && (ctx.profiles.bracketMidpoints.income[ctx.answers.income === 'skipped' ? '20-40k' : ctx.answers.income] < 80000),
    estimateSaving: () => ({ low: 800, high: 2000 }),
  },
  {
    id: 'university-grant-info', category: 'lifestyle', priority: 'easy-win', confidence: 0.7,
    trigger: ctx => ctx.answers.nationality === 'emirati' && ctx.answers.schooling === 'university',
    estimateSaving: () => ({ low: 0, high: 0 }),
  },
  {
    id: 'low-headroom', category: 'savings', priority: 'major-lever', confidence: 0.65,
    trigger: ctx => {
      const headroom = ctx.result.affordability.find(a => a.key === 'headroom');
      return headroom != null && headroom.pctOfIncome < 0.15;
    },
    estimateSaving: () => ({ low: 0, high: 0 }),                  // motivational
  },
  {
    id: 'clothing-deflating', category: 'lifestyle', priority: 'easy-win', confidence: 0.55,
    trigger: ctx => {
      const clothing = ctx.items.divisions.find(d => d.id === '03');
      if (!clothing) return false;
      const avg = clothing.items.reduce((s, i) => s + i.yoy_change, 0) / clothing.items.length;
      return avg < 0;
    },
    estimateSaving: () => ({ low: 50, high: 150 }),
  },
  {
    id: 'single-parent-housing-scheme', category: 'housing', priority: 'easy-win', confidence: 0.6,
    trigger: ctx => ctx.isSingleParent && ctx.answers.nationality === 'emirati',
    estimateSaving: () => ({ low: 0, high: 0 }),                  // info only
  },
  {
    id: 'delivery-vs-restaurant', category: 'food', priority: 'standard', confidence: 0.55,
    trigger: ctx => ctx.answers.eatingOut === 'very-often',
    estimateSaving: () => ({ low: 100, high: 300 }),
  },
];
