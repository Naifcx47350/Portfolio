export const sectionIds = [
  'about',
  'projects',
  'skills',
  'certifications',
  'contact',
] as const;

export type SectionId = (typeof sectionIds)[number];

export type NavLabelKey = 'about' | 'projects' | 'skills' | 'certifications' | 'contact';

export const navSections: { id: SectionId; labelKey: NavLabelKey }[] = [
  { id: 'about', labelKey: 'about' },
  { id: 'projects', labelKey: 'projects' },
  { id: 'skills', labelKey: 'skills' },
  { id: 'certifications', labelKey: 'certifications' },
  { id: 'contact', labelKey: 'contact' },
];
