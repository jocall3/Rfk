import { useState, useEffect, useCallback } from 'react';

export interface QuestionState {
  answers: Record<string, string>;
  notes: Record<string, string>;
}

export interface ProgressMetrics {
  totalQuestions: number;
  answeredCount: number;
  completionPercentage: number;
}

const STORAGE_KEY = 'app_question_state';

export const useQuestionState = (totalQuestionsCount: number = 100) => {
  const [state, setState] = useState<QuestionState>(() => {
    if (typeof window === 'undefined') {
      return { answers: {}, notes: {} };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { answers: {}, notes: {} };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { answers: {}, notes: {} };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [state]);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  }, []);

  const setNote = useCallback((questionId: string, note: string) => {
    setState((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [questionId]: note,
      },
    }));
  }, []);

  const clearState = useCallback(() => {
    setState({ answers: {}, notes: {} });
  }, []);

  const answeredCount = Object.keys(state.answers).filter(
    (key) => state.answers[key]?.trim() !== ''
  ).length;

  const metrics: ProgressMetrics = {
    totalQuestions: totalQuestionsCount,
    answeredCount,
    completionPercentage: totalQuestionsCount > 0 
      ? Math.round((answeredCount / totalQuestionsCount) * 100) 
      : 0,
  };

  return {
    answers: state.answers,
    notes: state.notes,
    setAnswer,
    setNote,
    clearState,
    metrics,
  };
};