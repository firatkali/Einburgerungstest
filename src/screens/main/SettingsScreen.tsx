import { useState } from 'react';
import { UserProgress, Bundesland, BUNDESLAND_NAMES, Language } from '../../types';
import { useTranslation } from '../../i18n';
import { revenueCatManager } from '../../lib/revenuecat';

type Props = {
  progress: UserProgress;
  onLanguageChange: (lang: Language) => void;
  onStateChange: (state: Bundesland) => void;
  onReset: () => void;
  onBack: () => void;
};

const LANGUAGES: Language[] = ['de', 'en', 'ar', 'tr', 'ru', 'fa'];

export function SettingsScreen({ progress, onLanguageChange, onStateChange, onReset, onBack }: Props) {
  const { t } = useTranslation(progress.language);
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const [showStateList, setShowStateList] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    setRestoreMsg(null);
    const result = await revenueCatManager.restorePurchases();
    setRestoring(false);
    setRestoreMsg(result.hasPremium ? t('settingsRestoredOk') : t('settingsRestoredFail'));
  };

  const totalExams = progress.examHistory.length;
  const passed = progress.examHistory.filter(e => e.passed).length;
  const avgScore = totalExams > 0
    ? Math.round(progress.examHistory.reduce((a, e) => a + e.score, 0) / totalExams)
    : 0;

  const currentStateName = progress.selectedState ? BUNDESLAND_NAMES[progress.selectedState] : '–';

  return (
    <div className="min-h-screen bg-[#0F1B2D] pb-10 pt-14 px-5">
      <div className="mx-auto max-w-[430px]">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1A2B40] border border-[#A0B0C0]/20 flex items-center justify-center text-[#A0B0C0] text-sm active:scale-90 transition-transform shrink-0"
          >
            ←
          </button>
          <h1 className="text-white text-2xl font-extrabold">{t('settingsTitle')}</h1>
        </div>

        <div className="rounded-[28px] border border-[#A0B0C0]/20 bg-[#1A2B40] p-5 mb-4">
          <div className="text-[#A0B0C0] text-xs font-medium uppercase tracking-[0.14em] mb-4">
            {t('statsSummary')}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#0F1B2D] border border-[#A0B0C0]/10 px-3 py-4 text-center">
              <div className="text-white text-2xl font-extrabold">{totalExams}</div>
              <div className="text-[#A0B0C0] text-xs mt-1">{t('homeExamsTaken')}</div>
            </div>
            <div className="rounded-2xl bg-[#0F1B2D] border border-[#A0B0C0]/10 px-3 py-4 text-center">
              <div className="text-white text-2xl font-extrabold">{passed}</div>
              <div className="text-[#A0B0C0] text-xs mt-1">{t('homePassed')}</div>
            </div>
            <div className="rounded-2xl bg-[#0F1B2D] border border-[#A0B0C0]/10 px-3 py-4 text-center">
              <div className="text-white text-2xl font-extrabold">{avgScore}</div>
              <div className="text-[#A0B0C0] text-xs mt-1">/33</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#A0B0C0]/20 bg-[#1A2B40] p-5 mb-4">
          <div className="mb-5">
            <div className="text-white text-base font-bold mb-1">{t('settingsLanguage')}</div>
            <div className="text-[#A0B0C0] text-sm leading-relaxed">{t('settingsLanguageHelp')}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`min-h-[52px] rounded-2xl border px-4 py-3 text-left transition-all ${
                  progress.language === lang
                    ? 'bg-[#00C2CC] text-[#0F1B2D] border-[#00C2CC]'
                    : 'bg-[#0F1B2D] text-white border-[#A0B0C0]/20'
                }`}
              >
                <div className="font-bold text-sm">
                  {{
                    de: t('languageNameDe'),
                    en: t('languageNameEn'),
                    ar: t('languageNameAr'),
                    tr: t('languageNameTr'),
                    ru: t('languageNameRu'),
                    fa: t('languageNameFa'),
                  }[lang]}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#A0B0C0]/20 bg-[#1A2B40] p-5 mb-4">
          <div className="text-[#A0B0C0] text-xs font-medium uppercase tracking-[0.14em] mb-4">
            {t('settingsTitle')}
          </div>

          <button
            onClick={() => setShowStateList(true)}
            className="w-full rounded-2xl bg-[#0F1B2D] border border-[#A0B0C0]/10 px-4 py-4 text-left mb-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-white text-sm font-bold">{t('settingsState')}</div>
                <div className="text-[#A0B0C0] text-sm mt-1">{currentStateName}</div>
              </div>
              <div className="text-[#00C2CC] text-sm font-bold">{t('settingsChangeState')}</div>
            </div>
          </button>

          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full rounded-2xl bg-[#0F1B2D] border border-[#A0B0C0]/10 px-4 py-4 text-left disabled:opacity-60"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-white text-sm font-bold">
                  {restoring ? t('settingsRestoring') : t('settingsRestore')}
                </div>
                <div className="text-[#A0B0C0] text-sm mt-1">
                  {restoreMsg ?? t('paywallTerms')}
                </div>
              </div>
              <div className="text-[#00C2CC] text-lg">↗</div>
            </div>
          </button>
        </div>

        <div className="rounded-[28px] border border-red-500/20 bg-[#1A2B40] p-5">
          <div className="text-red-400 text-xs font-medium uppercase tracking-[0.14em] mb-4">
            {t('settingsReset')}
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full rounded-2xl bg-[#2A1620] border border-red-500/20 px-4 py-4 text-left"
          >
            <div className="text-red-300 text-sm font-bold">{t('settingsReset')}</div>
            <div className="text-red-200/70 text-sm mt-1">{t('settingsResetConfirm')}</div>
          </button>
          <div className="text-[#A0B0C0] text-xs mt-4">
            {t('settingsVersion')} 1.0.0
          </div>
        </div>
      </div>

      {showStateList && (
        <div className="fixed inset-0 bg-black/70 flex flex-col z-50">
          <div className="bg-[#1A2B40] flex-1 mt-20 rounded-t-3xl overflow-y-auto px-5 pt-5 pb-10 border-t border-[#A0B0C0]/20">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-white font-bold text-lg">{t('settingsState')}</h2>
              <button onClick={() => setShowStateList(false)} className="text-[#A0B0C0] text-2xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(BUNDESLAND_NAMES) as [Bundesland, string][]).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => { onStateChange(code); setShowStateList(false); }}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    progress.selectedState === code
                      ? 'bg-[#00C2CC]/20 border-[#00C2CC] text-white'
                      : 'bg-[#0F1B2D] text-white border-[#A0B0C0]/20'
                  }`}
                >
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs opacity-60 mt-0.5">{code}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 pb-8 px-5">
          <div className="bg-[#1A2B40] border border-[#A0B0C0]/20 rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">{t('settingsReset')}</h3>
            <p className="text-[#A0B0C0] text-sm mb-6">{t('settingsResetConfirm')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-[#0F1B2D] border border-[#A0B0C0]/20 text-white py-3 rounded-2xl font-semibold">{t('cancel')}</button>
              <button onClick={() => { onReset(); setShowResetConfirm(false); }} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold">{t('yes')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
