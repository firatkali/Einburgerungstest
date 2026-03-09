import { useEffect, useMemo, useState } from 'react';
import { UserProgress, Question } from '../../types';
import { useTranslation } from '../../i18n';
import { generalQuestions } from '../../data/general-questions';
import { stateQuestions } from '../../data/state-questions';
import { QuestionCard } from '../../components/QuestionCard';

type Props = {
  progress: UserProgress;
  reviewIds?: number[] | null;
  onClearWrong: (id: number) => void;
  onBack: () => void;
};

export function WrongQuestionsScreen({ progress, reviewIds, onClearWrong, onBack }: Props) {
  const { t, tCategory } = useTranslation(progress.language);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const stateQ: Question[] = progress.selectedState ? (stateQuestions[progress.selectedState] ?? []) : [];
  const allQ = useMemo(() => [...generalQuestions, ...stateQ], [stateQ]);
  const activeWrongIds = reviewIds?.length ? reviewIds : progress.wrongAnswers;
  const wrongQ = useMemo(
    () => allQ.filter(q => activeWrongIds.includes(q.id)),
    [activeWrongIds, allQ]
  );

  const question = wrongQ.find(q => q.id === currentQuestionId) ?? wrongQ[0] ?? null;
  const currentIdx = question ? wrongQ.findIndex(q => q.id === question.id) : -1;

  const reset = (questionId: number | null) => {
    setCurrentQuestionId(questionId);
    setRevealed(false);
    setSelected(null);
  };

  const handleAnswer = (idx: number) => { setSelected(idx); setRevealed(true); };

  useEffect(() => {
    if (!question && wrongQ.length > 0) {
      reset(wrongQ[0].id);
    }
  }, [question, wrongQ]);

  if (wrongQ.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex flex-col pb-10 pt-14 px-5">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1A2B40] border border-[#A0B0C0]/20 flex items-center justify-center text-[#A0B0C0] text-sm active:scale-90 transition-transform shrink-0"
          >
            ←
          </button>
          <h1 className="text-white text-2xl font-extrabold">{t('wrongTitle')}</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-[#A0B0C0] text-base text-center">{t('wrongEmpty')}</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-[#0F1B2D] flex items-center justify-center">
        <div className="text-white text-lg">{t('loading')}</div>
      </div>
    );
  }

  const q = question;

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
        <h1 className="text-white text-2xl font-extrabold">{t('wrongTitle')}</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[#A0B0C0] text-sm">{currentIdx + 1} / {wrongQ.length}</span>
        {revealed && (
          <button
            onClick={() => {
              onClearWrong(q.id);
              const nextQuestion = wrongQ[currentIdx + 1] ?? wrongQ[currentIdx - 1] ?? null;
              reset(nextQuestion?.id ?? null);
            }}
            className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            ✓ {t('wrongLearned')}
          </button>
        )}
      </div>
      <div className="text-[#A0B0C0]/60 text-xs font-medium uppercase tracking-wider mb-3">{tCategory(q.category)}</div>
      <QuestionCard question={q} language={progress.language} selectedIndex={selected} revealed={revealed} onAnswer={handleAnswer} />
      <div className="flex gap-3 mt-6">
        <button onClick={() => reset(wrongQ[Math.max(0, currentIdx - 1)]?.id ?? null)} disabled={currentIdx === 0}
          className="flex-1 bg-[#1A2B40] border border-[#A0B0C0]/20 text-white font-semibold py-3 rounded-2xl disabled:opacity-30 active:scale-[0.97] transition-all">←</button>
        <button onClick={() => reset(wrongQ[Math.min(wrongQ.length - 1, currentIdx + 1)]?.id ?? null)} disabled={currentIdx === wrongQ.length - 1}
          className="flex-1 bg-[#1A2B40] border border-[#A0B0C0]/20 text-white font-semibold py-3 rounded-2xl disabled:opacity-30 active:scale-[0.97] transition-all">→</button>
      </div>
    </div>
  );
}
