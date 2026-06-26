// One-off helper: packs pre-rendered PNGs into a multi-size favicon.ico
// Usage: node scripts/gen-favicon.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pngToIco from 'png-to-ico';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = ['favicon-16.png', 'favicon-32.png', 'favicon-48.png'].map((f) =>
  resolve(root, 'public', f)
);

const buf = await pngToIco(sources);
writeFileSync(resolve(root, 'public', 'favicon.ico'), buf);
console.log('Wrote public/favicon.ico');
