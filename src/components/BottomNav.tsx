import { Language } from '../types';
import { useTranslation } from '../i18n';

export type Tab = 'home' | 'study' | 'exam' | 'stats';

type Props = { activeTab: Tab; onTab: (tab: Tab) => void; language: Language };

const TABS: { id: Tab; icon: string; labelKey: 'navHome' | 'navStudy' | 'navExam' | 'navStats' }[] = [
  { id: 'home',  icon: '🏠', labelKey: 'navHome' },
  { id: 'study', icon: '📖', labelKey: 'navStudy' },
  { id: 'exam',  icon: '📝', labelKey: 'navExam' },
  { id: 'stats', icon: '📊', labelKey: 'navStats' },
];

export function BottomNav({ activeTab, onTab, language }: Props) {
  const { t } = useTranslation(language);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A1525]/95 backdrop-blur-xl border-t border-[#A0B0C0]/20 flex safe-area-pb">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTab(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all ${
            activeTab === tab.id ? 'text-[#00C2CC]' : 'text-[#A0B0C0]'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
          {activeTab === tab.id && (
            <span className="absolute bottom-[calc(env(safe-area-inset-bottom)+0px)] w-1 h-1 rounded-full bg-[#00C2CC]" />
          )}
        </button>
      ))}
    </nav>
  );
}
