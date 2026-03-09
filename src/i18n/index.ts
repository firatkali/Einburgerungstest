import { useCallback } from 'react';
import { de } from './de';
import { en } from './en';
import { ar } from './ar';
import { tr } from './tr';
import { ru } from './ru';
import { fa } from './fa';
import { Language } from '../types';

export type { Strings } from './de';

const strings = { de, en, ar, tr, ru, fa } as const;

const categoryKeyMap = {
  'Demokratie und Grundgesetz': 'categoryDemokratieUndGrundgesetz',
  'Geschichte Deutschlands': 'categoryGeschichteDeutschlands',
  'Institutionen und Organe': 'categoryInstitutionenUndOrgane',
  'Rechte und Pflichten': 'categoryRechteUndPflichten',
  'Europa und internationale Politik': 'categoryEuropaUndInternationalePolitik',
  'Gesellschaft und Zusammenleben': 'categoryGesellschaftUndZusammenleben',
  'Wirtschaft und Soziales': 'categoryWirtschaftUndSoziales',
} as const;

export function useTranslation(language: Language) {
  const t = useCallback(
    (key: keyof typeof de): string => strings[language][key] ?? strings['de'][key],
    [language]
  );

  const tCategory = useCallback(
    (category: string): string => {
      const key = categoryKeyMap[category as keyof typeof categoryKeyMap];
      return key ? t(key) : category;
    },
    [t]
  );

  return { t, tCategory };
}

export { de, en, ar, tr, ru, fa };
