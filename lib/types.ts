// ─── Quiz answers (source of truth, persisted to localStorage) ───
export type Nationality = 'emirati' | 'expat';
export type IncomeBracket = 'u10k' | '10-20k' | '20-40k' | '40-80k' | '80-150k' | '150k+' | 'skipped';
export type RentBracket = 'u3k' | '3-6k' | '6-10k' | '10-18k' | '18-30k' | '30k+';

export type EmiratiHousingKind = 'family-home' | 'gov-grant' | 'own-mortgage' | 'rent';
export type ExpatHousingKind   = 'rent' | 'own-no-mortgage';

export interface EmiratiHousing {
  branch: 'emirati';
  kind: EmiratiHousingKind;
  rentBracket?: RentBracket;          // only when kind === 'rent'
}

export interface ExpatHousing {
  branch: 'expat';
  kind: ExpatHousingKind;
  rentBracket?: RentBracket;          // only when kind === 'rent'
}

export type Housing = EmiratiHousing | ExpatHousing;

export interface Household {
  adults: number;   // 1..8
  kids: number;     // 0..8
}

export type TransportMode = 'own-car' | 'mixed' | 'taxi-metro' | 'metro-walk';
export type EatingOut = 'rarely' | 'sometimes' | 'often' | 'very-often';
export type Schooling = 'public' | 'private' | 'university' | 'none';

export interface QuizAnswers {
  version: 1;
  nationality: Nationality;
  income: IncomeBracket;
  housing: Housing;
  household: Household;
  transport: TransportMode;
  eatingOut: EatingOut;
  schooling: Schooling;
  completedAt: string;                  // ISO timestamp
  language: 'en' | 'ar';
}

// ─── Profiles JSON shape ───
export interface NationalityAdjustment {
  utilityScaler: number;
  healthScaler: number;
  educationPublic: number;
  educationUni: number;
}

export interface TransportShape {
  petrol: number; 'car-insurance': number; 'car-maint': number; taxi: number; metro: number;
}

export interface Profiles {
  bracketMidpoints: {
    income: Record<Exclude<IncomeBracket, 'skipped'>, number>;
    rent: Record<RentBracket, number>;
  };
  dubaiAverages: {
    housingPctOfBasket: number;
    rentPctOfIncome: number;
    transportPctOfIncome: number;
    restaurantPctOfIncome: number;
    savingsHeadroomPct: number;
    averageHouseholdSize: number;
    trackedSpendRatio: number;
    averageRentAED: number;
  };
  nationalityAdjustments: { emirati: NationalityAdjustment; expat: NationalityAdjustment };
  eatingOutMultiplier: Record<EatingOut, number>;
  schoolFeeIndex: Record<Schooling, number>;
  transportShape: Record<TransportMode, TransportShape>;
  affordabilityThresholds: {
    rentPctOfIncome: { warn: number; alert: number };
    transportPctOfIncome: { warn: number; alert: number };
    restaurantPctOfIncome: { warn: number; alert: number };
  };
}

// ─── CPI items + monthly data shapes (mirrors existing JSON) ───
export interface CpiItem {
  id: string;
  name_en: string;
  name_ar: string;
  price_aed: number;
  mom_change: number;
  yoy_change: number;
  weight: number;
  selected?: boolean;
}

export interface CpiDivision {
  id: string;
  name_en: string;
  name_ar: string;
  weight: number;
  items: CpiItem[];
}

export interface CpiItemsData {
  officialCpi: { currentIndex: number; momChange: number; yoyChange: number };
  divisions: CpiDivision[];
}

// ─── Calculation result ───
export interface DriverContribution {
  divisionId: string;
  divisionName_en: string;
  divisionName_ar: string;
  basketPct: number;
  yoy: number;
  contributionPp: number;
  shareOfTotal: number;
  topItem: { name_en: string; name_ar: string; yoy: number };
}

export type AffordabilityKey = 'rent' | 'transport' | 'eating' | 'headroom';
export interface AffordabilityMetric {
  key: AffordabilityKey;
  pctOfIncome: number;
  benchmarkPct: number;
  status: 'ok' | 'warn' | 'alert';
}

export type RecPriority = 'easy-win' | 'major-lever' | 'standard';
export type RecCategory = 'housing' | 'transport' | 'food' | 'utilities' | 'lifestyle' | 'savings';

export interface Recommendation {
  id: string;
  category: RecCategory;
  priority: RecPriority;
  title: string;
  why: string;
  savingLow: number;
  savingHigh: number;
}

export interface CpiResult {
  personalYoy: number;
  personalMom: number;
  officialYoy: number;
  difference: number;
  estMonthlyBasket: number;
  estMonthlyExtra: number;
  basketWeights: Record<string, number>;
  decomposition: { mixPp: number; marketPp: number };
  drivers: DriverContribution[];
  affordability: AffordabilityMetric[];
  recommendations: Recommendation[];
}
