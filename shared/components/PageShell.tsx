import { cn } from '../lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors", className)}>
      <div className="max-w-[1400px] mx-auto">
        {children}
      </div>
    </div>
  );
}
