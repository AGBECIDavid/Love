'use strict';
/* =========================================================================
   Pour toi — nuit étoilée & cœur de particules
   Un seul fichier, aucune dépendance. Canvas 2D avec projection 3D maison.
   ========================================================================= */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const AUTO    = location.hash.indexOf('auto') !== -1;  // mode capture d'écran
if (location.hash.indexOf('debug') !== -1){            // captures : transitions coupées
  const st = document.createElement('style');
  st.textContent = '*,*::before,*::after{transition:none !important; animation:none !important;}';
  document.head.appendChild(st);
}

const canvas = document.getElementById('sky');
let ctx = canvas.getContext('2d');

let W = 0, H = 0, DPR = 1;
const MOBILE = window.innerWidth < 768;

/* Budgets de particules (réduits sur mobile) */
const N_GALAXY = MOBILE ? 230 : 380;
const N_STARS  = MOBILE ?  80 : 120;
const N_HEART  = MOBILE ? 270 : 360;
const N_RAIN   = MOBILE ?  60 :  90;

/* ---------- Sprites lumineux pré-rendus (rapides à dessiner) ---------- */
function makeGlow(r, g, b){
  const s = 64, c = document.createElement('canvas');
  c.width = c.height = s;
  const g2 = c.getContext('2d');
  const grad = g2.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
  grad.addColorStop(0.00, 'rgba(255,255,255,0.95)');
  grad.addColorStop(0.18, `rgba(${r},${g},${b},0.85)`);
  grad.addColorStop(0.45, `rgba(${r},${g},${b},0.28)`);
  grad.addColorStop(1.00, `rgba(${r},${g},${b},0)`);
  g2.fillStyle = grad;
  g2.fillRect(0, 0, s, s);
  return c;
}
const SPRITES = {
  blue:   makeGlow(143, 184, 255),
  lav:    makeGlow(195, 176, 255),
  warm:   makeGlow(248, 240, 255),      // blanc légèrement violet
  violet: makeGlow(169, 124, 255),      // l'accent du thème
  sky:    makeGlow(138, 212, 255),      // le léger bleu
  rose:   makeGlow(240, 168, 216),
};

const rand  = (a, b) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const clamp01 = t => Math.max(0, Math.min(1, t));
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- Galaxie spirale (2 bras, cœur chaud, bords bleus) ---------- */
const galaxy = [];
for (let i = 0; i < N_GALAXY; i++){
  const arm = i % 2;
  const r = Math.pow(Math.random(), 0.62);               // densité vers le centre
  const theta = arm * Math.PI + r * 3.6 + gauss() * 0.38;
  const sprite = r < 0.22 ? SPRITES.warm
               : r < 0.55 ? (Math.random() < 0.5 ? SPRITES.lav : SPRITES.blue)
               : SPRITES.blue;
  galaxy.push({
    x: Math.cos(theta) * r,
    y: gauss() * 0.05 * (1.15 - r),                      // disque fin
    z: Math.sin(theta) * r,
    sprite,
    size: rand(2.2, r < 0.2 ? 8 : 5.5),
    alpha: rand(0.25, 0.8) * (1.1 - r * 0.5),
    tw: rand(0.4, 1.4), ph: rand(0, Math.PI * 2),
  });
}
const TILT = 1.08;                    // inclinaison du disque (~62°)
const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

/* ---------- Étoiles ambiantes (espace écran, scintillement) ---------- */
let stars = [];
function makeStars(){
  stars = [];
  for (let i = 0; i < N_STARS; i++){
    stars.push({
      x: Math.random(), y: Math.random(),
      size: rand(1.6, 4.2),
      alpha: rand(0.15, 0.6),
      tw: rand(0.5, 2.2), ph: rand(0, Math.PI * 2),
      sprite: Math.random() < 0.85 ? SPRITES.blue : SPRITES.lav,
    });
  }
}

/* ---------- Le cœur : équation paramétrique + volume en z ---------- */
function heartPoint(t){
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return { x: x / 17, y: -y / 17 - 0.15 };               // normalisé, y écran vers le bas
}
const heart = [];
for (let i = 0; i < N_HEART; i++){
  const t = Math.random() * Math.PI * 2;
  const shell = 0.55 + 0.45 * Math.pow(Math.random(), 0.6); // surtout la coque, un peu de remplissage
  const p = heartPoint(t);
  const tx = p.x * shell;
  const ty = p.y * shell;
  const tz = gauss() * 0.16 * (1.05 - 0.5 * shell);         // épaisseur → volume 3D
  const r = Math.random();                                   // violet dominant, bleu et rose en appui
  const sprite = r < 0.50 ? SPRITES.violet
               : r < 0.72 ? SPRITES.sky
               : r < 0.90 ? SPRITES.rose : SPRITES.warm;
  heart.push({
    tx, ty, tz,                 // cible (cœur formé)
    x: tx, y: ty, z: tz,        // position courante (espace unitaire)
    sx: 0, sy: 0,               // départ de l'assemblage
    vx: 0, vy: 0, vz: 0,        // vitesse pendant l'explosion
    px: 0, py: 0, hasPrev: false, // écran précédent → traînées de comète
    delay: Math.random() * 0.55,
    sprite,
    size: rand(2.6, MOBILE ? 6.5 : 7.5),
    tw: rand(1.8, 3.6), ph: rand(0, Math.PI * 2),
  });
}

/* =========================================================================
   Décor d'accueil — une nébuleuse en forme de cœur, un anneau de lumière
   et des filaments. Rien n'est une image : la nébuleuse est peinte une fois
   dans un calque hors écran, puis composée à chaque image.
   ========================================================================= */
function heartPath(c, cx, cy, s){
  const STEPS = 160;
  c.beginPath();
  for (let i = 0; i <= STEPS; i++){
    const p = heartPoint(i / STEPS * Math.PI * 2);
    const x = cx + p.x * s, y = cy + p.y * s;
    if (i) c.lineTo(x, y); else c.moveTo(x, y);
  }
  c.closePath();
}

let nebula = null, nebulaRef = 0, decorFade = 1;

function makeNebula(s){
  const pad = Math.ceil(s * 2);
  const c = document.createElement('canvas');
  c.width = c.height = pad * 2;
  const g = c.getContext('2d');
  const cx = pad, cy = pad;

  /* Le halo : la lumière que le cœur répand autour de lui */
  const halo = g.createRadialGradient(cx, cy, s * 0.15, cx, cy, s * 1.95);
  halo.addColorStop(0.00, 'rgba(255,190,225,0.32)');
  halo.addColorStop(0.28, 'rgba(196,140,255,0.17)');
  halo.addColorStop(0.60, 'rgba(120,150,255,0.07)');
  halo.addColorStop(1.00, 'rgba(16,10,40,0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, c.width, c.height);

  /* La nébuleuse, découpée en forme de cœur */
  g.save();
  heartPath(g, cx, cy, s * 0.99);
  g.clip();
  g.fillStyle = 'rgba(26,14,54,0.6)';                    // le fond profond du cœur
  g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = 'lighter';
  const BLOBS = [
    [-0.42, -0.30, 0.80, '150,100,255'],
    [ 0.44, -0.28, 0.74, '90,170,255'],
    [ 0.02,  0.34, 0.86, '255,110,185'],
    [-0.16,  0.02, 0.50, '255,180,225'],
    [ 0.22, -0.06, 0.44, '255,225,190'],
    [-0.55,  0.22, 0.42, '180,120,255'],
  ];
  for (const [bx, by, br, col] of BLOBS){
    const gg = g.createRadialGradient(cx + bx*s, cy + by*s, 0, cx + bx*s, cy + by*s, br*s);
    gg.addColorStop(0.00, 'rgba(' + col + ',0.52)');
    gg.addColorStop(0.55, 'rgba(' + col + ',0.15)');
    gg.addColorStop(1.00, 'rgba(' + col + ',0)');
    g.fillStyle = gg;
    g.fillRect(0, 0, c.width, c.height);
  }
  /* Poussière d'étoiles à l'intérieur */
  for (let i = 0; i < 160; i++){
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * s * 0.92;
    const d = rand(1.2, 4.4);
    g.globalAlpha = rand(0.25, 0.9);
    g.drawImage(Math.random() < 0.7 ? SPRITES.warm : SPRITES.rose,
                cx + Math.cos(a) * r - d/2, cy + Math.sin(a) * r * 0.95 - d/2, d, d);
  }
  g.globalAlpha = 1;

  /* Un noyau plus clair, comme un second cœur à l'intérieur */
  const core = g.createRadialGradient(cx, cy - s*0.05, 0, cx, cy - s*0.05, s*0.58);
  core.addColorStop(0.00, 'rgba(255,236,246,0.45)');
  core.addColorStop(0.45, 'rgba(255,170,215,0.20)');
  core.addColorStop(1.00, 'rgba(255,170,215,0)');
  g.fillStyle = core;
  g.fillRect(0, 0, c.width, c.height);
  g.restore();

  /* Le liseré : la lumière posée sur le bord */
  g.globalCompositeOperation = 'lighter';
  g.lineJoin = 'round';
  heartPath(g, cx, cy, s * 1.005);
  g.lineWidth = Math.max(1, s * 0.055);
  g.strokeStyle = 'rgba(255,225,245,0.13)';
  g.stroke();
  heartPath(g, cx, cy, s);
  g.lineWidth = Math.max(1, s * 0.018);
  g.strokeStyle = 'rgba(255,238,250,0.6)';
  g.stroke();
  heartPath(g, cx, cy - s * 0.04, s * 0.62);
  g.lineWidth = Math.max(1, s * 0.013);
  g.strokeStyle = 'rgba(255,190,225,0.34)';
  g.stroke();

  return c;
}

/* L'anneau de lumière : sa moitié haute passe derrière le cœur, la basse devant. */
function drawRing(now, hc, S, a, front){
  const rx = S * 1.46, ry = S * 0.40;
  ctx.save();
  ctx.translate(hc.x, hc.y + S * 0.14);
  ctx.rotate(-0.15 + 0.035 * Math.sin(now * 0.28));
  const grd = ctx.createLinearGradient(-rx, 0, rx, 0);
  grd.addColorStop(0.00, 'rgba(226,214,255,0)');
  grd.addColorStop(0.22, 'rgba(255,240,250,0.7)');
  grd.addColorStop(0.50, 'rgba(255,255,255,0.95)');
  grd.addColorStop(0.78, 'rgba(255,240,250,0.7)');
  grd.addColorStop(1.00, 'rgba(226,214,255,0)');
  ctx.strokeStyle = grd;
  ctx.lineWidth = Math.max(1, S * 0.017);
  ctx.globalAlpha = a * (front ? 0.85 : 0.18);   // l'arrière passe derrière le cœur
  ctx.beginPath();
  if (front) ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
  else       ctx.ellipse(0, 0, rx, ry, 0, Math.PI, Math.PI * 2);
  ctx.stroke();

  const th = REDUCED ? 0.5 : (now * 0.19) % 2;          // l'étincelle fait le tour
  if ((front && th < 1) || (!front && th >= 1)){
    const an = th * Math.PI;
    const d = S * 0.11;
    ctx.globalAlpha = a * 0.9;
    ctx.drawImage(SPRITES.warm, Math.cos(an) * rx - d/2, Math.sin(an) * ry - d/2, d, d);
  }
  ctx.restore();
}

/* Les filaments de lumière qui s'échappent du cœur */
function drawFilaments(now, hc, S, a){
  const n = MOBILE ? 5 : 7;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(216,228,255,0.9)';
  ctx.lineWidth = Math.max(0.6, S * 0.006);
  for (let side = -1; side <= 1; side += 2){
    for (let i = 0; i < n; i++){
      const p = i / (n - 1);
      const y = hc.y + (p - 0.5) * S * 1.35;
      const wob = Math.sin(now * 0.45 + i * 1.7 + side) * S * 0.12;
      ctx.globalAlpha = a * (0.10 + 0.10 * (0.5 + 0.5 * Math.sin(now * 0.7 + i * 1.3 + side)));
      ctx.beginPath();
      ctx.moveTo(hc.x + side * S * 0.5, y);
      ctx.bezierCurveTo(hc.x + side * S * 1.15, y + wob,
                        hc.x + side * S * 2.1,  y - wob * 1.3 + (p - 0.5) * S * 0.5,
                        hc.x + side * (S * 1.7 + W * 0.42), y + (p - 0.5) * S * 1.5 + wob);
      ctx.stroke();
    }
  }
}

/* ---------- Gerbes d'étincelles (ouverture d'un souvenir) ---------- */
const sparks = [];
const SPARK_MAX = MOBILE ? 140 : 260;
function spawnBurst(x, y){
  if (REDUCED) return;
  const n = MOBILE ? 26 : 40;
  for (let i = 0; i < n && sparks.length < SPARK_MAX; i++){
    const a = Math.random() * Math.PI * 2;
    const v = rand(70, 430);
    sparks.push({
      x, y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - rand(20, 140),
      life: 0, max: rand(0.7, 1.7),
      size: rand(2.4, 7),
      sprite: Math.random() < 0.6 ? SPRITES.violet
            : Math.random() < 0.6 ? SPRITES.sky : SPRITES.warm,
    });
  }
}

/* ---------- Pluie dorée du final ---------- */
let rain = [], rainOn = false;
function makeRain(){
  rain = [];
  for (let i = 0; i < N_RAIN; i++){
    rain.push({
      x: Math.random(), y: Math.random(),
      vy: rand(9, 24) / 1000, vx: rand(-4, 4) / 1000,     // fractions d'écran / s
      size: rand(1.8, 4.6),
      alpha: rand(0.2, 0.7),
      tw: rand(0.6, 1.8), ph: rand(0, Math.PI * 2),
      sprite: Math.random() < 0.62 ? SPRITES.violet
            : Math.random() < 0.55 ? SPRITES.sky : SPRITES.lav,
    });
  }
}

/* ---------- Redimensionnement / netteté (devicePixelRatio) ---------- */
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width  = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  makeStars();
  nebula = null;                                   // sera repeinte à la bonne taille
}
window.addEventListener('resize', resize);
resize();
makeRain();

/* ---------- Projection 3D maison ---------- */
const FOCAL = 3;
function project(x, y, z, cx, cy, scale){
  const s = FOCAL / (FOCAL + z);
  return { x: cx + x * s * scale, y: cy + y * s * scale, s };
}

/* ---------- Machine à états ---------- */
const EXPLODE_DUR  = 0.9;
const ASSEMBLE_DUR = 2.6;
let state = 'intro';                 // intro → explode → assemble → formed
let tState = 0;                      // horodatage d'entrée dans l'état
let rotT = 0;                        // le cœur oscille doucement (jamais vu par la tranche)
let dimTarget = 1, dim = 1;          // le cœur s'estompe pendant la lecture

/* Téléphone tenu à l'horizontale : plus de hauteur que de place — le cœur se
   range à gauche et laisse la colonne de droite au titre et au bouton. */
function wideShort(){ return W > H * 1.4 && H < 700; }   // doit suivre la média-requête de intro.css

function heartScaleBase(){
  return wideShort() ? Math.min(W * 0.26, H * 0.42, 240)
                     : Math.min(W * 0.40, H * 0.30, 240);
}
function heartCenter(){
  return wideShort() && state === 'intro' ? { x: W * 0.28, y: H * 0.52 }
                                          : { x: W * 0.5,  y: H * 0.42 };
}
function introScale(){ return heartScaleBase() * 0.92; }   // l'accueil : cœur en grand

/* ---------- Boucle de rendu (horloge = timestamp rAF) ---------- */
let last = -1, tStateInit = false;
function frame(ts){
  const now = ts / 1000;
  if (last < 0) last = now;
  const dt = Math.min(0.05, Math.max(0.001, now - last));
  last = now;
  if (tStateInit){ tState = now; tStateInit = false; }

  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  /* --- Galaxie : rotation lente autour de Y, puis inclinaison, puis projection --- */
  const gRot = REDUCED ? 0.4 : now * 0.045;
  const cg = Math.cos(gRot), sg = Math.sin(gRot);
  const gcx = W * 0.5, gcy = H * 0.36, GS = Math.max(W, H) * 0.56;
  for (let i = 0; i < galaxy.length; i++){
    const p = galaxy[i];
    const x1 = p.x * cg - p.z * sg;
    const z1 = p.x * sg + p.z * cg;
    const y2 = p.y * cosT - z1 * sinT;
    const z2 = p.y * sinT + z1 * cosT;
    const pr = project(x1, y2, z2 * 0.8, gcx, gcy, GS);
    const tw = REDUCED ? 1 : 0.7 + 0.3 * Math.sin(now * p.tw + p.ph);
    ctx.globalAlpha = p.alpha * tw * pr.s * 0.85;
    const d = p.size * pr.s;
    ctx.drawImage(p.sprite, pr.x - d/2, pr.y - d/2, d, d);
  }

  /* --- Étoiles ambiantes --- */
  for (let i = 0; i < stars.length; i++){
    const st = stars[i];
    const tw = REDUCED ? 1 : 0.6 + 0.4 * Math.sin(now * st.tw + st.ph);
    ctx.globalAlpha = st.alpha * tw;
    ctx.drawImage(st.sprite, st.x * W - st.size/2, st.y * H - st.size/2, st.size, st.size);
  }

  /* --- Cœur de particules --- */
  dim += (dimTarget - dim) * Math.min(1, dt * 1.2);
  const hc = heartCenter();
  const base = heartScaleBase();
  const el = now - tState;

  let S, alphaMul = dim;
  if (state === 'intro'){
    S = introScale() * (1 + 0.035 * Math.sin(now * 1.5));
    alphaMul = 1;
  } else {
    const grow = clamp01((now - tState + (state !== 'explode' ? EXPLODE_DUR : 0)) / 3.2);
    S = base * lerp(0.88, 1, easeOutCubic(state === 'formed' ? 1 : grow));
    if (state === 'formed') S = base * (1 + 0.02 * Math.sin(now * 1.4));
  }

  if (state === 'explode'){
    for (const p of heart){
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      p.vx *= Math.pow(0.14, dt); p.vy *= Math.pow(0.14, dt); p.vz *= Math.pow(0.14, dt);
    }
    if (el >= EXPLODE_DUR){
      for (const p of heart){ p.sx = p.x; p.sy = p.y; p.vz = p.z; } // vz réutilisé = z de départ
      state = 'assemble'; tState = now;
    }
  } else if (state === 'assemble'){
    for (const p of heart){
      const k = easeOutCubic(clamp01((el - p.delay) / ASSEMBLE_DUR));
      p.x = lerp(p.sx, p.tx, k);
      p.y = lerp(p.sy, p.ty, k);
      p.z = lerp(p.vz, p.tz, k);
    }
    rotT += dt * clamp01(el / ASSEMBLE_DUR);
    if (el >= ASSEMBLE_DUR + 0.6){ state = 'formed'; tState = now; }
  } else if (state === 'formed'){
    rotT += dt;
    if (!revealsBuilt) buildReveals(now);
  }

  /* --- Décor d'accueil : filaments, anneau arrière, nébuleuse --- */
  if (state !== 'intro') decorFade = Math.max(0, decorFade - dt / 1.1);
  if (decorFade > 0.01){
    const ref = introScale();
    if (!nebula || Math.abs(nebulaRef - ref) > 1){ nebula = makeNebula(ref); nebulaRef = ref; }
    drawFilaments(now, hc, S, decorFade);
    drawRing(now, hc, S, decorFade, false);
    const d = nebula.width * (S / nebulaRef);
    ctx.globalAlpha = decorFade;
    ctx.drawImage(nebula, hc.x - d/2, hc.y - d/2, d, d);
  }

  const rotY = 0.52 * Math.sin(rotT * (REDUCED ? 0.06 : 0.55));
  const cr = Math.cos(rotY), sr = Math.sin(rotY);
  const trails = state === 'assemble' && !REDUCED;
  if (trails){ ctx.lineCap = 'round'; }
  for (const p of heart){
    const xr = p.x * cr - p.z * sr;
    const zr = p.x * sr + p.z * cr;
    const pr = project(xr, p.y, zr * 0.7, hc.x, hc.y, S);
    const tw = 0.7 + 0.3 * Math.sin(now * p.tw + p.ph);
    ctx.globalAlpha = alphaMul * tw * Math.min(1, pr.s);
    const d = p.size * pr.s * (S / base);
    if (trails && p.hasPrev){
      const dx = pr.x - p.px, dy = pr.y - p.py;
      if (dx*dx + dy*dy > 4){
        ctx.globalAlpha = alphaMul * 0.28;
        ctx.strokeStyle = 'rgba(169,124,255,0.6)';
        ctx.lineWidth = Math.max(0.6, d * 0.22);
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(pr.x, pr.y); ctx.stroke();
        ctx.globalAlpha = alphaMul * tw;
      }
    }
    ctx.drawImage(p.sprite, pr.x - d/2, pr.y - d/2, Math.max(1, d), Math.max(1, d));
    p.px = pr.x; p.py = pr.y; p.hasPrev = true;
  }

  /* --- La moitié avant de l'anneau, par-dessus le cœur --- */
  if (decorFade > 0.01) drawRing(now, hc, S, decorFade, true);

  /* --- Pluie dorée très lente (final) --- */
  if (rainOn){
    for (const p of rain){
      p.y += p.vy * dt; p.x += p.vx * dt;
      if (p.y > 1.05){ p.y = -0.05; p.x = Math.random(); }
      const tw = 0.55 + 0.45 * Math.sin(now * p.tw + p.ph);
      ctx.globalAlpha = p.alpha * tw;
      ctx.drawImage(p.sprite, p.x * W - p.size/2, p.y * H - p.size/2, p.size, p.size);
    }
  }

  /* --- Étincelles --- */
  for (let i = sparks.length - 1; i >= 0; i--){
    const sp = sparks[i];
    sp.life += dt;
    if (sp.life >= sp.max){ sparks.splice(i, 1); continue; }
    sp.x += sp.vx * dt; sp.y += sp.vy * dt;
    sp.vy += 260 * dt;                                  // légère gravité
    sp.vx *= Math.pow(0.22, dt); sp.vy *= Math.pow(0.55, dt);
    const k = 1 - sp.life / sp.max;
    ctx.globalAlpha = k * k;
    const d = sp.size * (0.5 + k);
    ctx.drawImage(sp.sprite, sp.x - d/2, sp.y - d/2, d, d);
  }

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  while (reveals.length && now >= reveals[0].at) reveals.shift().fn();

  if (!FF_ACTIVE) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* =========================================================================
   Déroulé : clic → explosion → assemblage → lecture → signature
   ========================================================================= */
let started = false;

function startExperience(skipAudio){
  if (started) return;
  started = true;
  document.body.classList.add('started');

  if (!skipAudio){
    try { startMusic(); } catch (e) { /* l'expérience continue sans musique */ }
  }

  if (REDUCED){
    // Version apaisée : pas d'explosion, le cœur apparaît formé, tout en fondus.
    for (const p of heart){ p.x = p.tx; p.y = p.ty; p.z = p.tz; }
    state = 'formed'; tStateInit = true;
    return;
  }

  for (const p of heart){
    // direction aléatoire sur la sphère + vitesse franche : dispersion plein écran
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(rand(-1, 1));
    const v = rand(2.4, 6.0);
    p.vx = Math.sin(b) * Math.cos(a) * v;
    p.vy = Math.sin(b) * Math.sin(a) * v * 0.8;
    p.vz = Math.cos(b) * v * 0.7;
    p.hasPrev = false;
  }
  state = 'explode';
  tStateInit = true;
}

/* =========================================================================
   La lettre — c'est elle qui donne le rythme
   -------------------------------------------------------------------------
   Les paragraphes n'arrivent plus à heure fixe. Ils sont empilés en cartes
   (voir letter.js) et c'est le défilement qui les fait tourner. Ici on ne
   garde que l'ouverture : la lettre paraît, le cœur s'estompe, et le reste
   de la page est accessible dès la première seconde.
   ========================================================================= */
let reveals = [], revealsBuilt = false;

function buildReveals(now){
  revealsBuilt = true;
  const HOLD = REDUCED ? 2.0 : 1.7;          // on laisse le cœur respirer seul
  reveals.push({ at: now + HOLD, fn: startReading });
}

function startReading(){
  document.body.classList.add('reading');
  dimTarget = 0.38;

  /* La lettre elle-même est tenue par letter.js : les passages sont empilés
     en cartes, et c'est le défilement qui les fait tourner. */

  /* Le reste de la page est ouvert tout de suite : la barre du haut y mène,
     et le simple fait de descendre suffit. On attend que tous les scripts
     soient là — en arrivée directe, gallery.js n'est pas encore chargé. */
  const ouvreTout = () => {
    if (window.revealBirthday) window.revealBirthday(false);
    if (window.revealGallery) window.revealGallery(false);
  };
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ouvreTout, { once: true });
  } else {
    ouvreTout();
  }
}


document.getElementById('openBtn').addEventListener('click', () => startExperience(false));

/* Mode capture : #auto démarre sans clic ; #ff=N avance l'animation de N secondes */
let FF_ACTIVE = false;
const FF = Number((location.hash.match(/ff=(\d+)/) || [])[1] || 0);
if (FF > 0){
  /* On attend le chargement complet : l'anniversaire et la galerie vivent dans
     leurs propres fichiers, et la frise doit pouvoir les appeler. */
  window.addEventListener('load', () => {
    startExperience(true);
    FF_ACTIVE = true;
    const realCtx = ctx;
    const tiny = document.createElement('canvas');
    tiny.width = tiny.height = 2;
    ctx = tiny.getContext('2d');
    for (let t = 0.05; t < FF; t += 1/30) frame(t * 1000);
    ctx = realCtx;
    FF_ACTIVE = false;
    requestAnimationFrame(frame);                    // on rend la main à l'animation
  });
} else if (AUTO){
  setTimeout(() => startExperience(true), 300);
}

/* =========================================================================
   MUSIQUE
   -------------------------------------------------------------------------
   💿 TA MUSIQUE : pose simplement un fichier nommé « musique.mp3 » à côté
   de index.html. C'est lui qui jouera, en boucle, avec un fondu de 3 s.

   S'il n'y est pas — ou si le navigateur ne sait pas le lire — la nappe
   générée en Web Audio prend le relais toute seule : la page n'est jamais
   muette, et il n'y a rien d'autre à changer dans le code.
   ========================================================================= */
const MUSIC_FILE  = 'musique.mp3';
const FILE_VOLUME = 0.62;
let audio = null, fadeTimer = 0;

/* Fondu du volume du fichier, en douceur */
function fadeAudio(cible, secondes){
  if (!audio) return;
  clearInterval(fadeTimer);
  const PAS = 40;
  const n = Math.max(1, Math.round(secondes * 1000 / PAS));
  const depart = audio.volume, ecart = (cible - depart) / n;
  let i = 0;
  fadeTimer = setInterval(() => {
    i++;
    if (audio) audio.volume = Math.max(0, Math.min(1, depart + ecart * i));
    if (i >= n) clearInterval(fadeTimer);
  }, PAS);
}

function startMusic(){
  const a = new Audio(MUSIC_FILE);
  a.loop = true; a.volume = 0; a.preload = 'auto';

  let tranché = false;
  const secours = () => {                      // pas de fichier : on joue la nappe
    if (tranché) return;
    tranché = true;
    try { a.pause(); } catch (e) {}
    audio = null;
    startGeneratedMusic();
  };

  a.addEventListener('error', secours, { once: true });
  a.addEventListener('playing', () => {
    if (tranché) return;
    tranché = true;
    audio = a;
    if (muted) a.muted = true;
    fadeAudio(FILE_VOLUME, 3);
  }, { once: true });

  const joue = a.play();
  if (joue && joue.catch) joue.catch(secours);
  setTimeout(secours, 4000);                   // rien n'a démarré : on n'attend pas plus
}

let AC = null, master = null, bus = null, muted = false;
const VOLUME = 0.20;
const midi = m => 440 * Math.pow(2, (m - 69) / 12);

/* I – V – vi – IV en do majeur, registre grave et chaud */
const CHORDS = [
  [48, 55, 60, 64],   // C
  [43, 55, 59, 62],   // G
  [45, 57, 60, 64],   // Am
  [41, 53, 57, 60],   // F
];
const CHORD_DUR = 7;
/* Pentatonique consonante avec les 4 accords, pour les notes "piano" */
const SPARKLE = [72, 74, 76, 79, 81, 84, 88];

function startGeneratedMusic(){
  AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();

  master = AC.createGain();
  master.gain.setValueAtTime(0.0001, AC.currentTime);
  master.gain.linearRampToValueAtTime(VOLUME, AC.currentTime + 3);   // fondu 3 s
  master.connect(AC.destination);

  /* Réverbération simple : delay en feedback, filtré pour s'adoucir */
  const delay = AC.createDelay(2); delay.delayTime.value = 0.46;
  const fb = AC.createGain(); fb.gain.value = 0.42;
  const damp = AC.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 1500;
  delay.connect(damp); damp.connect(fb); fb.connect(delay);
  const wet = AC.createGain(); wet.gain.value = 0.33;
  delay.connect(wet); wet.connect(master);

  bus = AC.createGain();
  bus.connect(master);
  bus.connect(delay);

  /* Nappe : planification en continu, un peu en avance */
  let next = AC.currentTime + 0.15, ci = 0;
  playChord(ci % CHORDS.length, next); ci++; next += CHORD_DUR;
  setInterval(() => {
    while (next < AC.currentTime + 3){
      playChord(ci % CHORDS.length, next);
      ci++; next += CHORD_DUR;
    }
  }, 600);

  scheduleSparkle(2.8);
}

function playChord(idx, when){
  for (const m of CHORDS[idx]){
    for (const [type, det, cutoff, peak] of [['sine', 0, 1200, 0.075], ['triangle', 5, 720, 0.042]]){
      const o = AC.createOscillator();
      o.type = type; o.frequency.value = midi(m);
      o.detune.value = det + rand(-2, 2);
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = cutoff; lp.Q.value = 0.3;
      const g = AC.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.linearRampToValueAtTime(peak, when + 2.6);        // attaque très douce
      g.gain.setValueAtTime(peak, when + CHORD_DUR - 2.0);
      g.gain.linearRampToValueAtTime(0.0001, when + CHORD_DUR + 0.7);
      o.connect(lp); lp.connect(g); g.connect(bus);
      o.start(when); o.stop(when + CHORD_DUR + 0.9);
    }
  }
}

function scheduleSparkle(delaySec){
  setTimeout(() => {
    if (AC){
      const m = SPARKLE[Math.floor(Math.random() * SPARKLE.length)];
      const t = AC.currentTime + 0.02;
      const o = AC.createOscillator(); o.type = 'triangle'; o.frequency.value = midi(m);
      const g = AC.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.10, t + 0.012);          // attaque piano
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);     // longue résonance
      const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
      o.connect(lp); lp.connect(g); g.connect(bus);
      o.start(t); o.stop(t + 3);
    }
    scheduleSparkle(rand(2.4, 6.0));
  }, delaySec * 1000);
}

function setMuted(m){
  muted = m;
  if (audio){ audio.muted = m; return; }
  if (!master) return;
  const t = AC.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(m ? 0.0001 : VOLUME, t + 0.5);
}

/* Baisse la nappe pendant la lecture d'une vidéo, puis la remonte */
function duckMusic(on){
  if (muted) return;
  if (audio){ fadeAudio(on ? FILE_VOLUME * 0.12 : FILE_VOLUME, 0.6); return; }
  if (!master) return;
  const t = AC.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(on ? VOLUME * 0.12 : VOLUME, t + 0.6);
}

/* Pont vers gallery.js : étincelles, musique en sourdine, préférence de mouvement */
window.PourToi = {
  reduced: REDUCED,
  burst: spawnBurst,
  duck: duckMusic,
  /* La pluie dorée, quand la lettre arrive sur le nom */
  rain(on){ rainOn = !!on; },
  /* Arrivée directe (#cadeau, #anniversaire, #galerie) : on saute l'accueil.
     Le cœur est déjà formé, le décor de nébuleuse s'efface, et la frise de
     la lettre ne s'enclenche pas — la page ne bougera pas toute seule. */
  settle(){
    if (state !== 'intro') return;
    for (const p of heart){ p.x = p.tx; p.y = p.ty; p.z = p.tz; }
    state = 'formed';
    tStateInit = true;
    revealsBuilt = true;
    started = true;
    document.body.classList.add('started');
    startReading();                              // la lettre et tout le reste, d'un coup
  },
  /* Le bouton « Ouvre ton cadeau » allume la musique : les navigateurs
     n'autorisent le son qu'après un vrai clic. Sans effet si elle joue déjà. */
  music(){
    if (started) return;
    started = true;
    document.body.classList.add('started');
    try { startMusic(); } catch (e) { /* le cadeau s'ouvre même sans son */ }
  },
};

const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
  setMuted(!muted);
  muteBtn.textContent = muted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', muted ? 'Remettre le son' : 'Couper le son');
});

