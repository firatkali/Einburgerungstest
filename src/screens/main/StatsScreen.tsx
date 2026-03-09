import { UserProgress } from '../../types';
import { useTranslation } from '../../i18n';
import { StatCard } from '../../components/StatCard';

type Props = { progress: UserProgress };

export function StatsScreen({ progress }: Props) {
  const { t } = useTranslation(progress.language);
  const { examHistory } = progress;
  const total = examHistory.length;
  const passed = examHistory.filter(e => e.passed).length;
  const avgScore = total > 0 ? Math.round(examHistory.reduce((a, e) => a + e.score, 0) / total) : 0;
  const high = total > 0 ? Math.max(...examHistory.map(e => e.score)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 pb-28 pt-14 px-5">
      <h1 className="text-white text-2xl font-extrabold mb-6">{t('statsTitle')}</h1>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-5xl">📊</span>
          <p className="text-white/60 text-base">{t('statsNoData')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard label={t('statsTotalExams')} value={total} icon="📝" accent="from-blue-500 to-indigo-500" />
            <StatCard label={t('statsHighScore')} value={`${high}/33`} icon="🏆" accent="from-amber-500 to-orange-500" />
            <StatCard label={t('statsPassed')} value={passed} icon="✅" accent="from-emerald-500 to-teal-500" />
            <StatCard label={t('statsAvgScore')} value={`${avgScore}/33`} icon="🎯" accent="from-violet-500 to-purple-500" />
          </div>

          <div className="bg-white/10 rounded-3xl p-5 border border-white/10">
            <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-4">{t('statsHistory')}</div>
            <div className="flex flex-col gap-3">
              {examHistory.slice(0, 20).map((exam, i) => {
                const d = new Date(exam.date);
                const label = d.toLocaleDateString(progress.language === 'de' ? 'de-DE' : 'en-GB');
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <div>
                      <div className="text-white text-sm font-medium">{label}</div>
                      <div className="text-white/40 text-xs">{Math.floor(exam.timeSpent / 60)} min</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold">{exam.score}/33</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${exam.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {exam.passed ? t('statsPast') : t('statsFail')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
