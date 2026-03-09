export type Bundesland =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE'
  | 'MV' | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

export const BUNDESLAND_NAMES: Record<Bundesland, string> = {
  BW: 'Baden-Württemberg',
  BY: 'Bayern',
  BE: 'Berlin',
  BB: 'Brandenburg',
  HB: 'Bremen',
  HH: 'Hamburg',
  HE: 'Hessen',
  MV: 'Mecklenburg-Vorpommern',
  NI: 'Niedersachsen',
  NW: 'Nordrhein-Westfalen',
  RP: 'Rheinland-Pfalz',
  SL: 'Saarland',
  SN: 'Sachsen',
  ST: 'Sachsen-Anhalt',
  SH: 'Schleswig-Holstein',
  TH: 'Thüringen',
};

export type Language = 'de' | 'en' | 'ar' | 'tr' | 'ru' | 'fa';

export type QuestionTranslation = {
  question: string;
  options: string[];
};

export type QuestionTranslations = Partial<Record<Language, QuestionTranslation>>;

export type Question = {
  id: number;
  category: string;
  question_de: string;
  question_en: string;
  options_de: string[];
  options_en: string[];
  translations?: QuestionTranslations;
  correctIndex: number; // 0-3
  state?: Bundesland;   // undefined = general question
};

export type ExamResult = {
  date: string;       // ISO
  score: number;      // out of 33
  passed: boolean;    // score >= 17
  timeSpent: number;  // seconds
  wrongIds: number[];
};

export type UserProgress = {
  purchased: boolean;
  selectedState: Bundesland | null;
  language: Language;
  bookmarks: number[];
  examHistory: ExamResult[];
  wrongAnswers: number[];
  studyWrongAnswers: number[];
  onboardingComplete: boolean;
};
