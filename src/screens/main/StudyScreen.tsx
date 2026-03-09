import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { UserProgress, Question } from '../../types';
import { useTranslation } from '../../i18n';
import { generalQuestions } from '../../data/general-questions';
import { stateQuestions } from '../../data/state-questions';
import { getQuestionOptions, getQuestionText } from '../../lib/language';
import {
  findBestFittingQuestionFontSize,
  getCachedQuestionFontSize,
  getQuestionFontCacheKey,
  getQuestionFontConfig,
  setCachedQuestionFontSize,
} from '../../lib/question-typography';
import { AnswerOption } from '../../components/AnswerOption';

type Filter = 'all' | 'bookmarks' | 'wrong' | 'state';
type FilterState = { questionId: number | null; revealed: boolean; selected: number | null };

type Props = {
  progress: UserProgress;
  onToggleBookmark: (id: number) => void;
  onRecordStudyAnswer: (id: number, isCorrect: boolean) => void;
  onBack: () => void;
};

const DEFAULT_FILTER_STATE: FilterState = { questionId: null, revealed: false, selected: null };

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 ${active ? 'fill-[#00C2CC] text-[#00C2CC]' : 'fill-transparent text-[#A0B0C0]'}`}>
      <path
        d="M6.75 3.5h10.5a.75.75 0 0 1 .75.75v16.185a.35.35 0 0 1-.592.254L12 15.578l-5.408 5.111A.35.35 0 0 1 6 20.435V4.25a.75.75 0 0 1 .75-.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StudyScreen({ progress, onToggleBookmark, onRecordStudyAnswer, onBack }: Props) {
  const { t, tCategory } = useTranslation(progress.language);
  const [filter, setFilter] = useState<Filter>('all');
  const [filterState, setFilterState] = useState<Record<Filter, FilterState>>({
    all: DEFAULT_FILTER_STATE,
    bookmarks: DEFAULT_FILTER_STATE,
    wrong: DEFAULT_FILTER_STATE,
    state: DEFAULT_FILTER_STATE,
  });
  const questionBodyRef = useRef<HTMLDivElement | null>(null);
  const questionTextRef = useRef<HTMLParagraphElement | null>(null);

  const stateQ: Question[] = progress.selectedState ? (stateQuestions[progress.selectedState] ?? []) : [];
  const allQ = useMemo(() => [...generalQuestions, ...stateQ], [stateQ]);

  const filtered: Question[] = useMemo(() => {
    switch (filter) {
      case 'bookmarks': return allQ.filter(q => progress.bookmarks.includes(q.id));
      case 'wrong':     return allQ.filter(q => progress.studyWrongAnswers.includes(q.id));
      case 'state':     return stateQ;
      default:          return allQ;
    }
  }, [allQ, filter, progress.bookmarks, progress.studyWrongAnswers, stateQ]);

  const activeState = filterState[filter];
  const fallbackQuestion = filtered[0] ?? null;
  const question = filtered.find(q => q.id === activeState.questionId) ?? fallbackQuestion;
  const currentIdx = question ? filtered.findIndex(q => q.id === question.id) : -1;
  const revealed = activeState.revealed;
  const selected = activeState.selected;
  const qText = question ? getQuestionText(question, progress.language) : '';
  const options = question ? getQuestionOptions(question, progress.language) : [];
  const fontCacheKey = question ? getQuestionFontCacheKey('study', question, progress.language) : null;
  const fontConfig = getQuestionFontConfig('study', progress.language);
  const [questionFontSize, setQuestionFontSize] = useState(
    () => (fontCacheKey ? getCachedQuestionFontSize(fontCacheKey) : undefined) ?? fontConfig.defaultSize
  );

  useEffect(() => {
    if (!question && filtered.length === 0) return;
    if (!question && fallbackQuestion) {
      setFilterState(prev => ({
        ...prev,
        [filter]: { questionId: fallbackQuestion.id, revealed: false, selected: null },
      }));
    }
  }, [fallbackQuestion, filter, filtered.length, question]);

  useLayoutEffect(() => {
    if (!question || !fontCacheKey) return;

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
  }, [fontCacheKey, fontConfig.maxSize, fontConfig.minSize, qText, question, questionFontSize]);

  const updateActiveState = (next: Partial<FilterState>) => {
    setFilterState(prev => ({
      ...prev,
      [filter]: { ...prev[filter], ...next },
    }));
  };

  const moveToQuestion = (newQuestion: Question | null) => {
    if (!newQuestion) return;
    updateActiveState({
      questionId: newQuestion.id,
      revealed: false,
      selected: null,
    });
  };

  const handleAnswer = (idx: number) => {
    if (!question) return;
    onRecordStudyAnswer(question.id, idx === question.correctIndex);
    updateActiveState({ selected: idx, revealed: true });
  };

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all',       label: t('studyAll') },
    { id: 'state',     label: t('studyState') },
    { id: 'bookmarks', label: t('studyBookmarks') },
    { id: 'wrong',     label: t('studyWrong') },
  ];

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0F1B2D] px-5 pt-14">
      <div className="mx-auto flex h-full max-w-[430px] flex-col">
        <div className="mb-4 flex items-center justify-between gap-3 pt-[1.4em]">
          <button
            onClick={onBack}
            aria-label={t('close')}
            className="h-9 w-9 shrink-0 rounded-full border border-[#A0B0C0]/20 bg-[#1A2B40] text-[#A0B0C0] text-sm transition-transform active:scale-90"
          >
            ✕
          </button>
          <h1 className="text-[26px] font-extrabold text-white">{t('navStudy')}</h1>
          <div className="h-9 w-9 shrink-0" />
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                filter === f.id ? 'bg-[#00C2CC] text-[#0F1B2D]' : 'border border-[#A0B0C0]/20 bg-[#1A2B40] text-[#A0B0C0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <span className="text-5xl">🎉</span>
            <p className="text-base text-[#A0B0C0]">{filter === 'bookmarks' ? t('studyNoBookmarks') : t('studyNoWrong')}</p>
          </div>
        ) : question ? (
          <>
            <div className="mb-[2px]">
              <span className="text-sm text-[#A0B0C0]">
                {t('studyQuestion')} {currentIdx + 1} {t('studyOf')} {filtered.length}
              </span>
            </div>

            <div className="mb-4 h-[184px] overflow-hidden rounded-3xl border border-[#A0B0C0]/20 bg-[#1A2B40] p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 text-xs font-medium uppercase tracking-[0.18em] text-[#A0B0C0]/60">
                  {tCategory(question.category)}
                </div>
                <button
                  onClick={() => onToggleBookmark(question.id)}
                  aria-label={t('studyBookmarks')}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  <BookmarkIcon active={progress.bookmarks.includes(question.id)} />
                </button>
              </div>

              <div ref={questionBodyRef} className="h-[118px] overflow-hidden pr-1">
                <p
                  ref={questionTextRef}
                  className="font-semibold leading-[1.35] text-white"
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
                  state={
                    !revealed
                      ? selected === i ? 'selected' : 'idle'
                      : i === question.correctIndex
                        ? 'correct'
                        : selected === i
                          ? 'wrong'
                          : 'idle'
                  }
                  onClick={() => handleAnswer(i)}
                  disabled={revealed}
                />
              ))}
            </div>

            <div className="mt-auto pb-8">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => moveToQuestion(filtered[Math.max(0, currentIdx - 1)] ?? null)}
                  disabled={currentIdx === 0}
                  className="rounded-2xl border border-[#A0B0C0]/20 bg-[#1A2B40] py-4 text-2xl font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  onClick={() => moveToQuestion(filtered[Math.min(filtered.length - 1, currentIdx + 1)] ?? null)}
                  disabled={currentIdx === filtered.length - 1}
                  className="rounded-2xl border border-[#A0B0C0]/20 bg-[#1A2B40] py-4 text-2xl font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
