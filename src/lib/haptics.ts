import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const hapticImpact = async (style: ImpactStyle) => {
  try {
    await Haptics.impact({ style });
  } catch {
    // Simulator / web — ignore
  }
};

export const hapticNotification = async (type: NotificationType) => {
  try {
    await Haptics.notification({ type });
  } catch {
    // Simulator / web — ignore
  }
};

export const hapticVibrate = async (duration: number = 50) => {
  try {
    await Haptics.vibrate({ duration });
  } catch {
    // Simulator / web — ignore
  }
};

export { ImpactStyle, NotificationType };
