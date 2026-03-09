import { useState, useCallback } from 'react';
import { UserProgress, Bundesland, ExamResult, Language } from '../types';
import { getProgress, saveProgress, resetProgress } from '../lib/storage';

export function useProgress() {
  const [progress, setProgressState] = useState<UserProgress>(() => getProgress());

  const update = useCallback((partial: Partial<UserProgress>) => {
    setProgressState(prev => {
      const next = { ...prev, ...partial };
      saveProgress(next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((language: Language) => update({ language }), [update]);
  const setSelectedState = useCallback((selectedState: Bundesland) => update({ selectedState }), [update]);
  const setPurchased = useCallback((purchased: boolean) => update({ purchased }), [update]);
  const setOnboardingComplete = useCallback(() => update({ onboardingComplete: true }), [update]);

  const addExamResult = useCallback((result: ExamResult) => {
    setProgressState(prev => {
      const examHistory = [result, ...prev.examHistory].slice(0, 50);
      const wrongSet = new Set([...prev.wrongAnswers, ...result.wrongIds]);
      const wrongAnswers = [...wrongSet];
      const next = { ...prev, examHistory, wrongAnswers };
      saveProgress(next);
      return next;
    });
  }, []);

  const clearWrongAnswer = useCallback((id: number) => {
    setProgressState(prev => {
      const wrongAnswers = prev.wrongAnswers.filter(w => w !== id);
      const next = { ...prev, wrongAnswers };
      saveProgress(next);
      return next;
    });
  }, []);

  const recordStudyAnswer = useCallback((id: number, isCorrect: boolean) => {
    setProgressState(prev => {
      const studyWrongAnswers = isCorrect
        ? prev.studyWrongAnswers.filter(w => w !== id)
        : prev.studyWrongAnswers.includes(id)
          ? prev.studyWrongAnswers
          : [...prev.studyWrongAnswers, id];
      const next = { ...prev, studyWrongAnswers };
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setProgressState(prev => {
      const bookmarks = prev.bookmarks.includes(id)
        ? prev.bookmarks.filter(b => b !== id)
        : [...prev.bookmarks, id];
      const next = { ...prev, bookmarks };
      saveProgress(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    resetProgress();
    setProgressState(getProgress());
  }, []);

  return {
    progress,
    setLanguage,
    setSelectedState,
    setPurchased,
    setOnboardingComplete,
    addExamResult,
    clearWrongAnswer,
    recordStudyAnswer,
    toggleBookmark,
    reset,
  };
}
