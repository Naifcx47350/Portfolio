import { useEffect, useRef } from 'react';
import { Renderer, Geometry, Program, Mesh } from 'ogl';
import type { Theme } from '../hooks/useTheme';
import { latentClusters, clusterColors } from '../data/latentClusters';

interface LatentFieldProps {
  readonly theme: Theme;
  readonly reducedMotion: boolean;
}

function particleCount(): number {
  if (typeof window === 'undefined') return 28000;
  const w = window.innerWidth;
  if (w < 480) return 11000;
  if (w < 768) return 19000;
  if (w < 1280) return 28000;
  return 42000;
}

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
}

function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec3 aTarget;
  attribute float aCluster;
  attribute float aSeed;
  attribute float aSize;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform vec2 uCursor;
  uniform float uCursorActive;
  uniform float uPull;
  uniform float uAttract;
  uniform float uAttractAge;
  uniform float uVortexRadius;
  uniform float uPushRadius;
  uniform float uInteractScale;
  uniform vec3 uC0;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vAttract;

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
    float morph = smoothstep(0.0, 1.0, uScroll);
    vec3 home = mix(position, aTarget, morph);

    float freq = 0.9 + aSeed * 0.2;
    vec3 sample = vec3(home.xy * freq + uTime * 0.035, uTime * 0.06 + aSeed * 6.28);
    vec3 flow = curlNoise(sample);
    flow = flow / (1.0 + length(flow));
    float amp = 0.13 + 0.06 * morph;
    vec3 pos = home + flow * amp;

    if (uPull > 0.001) {
      vec2 dir = normalize(uCursor + vec2(0.0001));
      float along = dot(pos.xy, dir);
      vec2 alongVec = along * dir;
      vec2 perpVec = pos.xy - alongVec;
      float stretch = 1.0 + uPull * 1.15;
      float squash = 1.0 - uPull * 0.28;
      pos.xy = alongVec * stretch + perpVec * squash;
      pos.xy += dir * uPull * 0.18;
    }

    vec2 d = pos.xy - uCursor;
    float dist = length(d);
    vec2 dir = normalize(d + vec2(0.0001));

    // Capture zone = full cloud; influence ramps so the core fills in first.
    float inCloud = smoothstep(uVortexRadius * 1.05, uVortexRadius * 0.38, dist);
    float coreBias = smoothstep(uVortexRadius * 0.72, uVortexRadius * 0.08, dist);
    float localAttract = uAttract * inCloud * (0.55 + coreBias * 0.45);

    // Repel — fades out inside the active vortex zone only.
    float pushAmt = smoothstep(uPushRadius, 0.0, dist) * uCursorActive * (1.0 - localAttract);
    pos.xy += dir * pushAmt * 0.28 * uInteractScale;

    // Hold: accretion disc — orbits biased toward the core so paths cross at the center.
    if (localAttract > 0.001) {
      vec2 rel = pos.xy - uCursor;
      float r = length(rel);
      float phase = aSeed * 6.2831853 + aCluster * 1.256;
      float theta = (r > 0.01) ? atan(rel.y, rel.x) : phase;

      float lane = fract(aSeed * 9.731 + aCluster * 0.41);
      float shell = fract(aSeed * 5.17 + aCluster * 0.19 + lane * 0.31);
      float innerR = 0.035;
      float outerR = uVortexRadius * 0.62;
      // pow(<1) stacks more shells near the middle — intersections happen at the core.
      float ringR = mix(innerR, outerR, pow(shell, 0.48));
      ringR = mix(ringR, clamp(r * 0.72, innerR, outerR), 0.12);
      ringR = max(innerR, ringR * (1.0 - uAttractAge * 0.022));

      float orbitR = mix(r, ringR, smoothstep(0.0, 0.78, localAttract));
      orbitR = clamp(orbitR, innerR, outerR);

      float omega = (2.0 + aSeed * 2.6) / pow(max(orbitR, 0.045), 0.48);
      omega *= (fract(aSeed * 1.37) > 0.5) ? 1.0 : -1.0;

      float orbitTheta = mix(theta, phase, smoothstep(0.0, 0.35, localAttract));
      orbitTheta += omega * uAttractAge;

      // Wobble grows toward the core — lanes weave and cross at the middle.
      float cross = (outerR / max(orbitR, 0.06)) * 0.016;
      float wobble =
        sin(orbitTheta * (2.0 + floor(aSeed * 4.0)) + uAttractAge * 1.6) * cross;
      wobble += sin(orbitTheta * 3.0 - uAttractAge * 2.4 + phase) * cross * 0.55;
      wobble += sin(orbitTheta * 5.0 + uAttractAge * 0.9 + aSeed * 9.0) * cross * 0.3;
      orbitR = clamp(orbitR + wobble * localAttract, innerR, outerR);

      float ecc = 0.05 + fract(aSeed * 3.7) * 0.09;
      orbitR = clamp(orbitR * (1.0 + ecc * cos(orbitTheta * 2.0 + phase) * localAttract), innerR, outerR);

      vec2 orbitPos = uCursor + orbitR * vec2(cos(orbitTheta), sin(orbitTheta));
      pos.xy = mix(pos.xy, orbitPos, smoothstep(0.04, 0.88, localAttract));
    }

    float aspect = uRes.x / uRes.y;
    vec2 clip = pos.xy;
    if (aspect > 1.0) clip.x /= aspect; else clip.y *= aspect;
    gl_Position = vec4(clip, 0.0, 1.0);

    float sizeMult = 1.0 + pushAmt * 1.2;
    sizeMult = mix(sizeMult, 1.05 + aSeed * 0.55, smoothstep(0.0, 0.7, localAttract));
    gl_PointSize = max(2.2, aSize * uPixelRatio * sizeMult);

    vColor = clusterColor(aCluster);
    vAlpha = (0.22 + aSeed * 0.5) * (1.0 + pushAmt * 0.8);
    vAlpha = mix(vAlpha, (0.48 + aSeed * 0.52), smoothstep(0.0, 0.55, localAttract));
    vAttract = localAttract;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAttract;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float edge = mix(0.5, 0.44, smoothstep(0.0, 0.75, vAttract));
    float alpha = smoothstep(edge, 0.0, d) * vAlpha;
    if (alpha < 0.01) discard;
    vec3 col = vColor * (1.0 + vAttract * 0.55);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function LatentField({ theme, reducedMotion }: LatentFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const themeRef = useRef<Theme>(theme);
  const reducedRef = useRef<boolean>(reducedMotion);

  themeRef.current = theme;
  reducedRef.current = reducedMotion;

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

    const coarse = isCoarsePointer();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({ alpha: true, dpr, antialias: false, depth: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const count = particleCount();
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const clusterAttr = new Float32Array(count);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    const totalWeight = latentClusters.reduce((sum, c) => sum + c.weight, 0);
    const spread = 0.17;

    for (let i = 0; i < count; i++) {
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
        uAttract: { value: 0 },
        uAttractAge: { value: 0 },
        uVortexRadius: { value: coarse ? 0.66 : 0.62 },
        uPushRadius: { value: coarse ? 0.62 : 0.42 },
        uInteractScale: { value: coarse ? 1.45 : 1.0 },
        uC0: { value: colors[0] },
        uC1: { value: colors[1] },
        uC2: { value: colors[2] },
        uC3: { value: colors[3] },
      },
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    program.setBlendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

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

    const hero = document.getElementById('hero');
    const cursorTarget = { x: 99, y: 99 };
    const cursorActive = { value: 0 };
    const pull = { target: 0 };
    const attract = { target: 0 };
    let pointerDown = false;
    let capturedId = -1;
    let attractTimer = 0;
    let attractAge = 0;

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('a, button, input, textarea, select, [role="button"], .code-window');
    };

    const touchPad = coarse ? 32 : 0;

    const mapPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      if (px < -touchPad || py < -touchPad || px > rect.width + touchPad || py > rect.height + touchPad) {
        return null;
      }
      const aspect = width / height;
      const ndcX = (px / width) * 2 - 1;
      const ndcY = 1 - (py / height) * 2;
      return {
        x: aspect > 1 ? ndcX * aspect : ndcX,
        y: aspect > 1 ? ndcY : ndcY / aspect,
        px,
      };
    };

    const updatePull = (px: number) => {
      const contentHalf = Math.min(1152, width) / 2;
      const over = Math.abs(px - width / 2) - contentHalf;
      pull.target = Math.min(1, Math.max(0, over / Math.max(1, width * 0.16)));
    };

    const applyPointer = (clientX: number, clientY: number) => {
      const mapped = mapPointer(clientX, clientY);
      if (!mapped) {
        if (!pointerDown) {
          cursorActive.value = 0;
          pull.target = 0;
        }
        return;
      }
      cursorTarget.x = mapped.x;
      cursorTarget.y = mapped.y;
      cursorActive.value = 1;
      updatePull(mapped.px);
    };

    const onHeroPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (isInteractiveTarget(e.target)) return;

      const mapped = mapPointer(e.clientX, e.clientY);
      if (!mapped) return;

      pointerDown = true;
      capturedId = e.pointerId;
      attractAge = 0;
      cursorTarget.x = mapped.x;
      cursorTarget.y = mapped.y;
      cursorActive.value = 1;
      updatePull(mapped.px);

      if (scroll < 0.12) {
        if (coarse) {
          window.clearTimeout(attractTimer);
          attractTimer = window.setTimeout(() => {
            if (pointerDown && scroll < 0.12) attract.target = 1;
          }, 220);
        } else {
          attract.target = 1;
        }
      }

      try {
        hero?.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onHeroPointerMove = (e: PointerEvent) => {
      applyPointer(e.clientX, e.clientY);
    };

    const releasePointer = (e: PointerEvent) => {
      if (capturedId !== -1 && e.pointerId !== capturedId) return;
      window.clearTimeout(attractTimer);
      pointerDown = false;
      attract.target = 0;
      attractAge = 0;
      capturedId = -1;
      try {
        hero?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (!coarse) {
        cursorActive.value = 0;
      }
    };

    const onHeroPointerUp = (e: PointerEvent) => releasePointer(e);
    const onHeroPointerCancel = (e: PointerEvent) => releasePointer(e);

    const onWindowPointerMove = (e: PointerEvent) => {
      if (pointerDown && capturedId === e.pointerId) return;
      applyPointer(e.clientX, e.clientY);
    };

    const onWindowPointerOut = () => {
      if (!pointerDown) {
        cursorActive.value = 0;
        pull.target = 0;
      }
    };

    hero?.addEventListener('pointerdown', onHeroPointerDown);
    hero?.addEventListener('pointermove', onHeroPointerMove);
    hero?.addEventListener('pointerup', onHeroPointerUp);
    hero?.addEventListener('pointercancel', onHeroPointerCancel);
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerout', onWindowPointerOut, { passive: true });

    let scroll = 0;
    const onScroll = () => {
      const denom = Math.max(1, window.innerHeight * 0.9);
      scroll = Math.min(1, Math.max(0, window.scrollY / denom));
      if (scroll >= 0.12) attract.target = 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let ioInView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        ioInView = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(container);

    let pageVisible = !document.hidden;
    const onVisibility = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    let raf = 0;
    let curCursorX = 99;
    let curCursorY = 99;
    let curActive = 0;
    let curScroll = 0;
    let curPull = 0;
    let curAttract = 0;
    let lastRenderT = 0;
    let lastFrameAt = performance.now();
    let lastTimeValue = -1;
    const start = performance.now();
    let contextLost = false;

    const renderOnce = (t: number) => {
      const dt = lastRenderT > 0 ? Math.min(0.05, t - lastRenderT) : 0.016;
      lastRenderT = t;

      program.uniforms.uTime.value = t;
      const activeEase = coarse ? 0.18 : 0.12;
      const attractEase = pointerDown ? 0.14 : 0.09;
      curCursorX += (cursorTarget.x - curCursorX) * activeEase;
      curCursorY += (cursorTarget.y - curCursorY) * activeEase;
      curActive += (cursorActive.value - curActive) * (coarse ? 0.14 : 0.08);
      curScroll += (scroll - curScroll) * 0.08;
      curPull += (pull.target - curPull) * 0.07;
      curAttract += (attract.target - curAttract) * attractEase;

      if (curAttract > 0.04 || attract.target > 0) {
        attractAge += dt;
      } else {
        attractAge *= 0.9;
      }

      program.uniforms.uCursor.value = [curCursorX, curCursorY];
      program.uniforms.uCursorActive.value = curActive;
      program.uniforms.uScroll.value = curScroll;
      program.uniforms.uPull.value = curPull;
      program.uniforms.uAttract.value = curAttract;
      program.uniforms.uAttractAge.value = attractAge;
      renderer.render({ scene: mesh });
      lastTimeValue = t;
      lastFrameAt = performance.now();
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);

      if (contextLost) return;

      const now = performance.now();
      const shouldAnimate = ioInView && pageVisible;

      if (!shouldAnimate) return;

      if (now - lastFrameAt > 900 && lastTimeValue >= 0) {
        renderOnce(lastTimeValue + 0.016);
      }

      const elapsed = (now - start) / 1000;
      renderOnce(elapsed);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(raf);
    };

    const onContextRestored = () => {
      contextLost = false;
      resize();
      lastFrameAt = performance.now();
      if (!reducedRef.current) {
        raf = requestAnimationFrame(loop);
      }
    };

    gl.canvas.addEventListener('webglcontextlost', onContextLost);
    gl.canvas.addEventListener('webglcontextrestored', onContextRestored);

    if (reducedRef.current) {
      resize();
      renderOnce(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(attractTimer);
      resizeObserver.disconnect();
      io.disconnect();
      hero?.removeEventListener('pointerdown', onHeroPointerDown);
      hero?.removeEventListener('pointermove', onHeroPointerMove);
      hero?.removeEventListener('pointerup', onHeroPointerUp);
      hero?.removeEventListener('pointercancel', onHeroPointerCancel);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerout', onWindowPointerOut);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.canvas.removeEventListener('webglcontextlost', onContextLost);
      gl.canvas.removeEventListener('webglcontextrestored', onContextRestored);
      programRef.current = null;
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return <div ref={containerRef} className="hero-particles-layer" aria-hidden="true" />;
}
