import { ExamResult, Language } from '../../types';
import { useTranslation } from '../../i18n';
import { ProgressBar } from '../../components/ProgressBar';

type Props = { result: ExamResult; language: Language; onRetry: () => void; onHome: () => void; onReview: () => void };

export function ExamResultScreen({ result, language, onRetry, onHome, onReview }: Props) {
  const { t } = useTranslation(language);
  const minutes = Math.floor(result.timeSpent / 60);
  const seconds = result.timeSpent % 60;
  const correct = result.score;
  const wrong = 33 - correct;

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col pb-12 pt-14 px-5">
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">{result.passed ? '🎉' : '😅'}</div>
        <h1 className={`text-4xl font-extrabold ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
          {result.passed ? t('examResultPassed') : t('examResultFailed')}
        </h1>
        <p className="text-[#A0B0C0] text-sm mt-2">
          {result.passed ? t('examResultPassMsg') : t('examResultFailMsg')}
        </p>
      </div>

      {/* Score */}
      <div className="bg-[#1A2B40] rounded-3xl p-5 mb-5 border border-[#A0B0C0]/20">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#A0B0C0] text-sm">{t('examResultScore')}</span>
          <span className="text-white font-bold text-2xl">{correct}/33</span>
        </div>
        <ProgressBar current={correct} total={33} />
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-emerald-400">✓ {correct} {t('examResultCorrect')}</span>
          <span className="text-red-400">✗ {wrong} {t('examResultWrong')}</span>
        </div>
      </div>

      {/* Time */}
      <div className="bg-[#1A2B40] rounded-3xl p-4 mb-6 border border-[#A0B0C0]/20 flex justify-between items-center">
        <span className="text-[#A0B0C0] text-sm">{t('examResultTime')}</span>
        <span className="text-white font-semibold">{minutes}:{seconds.toString().padStart(2,'0')} {t('examResultMinutes')}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button onClick={onRetry} className="w-full bg-[#00C2CC] text-[#0F1B2D] font-bold h-14 rounded-full active:scale-[0.97] transition-transform">
          🔄 {t('examResultRetry')}
        </button>
        {result.wrongIds.length > 0 && (
          <button onClick={onReview} className="w-full bg-[#1A2B40] text-white font-semibold h-14 rounded-full border border-[#A0B0C0]/20 active:scale-[0.97] transition-transform">
            📋 {t('examResultReview')}
          </button>
        )}
        <button onClick={onHome} className="w-full text-[#A0B0C0] text-sm py-3 active:opacity-70">
          {t('examResultHome')}
        </button>
      </div>
    </div>
  );
}
