export const sections = [
  {
    id: 'about',
    label: 'About',
    index: '00',
    title: 'Building AI that ships',
    description: null,
  },
  {
    id: 'projects',
    label: 'Projects',
    index: '01',
    title: 'Selected work',
    description:
      'End-to-end AI systems — from RAG pipelines and document intelligence to ML hackathon projects.',
    moreTitle: 'More projects',
  },
  {
    id: 'skills',
    label: 'Skills',
    index: '02',
    title: 'Tech stack',
    description: null,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    index: '03',
    title: 'Credentials',
    description: null,
  },
  {
    id: 'contact',
    label: 'Contact',
    index: '04',
    title: 'Get in touch',
    description:
      'Open to AI engineering roles, collaborations, and interesting problems. Send a message — I read every one.',
  },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export function getSection(id: SectionId) {
  return sections.find((s) => s.id === id)!;
}
