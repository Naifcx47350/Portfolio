# Cursor Mega-Prompt: Build Naif Alsahabi's AI Portfolio

> Paste this entire file into Cursor (Composer / Agent mode) as the build brief.
> It contains the full spec, the real project data, the design system, and the deployment setup.
> Build the whole site in one pass, then run the acceptance checklist at the end.

---

## 0. Role and goal

You are a senior frontend engineer and design lead. Build a single-page personal portfolio website for **Naif Alsahabi**, an AI Engineer and recent AI graduate. The site introduces him, showcases his projects with links to their repositories, lists his skills and certifications, offers a resume download, and provides a working contact path.

This is a professional reference that will be attached to a resume and shared with recruiters. It must look polished and intentional, not templated. Eye-catching, with a genuine "wow" on first load, but never noisy or gimmicky. The bar is a portfolio that could win a "Site of the Day" while still reading as a serious engineer's work.

You are running in an advanced agentic setup (capable model, multi-file Composer). Use that capacity: plan the architecture, build all files, self-review against the acceptance checklist, and iterate until it actually meets the bar. Do not stop at a minimal first pass.

Deliver a complete, production-ready Vite project that builds cleanly and deploys to GitHub Pages.

---

## 1. Tech stack (use exactly this)

- **React 18 + TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v3.4** (utility styling)
- **Framer Motion** (a.k.a. Motion) for component and scroll animation
- **GSAP** (with ScrollTrigger) for the cinematic intro sequence and any timeline-based orchestration that Framer Motion handles less cleanly
- **lucide-react** for icons
- Plain JS/TS + Canvas (or a light WebGL layer) for the ambient hero background and the live clock. Reach for raw `requestAnimationFrame` where it gives smoother control than a library.
- No backend. Static site only.
- Package manager: npm.

Rationale: this stack is fast, well-documented, and matches what Naif already uses in his Naskh project. GSAP is added specifically to make the intro sequence feel orchestrated and premium rather than a generic fade-in.

### Environment rule
Use a clean, isolated **Node.js 20** toolchain for this project. Use **nvm** if available to pin the version, otherwise system Node 20+.

```bash
nvm install 20 && nvm use 20   # if nvm is available
node -v                        # confirm v20+
```

Do all `npm install`, `npm run dev`, and `npm run build` work with this toolchain. Document the Node version requirement in the README.

---

## 2. Design system (follow precisely; do not substitute the generic dark-portfolio look)

**Direction:** Elegant minimal. Deep black base, restrained ember-red accents used as punctuation, never as fill. Bold and modern, but disciplined. Spend boldness in ONE signature element (see below); keep everything else quiet.

### Color tokens (dark mode = default)
Define these as CSS variables and Tailwind theme extensions. Use layered near-blacks for depth instead of one flat black.

```
--bg-base:      #0A0A0B   /* page background, near-black */
--bg-surface:   #121214   /* cards / raised surfaces */
--bg-elevated:  #1A1A1D   /* hover / elevated surfaces */
--border:       #26262B   /* hairline borders */
--text-primary: #F5F5F4   /* headings, high emphasis */
--text-muted:   #A1A1A6   /* body, secondary */
--accent:       #E0322B   /* ember red, used sparingly */
--accent-soft:  #7A1714   /* deep red for glows/gradients */
--accent-glow:  rgba(224, 50, 43, 0.14)  /* subtle red haze */
```

### Light mode (provide a clean, premium light theme; toggle persists in localStorage)
```
--bg-base:      #FAFAF9
--bg-surface:   #FFFFFF
--bg-elevated:  #F4F4F2
--border:       #E4E4E1
--text-primary: #111112
--text-muted:   #5A5A5E
--accent:       #C42820   /* slightly deeper red for contrast on light */
--accent-soft:  #E0322B
--accent-glow:  rgba(196, 40, 32, 0.10)
```

Implement theme via a `data-theme` attribute on `<html>` and CSS variables, with a toggle button. Default to dark. Respect `prefers-color-scheme` on first visit, then remember the user's choice.

### Typography
- **Display / headings:** a characterful but professional face. Use **Space Grotesk** (or **Sora** as alternative) for headings and the name. Tight tracking on large sizes.
- **Body / UI:** **Inter** for paragraphs and labels.
- **Mono / data:** **JetBrains Mono** for tech tags, section numbers, and small captions.
- Load via `@fontsource` packages (offline-safe, no FOUT from external CDN) or Google Fonts with `display=swap`.
- Set a clear type scale. Make the hero name large and confident. Use the mono face for small eyebrow labels and tech chips so they read as "data."

### Signature element (the one memorable thing)
A **cinematic intro sequence on first load**, followed by an **ambient reactive hero background**:

- **Intro (first visit per session):** a short (about 1.6 to 2.2s) orchestrated GSAP timeline. The screen starts near-black; a thin red line draws across, the name assembles (mask/clip reveal, not a plain fade), the role line and tagline stagger up, and the page "settles" into the hero. Skippable on click/scroll and on `prefers-reduced-motion` (instant settle). Do not replay on every navigation; gate it with `sessionStorage`.
- **Ambient hero background:** a faint dot/line grid in `--border` with a soft red radial glow (`--accent-glow`) that drifts slowly, plus a few-pixel cursor parallax. Canvas-rendered for smoothness, GPU-light, paused when offscreen and under reduced motion. This is the one effect that runs continuously, and it stays calm.

Everything else animates only on load or scroll. Spend the boldness here; keep the rest disciplined.

### Professional touches (include these; keep them tasteful, not busy)
- **Live local clock** in the nav or hero corner showing Riyadh time (Asia/Riyadh), updating each second, in the mono face. Small, quiet, a sign of craft.
- **Scroll progress indicator**: a thin accent line at the very top tracking page scroll.
- **Active-section nav highlight** driven by scroll position (IntersectionObserver).
- **Animated section eyebrows** (`01 — Projects` etc.) that reveal on scroll.
- **Subtle magnetic hover** on primary buttons and social icons (a few pixels of pull toward the cursor). Use sparingly: CTA and socials only.
- **Tasteful count-up** on any single headline stat if one is used (do not invent metrics; only animate real values from the data files).
- **Custom focus ring** in the accent color, and a refined custom text-selection color.

These should add up to "crafted," not "carnival." If any single touch starts competing with the content, dial it back.

### Motion rules
- Hero: the GSAP intro timeline described above, then settle.
- Sections: scroll-triggered reveal (fade + 16px rise) via Framer Motion `whileInView` or GSAP ScrollTrigger, once per element.
- Cards: quiet hover micro-interactions (border brightens to accent, slight lift, red glow blooms softly). No flips, no bounce.
- Respect `prefers-reduced-motion`: disable the intro, ambient drift, parallax, and magnetic hover; reduce reveals to instant fades. The clock and scroll indicator remain (no motion sickness risk).
- Do not scatter effects everywhere. Restraint is the brief.

---

## 3. Site structure (single page, smooth-scroll nav)

Fixed/sticky top nav with anchor links and the theme toggle. Sections in order:

1. **Hero** — name, role line (e.g. "AI Engineer / Machine Learning, LLMs, Computer Vision"), one-sentence value tagline, primary CTA ("View Projects") + secondary ("Download Resume"), social icons (GitHub, LinkedIn, Email). Signature grid/glow behind it.
2. **About** — 2 short paragraphs from `profile.ts`. Education + bootcamp callout. Keep it tight.
3. **Projects** — featured projects in a prominent layout (large cards), then the remaining projects in a compact grid. Each card: title, one-line summary, tech tags (mono chips), and links (Repo, and Live if present). Pull everything from `projects.ts`. Featured flag controls placement.
4. **Skills / Tech Stack** — grouped (Languages, AI/ML, Frameworks & Tools, Deployment) from `skills.ts`. Clean chip or grid layout, not a progress-bar cliche.
5. **Certifications** — from `certifications.ts`. Compact list/grid with issuer + year. Headline the NVIDIA NCA-GENL and Azure AI-900.
6. **Contact** — short invite line + a working form (see §6) + direct email/LinkedIn fallback.
7. **Footer** — name, year, "Built with React + Vite", quick links.

Add a tasteful section eyebrow system using the mono face and a small index (e.g. `01 — Projects`) ONLY because the page is a real ordered walkthrough; keep it subtle.

---

## 4. Single source of truth: data files

All editable content lives in `src/data/`. Naif edits ONLY these files to update the whole site. Do not hardcode content in components.

Create these files with the exact content below. Where a value is marked `// VERIFY`, leave it as written but add the comment so Naif can confirm.

### `src/data/profile.ts`
```ts
export const profile = {
  name: "Naif Alsahabi",
  fullName: "Naif Khalid Alsahabi",
  role: "AI Engineer",
  roleLine: "Machine Learning  ·  LLMs & RAG  ·  Computer Vision  ·  NLP",
  tagline:
    "I build end-to-end AI systems, from retrieval pipelines and LLM apps to deployment, with a focus on real-world, bilingual (Arabic/English) products.",
  location: "Riyadh, Saudi Arabia",
  email: "PNaif4735@gmail.com",
  resumeUrl: "/resume.pdf", // place the PDF in /public/resume.pdf
  about: [
    "I'm an Artificial Intelligence graduate from Imam Abdulrahman Bin Faisal University. My work focuses on turning models, data, and ideas into working tools: LLM and RAG applications, computer vision systems, NLP pipelines, and data-driven dashboards.",
    "I'm currently sharpening my AI engineering through the SDA AI Engineering bootcamp, with more focus on applied systems, deployment workflows, and production-oriented delivery. I enjoy building things that can actually be tested, shipped, and used."
  ],
  education: {
    degree: "B.S. in Artificial Intelligence",
    school: "Imam Abdulrahman Bin Faisal University (IAU)",
    gpa: "4.52 / 5.0",
    graduated: "August 2025",
    bootcamp: "SDA AI Engineering Bootcamp (Saudi Digital Academy), 2026"
  }
};

export const socials = {
  github: "https://github.com/Naifcx47350",
  linkedin: "https://www.linkedin.com/in/naif-alsahabi-085720249/",
  email: "mailto:PNaif4735@gmail.com"
};
```

### `src/data/projects.ts`
```ts
export type Project = {
  slug: string;
  title: string;
  summary: string;          // one line, shown on the card
  description?: string;     // optional longer text
  tech: string[];
  repo: string;
  live?: string;            // optional deployed URL; omit if none
  featured: boolean;
  tags?: string[];          // e.g. ["AI", "RAG", "Hackathon"]
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
    tech: ["Python", "AI", "NLP"], // VERIFY exact stack from repo
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
    tech: ["Python", "Scikit-learn", "Streamlit", "Pandas"], // VERIFY
    repo: "https://github.com/Naifcx47350/HydroAI",
    featured: true,
    tags: ["ML", "Anomaly Detection", "Hackathon"]
  },
  {
    slug: "anomaly-detection",
    title: "Financial Anomaly Detection",
    summary:
      "Autoencoder-based model that flags high-risk, unusual financial transactions.",
    tech: ["Python", "TensorFlow", "Scikit-learn"], // VERIFY
    repo: "https://github.com/Naifcx47350/Anomaly-detection-project",
    featured: false,
    tags: ["ML", "Anomaly Detection"]
  },
  {
    slug: "text-summarizer",
    title: "Text Summarizer",
    summary: "NLP tool that condenses long text into concise summaries.", // VERIFY description
    tech: ["Python", "NLP"], // VERIFY
    repo: "https://github.com/Naifcx47350/Text-Summarizer",
    featured: false,
    tags: ["NLP"]
  },
  {
    slug: "email-gen",
    title: "Email Generator",
    summary: "LLM-assisted tool for generating professional emails.", // VERIFY description
    tech: ["Python", "LLM"], // VERIFY
    repo: "https://github.com/Naifcx47350/Email-gen",
    featured: false,
    tags: ["LLM", "NLP"]
  },
  {
    slug: "library-management",
    title: "Library Management System",
    summary: "A management system for handling library records and operations.", // VERIFY description
    tech: ["Java"], // VERIFY
    repo: "https://github.com/Naifcx47350/Library_Management_System",
    featured: false,
    tags: ["Software"]
  }
];
```

> Note for Naif: the `// VERIFY` lines are my best inference from repo names/metadata. Open each repo, confirm the stack and one-line summary, and correct before publishing. Do not ship unverified claims.

### `src/data/skills.ts`
```ts
export const skills = {
  "Languages": ["Python", "Java", "C/C++", "SQL", "JavaScript", "TypeScript"],
  "AI / ML": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "LLMs", "RAG", "Prompt Engineering", "Model Evaluation"],
  "Frameworks & Libraries": ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Hugging Face", "LangChain", "Pandas", "NumPy"],
  "Apps & Deployment": ["FastAPI", "React", "ChromaDB", "OpenAI API", "Docker", "Git/GitHub", "Streamlit"]
};
```

### `src/data/certifications.ts`
```ts
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
```

---

## 5. File / folder structure

```
portfolio/
├─ public/
│  ├─ resume.pdf            // Naif drops his CV here
│  └─ favicon.svg
├─ src/
│  ├─ data/                 // single source of truth (above)
│  │  ├─ profile.ts
│  │  ├─ projects.ts
│  │  ├─ skills.ts
│  │  └─ certifications.ts
│  ├─ components/
│  │  ├─ Nav.tsx
│  │  ├─ IntroSequence.tsx    // GSAP cinematic intro (session-gated)
│  │  ├─ Hero.tsx
│  │  ├─ HeroBackground.tsx   // ambient canvas grid/glow (signature)
│  │  ├─ LiveClock.tsx        // Riyadh time, updates each second
│  │  ├─ ScrollProgress.tsx   // top scroll indicator
│  │  ├─ About.tsx
│  │  ├─ Projects.tsx
│  │  ├─ ProjectCard.tsx
│  │  ├─ Skills.tsx
│  │  ├─ Certifications.tsx
│  │  ├─ Contact.tsx
│  │  ├─ Footer.tsx
│  │  └─ ThemeToggle.tsx
│  ├─ hooks/
│  │  ├─ useTheme.ts
│  │  ├─ useReducedMotion.ts
│  │  ├─ useActiveSection.ts  // IntersectionObserver nav highlight
│  │  └─ useMagnetic.ts       // magnetic hover for CTA/socials
│  ├─ lib/
│  │  └─ animations.ts        // shared GSAP/Framer variants & timings
│  ├─ styles/
│  │  └─ index.css          // Tailwind + CSS variables for both themes
│  ├─ App.tsx
│  └─ main.tsx
├─ .github/workflows/deploy.yml
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## 6. Contact form (static-site constraint)

GitHub Pages cannot process form submissions server-side. Implement the form with **Formspree** (free tier):

- POST the form to `https://formspree.io/f/{FORM_ID}`.
- Put `{FORM_ID}` in a single constant at the top of `Contact.tsx` with a clear comment so Naif can paste his own.
- Show inline success and error states in the interface's own voice (no apologies, no vague errors).
- Always include a direct fallback below the form: a `mailto:` link and the LinkedIn link, so the page works even if the form key isn't set.

---

## 7. GitHub Pages deployment

Decide base path based on the repo name and tell Naif which he picked:

- If the repo is named **`Naifcx47350.github.io`** → site serves at the root, set `base: '/'` in `vite.config.ts`. (Clean URL: `naifcx47350.github.io`.) **Recommended.**
- If the repo is named anything else (e.g. `portfolio`) → site serves under a subpath, set `base: '/<repo-name>/'`. (URL: `naifcx47350.github.io/<repo-name>`.)

Add a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys to Pages:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

In the README, include the one-time setup step: GitHub repo → Settings → Pages → Source: "GitHub Actions". Also add a SPA-safe note: since this is a single page with anchors (no client routing), no 404 redirect hack is needed.

Confirm the official Vite static-deploy guidance while wiring this: https://vitejs.dev/guide/static-deploy.html

---

## 8. Quality floor (non-negotiable)

- Fully responsive, mobile-first; test down to ~360px width.
- Visible keyboard focus states on every interactive element.
- `prefers-reduced-motion` respected (ambient motion off, reveals become instant).
- Semantic HTML, proper heading order, `alt` text, aria labels on icon-only buttons.
- Lighthouse: aim for 95+ on Performance and Accessibility.
- No console errors. `npm run build` passes with no type errors.
- Lazy-load anything heavy; keep the bundle lean.
- All external links `target="_blank" rel="noopener noreferrer"`.

---

## 9. Reference material (consult these while building)

- Vite static deploy (GitHub Pages base path + Actions): https://vitejs.dev/guide/static-deploy.html
- Tailwind CSS docs: https://tailwindcss.com/docs
- Framer Motion / Motion docs (scroll reveals, `whileInView`, reduced motion): https://motion.dev/docs
- GSAP docs (timelines + ScrollTrigger for the intro and orchestration): https://gsap.com/docs/v3/
- React docs: https://react.dev
- Formspree (static form handling): https://formspree.io/
- Fontsource (self-hosted fonts): https://fontsource.org/
- Portfolio craft reference (structure/polish, do NOT clone the look): https://brittanychiang.com/

For visual inspiration on disciplined dark UI, search Awwwards and Godly for "dark minimal portfolio", but derive the actual design from the token system in §2. Do not reproduce any specific site.

---

## 10. Build order

1. Confirm Node 20+ (use nvm to pin if available).
2. Scaffold Vite + React + TS. Install Tailwind v3.4, Framer Motion, GSAP, lucide-react, fonts.
3. Wire CSS variables + both themes + `useTheme` + `useReducedMotion` + toggle.
4. Create all `src/data/*` files with the content in section 4.
5. Build layout shell: Nav (with LiveClock + ScrollProgress + active-section highlight) + section scaffolding + Footer.
6. Build the GSAP IntroSequence (session-gated, skippable, reduced-motion aware).
7. Build Hero + HeroBackground (ambient canvas signature) with the post-intro settle.
8. Build Projects (featured layout + compact grid) and ProjectCard from data, with magnetic-hover CTAs.
9. Build About, Skills, Certifications with scroll-reveal eyebrows.
10. Build Contact (Formspree + mailto/LinkedIn fallback).
11. Polish: scroll reveals, hover states, responsive passes, reduced-motion, custom focus + selection.
12. Add `deploy.yml`, set `base`, write README (including the conda setup). Run the acceptance checklist and iterate.

---

## 11. Acceptance checklist (run before declaring done)

- [ ] Built and run on Node 20+; README documents the version requirement.
- [ ] `npm run dev` runs with no errors; `npm run build` passes with no type errors.
- [ ] All content comes from `src/data/*`; nothing hardcoded in components.
- [ ] Intro sequence plays once per session, is skippable, and is replaced by an instant settle under reduced motion.
- [ ] Live Riyadh clock updates each second; scroll progress and active-section highlight work.
- [ ] Dark and light themes both look intentional; toggle persists across reload.
- [ ] Every project shows correct title, summary, tech tags, and a working Repo link; Live link only where provided.
- [ ] Hero ambient background is calm, performant, paused offscreen, and disabled under reduced motion.
- [ ] Magnetic hover limited to CTA/socials; never on body text or cards.
- [ ] Responsive at 360px, 768px, 1280px. No overflow, no broken layout.
- [ ] Keyboard navigation works; custom accent focus ring visible everywhere.
- [ ] Contact form posts to Formspree placeholder and shows success/error; mailto + LinkedIn fallback present.
- [ ] `deploy.yml` present; `base` set correctly for the chosen repo name; README explains the one-time Pages setting.
- [ ] No console errors. Lighthouse Accessibility 95+, Performance 90+ despite the animation layer.

---

## 12. README for the repo (generate this too)

Write a clean `README.md` for the portfolio repo containing: a one-line description, a screenshot placeholder, the tech stack, "Edit your content" instructions pointing ONLY to `src/data/*` and `public/resume.pdf`, local dev commands, and the GitHub Pages deploy steps. Keep it concise and professional.
