import type { Locale } from './i18n';

export type TimelineEntry = {
  year: string;
  title: string;
  org: string;
  detail?: string;
};

export const timeline: Record<Locale, TimelineEntry[]> = {
  en: [
    {
      year: '2026',
      title: 'SDA AI Engineering Bootcamp',
      org: 'Saudi Digital Academy',
      detail: 'Applied systems, deployment workflows, production-oriented delivery.',
    },
    {
      year: '2025',
      title: 'B.S. Artificial Intelligence',
      org: 'Imam Abdulrahman Bin Faisal University',
      detail: 'GPA 4.52 / 5.0 · August 2025',
    },
    {
      year: '2025',
      title: 'Hackathon projects',
      org: 'Ayat-thon, Ministry of Water & more',
      detail: 'HafidhAI, HydroAI, and rapid ML prototypes.',
    },
    {
      year: '2024',
      title: 'Advanced Artificial Intelligence',
      org: 'KAUST Academy',
    },
    {
      year: '2023',
      title: 'HCIA-AI V3.0',
      org: 'Huawei',
    },
  ],
  ar: [
    {
      year: '2026',
      title: 'معسكر SDA AI Engineering',
      org: 'الأكاديمية السعودية الرقمية',
      detail: 'أنظمة تطبيقية، سير عمل النشر، وتسليم موجه للإنتاج.',
    },
    {
      year: '2025',
      title: 'بكالوريوس الذكاء الاصطناعي',
      org: 'جامعة الإمام عبدالرحمن بن فيصل',
      detail: 'معدل 4.52 / 5.0 · أغسطس 2025',
    },
    {
      year: '2025',
      title: 'مشاركاتي في هاكثونات:',
      org: '',
      detail: '1. HafidhAI\n2. HydroAI',
    },
    {
      year: '2024',
      title: 'برنامج الذكاء الاصطناعي المتقدم',
      org: 'أكاديمية KAUST',
    },
    {
      year: '2023',
      title: 'HCIA-AI V3.0',
      org: 'Huawei',
    },
  ],
};
