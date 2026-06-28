// `icon` maps to a domain glyph in ProjectBanner (see iconMap there).
// `image` → path under public/ (e.g. "Screenshots/TerraMind/TerraMind1.png")
export type ProjectIcon =
  | 'sprout'
  | 'droplet'
  | 'scan-text'
  | 'book-open'
  | 'activity'
  | 'align-left'
  | 'mail'
  | 'library';

export type Project = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  description?: string;
  tech: string[];
  repo?: string;
  live?: string;
  featured: boolean;
  tags?: string[];
  icon: ProjectIcon;
  /** Single path or gallery under public/ (e.g. "Screenshots/TerraMind/TerraMind1.png"). */
  image?: string | string[];
  /** Omit repo/live links; show KACST confidential badge instead. */
  confidential?: boolean;
};

export function projectImages(project: Project): string[] {
  if (!project.image) return [];
  return Array.isArray(project.image) ? project.image : [project.image];
}

export const projects: Project[] = [
  {
    slug: "terramind",
    title: "TerraMind",
    year: "2026",
    summary:
      "Full-stack agriculture AI assistant with multi-RAG retrieval, source-grounded answers, and an LLM comparison mode.",
    description:
      "A bilingual (Arabic/English) agriculture assistant for farmers and agronomy teams. Combines Product RAG (client catalog), General Agriculture RAG (trusted references), Auto-RAG routing, and a base-LLM comparison mode. Answers include cited sources, retrieval scores, and streaming responses. Supports image upload for crop context, conversation history, and a multi-container Docker setup for reproducible local deployment.",
    tech: ["React", "FastAPI", "OpenAI", "LangChain", "ChromaDB", "Docker"],
    repo: "https://github.com/Naifcx47350/TerraMind",
    featured: true,
    tags: ["LLM", "RAG", "AgriTech"],
    icon: "sprout",
    image: "Screenshots/TerraMind/TerraMind1.png"
  },
  {
    slug: "naskh",
    title: "Naskh",
    year: "2026",
    summary:
      "Human-in-the-loop document intelligence for Arabic and bilingual business documents.",
    description:
      "Turns PDFs and document photos into structured fields, editable transcription, cited source highlights, and exportable review artifacts (DOCX/JSON/CSV). AI extracts and cites; a human reviews low-confidence fields before export. Built as an honest first-pass assistant with confidence indicators and a source-linked viewer.",
    tech: ["FastAPI", "React", "Vite", "TypeScript", "ChromaDB", "Framer Motion"],
    repo: "https://github.com/Naifcx47350/Naskh",
    featured: true,
    tags: ["LLM", "Document AI", "Arabic NLP"],
    icon: "scan-text",
    image: "Screenshots/Naskh/Naskh1.png"
  },
  {
    slug: "hafidhai",
    title: "HafidhAI",
    year: "2025",
    summary:
      "AI-powered, multi-language Quran memorization assistant built for Ayat-thon (آياتثون) 2025.",
    description:
      "A Quran memorization assistant designed with care and smart engagement, supporting multiple languages. Built for the آياتثون 2025 hackathon.",
    tech: ["Python", "AI", "NLP"],
    repo: "https://github.com/Naifcx47350/HafidhAI",
    featured: true,
    tags: ["AI", "Hackathon"],
    icon: "book-open",
    image: "Screenshots/HafidhAI/image.png"
  },
  {
    slug: "hydroai",
    title: "HydroAI",
    year: "2025",
    summary:
      "AI water-monitoring system: leak/anomaly detection, consumption forecasting, and water-quality assessment.",
    description:
      "Detects water-usage anomalies (leaks, bursts), forecasts consumption trends, and assesses water quality. Built for the Saudi Ministry of Water Hackathon using machine learning, with a Streamlit interface and a data pipeline.",
    tech: ["Python", "Scikit-learn", "Streamlit", "Pandas"],
    repo: "https://github.com/Naifcx47350/HydroAI",
    featured: true,
    tags: ["ML", "Anomaly Detection", "Hackathon"],
    icon: "droplet",
    image: "Screenshots/HydroAI/image.png"
  },
  {
    slug: "parkinsons-blink",
    title: "Camera-Based Eye-Blink Assessment for Parkinson's Screening",
    year: "2025",
    summary:
      "End-to-end ML pipeline analyzing eye-blink patterns from natural video for early Parkinson's screening, deployed behind an API for internal medical platforms.",
    description:
      "Built a leak-proof ML pipeline with patient-aware splits, preprocessing, feature selection, and calibration. Extracted video features using MediaPipe Face Mesh and OpenFace 2.2.0 into a unified schema, integrated the YouTubePD dataset, and engineered a top-20 hybrid feature set. Trained and validated SVM, XGBoost, and MLP models, finalizing a calibrated MLP (F1 0.580, AUROC 0.816, Accuracy 0.845). Deployed the full pipeline behind an API with strict JSON I/O contracts, plus complete documentation: feature dictionary, validation protocol, model release notes, and deployment runbook.",
    tech: ["Python", "Scikit-learn", "MediaPipe", "OpenFace", "OpenCV", "Pandas", "FastAPI"],
    featured: false,
    tags: ["Medical AI", "Computer Vision", "ML"],
    icon: "activity",
    image: ["Screenshots/Parkinsons/Parkinsons_1.png"],
    confidential: true,
  },
  {
    slug: "anomaly-detection",
    title: "Financial Anomaly Detection",
    year: "2024",
    summary:
      "Autoencoder-based model that flags high-risk, unusual financial transactions.",
    tech: ["Python", "TensorFlow", "Scikit-learn"],
    repo: "https://github.com/Naifcx47350/Anomaly-detection-project",
    featured: false,
    tags: ["ML", "Anomaly Detection"],
    icon: "activity"
  },
  {
    slug: "text-summarizer",
    title: "Text Summarizer",
    year: "2024",
    summary: "NLP tool that condenses long text into concise summaries.",
    tech: ["Python", "NLP"],
    repo: "https://github.com/Naifcx47350/Text-Summarizer",
    featured: false,
    tags: ["NLP"],
    icon: "align-left"
  },
  {
    slug: "email-gen",
    title: "Email Generator",
    year: "2024",
    summary: "LLM-assisted tool for generating professional emails.",
    tech: ["Python", "LLM"],
    repo: "https://github.com/Naifcx47350/Email-gen",
    live: "https://email-gen-nc4.streamlit.app",
    featured: false,
    tags: ["LLM", "NLP"],
    icon: "mail"
  },
  {
    slug: "library-management",
    title: "Library Management System",
    year: "2024",
    summary: "A management system for handling library records and operations.",
    tech: ["Java"],
    repo: "https://github.com/Naifcx47350/Library_Management_System",
    featured: false,
    tags: ["Software"],
    icon: "library"
  }
];
