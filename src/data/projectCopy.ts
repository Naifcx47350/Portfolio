import type { Locale } from './i18n';
import type { Project } from './projects';

/** Arabic card/modal copy keyed by project slug. English falls back to `projects.ts`. */
const arSummaries: Record<string, string> = {
  terramind:
    'مساعد زراعي ذكاء اصطناعي متكامل، يدعم استرجاعاً متعدد الأوضاع وإجابات مستندة إلى مصادر موثوقة، مع مقارنة بين النماذج.',
  naskh: 'نظام ذكاء وثائقي يشمل الإنسان في حلقة المراجعة، مخصص للمستندات العربية وثنائية اللغة.',
  hafidhai:
    'مساعد مبني بالذكاء الاصطناعي متعدد اللغات، لحفظ القرآن الكريم وترتيله، عبر تقنيات محاكاة الصوت، تم بناؤه كمشاركة في آياتثون.',
  hydroai:
    'نظام ذكاء اصطناعي لمراقبة المياه: كشف التسربات والشذوذ، التنبؤ بالاستهلاك، وتقييم الجودة.',
  'parkinsons-blink':
    'خط أنابيب تعلم آلي متكامل لتحليل أنماط رمش العين من فيديو طبيعي للكشف المبكر عن Parkinson، منشور خلف واجهة API لمنصات طبية داخلية.',
  'anomaly-detection':
    'نموذج قائم على المشفّر التلقائي (Autoencoder) للكشف عن المعاملات المالية غير الاعتيادية عالية الخطورة.',
  'text-summarizer': 'أداة NLP لتلخيص النصوص الطويلة وتكثيفها بدقة.',
  'email-gen': 'أداة مدعومة بنموذج لغوي كبير لصياغة رسائل بريد إلكتروني احترافية.',
  'library-management': 'نظام لإدارة سجلات المكتبة وعملياتها.',
};

export function localizeProject(project: Project, locale: Locale): Project {
  if (locale !== 'ar') return project;

  const summary = arSummaries[project.slug];
  if (!summary) return project;

  return { ...project, summary, description: undefined };
}
