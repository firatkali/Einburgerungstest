import { useEffect, useMemo, useState } from 'react';
import { UserProgress, Question } from '../../types';
import { useTranslation } from '../../i18n';
import { generalQuestions } from '../../data/general-questions';
import { stateQuestions } from '../../data/state-questions';
import { QuestionCard } from '../../components/QuestionCard';

type Filter = 'all' | 'bookmarks' | 'wrong' | 'state';
type FilterState = { questionId: number | null; revealed: boolean; selected: number | null };

type Props = {
  progress: UserProgress;
  onToggleBookmark: (id: number) => void;
  onRecordStudyAnswer: (id: number, isCorrect: boolean) => void;
  onBack: () => void;
};

const DEFAULT_FILTER_STATE: FilterState = { questionId: null, revealed: false, selected: null };

export function StudyScreen({ progress, onToggleBookmark, onRecordStudyAnswer, onBack }: Props) {
  const { t, tCategory } = useTranslation(progress.language);
  const [filter, setFilter] = useState<Filter>('all');
  const [filterState, setFilterState] = useState<Record<Filter, FilterState>>({
    all: DEFAULT_FILTER_STATE,
    bookmarks: DEFAULT_FILTER_STATE,
    wrong: DEFAULT_FILTER_STATE,
    state: DEFAULT_FILTER_STATE,
  });

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

  useEffect(() => {
    if (!question && filtered.length === 0) return;
    if (!question && fallbackQuestion) {
      setFilterState(prev => ({
        ...prev,
        [filter]: { questionId: fallbackQuestion.id, revealed: false, selected: null },
      }));
    }
  }, [fallbackQuestion, filter, filtered.length, question]);

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
    { id: 'bookmarks', label: t('studyBookmarks') },
    { id: 'wrong',     label: t('studyWrong') },
    { id: 'state',     label: t('studyState') },
  ];

  return (
    <div className="min-h-screen bg-[#0F1B2D] pb-10 pt-14 px-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#1A2B40] border border-[#A0B0C0]/20 flex items-center justify-center text-[#A0B0C0] text-sm active:scale-90 transition-transform shrink-0"
        >
          ←
        </button>
        <h1 className="text-white text-2xl font-extrabold">{t('studyTitle')}</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === f.id ? 'bg-[#00C2CC] text-[#0F1B2D]' : 'bg-[#1A2B40] text-[#A0B0C0] border border-[#A0B0C0]/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl">🎉</span>
          <p className="text-[#A0B0C0] text-base">{filter === 'bookmarks' ? t('studyNoBookmarks') : t('studyNoWrong')}</p>
        </div>
      ) : question ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#A0B0C0] text-sm">{t('studyQuestion')} {currentIdx + 1} {t('studyOf')} {filtered.length}</span>
            <button
              onClick={() => onToggleBookmark(question.id)}
              className="text-2xl active:scale-90 transition-transform"
            >
              {progress.bookmarks.includes(question.id) ? '🔖' : '🏷️'}
            </button>
          </div>

          <div className="text-[#A0B0C0]/60 text-xs font-medium uppercase tracking-wider mb-3">{tCategory(question.category)}</div>

          <QuestionCard
            question={question}
            language={progress.language}
            selectedIndex={selected}
            revealed={revealed}
            onAnswer={handleAnswer}
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => moveToQuestion(filtered[Math.max(0, currentIdx - 1)] ?? null)}
              disabled={currentIdx === 0}
              className="flex-1 bg-[#1A2B40] border border-[#A0B0C0]/20 text-white font-semibold py-3 rounded-2xl disabled:opacity-30 active:scale-[0.97] transition-all"
            >
              ←
            </button>
            <button
              onClick={() => moveToQuestion(filtered[Math.min(filtered.length - 1, currentIdx + 1)] ?? null)}
              disabled={currentIdx === filtered.length - 1}
              className="flex-1 bg-[#1A2B40] border border-[#A0B0C0]/20 text-white font-semibold py-3 rounded-2xl disabled:opacity-30 active:scale-[0.97] transition-all"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
