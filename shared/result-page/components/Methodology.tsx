import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';

interface Layer {
  label: string;
  body: string;
}

interface Props {
  toggleLabel: string;
  title: string;
  formula: string;
  layers: Layer[];
  caveat?: string;
}

export function Methodology({ toggleLabel, title, formula, layers, caveat }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-[#0066cc]"
        aria-expanded={open}
      >
        <Info className="w-3.5 h-3.5" />
        <span className="underline-offset-2 hover:underline">{toggleLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 text-[12px] leading-relaxed text-gray-600 max-w-3xl bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-2.5">
          <p className="font-semibold text-gray-800">{title}</p>
          <p>{formula}</p>
          <ul className="space-y-1.5 list-disc ms-5">
            {layers.map((l, i) => (
              <li key={i}><strong>{l.label}</strong>{l.body}</li>
            ))}
          </ul>
          {caveat && <p className="text-[11px] italic">{caveat}</p>}
        </div>
      )}
    </div>
  );
}
