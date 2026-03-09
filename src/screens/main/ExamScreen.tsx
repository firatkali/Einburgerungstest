import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UserProgress } from '../../types';
import { useTranslation } from '../../i18n';
import { useExam } from '../../hooks/useExam';
import { getQuestionOptions, getQuestionText } from '../../lib/language';
import {
  findBestFittingQuestionFontSize,
  getCachedQuestionFontSize,
  getQuestionFontCacheKey,
  getQuestionFontConfig,
  setCachedQuestionFontSize,
} from '../../lib/question-typography';
import { AnswerOption } from '../../components/AnswerOption';

type Props = {
  progress: UserProgress;
  onExamComplete: (wrongIds: number[], score: number, passed: boolean, timeSpent: number) => void;
  onAbort: () => void;
};

const EXAM_DURATION_SECONDS = 60 * 60;
const TIMER_RADIUS = 22;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

export function ExamScreen({ progress, onExamComplete, onAbort }: Props) {
  const { t } = useTranslation(progress.language);
  const { exam, startExam, submitAnswer, goToNext, submitExam, abortExam } = useExam();
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmAbort, setShowConfirmAbort] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const questionBodyRef = useRef<HTMLDivElement | null>(null);
  const questionTextRef = useRef<HTMLParagraphElement | null>(null);
  const q = exam.phase === 'idle' ? null : exam.questions[exam.currentIndex];
  const qText = q ? getQuestionText(q, progress.language) : '';
  const fontCacheKey = q ? getQuestionFontCacheKey('exam', q, progress.language) : null;
  const fontConfig = getQuestionFontConfig('exam', progress.language);
  const [questionFontSize, setQuestionFontSize] = useState(
    () => (fontCacheKey ? getCachedQuestionFontSize(fontCacheKey) : undefined) ?? fontConfig.defaultSize
  );

  useEffect(() => {
    if (progress.selectedState && exam.phase === 'idle') {
      startExam(progress.selectedState);
      startTimeRef.current = Date.now();
    }
  }, [exam.phase, progress.selectedState, startExam]);

  useEffect(() => {
    if (exam.phase === 'complete' && exam.result) {
      onExamComplete(exam.result.wrongIds, exam.result.score, exam.result.passed, exam.result.timeSpent);
    }
  }, [exam.phase, exam.result, onExamComplete]);

  useLayoutEffect(() => {
    if (!q || !fontCacheKey) return;

    const cachedFontSize = getCachedQuestionFontSize(fontCacheKey);
    if (cachedFontSize) {
      if (cachedFontSize !== questionFontSize) {
        setQuestionFontSize(cachedFontSize);
      }
      return;
    }

    const container = questionBodyRef.current;
    const textElement = questionTextRef.current;
    if (!container || !textElement) return;

    const bestFontSize = findBestFittingQuestionFontSize(
      container,
      textElement,
      fontConfig.minSize,
      fontConfig.maxSize
    );

    setCachedQuestionFontSize(fontCacheKey, bestFontSize);
    if (bestFontSize !== questionFontSize) {
      setQuestionFontSize(bestFontSize);
    }
  }, [fontCacheKey, fontConfig.maxSize, fontConfig.minSize, q, qText, questionFontSize]);

  if (exam.phase === 'idle') {
    return (
      <div className="min-h-screen bg-[#F7F5FB] flex items-center justify-center">
        <div className="text-[#262233] text-lg">{t('loading')}</div>
      </div>
    );
  }

  const currentAnswer = exam.answers[exam.currentIndex];
  const options = getQuestionOptions(q!, progress.language);
  const isAnswered = currentAnswer !== null;
  const isLast = exam.currentIndex === exam.questions.length - 1;
  const progressRatio = exam.questions.length ? (exam.currentIndex + 1) / exam.questions.length : 0;
  const timerRatio = Math.max(0, Math.min(1, exam.timeLeft / EXAM_DURATION_SECONDS));
  const timerDashOffset = TIMER_CIRCUMFERENCE * (1 - timerRatio);
  const minutes = Math.floor(exam.timeLeft / 60).toString().padStart(2, '0');
  const seconds = (exam.timeLeft % 60).toString().padStart(2, '0');

  const handleAnswer = (idx: number) => {
    if (currentAnswer !== null) return;
    submitAnswer(idx);
  };

  const handleNext = () => {
    if (isLast) {
      setShowConfirmSubmit(true);
      return;
    }
    goToNext();
  };

  const handleSubmitConfirm = () => {
    setShowConfirmSubmit(false);
    submitExam(startTimeRef.current);
  };

  const handleAbortConfirm = () => {
    abortExam();
    onAbort();
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0F1B2D] px-5 pt-14">
      <div className="mx-auto flex h-full max-w-[430px] flex-col">
        <div className="flex items-center justify-between gap-3 mb-4 pt-[1.4em]">
          <button
            onClick={() => setShowConfirmAbort(true)}
            aria-label={t('close')}
            className="w-9 h-9 rounded-full bg-[#1A2B40] border border-[#A0B0C0]/20 flex items-center justify-center text-[#A0B0C0] text-sm active:scale-90 transition-transform shrink-0"
          >
            ✕
          </button>
          <h1 className="text-white text-[26px] font-extrabold">{t('examTitle')}</h1>
          <div className="w-9 h-9 shrink-0" />
        </div>

        <div className="flex items-center justify-between mb-[1px]">
          <span className="text-[#A0B0C0] text-sm">
            {t('examQuestion')} {exam.currentIndex + 1} {t('examOf')} {exam.questions.length}
          </span>
          <div className="flex items-center gap-3">
            <div className="relative h-[57px] w-[57px] shrink-0 -translate-y-[11px]">
              <svg viewBox="0 0 52 52" className="h-[57px] w-[57px] -rotate-90">
                <circle cx="26" cy="26" r={TIMER_RADIUS} fill="none" stroke="#2A405C" strokeWidth="2" />
                <circle
                  cx="26"
                  cy="26"
                  r={TIMER_RADIUS}
                  fill="none"
                  stroke={exam.timeLeft <= 300 ? '#F97316' : '#00C2CC'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={TIMER_CIRCUMFERENCE}
                  strokeDashoffset={timerDashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-white">
                {minutes}:{seconds}
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-[#1A2B40] overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-[#00C2CC] transition-[width] duration-300"
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>

        <div className="rounded-3xl border border-[#A0B0C0]/20 bg-[#1A2B40] p-5 mb-4 h-[164px] overflow-hidden">
          <div ref={questionBodyRef} className="h-full overflow-hidden pr-1">
            <p
              ref={questionTextRef}
              className="text-white font-semibold leading-[1.35]"
              style={{ fontSize: `${questionFontSize}px` }}
            >
              {qText}
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3">
          {options.map((opt, i) => (
            <AnswerOption
              key={i}
              label={opt}
              index={i}
              state={currentAnswer === null ? 'idle' : i === currentAnswer ? 'selected' : 'idle'}
              onClick={() => handleAnswer(i)}
              disabled={currentAnswer !== null}
              variant="default"
            />
          ))}
        </div>

        <div className="mt-auto pb-8">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="w-full bg-[#00C2CC] text-[#0F1B2D] text-[20px] font-bold py-4 rounded-2xl disabled:opacity-30 active:scale-[0.97] transition-all"
          >
            {isLast ? t('examSubmit') : t('continue')}
          </button>
        </div>
      </div>

      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-5 pb-8">
          <div className="w-full max-w-sm rounded-3xl border border-[#A0B0C0]/20 bg-[#1A2B40] p-6">
            <h3 className="mb-2 text-lg font-bold text-white">{t('examConfirmSubmit')}</h3>
            <p className="mb-6 text-sm text-[#A0B0C0]">{t('examConfirmSubmitMsg')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmSubmit(false)} className="flex-1 rounded-2xl border border-[#A0B0C0]/20 bg-[#0F1B2D] py-3 font-semibold text-white">{t('cancel')}</button>
              <button onClick={handleSubmitConfirm} className="flex-1 rounded-2xl bg-[#00C2CC] py-3 font-bold text-[#0F1B2D]">{t('examConfirmYes')}</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmAbort && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-5 pb-8">
          <div className="w-full max-w-sm rounded-3xl border border-[#A0B0C0]/20 bg-[#1A2B40] p-6">
            <h3 className="mb-2 text-lg font-bold text-white">{t('examConfirmAbort')}</h3>
            <p className="mb-6 text-sm text-[#A0B0C0]">{t('examConfirmAbortMsg')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmAbort(false)} className="flex-1 rounded-2xl border border-[#A0B0C0]/20 bg-[#0F1B2D] py-3 font-semibold text-white">{t('cancel')}</button>
              <button onClick={handleAbortConfirm} className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-white">{t('examAbortYes')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
