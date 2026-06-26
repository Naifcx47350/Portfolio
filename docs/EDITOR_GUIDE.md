# Editor Guide

Reference for updating portfolio content. Line numbers may shift — search by file or field name.

---

## Quick map

| Content | File |
|---------|------|
| Profile, bio, education, socials | `src/data/profile.ts` |
| Section titles & UI text (EN + AR) | `src/data/i18n/index.ts` |
| Nav order & section anchors | `src/data/sections.ts` |
| Projects | `src/data/projects.ts` |
| Skill groups | `src/data/skills.ts` |
| Skill descriptions (constellation tap) | `src/data/techMeta.ts` |
| Skill brand logos | `src/components/TechLogo.tsx` |
| Certifications | `src/data/certifications.ts` |
| Hero particle field seeds | `src/data/latentClusters.ts` |
| Resume | `public/resume.pdf` |
| Nav logos | `public/brand/` |
| Favicons | `public/favicon*` |
| Certificate PDFs | `public/Certifaction/` |
| Project screenshots | `public/Screenshots/<Project>/` |
| Contact form | `src/components/Contact.tsx` (`FORMSPREE_ID`) |
| Deploy base path | `vite.config.ts` |

---

## Profile

**File:** `src/data/profile.ts`

| Field | Example |
|-------|---------|
| Display name | `"Naif Alsahabi"` |
| Full legal name | `"Naif Khalid Alsahabi"` |
| Role label (hero eyebrow) | `"AI Engineer"` |
| Role line (mono) | `"Machine Learning · LLMs & RAG · …"` |
| Tagline | one sentence |
| Location | `"Riyadh, Saudi Arabia"` |
| Email | `"PNaif4735@gmail.com"` |
| About paragraphs | `about: [ "…", "…" ]` |
| Education | `education.degree`, `.school`, `.gpa`, `.graduated`, `.bootcamp` |
| Contact form messages | `contact.successMessage`, etc. |
| Socials | `socials.github`, `.linkedin`, `.email` |

The hero **Download Resume** button points to `public/resume.pdf`.

---

## Section text & navigation

**File:** `src/data/i18n/index.ts`

All visible labels, titles, eyebrow numbers, and descriptions live under `en` and `ar`. Update matching keys in **both** locales.

Per section: `index`, `label`, `title`, `description` (optional), `moreTitle` (Projects), `selectHint` (Skills).

**File:** `src/data/sections.ts` — section order, anchor IDs (`#about`, `#projects`, …), and nav links.

---

## Projects

**File:** `src/data/projects.ts`

| Field | Purpose |
|-------|---------|
| `slug` | URL-safe ID |
| `title` | Card title |
| `year` | Year on card |
| `summary` | One-line description |
| `description` | Longer text in project modal |
| `tech` | Tech chips on card |
| `repo` | GitHub URL |
| `live` | Optional live demo URL |
| `featured` | `true` = large row; `false` = compact grid |
| `tags` | Optional badges |
| `icon` | Banner glyph (see below) |
| `image` | Path under `public/` (see below) |

**Icon values:** `sprout`, `droplet`, `scan-text`, `book-open`, `activity`, `align-left`, `mail`, `library`

**Screenshots:**

1. Save under `public/Screenshots/<Project>/` (e.g. `public/Screenshots/TerraMind/TerraMind1.png`)
2. Set `image: "Screenshots/TerraMind/TerraMind1.png"` in `projects.ts`

Paths with spaces or `&` are URL-encoded by `src/lib/assets.ts`. Without `image`, a procedural SVG banner is used.

Project card tech chips: `src/components/TechIcon.tsx`.

---

## Skills

Two views (toggle top-right): **Graph** (logo constellation) and **List** (grouped grid). Mobile defaults to List.

**Names:** `src/data/skills.ts` — keys `languages`, `aiMl`, `frameworks`, `apps`. Category headings in `i18n` → `skills.categories`.

**Descriptions:** `src/data/techMeta.ts` → `techDescriptions`, keyed by exact skill name.

**Logos:** `src/components/TechLogo.tsx` resolves in order:

1. `deviconMap` — brand SVGs from `devicon`
2. `simpleMap` — `simple-icons` (Keras, Hugging Face, LangChain, OpenAI)
3. `conceptMap` — lucide glyphs for concepts without a brand
4. Fallback — first two letters of the name

---

## Certifications

**File:** `src/data/certifications.ts`

| Field | Purpose |
|-------|---------|
| `name` | Certificate title |
| `issuer` | NVIDIA, Microsoft, etc. |
| `year` | `"2025"` |
| `featured` | `true` = large card |
| `pdf` | Path under `public/Certifaction/` |
| `image` | Optional PNG fallback |
| `credentialId` | Optional ID in modal |
| `verifyUrl` | Optional verify link |

**Folder layout:**

```
public/Certifaction/
├── Microsoft/
├── Nvidia/
├── Others/
└── Sdaia/
```

Add a PDF, then set `pdf: "IssuerFolder/filename.pdf"` on the cert entry.

---

## Branding & images

| Asset | Path |
|-------|------|
| Nav logo (dark mode) | `public/brand/logo-dark.png` |
| Nav logo (light mode) | `public/brand/logo-light.png` |
| Favicons | `public/favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png` |
| Portrait (About) | `public/profile/portrait.png` |
| Social preview | `public/og.png` |

Regenerate `.ico` after favicon PNG changes: `node scripts/gen-favicon.mjs`

---

## Hero particle field

**File:** `src/data/latentClusters.ts`

Each cluster: `name`, `center` ([-1, 1] space), `weight`, `dark` / `light` hex colors. Renderer: `src/components/LatentField.tsx`.

---

## Contact form

**File:** `src/components/Contact.tsx` — `FORMSPREE_ID`

Success/error copy: `src/data/profile.ts` → `contact.*`

---

## Deploy

**File:** `vite.config.ts`

| Host | `base` |
|------|--------|
| GitHub Pages (`Naifcx47350/Portfolio`) | `'/Portfolio/'` |
| Root domain | `'/'` |

| Workflow | Role |
|----------|------|
| `.github/workflows/deploy.yml` | Build and deploy to GitHub Pages on `main` |
| `.github/workflows/snake.yml` | Regenerate contribution snake SVGs to `output` branch |

```bash
npm install
npm run dev
npm run build
npm run preview
```
