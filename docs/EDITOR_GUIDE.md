# Portfolio Editor Guide (dev-only)

> **This file is NOT deployed to your live site.** It only lives in the GitHub repo
> for your reference. Visitors never see it. Line numbers may shift slightly after
> edits — search the file/field name if a line no longer matches.

---

## Quick map

| What you want to change | File | Where |
|-------------------------|------|-------|
| Name, bio, email, education, socials | `src/data/profile.ts` | profile object |
| Section titles & descriptions | `src/data/i18n/index.ts` | translation keys |
| Projects (add/edit/remove) | `src/data/projects.ts` | array starts line 28 |
| Skills & tech stack | `src/data/skills.ts` | grouped object |
| Skill descriptions (on logo tap) | `src/data/techMeta.ts` | `techDescriptions` |
| Skill brand logos | `src/components/TechLogo.tsx` | logo maps |
| Certifications | `src/data/certifications.ts` | array starts line 14 |
| Hero particle field (project seeds) | `src/data/latentClusters.ts` | `latentClusters` |
| Resume PDF | `public/resume.pdf` | replace file |
| Logos (nav) | `public/brand/` | see below |
| Favicons | `public/favicon*` | replace files |
| Certificate PDFs | `public/Certifaction/` | see below |
| Project screenshots | `public/Screenshots/<Project>/` | see below |
| Contact form (Formspree) | `src/components/Contact.tsx` | `FORMSPREE_ID` (line 8) |
| Deploy URL / base path | `vite.config.ts` | line 6 |

---

## 1. Profile & personal info

**File:** `src/data/profile.ts`

| Field | Line(s) | Example |
|-------|---------|---------|
| Display name | 2 | `"Naif Alsahabi"` |
| Full legal name | 3 | `"Naif Khalid Alsahabi"` |
| Role label (hero eyebrow) | 4 | `"AI Engineer"` |
| Role line (mono, under name) | 5 | `"Machine Learning · LLMs & RAG · …"` |
| Tagline (hero paragraph) | 6–7 | one sentence |
| Location | 8 | `"Riyadh, Saudi Arabia"` |
| Email | 9 | `"PNaif4735@gmail.com"` |
| About paragraphs | 11–14 | `about: [ "…", "…" ]` |
| Degree | 16 | `education.degree` |
| University | 17 | `education.school` |
| GPA | 18 | `"4.52 / 5.0"` |
| Graduation date | 19 | `"August 2025"` |
| Bootcamp | 20 | `education.bootcamp` |
| Contact form messages | 22–26 | `contact.successMessage`, etc. |
| GitHub URL | 30 | `socials.github` |
| LinkedIn URL | 31 | `socials.linkedin` |
| Email link | 32 | `socials.email` |

**Resume:** replace `public/resume.pdf` with your CV. No code change needed — the hero
"Download Resume" button already points to it.

---

## 2. Section headings & all on-screen text (About, Projects, Skills, etc.)

**File:** `src/data/i18n/index.ts`

The site is bilingual. All visible labels, titles, eyebrow numbers, and descriptions live
here under two locale blocks: `en` (English) and `ar` (Arabic). **Edit the matching key in
*both* blocks** so the language toggle stays in sync.

Per section, look for keys like:

- `index` — eyebrow number (`01 — Projects`)
- `label` — nav link text / eyebrow label
- `title` — section H2
- `description` — optional subtitle
- `moreTitle` — Projects only: heading for the compact grid
- `selectHint` — Skills only: prompt shown before a logo is tapped

**File:** `src/data/sections.ts` — only controls the **order, anchor IDs, and nav links**
(`#about`, `#projects`, …). Don't rename an `id` unless you update the matching nav entry.

---

## 3. Projects

**File:** `src/data/projects.ts`

**Add a project:** copy an existing object inside the `projects` array (starts ~line 28).

| Field | Purpose |
|-------|---------|
| `slug` | URL-safe ID |
| `title` | Card title |
| `year` | Year shown on the card (`"2026"`) |
| `summary` | One-line card description |
| `description` | Optional longer text shown in the project modal |
| `tech` | `["React", "Python", …]` — shown as chips on card |
| `repo` | GitHub URL |
| `live` | Optional deployed URL; omit if none |
| `featured` | `true` = large card row; `false` = compact grid |
| `tags` | Optional badges, e.g. `["LLM", "RAG"]` |
| `icon` | Banner glyph — see allowed values lines 3–11 |
| `image` | Optional **path** to a screenshot under `public/` (see below) |

**Allowed `icon` values** (line 3–11): `sprout`, `droplet`, `scan-text`, `book-open`,
`activity`, `align-left`, `mail`, `library`

**Real project screenshot (optional):**

1. Save the image under `public/Screenshots/<Project>/` (e.g.
   `public/Screenshots/TerraMind/TerraMind1.png`).
2. In `projects.ts`, set `image` to that path **relative to `public/`**:
   `image: "Screenshots/TerraMind/TerraMind1.png"`.

Paths with spaces or `&` are fine — they're URL-encoded by `src/lib/assets.ts`. Without an
`image`, a procedural SVG banner is generated automatically.

**Tech chips on project cards:** edit the `tech` array strings. The small brand marks on
cards are mapped in `src/components/TechIcon.tsx` (separate from the big Skills logos).

---

## 4. Skills / tech stack

The Skills section has two views (toggle in its top-right): **Graph** (an interactive
constellation where each tech is a brand logo node — tap one to reveal its description) and
**List** (the classic grouped grid). Mobile defaults to List.

**a) Skill names — `src/data/skills.ts`**

Edit the grouped object. Keys are categories (`languages`, `aiMl`, `frameworks`, `apps`);
values are string arrays. The category *headings* are translated in
`src/data/i18n/index.ts` under `skills.categories`.

**b) Description shown when a logo is selected — `src/data/techMeta.ts`**

Add/edit an entry in `techDescriptions` keyed by the exact skill name, e.g.
`Python: 'My primary language for ML, data pipelines, and backend services.'`

**c) The logo itself — `src/components/TechLogo.tsx`**

Each skill name resolves to a logo in this order:

1. `deviconMap` — full-color brand SVGs from the `devicon` package (most languages/frameworks).
2. `simpleMap` — single-color marks from `simple-icons` (Keras, Hugging Face, LangChain, OpenAI).
3. `conceptMap` — concepts with no brand (ML, NLP, RAG, …) get a neutral lucide glyph.
4. Fallback — the first two letters of the name.

To add a brand logo: import it from `devicon/icons/<name>/<name>-original.svg` and add it to
`deviconMap` under the exact skill string used in `skills.ts`.

---

## 5. Certifications

**File:** `src/data/certifications.ts` (array starts line 14)

| Field | Purpose |
|-------|---------|
| `name` | Full certificate title |
| `issuer` | NVIDIA, Microsoft, etc. |
| `year` | `"2025"` |
| `featured` | `true` = large card at top |
| `pdf` | Path under `public/Certifaction/` — **see folder structure below** |
| `image` | Optional PNG under `public/certs/` (fallback if no pdf) |
| `credentialId` | Optional ID shown in modal |
| `verifyUrl` | Optional external verify link |

### Certificate PDF folder

```
public/Certifaction/
├── Microsoft/
│   └── Certifacte(AI-900).pdf
├── Nvidia/
│   ├── NVIDIA_Certified_Associate_Generative_AI&LLMs.pdf
│   ├── Nvidia_Building_LLM_Applications_With_Prompt Engineering.pdf
│   └── …
├── Others/
│   └── HCIA_AI_V3.pdf
└── Sdaia/
    └── AI_Concepts_&_Advance_Application(SDAIA).pdf
```

**Add a new certificate:**

1. Drop PDF in `public/Certifaction/<IssuerFolder>/filename.pdf`
2. Add an entry to `certifications` array with `pdf: "IssuerFolder/filename.pdf"`
3. Click the card on the site — modal shows PDF preview above issuer details

**Current mappings** (already wired):

| Cert name | `pdf` value |
|-----------|-------------|
| NCA-GENL | `Nvidia/NVIDIA_Certified_Associate_Generative_AI&LLMs.pdf` |
| Azure AI-900 | `Microsoft/Certifacte(AI-900).pdf` |
| HCIA-AI V3.0 | `Others/HCIA_AI_V3.pdf` |
| AI Concepts (SDAIA) | `Sdaia/AI_Concepts_&_Advance_Application(SDAIA).pdf` |
| Building LLM Apps (NVIDIA DLI) | `Nvidia/Nvidia_Building_LLM_Applications_With_Prompt Engineering.pdf` |
| Rapid Application Dev (NVIDIA DLI) | `Nvidia/NVIDIA_Rapid_Application_Development_with_LLMs.pdf` |
| Intro to Transformer NLP | `Nvidia/NVIDIA_Introduction to Transformer-Based Natural Language Processing.pdf` |
| KAUST Advanced AI | `Others/KACST.pdf` |

---

## 6. Branding & images

### Nav logos

| File | Shown when |
|------|------------|
| `public/brand/logo-dark.png` | Dark mode (silver mark) |
| `public/brand/logo-light.png` | Light mode (dark mark) |

Swap logic: `src/components/Nav.tsx` (~line 30)

### Favicons

Replace in `public/`:

- `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-512.png`
- `apple-touch-icon.png`

Regenerate `.ico` after PNG changes: `node scripts/gen-favicon.mjs`

Wired in: `index.html` (head links)

### Hero particle field (advanced, optional)

**File:** `src/data/latentClusters.ts`

The hero's WebGL cloud is seeded from your real projects. Each entry in `latentClusters`
has a `name`, a `center` (in normalized `[-1, 1]` space), a `weight` (share of particles),
and `dark` / `light` hex colors. Add or retune clusters here to change the cloud — no
shader edits needed. The render lives in `src/components/LatentField.tsx` (don't edit
unless changing the effect itself).

---

## 7. Contact form

**File:** `src/components/Contact.tsx`

- **Line 8:** `const FORMSPREE_ID = '…'` — your ID from [formspree.io](https://formspree.io/)
  (already set; replace if you use a different form).
- Form success/error copy: `src/data/profile.ts` (`contact.*` fields).

---

## 8. Deploy & hosting

**File:** `vite.config.ts` line 6

| Host | `base` value |
|------|--------------|
| GitHub Pages (`Naifcx47350/Portfolio`) | `'/Portfolio/'` ← current |
| Root domain / `Naifcx47350.github.io` | `'/'` |

Workflows (both must stay committed):

- `.github/workflows/deploy.yml` — builds and deploys to GitHub Pages on every push to
  `main`. One-time: **Settings → Pages → Source → GitHub Actions**.
- `.github/workflows/snake.yml` — regenerates the contribution-snake SVGs daily and pushes
  them to the `output` branch (used by the last section). Needs **Settings → Actions →
  General → Workflow permissions → Read and write**.

**Commands:**

```bash
npm install
npm run dev      # local preview (http://localhost:5173/Portfolio/)
npm run build    # type-check + production build → dist/
npm run preview  # serve the built dist/ locally
```

---

## 9. Files you should NOT edit (unless changing design/code)

| Path | Why |
|------|-----|
| `src/components/*.tsx` | UI components — edit only for design changes |
| `src/lib/animations.ts` | Motion timings |
| `src/styles/index.css` | Theme colors & global styles |
| `dist/` | Build output — regenerated by `npm run build` |
| `node_modules/` | Dependencies |

---

## 10. Common tasks checklist

- [ ] Update bio → `profile.ts` (`about` array)
- [ ] Add project → `projects.ts` + optional screenshot in `public/Screenshots/<Project>/`
- [ ] Add cert → drop PDF in `public/Certifaction/<Issuer>/` + entry in `certifications.ts`
- [ ] Change email → `profile.ts` (`email` + `socials.email`)
- [ ] New skill → `skills.ts` + description in `techMeta.ts` + logo in `TechLogo.tsx`
- [ ] Edit section/nav text → `i18n/index.ts` (update **both** `en` and `ar`)
- [ ] Replace CV → `public/resume.pdf`
- [ ] Formspree → `Contact.tsx` (`FORMSPREE_ID`, line 8)
- [ ] Deploy → push to `main`, check GitHub Actions tab

---

*Last updated: iteration 3 — WebGL hero field (`latentClusters.ts`), interactive Skills
constellation with logos + tap-to-reveal descriptions (`techMeta.ts`, `TechLogo.tsx`),
bilingual text moved to `i18n/index.ts`, screenshots under `public/Screenshots/`.*
