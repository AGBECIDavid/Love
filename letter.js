/* =========================================================================
   La lettre — des cartes côte à côte, que l'on fait glisser.

   Un passage au centre, les voisins qui dépassent sur les côtés. Glisser à
   gauche ou à droite change de passage ; glisser vers le bas descend dans la
   page. Les deux gestes ne se mélangent jamais.

   Le glissement et le calage sur chaque carte sont ceux du navigateur
   (scroll-snap) : rien n'est simulé, donc ça réagit pareil sur tous les
   téléphones, sans à-coups. Ce script ne fait que la mise en scène (le
   voisin s'estompe), les flèches, les points et le clavier.

   En mouvement réduit, rien n'est construit : la lettre reste une colonne.
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

const track = document.createElement('div');
track.className = 'letter-track';
track.setAttribute('role', 'region');
track.setAttribute('aria-roledescription', 'carrousel');
track.setAttribute('aria-label', 'La lettre, en ' + N + ' passages');
track.tabIndex = 0;

const cards = blocks.map((b, i) => {
  const c = document.createElement('article');
  c.className = 'lcard';
  c.setAttribute('aria-roledescription', 'passage');
  c.setAttribute('aria-label', (i + 1) + ' sur ' + N);
  b.classList.add('show');
  c.appendChild(b);
  c.addEventListener('click', () => { if (i !== index) goTo(i); });   // toucher un voisin l'amène au centre
  track.appendChild(c);
  return c;
});

/* Sous la carte : ‹  ○ ● ○ ○ ○ ○  › */
const nav = document.createElement('div');
nav.className = 'letter-nav';

const prev = document.createElement('button');
prev.type = 'button'; prev.className = 'round';
prev.setAttribute('aria-label', 'Passage précédent');
prev.textContent = '‹';
prev.addEventListener('click', () => goTo(index - 1));

const next = document.createElement('button');
next.type = 'button'; next.className = 'round';
next.setAttribute('aria-label', 'Passage suivant');
next.textContent = '›';
next.addEventListener('click', () => goTo(index + 1));

const dots = document.createElement('div');
dots.className = 'letter-dots';
const puces = cards.map((_, i) => {
  const d = document.createElement('button');
  d.type = 'button';
  d.setAttribute('aria-label', 'Passage ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dots.appendChild(d);
  return d;
});

nav.append(prev, dots, next);

/* Une phrase d'aide qui change selon l'endroit, puis s'efface */
const hint = document.createElement('p');
hint.className = 'letter-hint';

/* Pour les lecteurs d'écran : le passage courant est annoncé */
const live = document.createElement('p');
live.className = 'letter-live';
live.setAttribute('aria-live', 'polite');

inner.append(track, nav, hint, live);

/* ---------- Position ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let index = 0, aGlisse = false, finaleVue = false;

function goTo(i){
  i = clamp(i, 0, N - 1);
  const c = cards[i];
  track.scrollTo({
    left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2,
    behavior: 'smooth',
  });
}

/* La mise en scène : le passage au centre est net, les voisins s'effacent un peu */
function layout(){
  const centre = track.scrollLeft + track.clientWidth / 2;
  let proche = 0, mieux = Infinity;

  cards.forEach((c, i) => {
    const milieu = c.offsetLeft + c.offsetWidth / 2;
    const off = (milieu - centre) / (c.offsetWidth || 1);
    const a = Math.min(1, Math.abs(off));
    c.style.transform = 'scale(' + (1 - a * 0.07).toFixed(3) + ')';
    c.style.setProperty('--dim', (a * 0.55).toFixed(3));
    if (Math.abs(off) < mieux){ mieux = Math.abs(off); proche = i; }
  });

  if (proche !== index) setIndex(proche);
}

function setIndex(i){
  if (i === index) return;
  index = i;
  aGlisse = true;                            // elle a tourné au moins une page
  render();
}

function render(){
  const i = index;
  cards.forEach((c, k) => {
    c.classList.toggle('here', k === i);
    c.setAttribute('aria-hidden', k === i ? 'false' : 'true');
  });
  puces.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  prev.disabled = i === 0;
  next.disabled = i === N - 1;
  live.textContent = 'Passage ' + (i + 1) + ' sur ' + N;

  if (i === N - 1){
    hint.textContent = '↓ descends, la suite t’attend';
    hint.classList.add('show');
    if (!finaleVue){ finaleVue = true; if (BR.rain) BR.rain(true); }   // la pluie dorée au nom
  } else if (!aGlisse){
    hint.textContent = 'glisse pour lire la suite  →';
    hint.classList.add('show');
  } else {
    hint.classList.remove('show');
  }
}

let attend = false;
track.addEventListener('scroll', () => {
  if (attend) return;
  attend = true;
  requestAnimationFrame(() => { attend = false; layout(); });
}, { passive: true });

window.addEventListener('resize', layout);

/* Au clavier : ← et → tournent les pages, tant que la lettre est à l'écran
   et que la visionneuse des souvenirs n'est pas ouverte. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  if (document.body.classList.contains('view-open')) return;
  if (!document.body.classList.contains('reading')) return;
  const r = track.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight) return;
  e.preventDefault();
  goTo(index + (e.key === 'ArrowRight' ? 1 : -1));
});

render();
layout();

})();
