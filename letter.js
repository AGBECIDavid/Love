/* =========================================================================
   La lettre — un jeu de cartes verticales.

   Les paragraphes ne s'affichent plus un par un sur une horloge : ils sont
   empilés en profondeur, le premier au centre. C'est le défilement de la
   page qui les fait tourner — au doigt, à la molette, au clavier, à la
   barre. Rien n'est capturé : le geste reste celui du navigateur, donc ça
   marche partout et on peut continuer vers l'anniversaire sans rien fermer.

   Si le mouvement réduit est demandé, on ne construit rien : la lettre
   reste une colonne de paragraphes, lisible d'un bout à l'autre.
   ========================================================================= */
'use strict';
(function(){

const BR = window.PourToi || {};
const REDUCED = BR.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scroller = document.getElementById('letter');
const inner    = scroller && scroller.querySelector('.letter-inner');
if (!inner) return;

const blocks = Array.prototype.slice.call(inner.querySelectorAll(':scope > .block'));
const N = blocks.length;

/* ---------- Version apaisée : la lettre reste une colonne ---------- */
if (REDUCED || N < 2){
  blocks.forEach((b) => b.classList.add('show'));
  return;
}

/* ---------- Construction ---------- */
inner.classList.add('deck-on');

const pin  = document.createElement('div');
pin.className = 'letter-pin';
const deck = document.createElement('div');
deck.className = 'letter-deck';
pin.appendChild(deck);

const cards = blocks.map((b, i) => {
  const c = document.createElement('article');
  c.className = 'lcard';
  c.setAttribute('aria-label', 'Passage ' + (i + 1) + ' sur ' + N);
  b.classList.add('show');
  c.appendChild(b);
  deck.appendChild(c);
  return c;
});

/* Les points de repère, pour sauter d'un passage à l'autre */
const dots = document.createElement('nav');
dots.className = 'letter-dots';
dots.setAttribute('aria-label', 'Passages de la lettre');
const puces = cards.map((_, i) => {
  const d = document.createElement('button');
  d.type = 'button';
  d.setAttribute('aria-label', 'Passage ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dots.appendChild(d);
  return d;
});
pin.appendChild(dots);

const count = document.createElement('div');
count.className = 'letter-count';
pin.appendChild(count);

inner.appendChild(pin);

/* Les repères d'arrêt : un par passage, pour que le défilement se cale */
const anchors = cards.map((_, i) => {
  const a = document.createElement('div');
  a.className = 'letter-anchor';
  inner.appendChild(a);
  return a;
});

/* ---------- Mesures ---------- */
let pas = 0;                                 // la course d'un passage, en pixels

function measure(){
  pas = scroller.clientHeight;
  inner.style.height = (N * pas) + 'px';
  anchors.forEach((a, i) => { a.style.top = (i * pas) + 'px'; });
  layout();
}

/* ---------- Placement des cartes ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let index = 0, finaleVue = false;

function layout(){
  if (!pas) return;
  const pos = clamp((scroller.scrollTop - inner.offsetTop) / pas, 0, N - 1);

  for (let i = 0; i < N; i++){
    const off = i - pos;                     // < 0 : déjà lu, > 0 : à venir
    const a = Math.abs(off);
    const ty = off * 96;                     // une carte par étage : rien ne se chevauche
    const tz = -a * 260;                     // et elles s'enfoncent
    const rx = clamp(-off * 12, -30, 30);    // en basculant légèrement
    /* Les cartes restent opaques — c'est un voile et le flou qui les enfoncent —
       et elles ne s'effacent qu'une fois loin derrière. */
    const dim = Math.min(0.84, a * 0.62);
    const op = clamp(1 - (a - 1.3) / 0.7, 0, 1);

    const c = cards[i];
    c.style.transform = 'translateY(' + ty + '%) translateZ(' + tz + 'px) rotateX(' + rx + 'deg)';
    c.style.opacity = op;
    c.style.setProperty('--dim', dim.toFixed(3));
    c.style.zIndex = String(120 - Math.round(a * 10));
    c.style.filter = a > 0.25 ? 'blur(' + Math.min(5, (a - 0.25) * 5).toFixed(2) + 'px)' : '';
    c.classList.toggle('here', a < 0.5);
    c.setAttribute('aria-hidden', a < 0.5 ? 'false' : 'true');
  }

  const n = Math.round(pos);
  if (n !== index){
    index = n;
    puces.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    count.textContent = (index + 1) + ' / ' + N;
  }
  /* La pluie dorée quand elle arrive sur le nom */
  if (!finaleVue && pos > N - 1.4){
    finaleVue = true;
    if (BR.rain) BR.rain(true);
  }
}

function goTo(i){
  scroller.scrollTo({
    top: inner.offsetTop + i * pas,
    behavior: REDUCED ? 'auto' : 'smooth',
  });
}

/* ---------- Boucle ---------- */
let attend = false;
function onScroll(){
  if (attend) return;
  attend = true;
  requestAnimationFrame(() => { attend = false; layout(); });
}

scroller.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', measure);
window.addEventListener('orientationchange', () => setTimeout(measure, 250));

/* Les flèches du clavier passent d'un passage à l'autre */
document.addEventListener('keydown', (e) => {
  if (document.body.classList.contains('view-open')) return;   // la visionneuse d'abord
  if (!document.body.classList.contains('reading')) return;
  if (e.key === 'ArrowDown' && index < N - 1){ e.preventDefault(); goTo(index + 1); }
  else if (e.key === 'ArrowUp' && index > 0){ e.preventDefault(); goTo(index - 1); }
});

measure();
count.textContent = '1 / ' + N;
puces[0].setAttribute('aria-current', 'true');

})();
