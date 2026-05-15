import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  /** Single-line summary shown when collapsed (e.g. "Top 3: housing, transport, food"). */
  summary?: string;
  /** Optional icon to render before the title. */
  icon?: React.ReactNode;
  /** Render expanded by default. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, summary, icon, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-[#0066cc] shrink-0">{icon}</span>}
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{title}</span>
            {summary && !open && (
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-full">{summary}</span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-5">
          {children}
        </div>
      )}
    </section>
  );
}
