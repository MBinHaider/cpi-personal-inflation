/**
 * Shared formatting helpers for CPI interactive component.
 *
 * All functions are pure and use Intl APIs exclusively — no manual digit
 * translation tables.
 *
 * Arabic locale strategy:
 *   - We use 'ar-u-nu-arab' (Unicode extension: numbering system = Arabic-Indic)
 *     rather than bare 'ar', because Node ≥ 22 / ICU defaults to Latin digits
 *     for the generic 'ar' tag in this runtime environment.
 *   - Arabic percent output includes U+061C (Arabic Letter Mark) as a
 *     bidirectional control character — callers may strip it for comparisons
 *     but should leave it in displayed text for correct BiDi rendering.
 */

/** Locale string used internally for Arabic formatting (Arabic-Indic digits). */
const AR_LOCALE = 'ar-u-nu-arab' as const;

type Locale = 'en' | 'ar';

function resolvedLocale(locale: Locale): string {
  return locale === 'ar' ? AR_LOCALE : 'en';
}

/**
 * Format a plain number using Intl.NumberFormat.
 *
 * @param n      The number to format.
 * @param locale 'en' → Latin digits, 'ar' → Arabic-Indic digits.
 * @param opts   Optional Intl.NumberFormatOptions to forward.
 */
export function formatNumber(
  n: number,
  locale: Locale,
  opts?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(resolvedLocale(locale), opts).format(n);
}

/**
 * Format a percentage value that is already in percent terms (e.g. 3.29 for 3.29%).
 *
 * - Always emits a sign: '+' for positive/zero, '-' for negative.
 * - Zero is formatted as "+0.00%" (or AR equivalent).
 * - Default fractionDigits = 2.
 * - The '%' sign is locale-appropriate: '%' (U+0025) in EN, '٪' (U+066A) in AR.
 * - AR output contains U+061C (Arabic Letter Mark) bidi control characters —
 *   strip with /؜/g for comparison if needed.
 *
 * @param n              Percent value already in percent terms.
 *                       Pass `3.29` to display "+3.29%", NOT `0.0329`.
 *                       Example: `formatPercent(3.29, 'en')` → `"+3.29%"`.
 * @param locale         'en' | 'ar'.
 * @param fractionDigits Decimal places (default 2).
 * @param signDisplay    Intl signDisplay option (default 'always' → always show sign).
 *                       Pass 'never' to suppress the sign, e.g. for basket-weight display.
 */
export function formatPercent(
  n: number,
  locale: Locale,
  fractionDigits = 2,
  signDisplay: Intl.NumberFormatOptions['signDisplay'] = 'always',
): string {
  if (Math.abs(n) > 1000) {
    console.warn(
      `formatPercent: value ${n} is outside the expected range (|n| > 1000). ` +
        'Did you pass a decimal fraction instead of a percent value? ' +
        'Pass 3.29 for 3.29%, not 0.0329.',
    );
  }
  // Intl 'percent' style multiplies by 100, so divide to compensate.
  const fraction = n / 100;
  return new Intl.NumberFormat(resolvedLocale(locale), {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    signDisplay,
  }).format(fraction);
}

/**
 * Format a currency value in AED.
 *
 * "AED" is intentionally kept as Latin in both locales (matches app convention).
 * Numbers use locale-appropriate digit shapes.
 *
 * EN example: "AED 23,400"
 * AR example: "AED ٢٣٬٤٠٠"
 *
 * EN signed example: "+AED 102" / "-AED 152"
 * AR signed example: "+AED ١٠٢" / "-AED ١٥٢"
 *
 * @param n           The amount in AED.
 * @param locale      'en' | 'ar'.
 * @param signDisplay Intl signDisplay option (default 'auto' → no sign for positive).
 *                    Pass 'always' to show + for positive values.
 */
export function formatCurrencyAed(
  n: number,
  locale: Locale,
  signDisplay: Intl.NumberFormatOptions['signDisplay'] = 'auto',
): string {
  const formatted = new Intl.NumberFormat(resolvedLocale(locale), {
    maximumFractionDigits: 0,
    signDisplay,
  }).format(n);
  // For 'always'/'exceptZero' signDisplay, Intl injects bidi control chars
  // (U+061C Arabic Letter Mark, U+200E/U+200F) around the +/- in AR output.
  // Strip them, extract the sign char, then rebuild as "{sign}AED {digits}".
  if (signDisplay === 'always' || signDisplay === 'exceptZero') {
    // Remove bidi control characters to find the sign reliably.
    const stripped = formatted.replace(/[؜‎‏‪-‮⁦-⁩]/g, '');
    const sign = stripped[0] === '+' || stripped[0] === '-' ? stripped[0] : '';
    const digits = sign ? stripped.slice(1) : stripped;
    return sign ? `${sign}AED ${digits}` : `AED ${digits}`;
  }
  return `AED ${formatted}`;
}

/**
 * Format a Date as abbreviated month + 2-digit year.
 *
 * EN example: "May 25"
 * AR example: "مايو ٢٥"
 *
 * @param d      The date to format.
 * @param locale 'en' | 'ar'.
 */
export function formatMonthYear(d: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(resolvedLocale(locale), {
    month: 'short',
    year: '2-digit',
  }).format(d);
}

/**
 * Format a Date as full month name + 4-digit year.
 *
 * EN example: "April 2026"
 * AR example: "أبريل ٢٠٢٦"
 *
 * @param d      The date to format.
 * @param locale 'en' | 'ar'.
 */
export function formatMonthYearLong(d: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(resolvedLocale(locale), {
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Replace `{key}` placeholders in a template string with values from `vars`.
 *
 * Handles multiple occurrences of the same placeholder.
 * Unknown placeholders are left unchanged (e.g. `{missing}` stays as-is).
 *
 * @param template  Template string containing `{key}` placeholders.
 * @param vars      Map of placeholder names to replacement values.
 *
 * @example
 *   interpolate('Saving {low}–{high} AED', { low: 50, high: 200 })
 *   // → 'Saving 50–200 AED'
 */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, k) =>
    k in vars ? String(vars[k]) : match,
  );
}

/**
 * Format a step indicator as "current / total".
 *
 * EN example: "1 / 6"
 * AR example: "١ / ٦"  (slash stays Latin as per DSC style)
 *
 * @param step   Current step number (1-based).
 * @param total  Total number of steps.
 * @param locale 'en' | 'ar'.
 */
export function formatStepIndicator(
  step: number,
  total: number,
  locale: Locale,
): string {
  return `${formatNumber(step, locale)} / ${formatNumber(total, locale)}`;
}
