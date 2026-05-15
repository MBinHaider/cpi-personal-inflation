import type { ReactNode } from 'react';

export type Locale = 'en' | 'ar';

export type StatusKind = 'alert' | 'warn' | 'ok';

export interface StatusInfo {
  kind: StatusKind;
  label: string;
}

export interface HeroComparison {
  yours: { label: string; value: string };
  benchmark: { label: string; value: string };
}

export interface Driver {
  id: string;
  icon: ReactNode;
  name: string;
  metaLine: string;
  value: string;
  valueTone: 'positive' | 'negative';
  shareSubtitle: string;
}

export interface Benchmark {
  id: string;
  label: string;
  userValue: number;
  benchmarkValue: number;
  userValueLabel: string;
  benchmarkValueLabel: string;
  tone: StatusKind;
}

export interface DataPoint {
  period: string;
  yourValue: number;
  benchmarkValue: number;
}

export interface ChipItem {
  id: string;
  label: string;
  value: string;
  stepKey?: string;
  onClick?: () => void;
}

export interface RecCardData {
  id: string;
  icon: ReactNode;
  title: string;
  why: string;
  savingLabel?: string;
}
