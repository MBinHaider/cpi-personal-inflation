import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  variant?: 'default' | 'primary';
  tooltip?: string;
  className?: string;
}

export function KpiCard({ label, value, change, changeDirection, icon, variant = 'default', tooltip, className }: KpiCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={cn(
        "relative rounded-[8px] border p-6 transition-all hover:shadow-lg",
        isPrimary
          ? "bg-gradient-to-br from-[#0066cc] to-[#0052a3] border-[#0066cc] text-white shadow-[0_4px_6px_rgba(0,102,204,0.2),0_2px_4px_rgba(0,102,204,0.12)]"
          : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700",
        className
      )}
      title={tooltip}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={cn("dd-caption", isPrimary ? "text-white/80" : "text-gray-500 dark:text-gray-400")}>
          {label}
        </span>
        {icon && (
          <span className={cn(isPrimary ? "text-white/80" : "text-[#0066cc] dark:text-white")}>
            {icon}
          </span>
        )}
      </div>
      <div className={cn("dd-kpi ltr-numbers", isPrimary ? "text-white" : "text-gray-900 dark:text-gray-100")}>
        {value}
      </div>
      {change && (
        <div className={cn("dd-caption mt-2 flex items-center gap-1 ltr-numbers",
          isPrimary ? "text-white/70" : (
            changeDirection === 'up' ? "text-[#10b981]" :
            changeDirection === 'down' ? "text-[#ef4444]" :
            "text-gray-500 dark:text-gray-400"
          )
        )}>
          {changeDirection === 'up' && <TrendingUp className="h-3 w-3" />}
          {changeDirection === 'down' && <TrendingDown className="h-3 w-3" />}
          {change}
        </div>
      )}
    </div>
  );
}
