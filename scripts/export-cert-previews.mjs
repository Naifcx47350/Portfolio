// Renders page 1 of each PDF in public/Certifaction/ to a PNG in public/certs/,
// mirroring the folder layout. The modal uses these images for preview; the
// original PDFs stay in place for "Open PDF in new tab".
//
// Usage: npm run certs:previews
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'public', 'Certifaction');
const OUT_DIR = path.join(ROOT, 'public', 'certs');
const CMAP_URL = path.join(ROOT, 'node_modules', 'pdfjs-dist', 'cmaps') + path.sep;
const STANDARD_FONT_DATA_URL =
  path.join(ROOT, 'node_modules', 'pdfjs-dist', 'standard_fonts') + path.sep;

const MAX_EDGE = 1600;

function collectPdfs(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) collectPdfs(abs, acc);
    else if (entry.name.toLowerCase().endsWith('.pdf')) acc.push(abs);
  }
  return acc;
}

async function renderFirstPage(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    isEvalSupported: false,
  });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(2.5, MAX_EDGE / Math.max(base.width, base.height));
  const viewport = page.getViewport({ scale });
  const canvasFactory = pdf.canvasFactory;
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

  await page.render({
    canvasContext: canvasAndContext.context,
    viewport,
    canvas: canvasAndContext.canvas,
  }).promise;

  const png = canvasAndContext.canvas.toBuffer('image/png');
  page.cleanup();
  await pdf.destroy();
  return { png, width: Math.round(viewport.width), height: Math.round(viewport.height) };
}

const pdfs = collectPdfs(SRC_DIR);
if (pdfs.length === 0) {
  console.error(`No PDFs found in ${SRC_DIR}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const pdfPath of pdfs) {
  const rel = path.relative(SRC_DIR, pdfPath);
  const outRel = rel.replace(/\.pdf$/i, '.png');
  const outPath = path.join(OUT_DIR, outRel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  try {
    const { png, width, height } = await renderFirstPage(pdfPath);
    fs.writeFileSync(outPath, png);
    console.log(`${rel}  ->  certs/${outRel}  (${width}×${height})`);
  } catch (err) {
    console.error(`Failed: ${rel}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log(`done  (${pdfs.length} PDF${pdfs.length === 1 ? '' : 's'})`);
