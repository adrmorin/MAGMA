import React from 'react';
import './AnimatedBackground.css';

/**
 * Fondo vectorial animado de MAGMA: simulación de magma.
 * Capas (de atrás hacia delante):
 *  1. Resplandor térmico que respira desde el subsuelo.
 *  2. Lago de magma: masa fluida (metaballs) con bordes orgánicos. Un filtro
 *     SVG (turbulencia + desplazamiento + "gooey") deforma y funde las burbujas.
 *  3. Vetas de magma activas, NO uniformes: cada veta se genera con un
 *     trazado quebrado (fractura de roca) y un grosor variable — adelgaza hacia
 *     la punta, con estrechamientos y engrosamientos — y puntos calientes que
 *     laten por separado. Por ellas viaja el flujo de magma.
 *  4. Brasas ascendentes con balanceo.
 * Todo se calcula una sola vez al cargar el módulo (generador con semilla, por
 * lo que el resultado es siempre el mismo). Las animaciones son
 * transform/opacity/dashoffset; la turbulencia SMIL se omite si el usuario
 * prefiere reducir el movimiento.
 */

/* ---------- Generador determinista ---------- */
const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const r1 = (n) => Math.round(n * 10) / 10;

/**
 * Convierte unos puntos de paso en una veta irregular:
 *  - centerline: polilínea quebrada (desplazamiento lateral correlacionado).
 *  - ribbon: contorno relleno con grosor variable.
 *  - hot: puntos calientes situados en los engrosamientos.
 */
const buildVein = ({ pts, w, taper, jitter = 8, seed }) => {
  const rnd = mulberry32(seed);

  // 1. Centro quebrado
  const center = [{ x: pts[0][0], y: pts[0][1] }];
  let walk = 0;
  for (let s = 0; s < pts.length - 1; s += 1) {
    const [x0, y0] = pts[s];
    const [x1, y1] = pts[s + 1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.hypot(dx, dy);
    const nx = -dy / dist;
    const ny = dx / dist;
    const steps = Math.max(2, Math.round(dist / (13 + rnd() * 9)));
    for (let k = 1; k <= steps; k += 1) {
      const f = k / steps;
      const last = k === steps && s === pts.length - 2;
      walk = walk * 0.45 + (rnd() - 0.5) * 2 * jitter;
      const off = k === steps ? 0 : walk;
      center.push({
        x: x0 + dx * f + nx * off,
        y: y0 + dy * f + ny * off,
        end: last,
      });
    }
  }

  // 2. Longitud acumulada → parámetro t ∈ [0,1]
  const cum = [0];
  for (let i = 1; i < center.length; i += 1) {
    cum.push(cum[i - 1] + Math.hypot(center[i].x - center[i - 1].x, center[i].y - center[i - 1].y));
  }
  const total = cum[cum.length - 1];

  // 3. Perfil de grosor: ruido suave + estrechamientos + engrosamientos
  const pa = rnd() * 6.28;
  const pb = rnd() * 6.28;
  const fa = 5 + rnd() * 5;
  const fb = 11 + rnd() * 8;
  const bulges = Array.from({ length: 2 + Math.floor(rnd() * 2) }, () => ({
    t: 0.12 + rnd() * 0.76,
    amp: 0.9 + rnd() * 1.1,
    sig: 0.025 + rnd() * 0.03,
  }));
  const pinches = Array.from({ length: 2 }, () => ({
    t: 0.1 + rnd() * 0.8,
    sig: 0.02 + rnd() * 0.02,
  }));

  const widthAt = (t) => {
    const noise = 0.62 + 0.28 * Math.sin(t * fa + pa) + 0.2 * Math.sin(t * fb + pb);
    let m = noise;
    bulges.forEach((b) => { m += b.amp * Math.exp(-((t - b.t) ** 2) / (2 * b.sig ** 2)); });
    pinches.forEach((p) => { m *= 1 - 0.7 * Math.exp(-((t - p.t) ** 2) / (2 * p.sig ** 2)); });
    return Math.max(0.35, w * m * (1 - taper * t));
  };

  // 4. Contorno
  const left = [];
  const right = [];
  const widths = center.map((_, i) => widthAt(cum[i] / total));
  center.forEach((p, i) => {
    const a = center[Math.max(0, i - 1)];
    const b = center[Math.min(center.length - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const hw = widths[i] / 2;
    left.push(`${r1(p.x + nx * hw)} ${r1(p.y + ny * hw)}`);
    right.push(`${r1(p.x - nx * hw)} ${r1(p.y - ny * hw)}`);
  });
  const ribbon = `M${left.join(' L')} L${right.reverse().join(' L')} Z`;
  const centerD = `M${center.map((p) => `${r1(p.x)} ${r1(p.y)}`).join(' L')}`;

  // 5. Puntos calientes en los engrosamientos
  const hot = bulges.map((b) => {
    let idx = 0;
    while (idx < center.length - 1 && cum[idx] / total < b.t) idx += 1;
    return { x: r1(center[idx].x), y: r1(center[idx].y), r: r1(Math.max(3, widths[idx] * 0.8)) };
  });

  return { ribbon, centerD, hot, w };
};

/* ---------- Definición de la red de vetas ---------- */
const VEIN_DEFS = [
  // Troncales: suben desde el lago y recorren toda la pantalla
  { pts: [[300, 900], [290, 780], [345, 680], [330, 580], [285, 480], [255, 380], [300, 260], [345, 170], [350, 60], [348, -10]], w: 8, taper: 0.7, jitter: 9, dur: 9, delay: 0, len: 110, trunk: true },
  { pts: [[720, 900], [735, 810], [700, 720], [730, 620], [775, 540], [790, 450], [760, 360], [720, 270], [705, 180], [740, 80], [740, -10]], w: 9.5, taper: 0.75, jitter: 10, dur: 12, delay: -4, len: 140, trunk: true },
  { pts: [[1120, 900], [1105, 800], [1160, 700], [1150, 580], [1100, 490], [1090, 390], [1130, 280], [1180, 200], [1195, 100], [1180, -10]], w: 7.5, taper: 0.65, jitter: 8, dur: 10, delay: -7, len: 95, trunk: true },
  // Ramificaciones (adelgazan hasta acabar en punta)
  { pts: [[330, 580], [420, 540], [470, 470], [560, 450], [620, 400], [650, 340]], w: 4.5, taper: 0.9, jitter: 7, dur: 8, delay: -2, len: 80 },
  { pts: [[300, 260], [200, 220], [160, 150], [90, 120], [30, 60], [0, 20]], w: 4, taper: 0.88, jitter: 7, dur: 9, delay: -5, len: 120 },
  { pts: [[730, 620], [640, 590], [600, 520], [520, 500], [470, 560], [420, 600]], w: 4.8, taper: 0.9, jitter: 7, dur: 8, delay: -3, len: 70 },
  { pts: [[760, 360], [850, 320], [900, 250], [980, 230], [1040, 170], [1060, 110]], w: 4.2, taper: 0.9, jitter: 7, dur: 7, delay: -6, len: 100 },
  { pts: [[1150, 580], [1250, 540], [1310, 470], [1400, 450], [1430, 410], [1440, 380]], w: 4.4, taper: 0.88, jitter: 7, dur: 9, delay: -1, len: 85 },
  { pts: [[1130, 280], [1040, 250], [990, 180], [930, 150], [880, 90], [870, 30]], w: 3.8, taper: 0.9, jitter: 7, dur: 8, delay: -8, len: 90 },
  { pts: [[0, 700], [80, 660], [140, 600], [200, 590], [250, 560], [280, 520]], w: 3.4, taper: 0.9, jitter: 6, dur: 7, delay: -4, len: 75 },
  { pts: [[1440, 640], [1360, 610], [1320, 550], [1260, 540], [1210, 510], [1190, 470]], w: 3.4, taper: 0.9, jitter: 6, dur: 7, delay: -9, len: 75 },
  // Ramitas
  { pts: [[560, 450], [600, 470], [640, 520]], w: 2.4, taper: 0.95, jitter: 5, dur: 6, delay: -3, len: 60 },
  { pts: [[980, 230], [1010, 270], [1050, 300]], w: 2.2, taper: 0.95, jitter: 5, dur: 6, delay: -5, len: 60 },
  { pts: [[90, 120], [110, 170], [90, 230]], w: 2.2, taper: 0.95, jitter: 5, dur: 6, delay: -2, len: 55 },
  { pts: [[1400, 450], [1380, 500], [1400, 560]], w: 2.2, taper: 0.95, jitter: 5, dur: 6, delay: -7, len: 55 },
].map((def, i) => ({ ...def, ...buildVein({ ...def, seed: 101 + i * 37 }) }));

// Burbujas irregulares (semilla fija → siempre el mismo reparto, pero nada de patrón):
//  - posiciones agrupadas en racimos, con huecos entre ellos
//  - muchas pequeñas y pocas grandes (distribución sesgada)
//  - forma elíptica, altura de ascenso, deriva, velocidad y escala final distintas
const BLOBS = (() => {
  const rnd = mulberry32(4242);
  const clusters = [90, 330, 560, 700, 980, 1210, 1380];
  return Array.from({ length: 26 }, () => {
    const base = clusters[Math.floor(rnd() * clusters.length)];
    const r = 11 + rnd() ** 2.2 * 58;                 // 11–69, sesgado a pequeñas
    return {
      cx: r1(base + (rnd() - 0.5) * 170),
      cy: r1(886 + rnd() * 34),
      rx: r1(r * (0.7 + rnd() * 0.8)),
      ry: r1(r * (0.65 + rnd() * 1.0)),
      dx: r1((rnd() - 0.5) * 150),
      rise: r1(25 + rnd() ** 1.8 * 230),               // 25–255
      scale: r1((0.65 + rnd() * 0.95) * 100) / 100,    // 0.65–1.6
      dur: r1(8 + rnd() * 20),
      delay: r1(-rnd() * 26),
    };
  });
})();

const EMBERS = Array.from({ length: 24 }, (_, i) => ({
  x: 40 + ((i * 163) % 1360),
  y: 780 + ((i * 37) % 120),
  r: 1.2 + (i % 4) * 0.6,
  dur: 9 + (i % 7) * 2,
  delay: -((i * 1.3) % 16),
  rise: 340 + (i % 6) * 70,
  sway: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 10),
}));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AnimatedBackground() {
  const animateNoise = !prefersReducedMotion();

  return (
    <div className="bgfx" aria-hidden="true">
      <svg
        className="bgfx__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          {/* Degradado de temperatura: núcleo amarillo → naranja → costra roja */}
          <linearGradient id="bgfx-heat" gradientUnits="userSpaceOnUse" x1="0" y1="920" x2="0" y2="760">
            <stop offset="0%" stopColor="#ffd23f" />
            <stop offset="35%" stopColor="#ff8a1f" />
            <stop offset="70%" stopColor="#ff4d00" />
            <stop offset="100%" stopColor="#8a1200" />
          </linearGradient>

          <radialGradient id="bgfx-haze" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#ff3d00" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff3d00" stopOpacity="0" />
          </radialGradient>

          {/* Magma fluido: bordes orgánicos + fusión de burbujas */}
          <filter id="bgfx-lava" x="-10%" y="-30%" width="120%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="7" result="noise">
              {animateNoise && (
                <animate
                  attributeName="baseFrequency"
                  dur="40s"
                  values="0.006 0.011;0.010 0.016;0.006 0.011"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" result="warp" />
            <feGaussianBlur in="warp" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>

          {/* Halo de las vetas (userSpaceOnUse: las vetas verticales no tienen bbox plano) */}
          <filter id="bgfx-vein-blur" filterUnits="userSpaceOnUse" x="-100" y="-100" width="1640" height="1100">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* 1. Resplandor térmico */}
        <rect className="bgfx__haze" width="1440" height="900" fill="url(#bgfx-haze)" />

        {/* 2. Lago de magma */}
        <g filter="url(#bgfx-lava)">
          <g fill="url(#bgfx-heat)">
            <rect x="-80" y="884" width="1600" height="120" />
            {BLOBS.map((b) => (
              <ellipse
                key={`${b.cx}-${b.cy}-${b.rx}`}
                cx={b.cx}
                cy={b.cy}
                rx={b.rx}
                ry={b.ry}
                className="bgfx__blob"
                style={{
                  animationDuration: `${b.dur}s`,
                  animationDelay: `${b.delay}s`,
                  '--bgfx-dx': `${b.dx}px`,
                  '--bgfx-rise': `${-b.rise}px`,
                  '--bgfx-s': b.scale,
                }}
              />
            ))}
          </g>
        </g>

        {/* 3. Vetas de magma activas (grosor y trazado irregulares) */}
        <g className="bgfx__veins">
          {/* Halo estático (el desenfoque se cachea; no se anima) */}
          <g filter="url(#bgfx-vein-blur)">
            {VEIN_DEFS.map((v) => (
              <path
                key={`g-${v.centerD}`}
                d={v.ribbon}
                className="bgfx__vein-glow"
                style={{ strokeWidth: v.w * 1.6 }}
              />
            ))}
            {VEIN_DEFS.flatMap((v) => v.hot).map((h) => (
              <circle key={`hg-${h.x}-${h.y}`} cx={h.x} cy={h.y} r={h.r * 2.4} className="bgfx__hotspot-glow" />
            ))}
          </g>

          {/* Cuerpo de la veta: rellena el contorno irregular y late */}
          {VEIN_DEFS.map((v, i) => (
            <path
              key={`c-${v.centerD}`}
              d={v.ribbon}
              className={`bgfx__vein-core${v.trunk ? '' : ' bgfx__vein-core--branch'}`}
              style={{
                animationDuration: `${4.2 + (i % 5) * 0.9}s`,
                animationDelay: `${-i * 0.8}s`,
              }}
            />
          ))}

          {/* Puntos calientes: cada uno late a su propio ritmo */}
          {VEIN_DEFS.flatMap((v, i) => v.hot.map((h, j) => (
            <circle
              key={`h-${h.x}-${h.y}`}
              cx={h.x}
              cy={h.y}
              r={h.r}
              className={`bgfx__hotspot${v.trunk ? '' : ' bgfx__hotspot--branch'}`}
              style={{ animationDuration: `${3 + ((i + j) % 4) * 1.1}s`, animationDelay: `${-(i * 1.3 + j)}s` }}
            />
          )))}

          {/* Pulsos de magma: longitudes, anchos y velocidades distintos */}
          {VEIN_DEFS.map((v, i) => (
            <path
              key={`p-${v.centerD}`}
              d={v.centerD}
              pathLength="1000"
              className={`bgfx__vein-pulse${v.trunk ? '' : ' bgfx__vein-pulse--branch'}`}
              style={{
                strokeWidth: Math.max(1.2, v.w * 0.35),
                strokeDasharray: `${v.len} 1500`,
                '--bgfx-travel': `${-(1000 + v.len)}`,
                animationDuration: `${v.dur}s`,
                animationDelay: `${v.delay - (i % 3) * 0.7}s`,
              }}
            />
          ))}
          {VEIN_DEFS.filter((v) => v.trunk).map((v) => (
            <path
              key={`p2-${v.centerD}`}
              d={v.centerD}
              pathLength="1000"
              className="bgfx__vein-pulse"
              style={{
                strokeWidth: Math.max(1.2, v.w * 0.3),
                strokeDasharray: `${Math.round(v.len * 0.6)} 1500`,
                '--bgfx-travel': `${-(1000 + Math.round(v.len * 0.6))}`,
                animationDuration: `${v.dur * 1.4}s`,
                animationDelay: `${v.delay - v.dur * 0.7}s`,
              }}
            />
          ))}
        </g>

        {/* 4. Brasas */}
        <g className="bgfx__embers">
          {EMBERS.map((e, i) => (
            <circle
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              cx={e.x}
              cy={e.y}
              r={e.r}
              className="bgfx__ember"
              style={{
                animationDuration: `${e.dur}s`,
                animationDelay: `${e.delay}s`,
                '--bgfx-rise': `${-e.rise}px`,
                '--bgfx-sway': `${e.sway}px`,
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
