import { Building2, ArrowUpRight, Banknote } from 'lucide-react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import type { CpiResult } from '../../lib/types';

interface Props { result: CpiResult; }

function interpolate(s: string, tokens: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in tokens ? String(tokens[k]) : `{${k}}`));
}

export function Hero({ result }: Props) {
  const { t } = useLanguage();
  const isPositive = result.difference >= 0;
  const verdictKey = isPositive ? 'result.hero.verdict.more' : 'result.hero.verdict.less';
  const verdict = interpolate(t(verdictKey), {
    ppDiff: Math.abs(result.difference).toFixed(2),
    basket: result.estMonthlyBasket.toLocaleString(),
    extra: Math.abs(result.estMonthlyExtra).toLocaleString(),
  });

  return (
    <div className="bg-gradient-to-br from-[#0066cc] to-[#0052a3] text-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 items-center shadow-lg">
      <div>
        <div className="text-xs uppercase tracking-widest text-white/80 font-medium mb-1.5">
          {t('result.hero.label')}
        </div>
        <div className="text-[56px] font-semibold tracking-tight leading-none mb-2 ltr-numbers">
          {result.personalYoy > 0 ? '+' : ''}{result.personalYoy.toFixed(2)}%
        </div>
        <div className="text-[15px] leading-relaxed text-white/95">{verdict}</div>
      </div>
      <div className="flex flex-col gap-3">
        <Stat icon={<Building2 className="w-4 h-4" />} label={t('result.hero.stat.official')} value={`+${result.officialYoy.toFixed(2)}%`} />
        <Stat icon={<ArrowUpRight className="w-4 h-4" />} label={t('result.hero.stat.difference')} value={`${result.difference >= 0 ? '+' : ''}${result.difference.toFixed(2)} pp`} />
        <Stat icon={<Banknote className="w-4 h-4" />} label={t('result.hero.stat.basket')} value={`AED ${result.estMonthlyBasket.toLocaleString()}`} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/15 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-white/80">{icon}</span>
        <span className="text-xs text-white/85">{label}</span>
      </div>
      <span className="text-lg font-semibold ltr-numbers">{value}</span>
    </div>
  );
}
