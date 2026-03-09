import { Language } from '../../types';
import { useTranslation } from '../../i18n';

type Props = { language: Language; onLanguageChange: (language: Language) => void; onNext: () => void };

const LANGUAGE_OPTIONS: Language[] = ['de', 'en', 'ar', 'tr', 'ru', 'fa'];
const LANGUAGE_LABEL_KEYS = {
  de: 'languageNameDe',
  en: 'languageNameEn',
  ar: 'languageNameAr',
  tr: 'languageNameTr',
  ru: 'languageNameRu',
  fa: 'languageNameFa',
} as const;

export function WelcomeScreen({ language, onLanguageChange, onNext }: Props) {
  const { t } = useTranslation(language);
  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col items-center justify-center px-6 pb-12 pt-16">
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        <div className="w-24 h-24 rounded-full bg-[#00C2CC] flex items-center justify-center mb-2">
          <span className="text-5xl">🇩🇪</span>
        </div>
        <h1 className="text-white text-4xl font-extrabold text-center leading-tight whitespace-pre-line">
          {t('welcomeTitle')}
        </h1>
        <p className="text-[#A0B0C0] text-base text-center leading-relaxed max-w-xs">
          {t('welcomeSubtitle')}
        </p>
        <div className="w-full max-w-sm">
          <div className="text-white text-sm font-bold text-center mb-2">{t('languageSelectTitle')}</div>
          <p className="text-[#A0B0C0] text-xs text-center leading-relaxed mb-4">{t('languageSelectSubtitle')}</p>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGE_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => onLanguageChange(option)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                  language === option
                    ? 'bg-[#00C2CC] border-[#00C2CC] text-[#0F1B2D]'
                    : 'bg-[#1A2B40] border-[#A0B0C0]/20 text-white'
                }`}
              >
                {t(LANGUAGE_LABEL_KEYS[option])}
              </button>
            ))}
          </div>
          <p className="text-[#A0B0C0]/70 text-xs text-center mt-3">{t('languageSupportNote')}</p>
        </div>
        <div className="flex gap-4 mt-4">
          {['460', '300+10', '17/33'].map((stat, i) => (
            <div key={i} className="bg-[#1A2B40] border border-[#A0B0C0]/20 rounded-2xl px-4 py-3 text-center">
              <div className="text-[#00C2CC] font-bold text-xl">{stat}</div>
              <div className="text-[#A0B0C0] text-xs mt-0.5">
                {[t('welcomeStatQuestions'), t('welcomeStatMix'), t('welcomeStatPass')][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full max-w-xs bg-[#00C2CC] text-[#0F1B2D] font-bold text-lg h-14 rounded-full shadow-lg active:scale-[0.97] transition-transform"
      >
        {t('getStarted')}
      </button>
    </div>
  );
}
