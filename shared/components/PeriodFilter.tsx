import { cn } from '../lib/utils';

interface PeriodFilterProps {
  periods: string[];
  selected: string;
  onChange: (period: string) => void;
}

export function PeriodFilter({ periods, selected, onChange }: PeriodFilterProps) {
  return (
    <div className="flex gap-1">
      {periods.map(period => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            "h-7 px-2 text-xs rounded-md font-medium transition-colors",
            selected === period
              ? "bg-gray-900 dark:bg-gray-700 text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
