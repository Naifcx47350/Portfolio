export type Cert = { name: string; issuer: string; year: string; featured?: boolean };

export const certifications: Cert[] = [
  { name: "Certified Associate: Generative AI & LLMs (NCA-GENL)", issuer: "NVIDIA", year: "2025", featured: true },
  { name: "Azure AI Fundamentals (AI-900)", issuer: "Microsoft", year: "2025", featured: true },
  { name: "Advanced Artificial Intelligence", issuer: "KAUST Academy", year: "2024" },
  { name: "HCIA-AI V3.0", issuer: "Huawei", year: "2023" },
  { name: "AI Concepts & Advanced Applications", issuer: "SDAIA", year: "2025" },
  { name: "Building LLM Applications with Prompt Engineering", issuer: "NVIDIA DLI", year: "2025" },
  { name: "Rapid Application Development with LLMs", issuer: "NVIDIA DLI", year: "2025" },
  { name: "Intro to Transformer-Based NLP", issuer: "NVIDIA DLI", year: "2025" }
];
