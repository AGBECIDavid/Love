/* =========================================================================
   Anniversaire — compte à rebours jusqu'à son jour, puis carte de fête.
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
};

/* ---------- Pont avec la page (particules dorées, préférence de mouvement) ---------- */
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
  wishBtn.hidden = false;
  sparkleLoop();
}

/* Quelques étincelles dorées au-dessus de la carte, tant qu'elle est à l'écran. */
function sparkleLoop(){
  if (REDUCED) return;
  const r = card.getBoundingClientRect();
  if (!document.hidden && r.bottom > 0 && r.top < window.innerHeight){
    burst(r.left + Math.random() * r.width, r.top + Math.random() * r.height * 0.7);
  }
  setTimeout(sparkleLoop, 1500 + Math.random() * 1800);
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

/* ---------- Mise en place ---------- */
nameEl.textContent = BIRTHDAY.name;
msgEl.textContent = BIRTHDAY.message;
const next = nextBirthday(new Date());
dateEl.textContent = 'Le ' + longDate(next) + ', tu souffleras tes ' + ageAt(next) + ' bougies.';
renderCountdown(new Date());

/* Accès direct : index.html#anniversaire (pratique aussi pour les captures) */
if (/anniversaire|birthday/.test(location.hash)){
  document.body.classList.add('started', 'reading');
  document.querySelectorAll('#letter .block').forEach((b) => b.classList.add('show'));
  revealBirthday(false);
  requestAnimationFrame(() => section.scrollIntoView());
}

})();
