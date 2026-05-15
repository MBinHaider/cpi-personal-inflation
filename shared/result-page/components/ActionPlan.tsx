import { Clock } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;             // e.g. "What to do next"
  primary: ReactNode;        // <PrimaryActionCard />
  quickWins?: ReactNode;     // <QuickWinsGrid> with cards inside, or undefined
}

export function ActionPlan({ title, primary, quickWins }: Props) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Clock className="w-4 h-4 text-[#0066cc]" aria-hidden="true" />
        <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
      </div>
      {primary}
      {quickWins}
    </section>
  );
}
