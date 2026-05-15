import { useState, useMemo } from 'react';
import { LineChart as LineChartIcon } from 'lucide-react';
import type { DataPoint } from '../types';

interface Props {
  title: string;
  data: DataPoint[];
  direction: 'backward' | 'forward';
  yAxisFormatter: (v: number) => string;
  yourLabel: string;
  benchmarkLabel: string;
  showPeriodFilter?: boolean;
}

const PERIODS = ['3M', '6M', '12M'] as const;
type Period = (typeof PERIODS)[number];

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  return points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = arr[i - 1];
    const c1x = prev.x + (p.x - prev.x) / 2;
    const c2x = c1x;
    return `${acc} C${c1x},${prev.y} ${c2x},${p.y} ${p.x},${p.y}`;
  }, '');
}

export function TrendChart({
  title, data, direction, yAxisFormatter, yourLabel, benchmarkLabel, showPeriodFilter = true,
}: Props) {
  const [period, setPeriod] = useState<Period>('12M');

  const sliced = useMemo(() => {
    const n = period === '3M' ? 3 : period === '6M' ? 6 : 12;
    return data.slice(-n);
  }, [data, period]);

  const { points, benchPoints, yMin, yMax, latest } = useMemo(() => {
    const all = sliced.flatMap(p => [p.yourValue, p.benchmarkValue]);
    let yMin = Math.min(...all);
    let yMax = Math.max(...all);
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    const span = yMax - yMin;
    const width = 600;
    const height = 180;
    const xStep = sliced.length > 1 ? width / (sliced.length - 1) : 0;
    const project = (v: number) => height - ((v - yMin) / span) * height + 10;
    const points = sliced.map((p, i) => ({ x: i * xStep, y: project(p.yourValue) }));
    const benchPoints = sliced.map((p, i) => ({ x: i * xStep, y: project(p.benchmarkValue) }));
    return { points, benchPoints, yMin, yMax, latest: sliced[sliced.length - 1] };
  }, [sliced]);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => yMin + t * (yMax - yMin));

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-2.5">
        <LineChartIcon className="w-4 h-4 text-[#0066cc]" aria-hidden="true" />
        <h3 className="text-[13px] font-bold text-gray-900 flex-1">{title}</h3>
        {showPeriodFilter && (
          <div className="inline-flex bg-gray-100 rounded-md p-0.5 gap-0.5">
            {PERIODS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`text-[10px] px-2 py-1 rounded font-semibold ${period === p ? 'bg-white text-[#0066cc] shadow-sm' : 'text-gray-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="relative h-[200px]">
          <svg viewBox="0 0 600 220" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0066cc" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0066cc" stopOpacity="0" />
              </linearGradient>
            </defs>
            {yTicks.map((tick, i) => {
              const y = 190 - ((tick - yMin) / (yMax - yMin)) * 180;
              return (
                <g key={i}>
                  <line x1="0" y1={y} x2="600" y2={y} stroke="#f0f1f5" strokeWidth="1" strokeDasharray="2 3" />
                  <text x="-6" y={y + 3} fontSize="9" fill="#888" textAnchor="end">{yAxisFormatter(tick)}</text>
                </g>
              );
            })}
            <path d={buildPath(benchPoints)} fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="5 4" />
            <path
              d={`${buildPath(points)} L600,200 L0,200 Z`}
              fill="url(#trend-area)"
            />
            <path d={buildPath(points)} fill="none" stroke="#0066cc" strokeWidth="2.4" strokeLinecap="round" />
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#0066cc" />)}
            {points.length > 0 && (
              <>
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="white" stroke="#0066cc" strokeWidth="2.5" />
                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill="#0066cc" />
              </>
            )}
            {sliced.map((p, i) => (
              <text key={i} x={i * (sliced.length > 1 ? 600 / (sliced.length - 1) : 0)} y="215" fontSize="9" fill="#888" textAnchor="middle">{p.period}</text>
            ))}
          </svg>
        </div>

        <div className="flex gap-4 mt-2 text-[10px] text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-0.5 bg-[#0066cc]" />
            {yourLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-0.5" style={{ background: 'repeating-linear-gradient(to right, #94a3b8 0 3px, transparent 3px 6px)' }} />
            {benchmarkLabel}
          </span>
          {latest && (
            <span className="ms-auto text-[10px] font-semibold text-[#0066cc] tabular-nums">
              {yAxisFormatter(latest.yourValue)}
            </span>
          )}
        </div>
      </div>
      <span className="sr-only">{direction}</span>
    </section>
  );
}
