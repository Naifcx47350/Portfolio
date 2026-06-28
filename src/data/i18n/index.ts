export type Locale = 'en' | 'ar';

export type TranslationKeys = typeof en;

const en = {
  nav: {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
    contact: 'Contact',
    toggleTheme: 'Toggle theme',
    toggleLocale: 'Switch language',
  },
  intro: {
    skipHint: 'Click anywhere to skip',
  },
  hero: {
    viewProjects: 'View Projects',
    downloadResume: 'Download Resume',
  },
  about: {
    index: '00',
    label: 'About',
    title: 'Building AI that ships',
    education: 'Education',
    degree: 'Degree',
    university: 'University',
    gpa: 'GPA',
    graduated: 'Graduated',
    current: 'Current',
    timelineTitle: 'Experience & milestones',
    focusTitle: 'Focus areas',
    location: 'Based in',
  },
  projects: {
    index: '01',
    label: 'Projects',
    title: 'Selected work',
    description:
      'End-to-end AI systems — from RAG pipelines and document intelligence to ML hackathon projects.',
    moreTitle: 'More projects',
    clickDetails: 'Click for details',
    viewRepo: 'View repository',
    openLive: 'Open live demo',
    confidentialBadge: 'KACST Internal',
    confidentialNote: 'Confidential',
    confidentialDisclaimer: 'Early-stage previews only. Full system is internal to KACST.',
    closePreview: 'Close preview',
  },
  skills: {
    index: '02',
    label: 'Skills',
    title: 'Tech stack',
    categories: {
      languages: 'Languages',
      aiMl: 'AI / ML',
      frameworks: 'Frameworks & Libraries',
      apps: 'Apps & Deployment',
    },
    selectHint: 'Select a technology to see how I use it.',
  },
  certifications: {
    index: '03',
    label: 'Certifications',
    title: 'Credentials',
    clickDetails: 'Click for details',
    issuer: 'Issuer',
    year: 'Year',
    credentialId: 'Credential ID',
    openPdf: 'Open PDF in new tab',
    verify: 'Verify credential',
    close: 'Close preview',
    loadingPreview: 'Loading preview…',
  },
  contact: {
    index: '04',
    label: 'Contact',
    title: 'Get in touch',
    description:
      'Open to AI engineering roles, collaborations, and interesting problems. Send a message — I read every one.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
  },
  footer: {
    copyright: 'All rights reserved.',
  },
  profile: {
    name: 'Naif Alsahabi',
    role: 'AI Engineer',
    roleLine: 'Machine Learning  ·  LLMs & RAG  ·  Computer Vision  ·  NLP',
    tagline:
      'I build end-to-end AI systems, from retrieval pipelines and LLM apps to deployment, with a focus on real-world, bilingual (Arabic/English) products.',
    location: 'Riyadh, Saudi Arabia',
    focusAreas: ['Machine Learning', 'LLMs & RAG', 'Computer Vision', 'NLP'],
    about: [
      "I'm an Artificial Intelligence graduate from Imam Abdulrahman Bin Faisal University. My work focuses on turning models, data, and ideas into working tools: LLM and RAG applications, computer vision systems, NLP pipelines, and data-driven dashboards.",
      "I'm currently sharpening my AI engineering through the SDA AI Engineering bootcamp, with more focus on applied systems, deployment workflows, and production-oriented delivery. I enjoy building things that can actually be tested, shipped, and used.",
    ],
    education: {
      degree: 'B.S. in Artificial Intelligence',
      school: 'Imam Abdulrahman Bin Faisal University (IAU)',
      bootcamp: 'SDA AI Engineering Bootcamp (Saudi Digital Academy), 2026',
      graduated: 'August 2025',
    },
    contact: {
      successMessage: "Message sent. I'll get back to you soon.",
      errorMessage: "Couldn't send right now. Use email or LinkedIn below.",
      fallbackLabel: 'Prefer direct contact?',
    },
  },
};

const ar: TranslationKeys = {
  nav: {
    about: 'نبذة',
    projects: 'المشاريع',
    skills: 'المهارات',
    certifications: 'الشهادات',
    contact: 'تواصل',
    toggleTheme: 'تبديل المظهر',
    toggleLocale: 'تغيير اللغة',
  },
  intro: {
    skipHint: 'انقر في أي مكان للتخطي',
  },
  hero: {
    viewProjects: 'عرض المشاريع',
    downloadResume: 'تحميل السيرة الذاتية',
  },
  about: {
    index: '00',
    label: 'نبذة',
    title: 'أبني أنظمة ذكاء اصطناعي تصل إلى الإنتاج',
    education: 'التعليم',
    degree: 'الدرجة',
    university: 'الجامعة',
    gpa: 'المعدل',
    graduated: 'التخرج',
    current: 'حالياً',
    timelineTitle: 'المسار والمحطات',
    focusTitle: 'Focus areas',
    location: 'الموقع',
  },
  projects: {
    index: '01',
    label: 'المشاريع',
    title: 'أعمال مختارة',
    description:
      'أنظمة ذكاء اصطناعي متكاملة: من خطوط RAG وذكاء المستندات إلى مشاريع هاكاثون في تعلم الآلة.',
    moreTitle: 'مشاريع أخرى',
    clickDetails: 'اضغط للتفاصيل',
    viewRepo: 'عرض المستودع',
    openLive: 'فتح العرض المباشر',
    confidentialBadge: 'KACST داخلي',
    confidentialNote: 'سري',
    confidentialDisclaimer: 'معاينات مبكرة فقط. النظام الكامل داخلي لدى KACST.',
    closePreview: 'إغلاق المعاينة',
  },
  skills: {
    index: '02',
    label: 'المهارات',
    title: 'التقنيات',
    categories: {
      languages: 'لغات البرمجة',
      aiMl: 'الذكاء الاصطناعي / تعلم الآلة',
      frameworks: 'الأطر والمكتبات',
      apps: 'التطبيقات والنشر',
    },
    selectHint: 'اختر تقنية لمعرفة كيف أستخدمها.',
  },
  certifications: {
    index: '03',
    label: 'الشهادات',
    title: 'الاعتمادات',
    clickDetails: 'اضغط للتفاصيل',
    issuer: 'الجهة المانحة',
    year: 'السنة',
    credentialId: 'رقم الاعتماد',
    openPdf: 'فتح PDF في تبويب جديد',
    verify: 'التحقق من الشهادة',
    close: 'إغلاق المعاينة',
    loadingPreview: 'جاري تحميل المعاينة…',
  },
  contact: {
    index: '04',
    label: 'تواصل',
    title: 'تواصل معي',
    description:
      'متاح لفرص هندسة الذكاء الاصطناعي، والتعاون، والمسائل التقنية المثيرة للاهتمام. أرسل رسالة؛ أقرأ كل واحدة.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    message: 'الرسالة',
    send: 'إرسال الرسالة',
    sending: 'جاري الإرسال…',
  },
  footer: {
    copyright: 'جميع الحقوق محفوظة.',
  },
  profile: {
    name: 'نايف الصحبي',
    role: 'مهندس ذكاء اصطناعي',
    roleLine: 'Machine Learning  ·  LLMs & RAG  ·  Computer Vision  ·  NLP',
    tagline:
      'أبني أنظمة ذكاء اصطناعي متكاملة، من خطوط الاسترجاع وتطبيقات LLM حتى النشر، مع تركيز على منتجات ثنائية اللغة (عربي/إنجليزي) قابلة للاستخدام الفعلي.',
    location: 'الرياض، المملكة العربية السعودية',
    focusAreas: ['Machine Learning', 'LLMs & RAG', 'Computer Vision', 'NLP'],
    about: [
      'أنا خريج ذكاء اصطناعي من جامعة الإمام عبدالرحمن بن فيصل. أركز في عملي على تحويل النماذج والبيانات إلى أدوات حقيقية: تطبيقات LLM وRAG، أنظمة رؤية حاسوبية، خطوط معالجة NLP، ولوحات بيانات تفاعلية.',
      'أطوّر مهاراتي حالياً في معسكر SDA AI Engineering بالأكاديمية السعودية الرقمية، مع تركيز أكبر على الأنظمة التطبيقية، وسير عمل النشر، والتسليم الجاهز للإنتاج. أستمتع ببناء ما يمكن اختباره وإطلاقه واستخدامه فعلياً.',
    ],
    education: {
      degree: 'بكالوريوس في الذكاء الاصطناعي',
      school: 'جامعة الإمام عبدالرحمن بن فيصل (IAU)',
      bootcamp: 'معسكر SDA AI Engineering، الأكاديمية السعودية الرقمية 2026',
      graduated: 'أغسطس 2025',
    },
    contact: {
      successMessage: 'تم إرسال رسالتك. سأرد عليك قريباً.',
      errorMessage: 'تعذّر الإرسال الآن. يمكنك التواصل عبر البريد أو LinkedIn أدناه.',
      fallbackLabel: 'تفضّل التواصل المباشر؟',
    },
  },
};

export const translations: Record<Locale, TranslationKeys> = { en, ar };

export function getT(locale: Locale): TranslationKeys {
  return translations[locale];
}
