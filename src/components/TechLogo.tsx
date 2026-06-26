import {
  Brain,
  Database,
  Eye,
  GitBranch,
  Layers,
  MessageSquareText,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { siHuggingface, siKeras, siLangchain } from 'simple-icons';
import { OPENAI } from './TechIcon';

import pythonLogo from 'devicon/icons/python/python-original.svg';
import javascriptLogo from 'devicon/icons/javascript/javascript-original.svg';
import typescriptLogo from 'devicon/icons/typescript/typescript-original.svg';
import javaLogo from 'devicon/icons/java/java-original.svg';
import cplusplusLogo from 'devicon/icons/cplusplus/cplusplus-original.svg';
import tensorflowLogo from 'devicon/icons/tensorflow/tensorflow-original.svg';
import pytorchLogo from 'devicon/icons/pytorch/pytorch-original.svg';
import scikitlearnLogo from 'devicon/icons/scikitlearn/scikitlearn-original.svg';
import pandasLogo from 'devicon/icons/pandas/pandas-original.svg';
import numpyLogo from 'devicon/icons/numpy/numpy-original.svg';
import fastapiLogo from 'devicon/icons/fastapi/fastapi-original.svg';
import reactLogo from 'devicon/icons/react/react-original.svg';
import dockerLogo from 'devicon/icons/docker/docker-original.svg';
import gitLogo from 'devicon/icons/git/git-original.svg';
import streamlitLogo from 'devicon/icons/streamlit/streamlit-original.svg';

type SimpleIcon = { path: string; hex: string };

const deviconMap: Record<string, string> = {
  Python: pythonLogo,
  JavaScript: javascriptLogo,
  TypeScript: typescriptLogo,
  Java: javaLogo,
  'C/C++': cplusplusLogo,
  TensorFlow: tensorflowLogo,
  PyTorch: pytorchLogo,
  'Scikit-learn': scikitlearnLogo,
  Pandas: pandasLogo,
  NumPy: numpyLogo,
  FastAPI: fastapiLogo,
  React: reactLogo,
  Docker: dockerLogo,
  'Git/GitHub': gitLogo,
  Streamlit: streamlitLogo,
};

const simpleMap: Record<string, SimpleIcon> = {
  Keras: siKeras,
  'Hugging Face': siHuggingface,
  LangChain: siLangchain,
  'OpenAI API': { path: OPENAI.path, hex: `#${OPENAI.hex}` },
};

// Concepts have no brand mark — pair with a neutral glyph instead of faking a logo.
const conceptMap: Record<string, LucideIcon> = {
  'Machine Learning': Brain,
  'Deep Learning': Layers,
  NLP: MessageSquareText,
  'Computer Vision': Eye,
  LLMs: Sparkles,
  RAG: GitBranch,
  'Prompt Engineering': MessageSquareText,
  'Model Evaluation': Brain,
  SQL: Database,
  ChromaDB: Database,
};

interface TechLogoProps {
  name: string;
  size?: number;
}

export function TechLogo({ name, size = 40 }: TechLogoProps) {
  const devicon = deviconMap[name];
  if (devicon) {
    return (
      <img
        src={devicon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="tech-logo"
        style={{ objectFit: 'contain' }}
      />
    );
  }

  const simple = simpleMap[name];
  if (simple) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={simple.hex}
        aria-hidden="true"
        className="tech-logo"
      >
        <path d={simple.path} />
      </svg>
    );
  }

  const Concept = conceptMap[name];
  if (Concept) {
    return <Concept size={Math.round(size * 0.62)} strokeWidth={1.6} aria-hidden="true" className="tech-concept" />;
  }

  return <span className="font-mono text-sm text-muted">{name.slice(0, 2)}</span>;
}
