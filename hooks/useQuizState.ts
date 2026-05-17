import { useReducer, useEffect, useMemo } from 'react';
import {
  reducer,
  loadInitial,
  activeSteps,
  isQuizComplete,
  STORAGE_KEY,
  type QuizState,
  type QuizAction,
  type AnswerKey,
} from '../lib/quizReducer';

export { STORAGE_KEY };
export type { QuizState, QuizAction, AnswerKey };

export function useQuizState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      if (state.step === 0 && Object.keys(state.answers).length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, ...state }));
    } catch {}
  }, [state]);

  const steps = useMemo(() => activeSteps(state.answers), [state.answers]);
  const stepCount = steps.length;
  const progressPct = stepCount > 0
    ? Math.min(100, Math.max(0, (state.step / stepCount) * 100))
    : 0;
  const isComplete = isQuizComplete(state);

  return { state, dispatch, steps, stepCount, progressPct, isComplete };
}
