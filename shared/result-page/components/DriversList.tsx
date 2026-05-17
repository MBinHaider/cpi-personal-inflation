import { BarChart3 } from 'lucide-react';
import { DriverRow } from './DriverRow';
import type { Driver } from '../types';

interface Props {
  title: string;
  metaLine?: string;
  drivers: Driver[];
}

export function DriversList({ title, metaLine, drivers }: Props) {
  return (
    <section className="mt-6">
      <div className="mb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#0066cc] shrink-0" aria-hidden="true" />
          <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
        </div>
        {metaLine && <p className="text-[10px] text-gray-500 mt-1 ms-6">{metaLine}</p>}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg px-3">
        {drivers.map(d => <DriverRow key={d.id} {...d} />)}
      </div>
    </section>
  );
}
