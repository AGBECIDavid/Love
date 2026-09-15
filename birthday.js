/* =========================================================================
   Anniversaire — compte à rebours jusqu'à son jour, puis le cadeau.

   Le cadeau se joue en trois actes, tout seul, après un unique clic :
     1. « Bienvenue dans mes souvenirs » ;
     2. les photos et vidéos défilent d'elles-mêmes (moteur de gallery.js) ;
     3. le petit bonhomme se dessine trait par trait, envoie son cœur, et le
        grand cœur s'allume — « Joyeux anniversaire », « Je t'aime ».

   Le bouton apparaît le jour J. Pour un QR code (ou pour répéter avant
   l'heure), l'adresse index.html#cadeau ouvre la carte, bouton prêt.
   Aucune dépendance. Tout ce qui se personnalise tient dans BIRTHDAY.
   ========================================================================= */
'use strict';
(function(){

/* ---------- À personnaliser ---------- */
const BIRTHDAY = {
  name:  'Fumilayo Fifamin Yousra AMADOU',
  day:   3,          // ← le jour de sa naissance
  month: 10,         // ← le mois (1 = janvier, 12 = décembre)
  born:  2007,       // ← son année de naissance (elle a 19 ans le 3 octobre 2026)
  message: 'Le monde a reçu un cadeau ce jour-là, et il ne le savait pas encore.',
  wish:    'Mon vœu tient en un mot : toi. Aujourd’hui, demain, et tous les jours d’après.',
  welcome: 'Bienvenue dans mes souvenirs',
  love:    'Je t’aime',
};

/* ---------- Pont avec la page (particules dorées, musique, mouvement) ---------- */
const BR = window.PourToi || {};
const REDUCED = BR.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const burst = BR.burst || function(){};

const section = document.getElementById('bday');
const card    = section.querySelector('.bday-card');
const kicker  = document.getElementById('bdayKicker');
const lead    = document.getElementById('bdayLead');
const nameEl  = document.getElementById('bdayName');
const dateEl  = document.getElementById('bdayDate');
const msgEl   = document.getElementById('bdayMsg');
const wishBtn = document.getElementById('bdayWish');
const secret  = document.getElementById('bdaySecret');
const numD = document.getElementById('bdayDays');
const numH = document.getElementById('bdayHours');
const numM = document.getElementById('bdayMins');
const numS = document.getElementById('bdaySec');
const labD = document.getElementById('bdayDaysLab');

const giftBtn   = document.getElementById('bdayGift');
const replayBtn = document.getElementById('bdayReplay');
const introBox  = document.getElementById('showIntro');
const stage     = document.getElementById('bdayStage');
const heartSvg  = document.getElementById('bdayHeart');
const biu       = document.getElementById('bdayBiu');
const loveEl    = document.getElementById('bdayLove');

const MS_DAY = 86400000;

/* ---------- Dates ---------- */
function midnight(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

/* Prochaine occurrence : cette année si elle n'est pas passée, sinon l'an prochain. */
function nextBirthday(now){
  const here = new Date(now.getFullYear(), BIRTHDAY.month - 1, BIRTHDAY.day);
  return here >= midnight(now) ? here : new Date(now.getFullYear() + 1, BIRTHDAY.month - 1, BIRTHDAY.day);
}

function isBirthday(now){
  return now.getDate() === BIRTHDAY.day && now.getMonth() === BIRTHDAY.month - 1;
}

function longDate(d){
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(d);
  } catch (e){
    return BIRTHDAY.day + '/' + BIRTHDAY.month;      // navigateur sans Intl : on reste lisible
  }
}

function pad(n){ return n < 10 ? '0' + n : String(n); }

/* L'âge qu'elle a (ou qu'elle aura) le jour de cette occurrence. */
function ageAt(d){ return d.getFullYear() - BIRTHDAY.born; }

/* ---------- Compte à rebours ---------- */
function renderCountdown(now){
  const left = Math.max(0, nextBirthday(now) - now);
  const secs = Math.floor(left / 1000);
  const days = Math.floor(left / MS_DAY);

  numD.textContent = String(days);
  numH.textContent = pad(Math.floor(secs / 3600) % 24);
  numM.textContent = pad(Math.floor(secs / 60) % 60);
  numS.textContent = pad(secs % 60);
  labD.textContent = days > 1 ? 'jours' : 'jour';
}

/* ---------- Le jour J ---------- */
let partying = false;

function celebrate(){
  if (partying) return;
  partying = true;
  section.classList.add('is-today');
  kicker.textContent = 'Aujourd’hui, le monde te fête';
  lead.textContent = 'Joyeux anniversaire';
  const today = new Date();
  dateEl.textContent = 'C’est aujourd’hui — ' + longDate(today) + '. Tu as ' + ageAt(today) + ' ans.';
  giftBtn.hidden = false;                            // le cadeau attend son clic
  sparkleLoop();
}

/* Quelques étincelles dorées au-dessus de la carte, tant qu'elle est à l'écran. */
let sparkling = false;
function sparkleLoop(){
  if (REDUCED || sparkling) return;
  sparkling = true;
  (function again(){
    const r = card.getBoundingClientRect();
    if (!document.hidden && r.bottom > 0 && r.top < window.innerHeight){
      burst(r.left + Math.random() * r.width, r.top + Math.random() * r.height * 0.7);
    }
    setTimeout(again, 1500 + Math.random() * 1800);
  })();
}

/* ---------- Boucle ---------- */
let timer = 0;

function tick(){
  const now = new Date();
  if (isBirthday(now)){
    celebrate();
    if (timer){ clearInterval(timer); timer = 0; }
    return;
  }
  renderCountdown(now);
  card.classList.toggle('tick');                     // la seconde bat doucement
}

/* ---------- Ouverture ---------- */
let shown = false;

function revealBirthday(scrollToIt){
  if (!shown){
    shown = true;
    document.body.classList.add('bday-on');
    tick();
    if (!timer && !partying) timer = setInterval(tick, 1000);
  }
  if (scrollToIt){
    section.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }
}
window.revealBirthday = revealBirthday;
document.getElementById('bdayBtn').addEventListener('click', () => revealBirthday(true));

/* ---------- Le vœu ---------- */
wishBtn.addEventListener('click', () => {
  const r = wishBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
  secret.textContent = BIRTHDAY.wish;
  secret.classList.add('show');
  wishBtn.hidden = true;
});

/* =========================================================================
   LE GRAND CŒUR — 90 petits cœurs semés par le code sur une grille 13 × 11
   ========================================================================= */
const heartMatrix = [
  [0,0,1,1,0,0,0,0,0,1,1,0,0],
  [0,1,1,1,1,0,0,0,1,1,1,1,0],
  [1,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0],
];

const SVG_NS = 'http://www.w3.org/2000/svg';
/* Le dégradé du grand cœur : rouge — clair en haut, profond en bas. */
const STOPS = [
  [255, 122, 138],   // rouge clair, presque rose
  [232,  50,  70],   // le rouge franc
  [193,  18,  60],   // le rouge profond
];

function mix(t){
  const u = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(u));
  const k = u - i;
  const c = (j) => Math.round(STOPS[i][j] + (STOPS[i + 1][j] - STOPS[i][j]) * k);
  return 'rgb(' + c(0) + ',' + c(1) + ',' + c(2) + ')';
}

const cells = [];
heartMatrix.forEach((row, r) => {
  row.forEach((on, c) => {
    if (!on) return;
    const u = document.createElementNS(SVG_NS, 'use');
    u.setAttribute('href', '#bdayMini');
    u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#bdayMini');  // vieux Safari
    u.setAttribute('x', c * 10);
    u.setAttribute('y', r * 10);
    u.style.fill = mix(r / (heartMatrix.length - 1));              // clair en haut, profond en bas
    heartSvg.appendChild(u);
    cells.push({ el: u, x: c * 10 + 5, y: r * 10 + 5 });
  });
});

/* =========================================================================
   LE SPECTACLE — trois actes enchaînés
   ========================================================================= */
const DRAW_MS = 4600;                                // durée du dessin du bonhomme
let jobs = [];                                       // minuteries en cours
let playing = false;

function after(ms, fn){ jobs.push(setTimeout(fn, ms)); }
function clearJobs(){ jobs.forEach(clearTimeout); jobs = []; }

function resetShow(){
  clearJobs();
  stage.classList.remove('draw', 'alive');
  heartSvg.classList.remove('beat');
  cells.forEach((c) => c.el.classList.remove('lit'));
  biu.style.opacity = '0';
  biu.style.transform = '';
  loveEl.classList.remove('show');
  secret.classList.remove('show');
  secret.textContent = '';
  wishBtn.hidden = true;
  replayBtn.hidden = true;
}

function startShow(){
  if (playing) return;
  playing = true;
  if (BR.music) BR.music();                          // le clic autorise enfin le son
  giftBtn.hidden = true;
  resetShow();
  stage.hidden = true;
  section.classList.add('is-gift');
  act1();
}

/* ---------- Acte 1 : le mot d'accueil ---------- */
function act1(){
  document.body.classList.add('show-intro-on');
  after(REDUCED ? 3000 : 4400, () => {
    document.body.classList.remove('show-intro-on');
    act2();
  });
}

/* ---------- Acte 2 : le défilé des souvenirs ---------- */
function act2(){
  if (typeof window.playMemoriesShow === 'function') window.playMemoriesShow(act3);
  else act3();                                       // galerie absente : on va au cœur
}

/* ---------- Acte 3 : le bonhomme dessine son cœur ---------- */
function act3(){
  stage.hidden = false;
  section.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });

  after(REDUCED ? 60 : 800, () => {
    void stage.offsetWidth;                          // relance les animations CSS
    stage.classList.add('draw');                     // la main invisible dessine
    after(REDUCED ? 200 : DRAW_MS, () => {
      stage.classList.add('alive');                  // il respire
      shoot(bloom);
    });
  });
}

/* Le petit cœur part de sa main et file vers le grand cœur, en arc. */
function shoot(done){
  const w = stage.clientWidth, h = stage.clientHeight;
  const x0 = 0.27 * w, y0 = 0.78 * h;                // la main
  const x1 = 0.48 * w, y1 = 0.24 * h;               // le point d'impact
  if (REDUCED){ done(x1, y1); return; }

  const cx = (x0 + x1) / 2 - 0.04 * w;
  const cy = Math.min(y0, y1) - 0.18 * h;            // le sommet de l'arc
  const DUR = 950;
  const t0 = performance.now();

  (function step(now){
    const k = Math.min(1, (now - t0) / DUR);
    const u = 1 - k;
    const mx = u * u * x0 + 2 * u * k * cx + k * k * x1;
    const my = u * u * y0 + 2 * u * k * cy + k * k * y1;
    biu.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%) scale(' +
                          (0.7 + 0.5 * k) + ') rotate(' + (-14 + 28 * k) + 'deg)';
    biu.style.opacity = k < 0.82 ? '1' : String(Math.max(0, (1 - k) / 0.18));
    if (k < 1) requestAnimationFrame(step);
    else { biu.style.opacity = '0'; done(x1, y1); }
  })(t0);
}

/* Les petits cœurs s'allument en vague, depuis l'endroit touché. */
function bloom(ix, iy){
  const sr = stage.getBoundingClientRect();
  const hr = heartSvg.getBoundingClientRect();
  burst(sr.left + ix, sr.top + iy);                  // l'impact fait des étincelles

  const px = hr.width  ? (ix + sr.left - hr.left) / hr.width  * 130 : 20;
  const py = hr.height ? (iy + sr.top  - hr.top)  / hr.height * 110 : 30;
  const order = cells.slice().sort((a, b) =>
    ((a.x - px) * (a.x - px) + (a.y - py) * (a.y - py)) -
    ((b.x - px) * (b.x - px) + (b.y - py) * (b.y - py)));

  let i = 0;
  const step = REDUCED ? 8 : 26;
  const t = setInterval(() => {
    order[i++].el.classList.add('lit');
    if (i >= order.length){ clearInterval(t); finish(); }
  }, step);
  jobs.push(t);                                      // clearTimeout arrête aussi un interval
}

/* ---------- Le mot de la fin ---------- */
function finish(){
  heartSvg.classList.add('beat');                    // le cœur se met à battre
  after(REDUCED ? 100 : 700, () => {
    loveEl.textContent = BIRTHDAY.love;
    loveEl.classList.add('show');
    const r = heartSvg.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2);
  });
  after(REDUCED ? 400 : 2200, () => {
    partyFace();
    wishBtn.hidden = false;
    replayBtn.hidden = false;
    playing = false;
  });
}

/* Le spectacle finit toujours en fête — même si le QR est scanné un autre jour :
   dans ce cas on écrit « Joyeux anniversaire » sans annoncer une fausse date. */
function partyFace(){
  const today = new Date();
  section.classList.add('is-today');
  lead.textContent = 'Joyeux anniversaire';
  if (isBirthday(today)){
    kicker.textContent = 'Aujourd’hui, le monde te fête';
    dateEl.textContent = 'C’est aujourd’hui — ' + longDate(today) + '. Tu as ' + ageAt(today) + ' ans.';
  } else {
    section.classList.add('is-early');
  }
  if (timer){ clearInterval(timer); timer = 0; }
  sparkleLoop();
}

giftBtn.addEventListener('click', () => {
  const r = giftBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);
  startShow();
});

replayBtn.addEventListener('click', () => { playing = false; startShow(); });

/* ---------- Mise en place ---------- */
nameEl.textContent = BIRTHDAY.name;
msgEl.textContent = BIRTHDAY.message;
loveEl.textContent = BIRTHDAY.love;
introBox.querySelector('p').textContent = BIRTHDAY.welcome;
const next = nextBirthday(new Date());
dateEl.textContent = 'Le ' + longDate(next) + ', tu souffleras tes ' + ageAt(next) + ' bougies.';
renderCountdown(new Date());

/* Accès direct : index.html#anniversaire (pratique aussi pour les captures) */
const HASH = location.hash;
const WANTS_GIFT = /cadeau|fete|f%C3%AAte/i.test(HASH);

if (WANTS_GIFT || /anniversaire|birthday/.test(HASH)){
  if (BR.settle) BR.settle();                      // le cœur d'accueil se range
  document.body.classList.add('started', 'reading');
  document.querySelectorAll('#letter .block').forEach((b) => b.classList.add('show'));
  revealBirthday(false);
  /* #cadeau : l'adresse du QR code. La carte s'ouvre, le bouton attend. */
  if (WANTS_GIFT) giftBtn.hidden = false;
  requestAnimationFrame(() => section.scrollIntoView({ block: WANTS_GIFT ? 'center' : 'start' }));
}

})();
