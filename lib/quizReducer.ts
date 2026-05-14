import type { QuizAnswers, Household } from './types';

export const STORAGE_KEY = 'cpi.quizAnswers';

export interface QuizState {
  step: number;                              // index into the active steps list
  answers: Partial<QuizAnswers>;
}

export type AnswerKey = 'nationality' | 'income' | 'housing' | 'household' | 'transport' | 'eatingOut' | 'schooling';

export type QuizAction =
  | { type: 'answer'; key: AnswerKey; value: any }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; step: number }
  | { type: 'reset' }
  | { type: 'hydrate'; state: QuizState };

const BASE_STEPS: AnswerKey[] = ['nationality', 'income', 'housing', 'household', 'transport', 'eatingOut'];

export function activeSteps(answers: Partial<QuizAnswers>): AnswerKey[] {
  const showSchooling = answers.household ? answers.household.kids > 0 : false;
  return showSchooling ? [...BASE_STEPS, 'schooling'] : BASE_STEPS;
}

export function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'answer': {
      const answers = { ...state.answers, [action.key]: action.value };
      if (action.key === 'household' && (action.value as Household).kids === 0) {
        (answers as any).schooling = 'none';
      }
      const steps = activeSteps(answers);
      const currentKey = activeSteps(state.answers)[state.step];
      const nextStep =
        action.key === currentKey
          ? Math.min(state.step + 1, steps.length)
          : state.step;
      return { step: nextStep, answers };
    }
    case 'next':
      return { ...state, step: Math.min(state.step + 1, activeSteps(state.answers).length) };
    case 'back':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'goto':
      return { ...state, step: Math.max(0, action.step) };
    case 'reset':
      return { step: 0, answers: {} };
    case 'hydrate':
      return action.state;
  }
}

export function isQuizComplete(state: QuizState): boolean {
  const steps = activeSteps(state.answers);
  return state.step >= steps.length && steps.every(k => state.answers[k as keyof QuizAnswers] != null);
}

export function loadInitial(): QuizState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { step: 0, answers: {} };
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && parsed.answers) {
      return { step: parsed.step ?? 0, answers: parsed.answers };
    }
  } catch {}
  return { step: 0, answers: {} };
}
