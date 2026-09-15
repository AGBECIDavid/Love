# Pour toi — carnet de bord

Site cadeau pour **Fumilayo Fifamin Yousra AMADOU**, anniversaire le **3 octobre**.
Une seule page, aucune dépendance, aucun outil de build : on ouvre `index.html` et ça marche.

Ce fichier existe pour retrouver le fil sans relire tout le code — où se trouve quoi,
quoi changer pour quoi, et ce qui a déjà été décidé.

---

## 1. Les fichiers

| Fichier | Ce qu'il contient |
|---|---|
| `index.html` | La structure de la page, le thème (bloc `:root`), les styles de l'accueil, de la lettre et de la barre du haut, **et tout le canvas** (galaxie, étoiles, cœur de particules, nébuleuse, anneau, filaments, étincelles) + la musique + la frise de la lettre. |
| `intro.css` | L'habillage de l'accueil : la police calligraphiée, le titre et son reflet, les papillons, les attrape-rêves, le voile violet. |
| `birthday.js` / `birthday.css` | La section anniversaire : compte à rebours, bouton cadeau, le spectacle en trois actes, le bonhomme dessiné, le grand cœur rouge. |
| `gallery.js` / `gallery.css` | Les souvenirs : la liste `MEDIA`, le défilé en cercle, la mosaïque, la visionneuse et son mode cinéma. |
| `fonts/` | `great-vibes-latin.woff2` (42 ko) + sa licence OFL. Embarquée : aucun appel réseau, marche hors ligne. |
| `img_life/` | Les photos et vidéos, plus `img_life/thumbs/` pour les vignettes. |

Ordre de chargement : `index.html` (script interne) → `birthday.js` → `gallery.js`.
Les deux derniers s'exécutent dans une fonction fermée : rien ne fuit dans la page.

---

## 2. Le déroulé, du début à la fin

```
ACCUEIL                 le cœur-nébuleuse, « Pour toi », bouton « Ouvre mon cœur »
   │ clic  → la musique démarre (les navigateurs l'exigent)
   ▼
EXPLOSION               le cœur éclate puis se reforme (canvas)
   ▼
LA LETTRE               les paragraphes apparaissent un par un, puis la signature
   ▼
ANNIVERSAIRE            apparaît toute seule juste après la signature
   │                    · avant le 3 octobre : le compte à rebours
   │                    · le 3 octobre : bouton « Ouvre ton cadeau ✨ »
   ▼ clic
   ACTE 1               « Bienvenue dans mes souvenirs », plein écran, 4,4 s
   ACTE 2               les 20 souvenirs défilent seuls — 4 s par photo,
   │                    les vidéos jusqu'au bout, bouton « Passer ▸ »
   ACTE 3               le bonhomme se dessine (4,6 s), envoie son cœur,
                        les 86 petits cœurs rouges s'allument en vague depuis
                        le point d'impact, puis battent.
                        « Joyeux anniversaire » + « Je t'aime »
                        + « Fais un vœu ✨ » + « Revoir le cadeau ↺ »
   ▼
SOUVENIRS               la galerie, ~5 s après l'anniversaire
```

La barre du haut (**Anniversaire** / **Souvenirs** / 🔊) permet d'y aller directement à tout moment.

---

## 3. Les adresses spéciales

| Adresse | Effet |
|---|---|
| `index.html#cadeau` | **L'adresse du QR code.** Ouvre la carte d'anniversaire avec le bouton cadeau prêt, quel que soit le jour. Saute la lettre (elle reste lisible plus haut). |
| `index.html#anniversaire` | Va droit à la carte d'anniversaire. |
| `index.html#galerie` | Va droit aux souvenirs. |
| `index.html#ff=45` | Avance l'animation de 45 secondes — pour voir la lettre déroulée sans attendre. |
| `index.html#auto` | Démarre sans clic (captures d'écran). |
| `index.html#debug` | Coupe toutes les transitions (captures d'écran). |

Sur les trois premières, `PourToi.settle()` range le cœur d'accueil et **n'enclenche pas** la frise
de la lettre : la page ne bougera pas toute seule pendant qu'elle lit.

---

## 4. Tester

```bash
firefox "file://$HOME/love/index.html#cadeau"     # le plus simple
```

Ou avec un serveur, pour tester aussi depuis le téléphone sur le même wifi :

```bash
python3 -m http.server 8000        # dans le dossier du projet
# puis http://localhost:8000/index.html#cadeau
#   ou http://<ip-du-pc>:8000/index.html#cadeau
```

Pour voir le **vrai jour J** sans attendre : changer la date du système au 3 octobre,
ou ouvrir `#cadeau` (le spectacle est identique, seule la phrase de date change).

---

## 5. Ce qu'on change, et où

### Les textes de l'anniversaire — `birthday.js`, tout en haut

```js
const BIRTHDAY = {
  name:    'Fumilayo Fifamin Yousra AMADOU',
  day: 3, month: 10, born: 2007,     // le jour, le mois, l'année de naissance
  message: '…',                      // la phrase sous le compte à rebours
  wish:    '…',                      // ce que révèle « Fais un vœu »
  welcome: 'Bienvenue dans mes souvenirs',   // l'acte 1
  love:    'Je t’aime',                      // le mot de la fin
};
```

### La lettre — `index.html`

Les paragraphes sont les `<p class="block">` dans `<section id="letter">`.
Le nom en grand et la signature sont dans `<div id="finale">`.
Ajouter ou retirer un paragraphe décale automatiquement la suite de la frise.

### Le titre de l'accueil — `index.html`

```html
<h1 class="intro-title" data-text="Pour toi">Pour toi</h1>
```

⚠️ **Changer le texte aux deux endroits** : `data-text` sert au reflet sous le titre.

### Les couleurs — `index.html`, bloc `:root`

```css
--night   #070513   la nuit
--indigo  #170e3c   le halo du fond
--violet  #a97cff   l'accent principal
--violet-soft #d3c0ff   les titres
--sky     #8ad4ff   le léger bleu (filets, libellés, barre de progression)
--rose    #f0a8d8   les cœurs de la nuit
--ink / --ink-dim   les textes
```

Changer une variable suffit : tout le site suit. Deux exceptions volontaires :

- **le grand cœur rouge** du final : `STOPS` dans `birthday.js` (clair en haut → profond en bas) ;
- **les particules du canvas** : `SPRITES` dans `index.html` (violet, bleu, rose, blanc).

### La musique

Générée en Web Audio, aucun fichier. Pour mettre un MP3 à la place : le bloc de commentaire
« 💿 POUR METTRE TA PROPRE MUSIQUE » dans `index.html` donne le remplacement exact.

---

## 6. Ajouter une photo ou une vidéo

1. Déposer le fichier dans `img_life/`.
2. Fabriquer sa vignette (560 px de large) :
   ```bash
   ffmpeg -i img_life/photo-18.jpeg -vf scale=560:-1 img_life/thumbs/photo-18.jpg
   ```
   Pour une vidéo, il faut en plus une affiche :
   ```bash
   ffmpeg -ss 1 -i img_life/video-04.mp4 -frames:v 1 img_life/video-04-poster.jpg
   ffmpeg -i img_life/video-04-poster.jpg -vf scale=560:-1 img_life/thumbs/video-04.jpg
   ```
3. Ajouter l'entrée dans `MEDIA`, en haut de `gallery.js` — **l'ordre du tableau est l'ordre du défilé** :
   ```js
   { type:'photo', src:'img_life/photo-18.jpeg', thumb:'img_life/thumbs/photo-18.jpg', lqip:'data:image/jpeg;base64,…' },
   { type:'video', src:'img_life/video-04.mp4', poster:'img_life/video-04-poster.jpg', thumb:'img_life/thumbs/video-04.jpg', lqip:'…' },
   ```

`lqip` est l'aperçu flou affiché pendant le chargement. Il est **facultatif** (sans lui, la
vignette apparaît simplement d'un coup). Pour en fabriquer un :

```bash
ffmpeg -i img_life/photo-18.jpeg -vf scale=20:-1 -q:v 20 /tmp/tiny.jpg
echo "data:image/jpeg;base64,$(base64 -w0 /tmp/tiny.jpg)"
```

Rien d'autre à toucher : le compteur « 1 / 20 », le défilé et le spectacle s'adaptent tout seuls.

---

## 7. Les réglages de rythme

| Où | Constante | Valeur | Ce que c'est |
|---|---|---|---|
| `gallery.js` | `SHOW_MS` | 4000 | une photo pendant le cadeau |
| `gallery.js` | `PHOTO_MS` | 6500 | une photo en mode cinéma normal |
| `birthday.js` | `DRAW_MS` | 4600 | le temps que met le bonhomme à se dessiner |
| `birthday.js` | acte 1 | 4400 | le mot d'accueil à l'écran |
| `birthday.js` | `bloom` | 26 ms | entre deux petits cœurs qui s'allument (86 en tout ≈ 2,2 s) |
| `index.html` | `STAGGER` | 5.8 | secondes entre deux paragraphes de la lettre |
| `index.html` | `HOLD` | 1.7 | le cœur respire seul avant le premier paragraphe |

Les délais du dessin du bonhomme sont **dans le SVG**, en `style="--d:…;--t:…"` sur chaque trait
(`--d` = quand il commence, `--t` = combien de temps il met). Si on en change un, penser à
`DRAW_MS` qui doit rester ≥ à la fin du dernier trait.

---

## 8. Ce que les fichiers se disent entre eux

C'est le seul endroit où le code se parle d'un fichier à l'autre — à ne pas casser.

**`window.PourToi`** (défini dans `index.html`, lu par les deux autres) :

| | |
|---|---|
| `reduced` | l'utilisatrice a demandé moins d'animations |
| `burst(x, y)` | une gerbe d'étincelles aux coordonnées écran |
| `duck(bool)` | baisse la musique pendant une vidéo, puis la remonte |
| `settle()` | range le cœur d'accueil (arrivée directe par `#cadeau` & co) |
| `music()` | allume la musique au premier clic, sans effet ensuite |

**Fonctions globales** :

| | |
|---|---|
| `window.revealBirthday(scroll)` | fait apparaître la carte d'anniversaire (`birthday.js`) |
| `window.revealGallery(scroll)` | fait apparaître les souvenirs (`gallery.js`) |
| `window.playMemoriesShow(fin)` | joue tout le défilé puis appelle `fin()` — c'est l'acte 2, et c'est `birthday.js` qui l'appelle |

**Classes sur `<body>`** : `started` (la lettre est lancée), `reading`, `bday-on`, `gallery-on`,
`view-open` (visionneuse ouverte), `show-on` (le cadeau est en train de se jouer),
`show-intro-on` (l'acte 1 est à l'écran).

---

## 9. Décisions déjà prises

- **Un seul clic** pour lancer le cadeau : c'est lui qui autorise le son, et c'est la cible du QR code.
- **Tout est dessiné par le code** — aucune image de décor. La nébuleuse est peinte une fois dans
  un calque hors écran puis recomposée : le coût par image reste celui d'un `drawImage`.
- **Le cadeau est rejouable** (« Revoir le cadeau ↺ »), autant de fois qu'elle veut.
- **Hors du 3 octobre**, le final écrit « Joyeux anniversaire » mais **n'annonce pas** une fausse date.
- **`prefers-reduced-motion`** est respecté partout : tout se joue en fondus courts.
- Le violet est le thème, **le grand cœur final reste rouge** : c'est lui qu'on doit voir.

## 10. Ce qui reste ouvert

- Fusionner la branche `claude/quirky-albattani-gpsaj2` dans `main` pour que l'adresse
  publique (Vercel) serve le cadeau — le QR code doit viser `…/#cadeau`.
- Le titre de l'accueil est « Pour toi » — à confirmer.

---

## 11. Journal

- **Galerie & anniversaire** — défilé en cercle, mosaïque, visionneuse, mode cinéma ; compte à rebours.
- **Le cadeau en trois actes** — mot d'accueil, défilé automatique, bonhomme dessiné trait par
  trait et grand cœur qui s'allume ; adresse `#cadeau` pour le QR code ; rejouable.
- **L'accueil nébuleuse** — cœur cosmique, anneau de lumière, filaments, papillons,
  attrape-rêves, titre calligraphié (police embarquée).
- **Le thème violet** — l'or remplacé par le violet et un léger bleu sur toute la page ;
  `settle()` pour les arrivées directes.
- **Le grand cœur repasse au rouge.**
