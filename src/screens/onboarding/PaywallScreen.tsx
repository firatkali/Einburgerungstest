import { useEffect, useState } from 'react';
import { Language } from '../../types';
import { useTranslation } from '../../i18n';
import { revenueCatManager } from '../../lib/revenuecat';

type Props = { language: Language; onPurchased: () => void; onBack: () => void };

const FEATURES = [
  'paywallFeature1', 'paywallFeature2', 'paywallFeature3',
  'paywallFeature4', 'paywallFeature5', 'paywallFeature6',
] as const;

export function PaywallScreen({ language, onPurchased, onBack }: Props) {
  const { t } = useTranslation(language);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    revenueCatManager.fetchPrice().then(p => p && setPrice(p));
  }, []);

  const handlePurchase = async () => {
    onPurchased(); // TODO: re-enable RevenueCat once API key is configured
  };

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    const result = await revenueCatManager.restorePurchases();
    setLoading(false);
    if (result.success && result.hasPremium) onPurchased();
    else setError(t('paywallRestoreError'));
  };

  return (
    <div className="min-h-screen bg-[#0F1B2D] flex flex-col px-6 pb-12 pt-16">
      <button onClick={onBack} className="text-[#A0B0C0] text-sm mb-4 text-left">← {t('back')}</button>

      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#00C2CC] flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold">{t('paywallTitle')}</h1>
        <p className="text-[#A0B0C0] text-sm mt-2">{t('paywallSubtitle')}</p>
      </div>

      <div className="bg-[#1A2B40] border border-[#A0B0C0]/20 rounded-3xl p-5 mb-6 flex flex-col gap-3">
        {FEATURES.map(key => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-[#00C2CC] text-lg">✓</span>
            <span className="text-white text-sm">{t(key)}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-2xl px-4 py-3 mb-4 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-[#00C2CC] text-[#0F1B2D] font-bold text-lg h-14 rounded-full shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60 mb-3"
      >
        {loading ? t('paywallPurchasing') : (
          <span>{t('paywallCta')}{price ? ` — ${price}` : ''}</span>
        )}
      </button>

      <button
        onClick={handleRestore}
        disabled={loading}
        className="w-full text-[#A0B0C0] text-sm py-2 active:opacity-70 transition-opacity"
      >
        {loading ? t('paywallRestoring') : t('paywallRestore')}
      </button>

      <p className="text-center text-[#A0B0C0]/40 text-xs mt-4">{t('paywallTerms')}</p>
    </div>
  );
}
