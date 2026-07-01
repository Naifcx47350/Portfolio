// One-off asset processor: keys out the solid dark background baked into the
// generated logo PNGs and writes true-transparent, downscaled versions in place.
//
// Method: edge-connected flood fill (so interior grey logo shapes are preserved),
// a thin feather band for anti-aliased edges, then premultiplied box-downscale for
// clean alpha edges. Originals are backed up to *-solid.png first.
//
// Usage: node scripts/make-logo-transparent.mjs
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const TARGETS = [
  'public/brand/dark/logo-dark.png',
  'public/brand/light/logo-light.png',
];

const OUT_SIZE = 512; // logos never render larger than ~80px; 512 is crisp + light
const FILL_TOL = 60; // color distance treated as "background" during flood fill
const FEATHER_HI = 108; // distance at which a boundary pixel becomes fully opaque

function dist2(r, g, b, cr, cg, cb) {
  const dr = r - cr;
  const dg = g - cg;
  const db = b - cb;
  return dr * dr + dg * dg + db * db;
}

function cornerAverage(png) {
  const { width, height, data } = png;
  const pts = [];
  const s = 6;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      pts.push([x, y], [width - 1 - x, y], [x, height - 1 - y], [width - 1 - x, height - 1 - y]);
    }
  }
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of pts) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = pts.length;
  return [r / n, g / n, b / n];
}

function processOne(relPath) {
  const abs = path.resolve(relPath);
  const png = PNG.sync.read(fs.readFileSync(abs));
  const { width, height, data } = png;
  const [cr, cg, cb] = cornerAverage(png);

  const fillTol2 = FILL_TOL * FILL_TOL;
  const filled = new Uint8Array(width * height);
  const stack = [];

  // Seed from every border pixel that matches the background.
  const seed = (x, y) => {
    const p = y * width + x;
    if (filled[p]) return;
    const i = p * 4;
    if (dist2(data[i], data[i + 1], data[i + 2], cr, cg, cb) <= fillTol2) {
      filled[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p - x) / width;
    const tryPush = (nx, ny) => {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) return;
      const np = ny * width + nx;
      if (filled[np]) return;
      const i = np * 4;
      if (dist2(data[i], data[i + 1], data[i + 2], cr, cg, cb) <= fillTol2) {
        filled[np] = 1;
        stack.push(np);
      }
    };
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  // Alpha: filled bg -> 0. Kept pixels adjacent to bg get feathered by how far
  // their color sits from the background (kills the navy halo on light mode).
  let cleared = 0;
  for (let p = 0; p < width * height; p++) {
    const i = p * 4;
    if (filled[p]) {
      data[i + 3] = 0;
      cleared++;
      continue;
    }
    const x = p % width;
    const y = (p - x) / width;
    let borders = false;
    if (x > 0 && filled[p - 1]) borders = true;
    else if (x < width - 1 && filled[p + 1]) borders = true;
    else if (y > 0 && filled[p - width]) borders = true;
    else if (y < height - 1 && filled[p + width]) borders = true;

    if (borders) {
      const d = Math.sqrt(dist2(data[i], data[i + 1], data[i + 2], cr, cg, cb));
      const a = Math.max(0, Math.min(1, (d - FILL_TOL) / (FEATHER_HI - FILL_TOL)));
      data[i + 3] = Math.round(a * 255);
    } else {
      data[i + 3] = 255;
    }
  }

  // Premultiplied box-downscale to OUT_SIZE (square logos) for smooth alpha edges.
  const out = new PNG({ width: OUT_SIZE, height: OUT_SIZE });
  const sx = width / OUT_SIZE;
  const sy = height / OUT_SIZE;
  for (let oy = 0; oy < OUT_SIZE; oy++) {
    const y0 = Math.floor(oy * sy);
    const y1 = Math.max(y0 + 1, Math.floor((oy + 1) * sy));
    for (let ox = 0; ox < OUT_SIZE; ox++) {
      const x0 = Math.floor(ox * sx);
      const x1 = Math.max(x0 + 1, Math.floor((ox + 1) * sx));
      let pr = 0;
      let pg = 0;
      let pb = 0;
      let pa = 0;
      let n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * width + x) * 4;
          const a = data[i + 3] / 255;
          pr += data[i] * a;
          pg += data[i + 1] * a;
          pb += data[i + 2] * a;
          pa += a;
          n++;
        }
      }
      const oi = (oy * OUT_SIZE + ox) * 4;
      const aAvg = pa / n;
      if (aAvg > 0.0001) {
        out.data[oi] = Math.round(pr / pa);
        out.data[oi + 1] = Math.round(pg / pa);
        out.data[oi + 2] = Math.round(pb / pa);
      } else {
        out.data[oi] = 0;
        out.data[oi + 1] = 0;
        out.data[oi + 2] = 0;
      }
      out.data[oi + 3] = Math.round(aAvg * 255);
    }
  }

  const backup = abs.replace(/\.png$/, '-solid.png');
  if (!fs.existsSync(backup)) fs.copyFileSync(abs, backup);
  fs.writeFileSync(abs, PNG.sync.write(out));

  const pct = ((cleared / (width * height)) * 100).toFixed(1);
  console.log(
    `${relPath}  bg=rgb(${cr | 0},${cg | 0},${cb | 0})  cleared=${pct}%  -> ${OUT_SIZE}x${OUT_SIZE} RGBA`
  );
}

for (const t of TARGETS) processOne(t);
console.log('done');
