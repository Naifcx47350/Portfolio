export type Project = {
  slug: string;
  title: string;
  summary: string;
  description?: string;
  tech: string[];
  repo: string;
  live?: string;
  featured: boolean;
  tags?: string[];
};

export const projects: Project[] = [
  {
    slug: "terramind",
    title: "TerraMind",
    summary:
      "Full-stack agriculture AI assistant with multi-RAG retrieval, source-grounded answers, and an LLM comparison mode.",
    description:
      "A bilingual (Arabic/English) agriculture assistant for farmers and agronomy teams. Combines Product RAG (client catalog), General Agriculture RAG (trusted references), Auto-RAG routing, and a base-LLM comparison mode. Answers include cited sources, retrieval scores, and streaming responses. Supports image upload for crop context, conversation history, and a multi-container Docker setup for reproducible local deployment.",
    tech: ["React", "FastAPI", "OpenAI", "LangChain", "ChromaDB", "Docker"],
    repo: "https://github.com/Naifcx47350/TerraMind",
    featured: true,
    tags: ["LLM", "RAG", "AgriTech"]
  },
  {
    slug: "naskh",
    title: "Naskh",
    summary:
      "Human-in-the-loop document intelligence for Arabic and bilingual business documents.",
    description:
      "Turns PDFs and document photos into structured fields, editable transcription, cited source highlights, and exportable review artifacts (DOCX/JSON/CSV). AI extracts and cites; a human reviews low-confidence fields before export. Built as an honest first-pass assistant with confidence indicators and a source-linked viewer.",
    tech: ["FastAPI", "React", "Vite", "TypeScript", "ChromaDB", "Framer Motion"],
    repo: "https://github.com/Naifcx47350/Naskh",
    featured: true,
    tags: ["LLM", "Document AI", "Arabic NLP"]
  },
  {
    slug: "hafidhai",
    title: "HafidhAI",
    summary:
      "AI-powered, multi-language Quran memorization assistant built for Ayat-thon (آياتثون) 2025.",
    description:
      "A Quran memorization assistant designed with care and smart engagement, supporting multiple languages. Built for the آياتثون 2025 hackathon.",
    tech: ["Python", "AI", "NLP"],
    repo: "https://github.com/Naifcx47350/HafidhAI",
    featured: true,
    tags: ["AI", "Hackathon"]
  },
  {
    slug: "hydroai",
    title: "HydroAI",
    summary:
      "AI water-monitoring system: leak/anomaly detection, consumption forecasting, and water-quality assessment.",
    description:
      "Detects water-usage anomalies (leaks, bursts), forecasts consumption trends, and assesses water quality. Built for the Saudi Ministry of Water Hackathon using machine learning, with a Streamlit interface and a data pipeline.",
    tech: ["Python", "Scikit-learn", "Streamlit", "Pandas"],
    repo: "https://github.com/Naifcx47350/HydroAI",
    featured: true,
    tags: ["ML", "Anomaly Detection", "Hackathon"]
  },
  {
    slug: "anomaly-detection",
    title: "Financial Anomaly Detection",
    summary:
      "Autoencoder-based model that flags high-risk, unusual financial transactions.",
    tech: ["Python", "TensorFlow", "Scikit-learn"],
    repo: "https://github.com/Naifcx47350/Anomaly-detection-project",
    featured: false,
    tags: ["ML", "Anomaly Detection"]
  },
  {
    slug: "text-summarizer",
    title: "Text Summarizer",
    summary: "NLP tool that condenses long text into concise summaries.",
    tech: ["Python", "NLP"],
    repo: "https://github.com/Naifcx47350/Text-Summarizer",
    featured: false,
    tags: ["NLP"]
  },
  {
    slug: "email-gen",
    title: "Email Generator",
    summary: "LLM-assisted tool for generating professional emails.",
    tech: ["Python", "LLM"],
    repo: "https://github.com/Naifcx47350/Email-gen",
    featured: false,
    tags: ["LLM", "NLP"]
  },
  {
    slug: "library-management",
    title: "Library Management System",
    summary: "A management system for handling library records and operations.",
    tech: ["Java"],
    repo: "https://github.com/Naifcx47350/Library_Management_System",
    featured: false,
    tags: ["Software"]
  }
];
