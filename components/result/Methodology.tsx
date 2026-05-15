import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';

/**
 * "How this is calculated" disclosure. Explains the three data layers
 * that produce the personal-CPI result so users (and reviewers) can see
 * what's DSC-published vs what's a calibration vs what's a hand-written
 * estimate. Default collapsed — a footnote, not a section.
 */
export function Methodology() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-blue-300 transition-colors"
        aria-expanded={open}
      >
        <Info className="w-3.5 h-3.5" />
        <span className="underline-offset-2 hover:underline">{t('result.methodology.toggle')}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl space-y-2.5 bg-gray-50 dark:bg-slate-800/40 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{t('result.methodology.title')}</p>
          <p>{t('result.methodology.formula')}</p>
          <ul className="space-y-1.5 list-disc ms-5">
            <li><strong>{t('result.methodology.layer1.label')}</strong>{t('result.methodology.layer1.body')}</li>
            <li><strong>{t('result.methodology.layer2.label')}</strong>{t('result.methodology.layer2.body')}</li>
            <li><strong>{t('result.methodology.layer3.label')}</strong>{t('result.methodology.layer3.body')}</li>
          </ul>
          <p className="text-[11px] italic">{t('result.methodology.estimateCaveat')}</p>
        </div>
      )}
    </div>
  );
}
