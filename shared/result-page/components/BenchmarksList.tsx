import { Gauge } from 'lucide-react';
import { BenchmarkBar } from './BenchmarkBar';
import type { Benchmark } from '../types';

interface Props {
  title: string;
  benchmarks: Benchmark[];
}

export function BenchmarksList({ title, benchmarks }: Props) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-2.5">
        <Gauge className="w-4 h-4 text-[#0066cc]" aria-hidden="true" />
        <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg px-3">
        {benchmarks.map(b => <BenchmarkBar key={b.id} {...b} />)}
      </div>
    </section>
  );
}
