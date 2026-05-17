import { useEffect, useRef } from 'react';
import { useQuizState } from '../hooks/useQuizState';
import { NationalityQuestion } from './questions/NationalityQuestion';
import { IncomeQuestion } from './questions/IncomeQuestion';
import { HousingQuestion } from './questions/HousingQuestion';
import { HouseholdQuestion } from './questions/HouseholdQuestion';
import { TransportQuestion } from './questions/TransportQuestion';
import { EatingOutQuestion } from './questions/EatingOutQuestion';
import { SchoolingQuestion } from './questions/SchoolingQuestion';
import type { QuizAnswers } from '../lib/types';
import { useLanguage } from '@shared/contexts/LanguageContext';

interface Props {
  onComplete: (answers: QuizAnswers) => void;
  startStep?: number;                       // for "Edit answers" entry (step 0)
  startStepKey?: string | null;             // jump to a specific step by key
}

export function Wizard({ onComplete, startStep, startStepKey }: Props) {
  const { state, dispatch, steps, stepCount, progressPct, isComplete } = useQuizState();
  const { language } = useLanguage();

  // Latch: if isComplete was already true when the wizard mounted (e.g. the
  // user clicked "Edit answers" from the result page), suppress the onComplete
  // call until the user navigates back at least one step and re-completes.
  const wasInitiallyComplete = useRef(isComplete);

  // Ref to always have the latest steps without it being an effect dependency.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  useEffect(() => {
    if (startStepKey != null) {
      const idx = stepsRef.current.indexOf(startStepKey as any);
      if (idx >= 0) dispatch({ type: 'goto', step: idx });
    } else if (startStep != null) {
      dispatch({ type: 'goto', step: startStep });
    }
  }, [startStep, startStepKey, dispatch]);

  useEffect(() => {
    if (isComplete && !wasInitiallyComplete.current) {
      // User just completed the wizard during this mount — fire onComplete.
      const a = state.answers as QuizAnswers;
      onComplete({
        ...a,
        version: 1,
        completedAt: new Date().toISOString(),
        language,
      });
    }
    // Clear the latch once the wizard is no longer complete (user went back).
    // Next time they reach the end, the guard above will be false and onComplete fires.
    if (!isComplete) {
      wasInitiallyComplete.current = false;
    }
  }, [isComplete, state.answers, language, onComplete]);

  const stepIndex = Math.min(state.step, steps.length - 1);
  const stepKey = steps[stepIndex];
  const back = () => dispatch({ type: 'back' });

  switch (stepKey) {
    case 'nationality':
      return (
        <NationalityQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          value={state.answers.nationality}
          onAnswer={v => dispatch({ type: 'answer', key: 'nationality', value: v })}
        />
      );
    case 'income':
      return (
        <IncomeQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          value={state.answers.income}
          onAnswer={v => dispatch({ type: 'answer', key: 'income', value: v })}
          onBack={back}
        />
      );
    case 'housing':
      return (
        <HousingQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          nationality={state.answers.nationality ?? 'expat'}
          value={state.answers.housing}
          onAnswer={v => dispatch({ type: 'answer', key: 'housing', value: v })}
          onBack={back}
        />
      );
    case 'household':
      return (
        <HouseholdQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          value={state.answers.household}
          onAnswer={v => dispatch({ type: 'answer', key: 'household', value: v })}
          onBack={back}
        />
      );
    case 'transport':
      return (
        <TransportQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          value={state.answers.transport}
          onAnswer={v => dispatch({ type: 'answer', key: 'transport', value: v })}
          onBack={back}
        />
      );
    case 'eatingOut':
      return (
        <EatingOutQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          value={state.answers.eatingOut}
          onAnswer={v => dispatch({ type: 'answer', key: 'eatingOut', value: v })}
          onBack={back}
        />
      );
    case 'schooling':
      return (
        <SchoolingQuestion
          progressPct={progressPct}
          stepIndex={stepIndex} stepCount={stepCount}
          nationality={state.answers.nationality ?? 'expat'}
          value={state.answers.schooling}
          onAnswer={v => dispatch({ type: 'answer', key: 'schooling', value: v })}
          onBack={back}
        />
      );
  }
  return null;
}
