export const CATEGORIES = [
  'Demokratie und Grundgesetz',
  'Geschichte Deutschlands',
  'Institutionen und Organe',
  'Rechte und Pflichten',
  'Europa und internationale Politik',
  'Gesellschaft und Zusammenleben',
  'Wirtschaft und Soziales',
] as const;

export type Category = (typeof CATEGORIES)[number];
