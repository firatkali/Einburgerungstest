import { Question, Language } from '../types';

export function isRtlLanguage(language: Language): boolean {
  return language === 'ar' || language === 'fa';
}

export function getQuestionLanguage(language: Language): Language {
  return language;
}

function getLanguageFallbacks(language: Language): Language[] {
  return language === 'de' ? ['de', 'en'] : [language, 'en', 'de'];
}

function getQuestionTranslation(question: Question, language: Language) {
  for (const candidate of getLanguageFallbacks(language)) {
    const translated = question.translations?.[candidate];
    if (translated?.question && translated.options?.length === 4) {
      return translated;
    }

    if (candidate === 'de') {
      return { question: question.question_de, options: question.options_de };
    }

    if (candidate === 'en') {
      return { question: question.question_en, options: question.options_en };
    }
  }

  return { question: question.question_en, options: question.options_en };
}

export function getQuestionText(question: Question, language: Language): string {
  return getQuestionTranslation(question, language).question;
}

export function getQuestionOptions(question: Question, language: Language): string[] {
  return getQuestionTranslation(question, language).options;
}
