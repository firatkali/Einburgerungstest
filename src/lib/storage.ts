import { UserProgress } from '../types';

const STORAGE_KEY = 'einburgerungstest_progress';

const DEFAULT_PROGRESS: UserProgress = {
  purchased: false,
  selectedState: null,
  language: 'de',
  bookmarks: [],
  examHistory: [],
  wrongAnswers: [],
  studyWrongAnswers: [],
  onboardingComplete: false,
};

export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage unavailable — ignore
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
