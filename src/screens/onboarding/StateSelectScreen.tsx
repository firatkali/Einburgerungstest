import { Bundesland, BUNDESLAND_NAMES, Language } from '../../types';
import { useTranslation } from '../../i18n';

type Props = { language: Language; onSelect: (state: Bundesland) => void; onBack: () => void };

const STATES = Object.entries(BUNDESLAND_NAMES) as [Bundesland, string][];

const STATE_FLAGS: Record<Bundesland, string> = {
  BW: '🏰', BY: '🦁', BE: '🐻', BB: '🦅', HB: '⚓', HH: '🏙️',
  HE: '🦁', MV: '🌊', NI: '🐎', NW: '⚔️', RP: '🍷', SL: '⛏️',
  SN: '🏛️', ST: '🏰', SH: '🌊', TH: '⭐',
};

export function StateSelectScreen({ language, onSelect, onBack }: Props) {
  const { t } = useTranslation(language);
  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col pb-8">
      <div className="px-6 pt-16 pb-4">
        <button onClick={onBack} className="text-[#A0B0C0] text-sm mb-6 text-left">← {t('back')}</button>
        <h1 className="text-white text-3xl font-extrabold">{t('stateSelectTitle')}</h1>
        <p className="text-[#A0B0C0] text-sm mt-2">{t('stateSelectSubtitle')}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {STATES.map(([code, name]) => (
            <button
              key={code}
              onClick={() => onSelect(code)}
              className="bg-[#1A2B40] hover:bg-[#1A2B40]/80 active:scale-[0.97] border border-[#A0B0C0]/20 hover:border-[#00C2CC]/40 rounded-2xl p-4 text-left transition-all"
            >
              <span className="text-2xl">{STATE_FLAGS[code]}</span>
              <div className="text-white font-semibold text-sm mt-2 leading-tight">{name}</div>
              <div className="text-[#A0B0C0] text-xs mt-0.5">{code}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
