# Naif Alsahabi — Portfolio

Personal portfolio for an AI Engineer: projects, skills, certifications, and contact — built with React, Vite, TypeScript, Tailwind CSS, and a custom WebGL particle field.

![Portfolio screenshot](./assets/Main.png)

## Highlights

- **Hero "latent space" field** — a GPU particle cloud (WebGL/OGL) seeded from real
  projects. It defaults to a circle and warps toward the cursor like a gravitational
  lens when you hover outside the content column.
- **Interactive Skills constellation** — full-color brand logos as nodes, animated links,
  and a tap-to-reveal description. Toggle between the **Graph** and **List** views.
- **Scroll-linked reveals** — sections and cards slide in (and back out) as you scroll,
  driven by Framer Motion.
- **Section dock spine** — an enlarged, spaced scroll indicator with a progress line that
  tracks your real position through the page.
- **In-browser certificate previews** — PDFs render inline via pdf.js, no download needed.

## Tech stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS v3.4
- Framer Motion (scroll-linked reveals) + GSAP (intro sequence)
- OGL — WebGL GPU particle field in the hero
- devicon + simple-icons — self-hosted brand logos for the Skills constellation
- lucide-react — UI and concept glyphs
- pdf.js (`pdfjs-dist`) — in-browser certificate PDF previews
- Formspree — contact form

## Requirements

- **Node.js 20+** (recommended: use [nvm](https://github.com/nvm-sh/nvm))

```bash
nvm install 20 && nvm use 20
node -v   # should print v20.x or higher
```

## Edit your content

Update **only** these files — the rest of the site reads from them:

| File | What to edit |
|------|----------------|
| `src/data/profile.ts` | Name, bio, education, social links, email |
| `src/data/projects.ts` | Projects: title, year, summary, tech, repo/live URLs, screenshot path |
| `src/data/skills.ts` | Skill groups (drive the Skills constellation + list) |
| `src/data/techMeta.ts` | One-line description shown when a skill logo is selected |
| `src/data/certifications.ts` | Certifications + PDF paths |
| `src/data/latentClusters.ts` | Project names/colors that seed the hero particle field |
| `public/resume.pdf` | Your CV download |
| `src/components/Contact.tsx` | `FORMSPREE_ID` — your [Formspree](https://formspree.io/) form ID (already set) |

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/Portfolio/`).

```bash
npm run build    # production build → dist/
npm run preview  # preview the built site
```

## Deploy to GitHub Pages

This repo is configured for **`Naifcx47350/Portfolio`**:

- **Live URL:** [https://naifcx47350.github.io/Portfolio/](https://naifcx47350.github.io/Portfolio/)
- **Vite base path:** `/Portfolio/` (see `vite.config.ts`)

### One-time setup

1. Push this repo to GitHub (`main` branch).
2. Go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. On push to `main`, the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

### Switching hosts (one-line change)

The only host-specific setting is `base` in `vite.config.ts`. All asset
references (favicons, logos, project banners, cert images) use
`import.meta.env.BASE_URL` or root-relative paths, so they follow `base`
automatically — nothing 404s under a subpath.

| Host | `base` value |
|------|--------------|
| GitHub Pages project site (`Naifcx47350/Portfolio`) | `'/Portfolio/'` (current) |
| GitHub Pages user site (`Naifcx47350.github.io`) | `'/'` |
| Vercel / Netlify / Cloudflare Pages (root domain) | `'/'` |

This is a single-page app with anchor navigation — no SPA 404 redirect is needed.

### GitHub activity (contribution snake)

The last section renders an animated contribution "snake". It is produced by
`.github/workflows/snake.yml`, which regenerates the SVGs daily and pushes them to the
`output` branch (the component loads them from there). Make sure that workflow file is
**committed** and that Actions has write permission (Settings → Actions → General →
Workflow permissions → *Read and write*). For a different account, change
`github_user_name` in that workflow.

## Branding & images (drop-in, no code changes)

- **Logos:** `public/brand/logo-dark.png` (shown in dark mode) and
  `public/brand/logo-light.png` (shown in light mode). The nav swaps them by theme.
- **Favicons:** `public/favicon.ico`, `favicon-16.png`, `favicon-32.png`,
  `favicon-512.png`, `apple-touch-icon.png`.
- **Project screenshots (optional):** drop the image under `public/Screenshots/<Project>/`
  and point `image` on that project in `src/data/projects.ts` at it
  (e.g. `image: "Screenshots/TerraMind/TerraMind1.png"`). Without it, a procedural SVG
  banner is generated automatically. Paths with spaces or `&` are URL-safe (see
  `src/lib/assets.ts`).
- **Certificates:** drop the PDF under `public/Certifaction/<Issuer>/` and set `pdf` on
  the cert in `src/data/certifications.ts` (plus optional `credentialId` / `verifyUrl`).
  The modal renders the PDF inline via pdf.js.
- **Skill logos:** brand logos come from `devicon` / `simple-icons` and are mapped in
  `src/components/TechLogo.tsx`. Concept skills (no brand) use a neutral lucide glyph.

## License

See [LICENSE](./LICENSE).
