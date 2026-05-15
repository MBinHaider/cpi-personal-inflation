import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { StatusKind } from '../types';

interface Props {
  kind: StatusKind;
  label: string;
}

const STYLES: Record<StatusKind, string> = {
  alert: 'bg-red-50 text-red-800 border-red-200',
  warn:  'bg-amber-50 text-amber-800 border-amber-200',
  ok:    'bg-emerald-50 text-emerald-800 border-emerald-200',
};

const ICONS: Record<StatusKind, typeof AlertTriangle> = {
  alert: AlertTriangle,
  warn:  AlertCircle,
  ok:    CheckCircle2,
};

export function StatusPill({ kind, label }: Props) {
  const Icon = ICONS[kind];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border ${STYLES[kind]}`}>
      <Icon className="w-3 h-3 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
