import type { ReactNode } from 'react';

export interface QuizStat {
  value: string;
  caption: string;
}

export interface CardOption {
  id: string;
  icon: ReactNode;
  label: string;
  sub?: string;
}

export interface PillOption {
  id: string;
  label: string;
  sub?: string;
}

export interface RangeAxis {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}
