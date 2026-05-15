import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';
import { formatPercent, interpolate } from '../../lib/format';
import { deriveAffordabilityStatus } from '../../lib/affordabilityStatus';
import type { AffordabilityStatus, AffordabilityStatusKind } from '../../lib/affordabilityStatus';

interface Props { result: CpiResult; }

function getContainerClasses(kind: AffordabilityStatusKind): string {
  const base = 'flex items-start gap-3 rounded-xl border px-4 py-3.5';
  switch (kind) {
    case 'alert': return `${base} border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200`;
    case 'warn':  return `${base} border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200`;
    case 'ok':    return `${base} border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200`;
    default:      return base;
  }
}

function getIconClasses(kind: AffordabilityStatusKind): string {
  switch (kind) {
    case 'alert': return 'text-red-600 dark:text-red-300';
    case 'warn':  return 'text-amber-600 dark:text-amber-300';
    case 'ok':    return 'text-emerald-600 dark:text-emerald-300';
    default:      return '';
  }
}

function getBannerText(
  status: AffordabilityStatus,
  t: (key: string) => string,
  language: 'en' | 'ar',
): string {
  if (status.kind === 'ok') return t('result.status.ok');
  if (status.kind === 'noData') return '';
  const metricKey = status.metricKey ?? 'rent';
  const translationKey = `result.status.${status.kind}.${metricKey}`;
  const pctFormatted = formatPercent((status.pct ?? 0) * 100, language, 0, 'never');
  return interpolate(t(translationKey), { pct: pctFormatted });
}

export function StatusBanner({ result }: Props) {
  const { t, language } = useLanguage();
  const status = deriveAffordabilityStatus(result.affordability);
  if (status.kind === 'noData') return null;

  const Icon =
    status.kind === 'alert' ? AlertTriangle :
    status.kind === 'warn'  ? AlertCircle :
    CheckCircle2;

  return (
    <div className={getContainerClasses(status.kind)}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${getIconClasses(status.kind)}`} />
      <div className="text-sm font-medium leading-snug">
        {getBannerText(status, t, language)}
      </div>
    </div>
  );
}
