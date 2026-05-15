/**
 * Map a monthly-AED impact magnitude to a translation key for a
 * real-world anchor sentence. Lets a naive reader feel the number.
 *
 * Pass the SIGNED monthly delta (positive = paying more, negative = saving).
 * Returns the translation key the caller should resolve via t(). Returns null
 * when the magnitude is too small to be meaningful (e.g. < 5 AED/month).
 */
export type AnchorBucket = 'u30' | '30-80' | '80-150' | '150-300' | '300-600' | '600-1200' | '1200+';

export function pickAnchorKey(monthlyDeltaAed: number): string | null {
  const abs = Math.abs(monthlyDeltaAed);
  if (abs < 5) return null;
  const bucket: AnchorBucket =
    abs < 30   ? 'u30'      :
    abs < 80   ? '30-80'    :
    abs < 150  ? '80-150'   :
    abs < 300  ? '150-300'  :
    abs < 600  ? '300-600'  :
    abs < 1200 ? '600-1200' :
                 '1200+';
  const sign = monthlyDeltaAed >= 0 ? 'positive' : 'negative';
  return `result.hero.anchor.${sign}.${bucket}`;
}
