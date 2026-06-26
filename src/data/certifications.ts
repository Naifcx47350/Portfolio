// `pdf`  → path under public/Certifaction/ (e.g. "Nvidia/my-cert.pdf")
// `image` → optional PNG scan under public/certs/ (used when no pdf is set)
export type Cert = {
  name: string;
  issuer: string;
  year: string;
  featured?: boolean;
  pdf?: string;
  image?: string;
  credentialId?: string;
  verifyUrl?: string;
};

export const certifications: Cert[] = [
  {
    name: "Certified Associate: Generative AI & LLMs (NCA-GENL)",
    issuer: "NVIDIA",
    year: "2025",
    featured: true,
    pdf: "Nvidia/NVIDIA_NCA-GENL.pdf",
  },
  {
    name: "Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
    year: "2025",
    featured: true,
    pdf: "Microsoft/Certifacte(AI-900).pdf",
  },
  {
    name: "Advanced Artificial Intelligence",
    issuer: "KAUST Academy",
    year: "2024",
    pdf: "Others/KACST.pdf",
  },
  {
    name: "HCIA-AI V3.0",
    issuer: "Huawei",
    year: "2023",
    pdf: "Others/HCIA_AI_V3.pdf",
  },
  {
    name: "AI Concepts & Advanced Applications",
    issuer: "SDAIA",
    year: "2025",
    pdf: "Sdaia/AI_Concepts_&_Advance_Application(SDAIA).pdf",
  },
  {
    name: "Building LLM Applications with Prompt Engineering",
    issuer: "NVIDIA DLI",
    year: "2025",
    pdf: "Nvidia/Nvidia_Building_LLM_Applications_With_Prompt Engineering.pdf",
  },
  {
    name: "Rapid Application Development with LLMs",
    issuer: "NVIDIA DLI",
    year: "2025",
    pdf: "Nvidia/NVIDIA_Rapid_Application_Development_with_LLMs.pdf",
  },
  {
    name: "Intro to Transformer-Based NLP",
    issuer: "NVIDIA DLI",
    year: "2025",
    pdf: "Nvidia/NVIDIA_Introduction to Transformer-Based Natural Language Processing.pdf",
  },
];
