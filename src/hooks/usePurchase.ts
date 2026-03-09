import { useState, useCallback } from 'react';
import { revenueCatManager } from '../lib/revenuecat';

export function usePurchase(onPurchased: () => void, onRestored: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await revenueCatManager.purchasePremium();
    setLoading(false);
    if (result.success) {
      onPurchased();
    } else if (result.error) {
      setError(result.error);
    }
  }, [onPurchased]);

  const restore = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await revenueCatManager.restorePurchases();
    setLoading(false);
    if (result.success && result.hasPremium) {
      onRestored();
    } else {
      setError(result.error ?? 'No purchases found.');
    }
  }, [onRestored]);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, purchase, restore, clearError };
}
