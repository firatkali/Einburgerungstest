import { useState, useCallback, useRef, useEffect } from 'react';
import { Question, ExamResult, Bundesland } from '../types';
import { generalQuestions } from '../data/general-questions';
import { stateQuestions } from '../data/state-questions';

type ExamPhase = 'idle' | 'active' | 'complete';

type ExamState = {
  phase: ExamPhase;
  questions: Question[];
  answers: (number | null)[];
  currentIndex: number;
  timeLeft: number; // seconds
  result: ExamResult | null;
};

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds
const GENERAL_COUNT = 30;
const STATE_COUNT = 3;
const PASS_THRESHOLD = 17;

function sampleRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function buildExamQuestions(state: Bundesland): Question[] {
  const general = sampleRandom(generalQuestions, GENERAL_COUNT);
  const statePool = stateQuestions[state] ?? [];
  const stateQ = sampleRandom(statePool, Math.min(STATE_COUNT, statePool.length));
  // Shuffle the combined set
  return sampleRandom([...general, ...stateQ], general.length + stateQ.length);
}

export function useExam() {
  const [exam, setExam] = useState<ExamState>({
    phase: 'idle',
    questions: [],
    answers: [],
    currentIndex: 0,
    timeLeft: EXAM_DURATION,
    result: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startExam = useCallback((state: Bundesland) => {
    stopTimer();
    const questions = buildExamQuestions(state);
    const answers = new Array(questions.length).fill(null);
    const startTime = Date.now();

    setExam({
      phase: 'active',
      questions,
      answers,
      currentIndex: 0,
      timeLeft: EXAM_DURATION,
      result: null,
    });

    timerRef.current = setInterval(() => {
      setExam(prev => {
        if (prev.phase !== 'active') {
          stopTimer();
          return prev;
        }
        const newTime = prev.timeLeft - 1;
        if (newTime <= 0) {
          stopTimer();
          const spent = Math.floor((Date.now() - startTime) / 1000);
          let correct = 0;
          const wrongIds: number[] = [];
          prev.questions.forEach((q, i) => {
            if (prev.answers[i] === q.correctIndex) correct++;
            else wrongIds.push(q.id);
          });
          const result: ExamResult = {
            date: new Date().toISOString(),
            score: correct,
            passed: correct >= PASS_THRESHOLD,
            timeSpent: spent,
            wrongIds,
          };
          return { ...prev, phase: 'complete', timeLeft: 0, result };
        }
        return { ...prev, timeLeft: newTime };
      });
    }, 1000);
  }, [stopTimer]);

  const submitAnswer = useCallback((answerIndex: number) => {
    setExam(prev => {
      if (prev.phase !== 'active') return prev;
      const answers = [...prev.answers];
      answers[prev.currentIndex] = answerIndex;
      const isLast = prev.currentIndex >= prev.questions.length - 1;
      if (isLast) {
        return { ...prev, answers, currentIndex: prev.currentIndex };
      }
      return { ...prev, answers };
    });
  }, []);

  const goToNext = useCallback(() => {
    setExam(prev => {
      if (prev.currentIndex >= prev.questions.length - 1) return prev;
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, []);

  const submitExam = useCallback((startTimestamp: number) => {
    setExam(prev => {
      if (prev.phase !== 'active') return prev;
      stopTimer();
      const spent = Math.floor((Date.now() - startTimestamp) / 1000);
      let correct = 0;
      const wrongIds: number[] = [];
      prev.questions.forEach((q, i) => {
        if (prev.answers[i] === q.correctIndex) correct++;
        else wrongIds.push(q.id);
      });
      const result: ExamResult = {
        date: new Date().toISOString(),
        score: correct,
        passed: correct >= PASS_THRESHOLD,
        timeSpent: spent,
        wrongIds,
      };
      return { ...prev, phase: 'complete', result };
    });
  }, [stopTimer]);

  const abortExam = useCallback(() => {
    stopTimer();
    setExam(prev => ({ ...prev, phase: 'idle', result: null }));
  }, [stopTimer]);

  const resetExam = useCallback(() => {
    stopTimer();
    setExam({ phase: 'idle', questions: [], answers: [], currentIndex: 0, timeLeft: EXAM_DURATION, result: null });
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  return {
    exam,
    startExam,
    submitAnswer,
    goToNext,
    submitExam,
    abortExam,
    resetExam,
    PASS_THRESHOLD,
  };
}
