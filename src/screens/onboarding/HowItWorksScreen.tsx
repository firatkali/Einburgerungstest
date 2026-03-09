import { Language } from '../../types';
import { useTranslation } from '../../i18n';

type Props = { language: Language; onNext: () => void; onBack: () => void };

const STEPS = [
  { icon: '📝', titleKey: 'howItWorksStep1Title', descKey: 'howItWorksStep1Desc' },
  { icon: '⏱️', titleKey: 'howItWorksStep2Title', descKey: 'howItWorksStep2Desc' },
  { icon: '✅', titleKey: 'howItWorksStep3Title', descKey: 'howItWorksStep3Desc' },
] as const;

export function HowItWorksScreen({ language, onNext, onBack }: Props) {
  const { t } = useTranslation(language);
  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col px-6 pb-12 pt-16">
      <button onClick={onBack} className="text-[#A0B0C0] text-sm mb-6 text-left">← {t('back')}</button>
      <h1 className="text-white text-3xl font-extrabold mb-8">{t('howItWorksTitle')}</h1>
      <div className="flex flex-col gap-5 flex-1">
        {STEPS.map((step, i) => (
          <div key={i} className="bg-[#1A2B40] border border-[#A0B0C0]/20 rounded-3xl p-5 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00C2CC]/20 border border-[#00C2CC]/30 flex items-center justify-center text-2xl shrink-0">
              {step.icon}
            </div>
            <div>
              <div className="text-white font-bold text-lg">{t(step.titleKey)}</div>
              <div className="text-[#A0B0C0] text-sm mt-1 leading-relaxed">{t(step.descKey)}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="w-full bg-[#00C2CC] text-[#0F1B2D] font-bold text-lg h-14 rounded-full shadow-lg active:scale-[0.97] transition-transform mt-6"
      >
        {t('continue')}
      </button>
    </div>
  );
}
