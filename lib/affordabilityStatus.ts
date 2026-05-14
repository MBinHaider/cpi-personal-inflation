import type { AffordabilityMetric } from './types';

export type AffordabilityStatusKind = 'alert' | 'warn' | 'ok' | 'noData';

export interface AffordabilityStatus {
  kind: AffordabilityStatusKind;
  metricKey?: string;   // e.g. 'rent', 'transport', 'eating'
  pct?: number;         // pctOfIncome of the worst offender (already a fraction, e.g. 0.47)
}

/**
 * Priority order for surfacing the worst affordability offender.
 * 'eating' is the AffordabilityKey used in calc.ts (not 'eatingOut').
 */
const PRIORITY: ReadonlyArray<string> = ['rent', 'transport', 'eating'];

/**
 * Derives a single affordability status from a list of AffordabilityMetric objects.
 *
 * Uses the `status` field that calc.ts already computes — no threshold
 * re-computation needed here.  Priority order: rent > transport > eating.
 *
 * Returns `noData` when the metrics array is empty (income skipped).
 */
export function deriveAffordabilityStatus(metrics: AffordabilityMetric[]): AffordabilityStatus {
  if (!metrics || metrics.length === 0) return { kind: 'noData' };

  // Find worst alert metric in priority order
  for (const key of PRIORITY) {
    const m = metrics.find(x => x.key === key);
    if (m && m.status === 'alert') {
      return { kind: 'alert', metricKey: key, pct: m.pctOfIncome };
    }
  }
  // Find worst warn metric in priority order
  for (const key of PRIORITY) {
    const m = metrics.find(x => x.key === key);
    if (m && m.status === 'warn') {
      return { kind: 'warn', metricKey: key, pct: m.pctOfIncome };
    }
  }
  return { kind: 'ok' };
}
