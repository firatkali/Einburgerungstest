import { Purchases } from '@revenuecat/purchases-capacitor';

const IOS_API_KEY = 'TODO_REVENUECAT_IOS_API_KEY';

export const PRODUCT_IDS = {
  PREMIUM: 'einburgerungstest_premium',
};

export const ENTITLEMENTS = {
  PREMIUM: 'premium',
};

class RevenueCatManager {
  private static instance: RevenueCatManager;
  private isConfigured = false;

  private constructor() {}

  public static getInstance(): RevenueCatManager {
    if (!RevenueCatManager.instance) {
      RevenueCatManager.instance = new RevenueCatManager();
    }
    return RevenueCatManager.instance;
  }

  public async configure(userId?: string): Promise<void> {
    const isNative = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
    if (!isNative) {
      console.debug('RevenueCat: web env, skipping');
      return;
    }
    try {
      await Purchases.configure({
        apiKey: IOS_API_KEY,
        appUserID: userId ?? null,
      });
      this.isConfigured = true;
    } catch (e) {
      console.error('RevenueCat configure error:', e);
    }
  }

  public async purchasePremium(): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured) return { success: false, error: 'Purchase service not ready.' };
    try {
      const offerings = await Purchases.getOfferings();
      const allPackages = Object.values(offerings.all).flatMap(o => o.availablePackages);
      const pkg = allPackages.find(p => p.product.identifier === PRODUCT_IDS.PREMIUM);
      if (!pkg) return { success: false, error: 'Product not found. Please try again later.' };

      const result = await Purchases.purchasePackage({ aPackage: pkg });
      const hasPremium = !!result.customerInfo?.entitlements?.active[ENTITLEMENTS.PREMIUM];
      return { success: hasPremium };
    } catch (e: any) {
      if (e?.userCancelled) return { success: false };
      const detail = e?.message ?? e?.code ?? JSON.stringify(e);
      return { success: false, error: `Purchase failed: ${detail}` };
    }
  }

  public async restorePurchases(): Promise<{ success: boolean; hasPremium: boolean; error?: string }> {
    if (!this.isConfigured) return { success: false, hasPremium: false, error: 'Purchase service not ready.' };
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      const hasPremium = !!customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
      return { success: true, hasPremium };
    } catch (e) {
      return { success: false, hasPremium: false, error: 'Restore failed. Please try again.' };
    }
  }

  public async checkPremiumStatus(): Promise<boolean> {
    if (!this.isConfigured) return false;
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      return !!customerInfo.entitlements.active[ENTITLEMENTS.PREMIUM];
    } catch {
      return false;
    }
  }

  public async fetchPrice(): Promise<string | null> {
    if (!this.isConfigured) return null;
    try {
      const offerings = await Purchases.getOfferings();
      const allPackages = Object.values(offerings.all).flatMap(o => o.availablePackages);
      const pkg = allPackages.find(p => p.product.identifier === PRODUCT_IDS.PREMIUM);
      return pkg?.product.priceString ?? null;
    } catch {
      return null;
    }
  }
}

export const revenueCatManager = RevenueCatManager.getInstance();
