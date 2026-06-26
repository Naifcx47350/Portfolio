import { useEffect, useRef } from 'react';
import { Renderer, Geometry, Program, Mesh } from 'ogl';
import type { Theme } from '../hooks/useTheme';
import { latentClusters, clusterColors } from '../data/latentClusters';

interface LatentFieldProps {
  theme: Theme;
  reducedMotion: boolean;
}

function particleCount(): number {
  if (typeof window === 'undefined') return 24000;
  const w = window.innerWidth;
  if (w < 480) return 9000;
  if (w < 768) return 15000;
  if (w < 1280) return 24000;
  return 34000;
}

function gaussian(): number {
  // Box–Muller
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const vertex = /* glsl */ `
  attribute vec3 position;   // home (clustered layout)
  attribute vec3 aTarget;    // scroll=1 layout (dispersed ribbon)
  attribute float aCluster;  // 0..3
  attribute float aSeed;     // 0..1 random
  attribute float aSize;     // base point size

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform vec2 uCursor;       // design space
  uniform float uCursorActive;
  uniform float uPull;        // 0..1 black-hole lensing when cursor leaves content
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;

  varying vec3 vColor;
  varying float vAlpha;

  //
  // Ashima / McEwan 3D simplex noise
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 snoiseVec3(vec3 x){
    return vec3(
      snoise(x),
      snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
      snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
    );
  }

  // Divergence-free curl noise: flow = curl of a vector potential.
  vec3 curlNoise(vec3 p){
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    vec3 px0 = snoiseVec3(p - dx); vec3 px1 = snoiseVec3(p + dx);
    vec3 py0 = snoiseVec3(p - dy); vec3 py1 = snoiseVec3(p + dy);
    vec3 pz0 = snoiseVec3(p - dz); vec3 pz1 = snoiseVec3(p + dz);
    float x = py1.z - py0.z - pz1.y + pz0.y;
    float y = pz1.x - pz0.x - px1.z + px0.z;
    float z = px1.y - px0.y - py1.x + py0.x;
    return vec3(x, y, z) / (2.0 * e);
  }

  vec3 clusterColor(float c){
    if (c < 0.5) return uC0;
    if (c < 1.5) return uC1;
    if (c < 2.5) return uC2;
    return uC3;
  }

  void main(){
    // Morph between clustered layout and dispersed ribbon as the page scrolls.
    float morph = smoothstep(0.0, 1.0, uScroll);
    vec3 home = mix(position, aTarget, morph);

    // Curl-noise flow field — the field drifts with time so the cloud is alive.
    float freq = 0.9 + aSeed * 0.2;
    vec3 sample = vec3(home.xy * freq + uTime * 0.035, uTime * 0.06 + aSeed * 6.28);
    vec3 flow = curlNoise(sample);
    flow = flow / (1.0 + length(flow));      // soft-normalize so a few particles don't fling out
    float amp = 0.13 + 0.06 * morph;
    vec3 pos = home + flow * amp;

    // Gravitational lensing: when the cursor moves past the content edge, the whole
    // cloud elongates toward it — like light bending into a black hole.
    if (uPull > 0.001) {
      vec2 dir = normalize(uCursor + vec2(0.0001));
      float along = dot(pos.xy, dir);
      vec2 alongVec = along * dir;
      vec2 perpVec = pos.xy - alongVec;
      float stretch = 1.0 + uPull * 1.15;
      float squash = 1.0 - uPull * 0.28;
      pos.xy = alongVec * stretch + perpVec * squash;
      pos.xy += dir * uPull * 0.18;      // lean the cloud toward the cursor
    }

    // Cursor parts the flock locally with a smoothstep falloff.
    vec2 d = pos.xy - uCursor;
    float dist = length(d);
    float push = smoothstep(0.42, 0.0, dist) * uCursorActive;
    pos.xy += normalize(d + 0.0001) * push * 0.28;

    // Design space -> clip space with aspect correction (keeps the cloud circular).
    float aspect = uRes.x / uRes.y;
    vec2 clip = pos.xy;
    if (aspect > 1.0) clip.x /= aspect; else clip.y *= aspect;
    gl_Position = vec4(clip, 0.0, 1.0);

    float sizeBoost = 1.0 + push * 1.4;
    gl_PointSize = aSize * uPixelRatio * sizeBoost;

    vColor = clusterColor(aCluster);
    vAlpha = (0.22 + aSeed * 0.5) * (1.0 + push * 0.8);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function LatentField({ theme, reducedMotion }: LatentFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const themeRef = useRef<Theme>(theme);
  const reducedRef = useRef<boolean>(reducedMotion);

  themeRef.current = theme;
  reducedRef.current = reducedMotion;

  // Keep cluster colors in sync with the theme without rebuilding buffers.
  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    const colors = clusterColors(theme);
    program.uniforms.uC0.value = colors[0];
    program.uniforms.uC1.value = colors[1];
    program.uniforms.uC2.value = colors[2];
    program.uniforms.uC3.value = colors[3];
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({ alpha: true, dpr, antialias: false, depth: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    // ---- Seed particles from the real project clusters ----
    const count = particleCount();
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const clusterAttr = new Float32Array(count);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    const totalWeight = latentClusters.reduce((sum, c) => sum + c.weight, 0);
    const spread = 0.17;

    for (let i = 0; i < count; i++) {
      // Pick a cluster by weight.
      let r = Math.random() * totalWeight;
      let ci = 0;
      for (let k = 0; k < latentClusters.length; k++) {
        r -= latentClusters[k].weight;
        if (r <= 0) {
          ci = k;
          break;
        }
      }
      const c = latentClusters[ci];

      const hx = c.center[0] + gaussian() * spread;
      const hy = c.center[1] + gaussian() * spread;
      positions[i * 3] = hx;
      positions[i * 3 + 1] = hy;
      positions[i * 3 + 2] = 0;

      // Dispersed "ribbon" layout for the scrolled state.
      targets[i * 3] = (Math.random() * 2 - 1) * 1.2;
      targets[i * 3 + 1] = gaussian() * 0.14;
      targets[i * 3 + 2] = 0;

      clusterAttr[i] = ci;
      seeds[i] = Math.random();
      sizes[i] = 1.1 + Math.random() * 1.8 + (ci === 0 || ci === 3 ? 0.4 : 0);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      aTarget: { size: 3, data: targets },
      aCluster: { size: 1, data: clusterAttr },
      aSeed: { size: 1, data: seeds },
      aSize: { size: 1, data: sizes },
    });

    const colors = clusterColors(themeRef.current);
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPixelRatio: { value: dpr },
        uCursor: { value: [99, 99] },
        uCursorActive: { value: 0 },
        uPull: { value: 0 },
        uC0: { value: colors[0] },
        uC1: { value: colors[1] },
        uC2: { value: colors[2] },
        uC3: { value: colors[3] },
      },
    });
    // Additive blending for glow where particles overlap.
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    program.setBlendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    // ---- Sizing ----
    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      renderer.setSize(width, height);
      program.uniforms.uRes.value = [width, height];
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ---- Pointer (canvas is pointer-events:none, so listen on window) ----
    const cursorTarget = { x: 99, y: 99 };
    const cursorActive = { value: 0 };
    const pull = { target: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        cursorActive.value = 0;
        pull.target = 0;
        return;
      }
      const aspect = width / height;
      const ndcX = (px / width) * 2 - 1;
      const ndcY = 1 - (py / height) * 2;
      cursorTarget.x = aspect > 1 ? ndcX * aspect : ndcX;
      cursorTarget.y = aspect > 1 ? ndcY : ndcY / aspect;
      cursorActive.value = 1;

      // Pull ramps up as the cursor moves past the centered content column.
      const contentHalf = Math.min(1152, width) / 2;
      const over = Math.abs(px - width / 2) - contentHalf;
      pull.target = Math.min(1, Math.max(0, over / Math.max(1, width * 0.16)));
    };
    const onPointerLeave = () => {
      cursorActive.value = 0;
      pull.target = 0;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerout', onPointerLeave, { passive: true });

    // ---- Scroll morph (normalized over the first viewport of scrolling) ----
    let scroll = 0;
    const onScroll = () => {
      const denom = Math.max(1, window.innerHeight * 0.9);
      scroll = Math.min(1, Math.max(0, window.scrollY / denom));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Visibility gating (perf) ----
    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(container);
    const onVisibility = () => {
      if (document.hidden) inView = false;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // ---- Render loop ----
    let raf = 0;
    let curCursorX = 99;
    let curCursorY = 99;
    let curActive = 0;
    let curScroll = 0;
    let curPull = 0;
    const start = performance.now();

    const renderOnce = (t: number) => {
      program.uniforms.uTime.value = t;
      // Ease cursor + scroll for smoothness.
      curCursorX += (cursorTarget.x - curCursorX) * 0.12;
      curCursorY += (cursorTarget.y - curCursorY) * 0.12;
      curActive += (cursorActive.value - curActive) * 0.08;
      curScroll += (scroll - curScroll) * 0.08;
      curPull += (pull.target - curPull) * 0.07;
      program.uniforms.uCursor.value = [curCursorX, curCursorY];
      program.uniforms.uCursorActive.value = curActive;
      program.uniforms.uScroll.value = curScroll;
      program.uniforms.uPull.value = curPull;
      renderer.render({ scene: mesh });
    };

    if (reducedRef.current) {
      // Static single frame — no animation.
      resize();
      renderOnce(0);
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        const elapsed = (performance.now() - start) / 1000;
        renderOnce(elapsed);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      programRef.current = null;
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
    };
    // Rebuild only when reduced-motion changes (theme handled via uniforms above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return <div ref={containerRef} className="hero-particles-layer" aria-hidden="true" />;
}
