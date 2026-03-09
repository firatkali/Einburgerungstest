import { UserProgress } from '../../types';
import { useTranslation } from '../../i18n';
import { StatCard } from '../../components/StatCard';

type Props = {
  progress: UserProgress;
  onStartExam: () => void;
  onStudy: () => void;
  onSettings: () => void;
};

export function HomeScreen({ progress, onStartExam, onStudy, onSettings }: Props) {
  const { t } = useTranslation(progress.language);
  const last = progress.examHistory[0] ?? null;
  const totalExams = progress.examHistory.length;
  const passed = progress.examHistory.filter(e => e.passed).length;
  const avgScore = totalExams > 0
    ? Math.round(progress.examHistory.reduce((a, e) => a + e.score, 0) / totalExams)
    : 0;

  return (
    <div className="min-h-screen bg-[#0F1B2D] pb-10 px-5 pt-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-4xl mb-1">🇩🇪</div>
          <h1 className="text-white text-2xl font-extrabold">{t('homeGreeting')}</h1>
        </div>
        <button
          onClick={onSettings}
          className="w-10 h-10 rounded-full bg-[#1A2B40] border border-[#A0B0C0]/20 flex items-center justify-center text-[#A0B0C0] active:scale-90 transition-transform"
        >
          ⚙️
        </button>
      </div>

      {/* Last result */}
      <div className="bg-[#1A2B40] rounded-3xl p-5 mb-5 border border-[#A0B0C0]/20">
        <div className="text-[#A0B0C0] text-xs font-medium uppercase tracking-wide mb-3">{t('homeLastScore')}</div>
        {last ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-4xl font-extrabold">{last.score}</span>
              <span className="text-[#A0B0C0] text-lg">/33</span>
            </div>
            <div className={`px-4 py-2 rounded-xl font-bold text-sm ${last.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
              {last.passed ? t('examResultPassed') : t('examResultFailed')}
            </div>
          </div>
        ) : (
          <p className="text-[#A0B0C0] text-sm">{t('homeNoExams')}</p>
        )}
      </div>

      {/* Stats grid */}
      {totalExams > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label={t('homeExamsTaken')} value={totalExams} icon="📝" />
          <StatCard label={t('homePassed')} value={passed} icon="✅" />
          <StatCard label={t('homeCorrectRate')} value={`${avgScore}/33`} icon="🎯" />
        </div>
      )}

      {/* CTAs */}
      <button
        onClick={onStartExam}
        className="w-full bg-[#00C2CC] text-[#0F1B2D] font-bold text-lg h-14 rounded-full shadow-lg active:scale-[0.97] transition-transform mb-3"
      >
        🚀 {t('homeStartExam')}
      </button>
      <button
        onClick={onStudy}
        className="w-full bg-[#1A2B40] text-white font-semibold text-base h-14 rounded-full border border-[#A0B0C0]/20 active:scale-[0.97] transition-transform"
      >
        📖 {t('homeStudy')}
      </button>
    </div>
  );
}
