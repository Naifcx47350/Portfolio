export type SkillCategory = 'languages' | 'aiMl' | 'frameworks' | 'apps';

export const skills: Record<SkillCategory, string[]> = {
  languages: ['Python', 'Java', 'C/C++', 'SQL', 'JavaScript', 'TypeScript'],
  aiMl: [
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Computer Vision',
    'LLMs',
    'RAG',
    'Prompt Engineering',
    'Model Evaluation',
  ],
  frameworks: [
    'TensorFlow',
    'PyTorch',
    'Keras',
    'Scikit-learn',
    'Hugging Face',
    'LangChain',
    'Pandas',
    'NumPy',
  ],
  apps: ['FastAPI', 'React', 'ChromaDB', 'OpenAI API', 'Docker', 'Git/GitHub', 'Streamlit'],
};

export const skillCategoryOrder: SkillCategory[] = [
  'languages',
  'aiMl',
  'frameworks',
  'apps',
];
