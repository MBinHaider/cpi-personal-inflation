import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export function QuickWinsGrid({ children, title }: Props) {
  return (
    <div className="mt-3">
      {title && (
        <h5 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 ps-0.5">
          {title}
        </h5>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {children}
      </div>
    </div>
  );
}
