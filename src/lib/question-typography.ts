import { Language, Question } from '../types';
import { getQuestionText } from './language';

type ScreenKey = 'exam' | 'study' | 'wrong';

type FontConfig = {
  defaultSize: number;
  minSize: number;
  maxSize: number;
};

type LanguageConfigMap = Partial<Record<Language, Partial<FontConfig>>> & {
  default: FontConfig;
};

const QUESTION_FONT_CONFIG: Record<ScreenKey, LanguageConfigMap> = {
  exam: {
    default: { defaultSize: 26, minSize: 14, maxSize: 26 },
  },
  study: {
    default: { defaultSize: 26, minSize: 14, maxSize: 26 },
  },
  wrong: {
    default: { defaultSize: 24, minSize: 14, maxSize: 24 },
  },
};

const fontSizeCache = new Map<string, number>();

export function getQuestionFontConfig(screen: ScreenKey, language: Language): FontConfig {
  const screenConfig = QUESTION_FONT_CONFIG[screen];
  return {
    ...screenConfig.default,
    ...(screenConfig[language] ?? {}),
  };
}

export function getQuestionFontCacheKey(screen: ScreenKey, question: Question, language: Language): string {
  return `${screen}:${language}:${question.id}:${getQuestionText(question, language)}`;
}

export function getCachedQuestionFontSize(cacheKey: string): number | undefined {
  return fontSizeCache.get(cacheKey);
}

export function setCachedQuestionFontSize(cacheKey: string, fontSize: number): void {
  fontSizeCache.set(cacheKey, fontSize);
}

export function findBestFittingQuestionFontSize(
  container: HTMLElement,
  textElement: HTMLElement,
  minSize: number,
  maxSize: number
): number {
  const previousFontSize = textElement.style.fontSize;
  let low = minSize;
  let high = maxSize;
  let best = minSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    textElement.style.fontSize = `${mid}px`;

    const fitsHeight = textElement.scrollHeight <= container.clientHeight;
    const fitsWidth = textElement.scrollWidth <= container.clientWidth;

    if (fitsHeight && fitsWidth) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  textElement.style.fontSize = previousFontSize;
  return best;
}
