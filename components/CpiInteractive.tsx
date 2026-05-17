import { useCallback, useMemo, useState } from 'react';
import { PageShell } from '@shared/components/PageShell';
import { Header } from '@shared/components/Header';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { Welcome } from './Welcome';
import { Wizard } from './Wizard';
import { LoadingTransition } from './LoadingTransition';
import { ResultPage } from './result/ResultPage';
import { STORAGE_KEY } from '../hooks/useQuizState';
import { computeCpiWithRecommendations } from '../lib/calc';
import { profiles } from '../lib/profiles';
import cpiItems from '../data/cpi-items.json';
import type { CpiItemsData, QuizAnswers, CpiResult } from '../lib/types';

type View = 'welcome' | 'wizard' | 'loading' | 'result';

const items = cpiItems as CpiItemsData;

function readPersistedAnswers(): QuizAnswers | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return null;
    const a = parsed.answers;
    if (a?.nationality && a?.income && a?.housing && a?.household && a?.transport && a?.eatingOut && a?.schooling != null) {
      return { ...a, version: 1, completedAt: parsed.completedAt ?? new Date().toISOString(), language: a.language ?? 'en' };
    }
  } catch {}
  return null;
}

export function CpiInteractive() {
  const { t, language } = useLanguage();
  const initial = useMemo(() => readPersistedAnswers(), []);
  const [view, setView] = useState<View>(initial ? 'result' : 'welcome');
  const [answers, setAnswers] = useState<QuizAnswers | null>(initial);
  const [wizardStartStep, setWizardStartStep] = useState<number | undefined>(undefined);
  const [wizardStartStepKey, setWizardStartStepKey] = useState<string | null>(null);

  const result: CpiResult | null = useMemo(() => {
    if (!answers) return null;
    return computeCpiWithRecommendations(answers, items, profiles, t);
  }, [answers, t, language]);

  const handleStart = useCallback(() => {
    setWizardStartStep(0);
    setWizardStartStepKey(null);
    setView('wizard');
  }, []);

  const handleWizardComplete = useCallback((a: QuizAnswers) => {
    setAnswers(a);
    setView('loading');
  }, []);

  const handleLoadingDone = useCallback(() => setView('result'), []);

  const handleEdit = useCallback((stepKey?: string) => {
    setWizardStartStepKey(stepKey ?? null);
    setWizardStartStep(0);
    setView('wizard');
  }, []);

  const handleRetake = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setAnswers(null);
    setWizardStartStep(0);
    setWizardStartStepKey(null);
    setView('welcome');
  }, []);

  return (
    <PageShell>
      <Header appName="Inflation Lens" appType="CPI" glyph="inflation" />
      <div className="px-6 pb-10 pt-2 max-w-[1100px] mx-auto">
        {view === 'welcome' && <Welcome onStart={handleStart} />}
        {view === 'wizard' && (
          <Wizard
            onComplete={handleWizardComplete}
            startStep={wizardStartStep}
            startStepKey={wizardStartStepKey}
          />
        )}
        {view === 'loading' && (
          <LoadingTransition onDone={handleLoadingDone} previewYoy={result?.personalYoy} />
        )}
        {view === 'result' && answers && result && (
          <ResultPage answers={answers} result={result} onEdit={handleEdit} onRetake={handleRetake} />
        )}
      </div>
    </PageShell>
  );
}
