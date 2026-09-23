# Pour toi — carnet de bord

Site cadeau pour **Fumilayo Fifamin Yousra AMADOU**, anniversaire le **3 octobre**.
Une seule page, aucune dépendance, aucun outil de build : on ouvre `index.html` et ça marche.

Ce fichier existe pour retrouver le fil sans relire tout le code — où se trouve quoi,
quoi changer pour quoi, et ce qui a déjà été décidé.

---

## 1. Les fichiers

| Fichier | Ce qu'il contient |
|---|---|
| `index.html` | **Le balisage seul** : les sections, les textes, les boutons. Plus aucun style ni script dedans. |
| `main.css` | La base : couleurs et rayons (`:root`), **le système de boutons commun**, l'accueil, la lettre, la barre du haut. |
| `main.js` | Le cœur de la page : le canvas (galaxie, étoiles, cœur de particules, nébuleuse, anneau, filaments, étincelles), l'ouverture de la lettre, la musique, et le pont `window.PourToi`. |
| `intro.css` | L'habillage de l'accueil : la police calligraphiée, le titre et son reflet, les papillons, les attrape-rêves, le voile violet. |
| `letter.js` / `letter.css` | La lettre en cartes côte à côte, que l'on fait glisser. |
| `birthday.js` / `birthday.css` | La section anniversaire : compte à rebours, bouton cadeau, le spectacle en trois actes, le bonhomme dessiné, le grand cœur rouge. |
| `gallery.js` / `gallery.css` | Les souvenirs : la liste `MEDIA`, le défilé en cercle, la mosaïque, la visionneuse et son mode cinéma. |
| `fonts/` | `great-vibes-latin.woff2` (42 ko) + sa licence OFL. Embarquée : aucun appel réseau, marche hors ligne. |
| `img_life/` | Les photos et vidéos, plus `img_life/thumbs/` pour les vignettes. |
| `qr/` + `tools/qr.py` | Le QR code du cadeau, et le script d'une ligne pour le refaire. |
| `apercu.jpg` | L'image qui s'affiche quand le lien est partagé (WhatsApp, messages). 1200×630. |

Ordre de chargement : `main.js` → `letter.js` → `birthday.js` → `gallery.js` (et `main.css` avant les autres feuilles).
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
   ACTE 2               les 24 souvenirs défilent seuls — 4 s par photo,
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

### Le QR code

Il est déjà fabriqué, dans `qr/` :

| Fichier | Pour quoi |
|---|---|
| `qr/qr-cadeau.png` | **celui qu'on imprime** — noir sur blanc, le plus sûr à scanner |
| `qr/qr-cadeau-violet.svg` | violet avec un cœur au centre — pour un écran, une carte, une affiche |

Les deux encodent `https://love-self-omega.vercel.app/#cadeau` et sont en correction d'erreur
« H » : le cœur peut cacher le centre sans gêner la lecture. Vérifiés relus jusqu'à 220 px.

Si l'adresse change (autre domaine, sous-dossier) :

```bash
pip install segno
python3 tools/qr.py https://la-nouvelle-adresse/#cadeau
```

⚠️ Le QR pointe vers la branche **`main`** : les corrections doivent y être fusionnées
pour qu'il serve la bonne version. `apercu.jpg` et les balises Open Graph de `index.html`
contiennent la même adresse en dur — à changer ensemble si le domaine change.

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

### Les couleurs — `main.css`, bloc `:root`

```css
--night   #070513   la nuit
--indigo  #170e3c   le halo du fond
--violet  #a97cff   l'accent principal
--violet-soft #d3c0ff   les titres
--sky     #8ad4ff   le léger bleu (filets, libellés, barre de progression)
--rose    #f0a8d8   les cœurs de la nuit
--ink / --ink-dim   les textes
```

Et trois rayons pour toute la page : `--r-card` (20 px, les grandes cartes), `--r-media` (16 px,
les photos), `--r-tile` (14 px, les petites tuiles).

Changer une variable suffit : tout le site suit. Deux exceptions volontaires :

- **le grand cœur rouge** du final : `STOPS` dans `birthday.js` (clair en haut → profond en bas) ;
- **les particules du canvas** : `SPRITES` dans `main.js` (violet, bleu, rose, blanc).

### Les boutons — un seul dessin, dans `main.css`

Tous les boutons de la page partagent la même base. On choisit l'intensité par la classe :

| Classe | Pour quoi | Exemples |
|---|---|---|
| `pill` | une action ordinaire | la barre du haut, « Fais un vœu », Cercle / Mosaïque |
| `pill pill--lead` | **l'**action d'un écran — elle respire | « Ouvre mon cœur », « Ouvre ton cadeau » |
| `pill pill--quiet` | une action discrète | « Passer », « Revoir le cadeau » |
| `round` | un bouton rond | 🔊, les flèches, lecture/pause |

Un nouveau bouton = une de ces classes, rien d'autre. Toutes font 44 px de haut au minimum
(la taille d'un pouce), toutes ont le même anneau au clavier.

### La musique

**`musique.mp3` est en place** (3 min 07, 2,9 Mo) : il joue en boucle, avec un fondu de
3 secondes. Pour en changer, il suffit de remplacer ce fichier — rien à toucher dans le code.
Le son a été normalisé à −16 LUFS, le niveau habituel du web : ni trop fort, ni trop faible.

Le format compte : **MP3**, lu partout. Un `.webm`/Opus ne passe pas sur iPhone.

S'il n'y est pas, ou si le navigateur ne sait pas le lire, la **nappe générée en Web Audio**
prend le relais toute seule — la page n'est jamais muette. Le bouton 🔊 et la baisse du son
pendant les vidéos fonctionnent dans les deux cas.

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

## 6 bis. Ce qui se passe quand ça se passe mal

Le cadeau doit tenir même si un fichier manque ou si le téléphone fait des siennes.

| Situation | Ce que voit l'utilisatrice |
|---|---|
| La grande image met du temps à arriver | L'aperçu flou tient la place, à la bonne taille, jusqu'à l'image nette |
| Une photo ou une vidéo est introuvable | Un cœur et « Ce souvenir n'a pas pu s'ouvrir ». Pendant le cadeau, ça enchaîne après 2,4 s |
| Une vignette est introuvable | Un cœur discret dans le cadre, jamais l'icône du navigateur |
| Le navigateur refuse de lancer une vidéo (économie d'énergie, onglet en veille) | Un **chien de garde** passe au souvenir suivant : durée réelle du film, 20 s par défaut, 2,5 s si la lecture est refusée. Le spectacle ne peut pas se figer |
| Elle change d'avis pendant le défilé | « Passer ▸ » en haut à gauche, ou Échap, ou une glissade vers le bas |
| Elle veut sortir de la lettre | La barre du haut apparaît dès le premier clic |

## 6 ter. Téléphone à l'horizontale

Sous 700 px de haut et au-delà d'un rapport 7/5, l'accueil passe en deux colonnes :
le cœur à gauche, le titre et le bouton à droite. **Deux endroits doivent rester d'accord** :
la média-requête en bas de `intro.css` et `wideShort()` dans `main.js` — l'une place le
texte, l'autre place le cœur dessiné sur le canvas.

---

## 7. Les réglages de rythme

| Où | Constante | Valeur | Ce que c'est |
|---|---|---|---|
| `gallery.js` | `SHOW_MS` | 4000 | une photo pendant le cadeau |
| `gallery.js` | `PHOTO_MS` | 6500 | une photo en mode cinéma normal |
| `birthday.js` | `DRAW_MS` | 4600 | le temps que met le bonhomme à se dessiner |
| `birthday.js` | acte 1 | 4400 | le mot d'accueil à l'écran |
| `birthday.js` | `bloom` | 26 ms | entre deux petits cœurs qui s'allument (86 en tout ≈ 2,2 s) |
| `gallery.js` | `watchVideo` | 20 s | le filet de sécurité si une vidéo ne démarre pas |
| `main.js` | `HOLD` | 1.7 | le cœur respire seul avant que la lettre s'ouvre |

**La lettre n'a plus d'horloge du tout.** Les passages sont des cartes **côte à côte**
(`letter.js`) : un au centre, les voisins qui dépassent sur les côtés, un peu estompés.

- **glisser à gauche / à droite** change de passage — ou les flèches ‹ ›, les points, les
  touches ← →, ou toucher la carte voisine ;
- **glisser vers le bas** descend dans la page, vers l'anniversaire et les souvenirs.

Les deux gestes ne se mélangent jamais, et c'est ce qui rend la lecture simple. Le glissement
et le calage sur chaque carte sont ceux du navigateur (`scroll-snap-type: x mandatory`,
`scroll-snap-stop: always` : un geste = un passage) — rien n'est simulé, donc ça réagit pareil
sur tous les téléphones. Le script ne fait que la mise en scène et les commandes.

Toutes les cartes prennent la hauteur du passage le plus long : **aucun texte ne peut être
coupé**. Une phrase d'aide guide sous la carte : « glisse pour lire la suite → » au début,
puis « ↓ descends, la suite t'attend » sur la dernière carte, où tombe la pluie dorée.

> Historique : une première version empilait les cartes à la verticale, pilotées par le
> défilement de la page. Glisser vers le haut voulait alors dire deux choses à la fois
> (carte suivante *et* descendre), ce qui rendait la lecture difficile et sautillante sur
> téléphone. D'où le choix de l'horizontale.

En **mouvement réduit**, rien n'est construit : la lettre reste une colonne de paragraphes.

Les délais du dessin du bonhomme sont **dans le SVG**, en `style="--d:…;--t:…"` sur chaque trait
(`--d` = quand il commence, `--t` = combien de temps il met). Si on en change un, penser à
`DRAW_MS` qui doit rester ≥ à la fin du dernier trait.

---

## 8. Ce que les fichiers se disent entre eux

C'est le seul endroit où le code se parle d'un fichier à l'autre — à ne pas casser.

**`window.PourToi`** (défini dans `main.js`, lu par les autres scripts) :

| | |
|---|---|
| `reduced` | l'utilisatrice a demandé moins d'animations |
| `burst(x, y)` | une gerbe d'étincelles aux coordonnées écran |
| `duck(bool)` | baisse la musique pendant une vidéo, puis la remonte |
| `settle()` | arrivée directe (`#cadeau` & co) : range l'accueil et ouvre la lettre — **le seul endroit** qui fait ça |
| `rain(on)` | la pluie dorée, déclenchée par `letter.js` quand elle arrive sur le nom |
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

**Les adresses sont relues à chaud.** `birthday.js` et `gallery.js` ont chacun un
`applyHash(atLoad)` branché sur `hashchange` : un lien `#cadeau` reçu alors que la page
est déjà ouverte fonctionne, et les boutons de la barre du haut passent par l'adresse,
donc le bouton retour du téléphone ramène où elle était.

**La visionneuse est une vraie fenêtre modale** : le focus tourne en boucle sur ses
boutons et le reste de la page devient `inert`. L'inertie est levée *avant* de rendre
le focus à la vignette — sinon `focus()` échoue en silence.

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

- **Fusionner la branche `claude/quirky-albattani-gpsaj2` dans `main`** : c'est la seule
  chose qui manque pour que le QR code de `qr/` ouvre le cadeau.
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
- **Le grand cœur repasse au rouge**, et le QR code du cadeau est fabriqué.
- **24 souvenirs** (4 ajoutés), la musique vient du fichier `musique.mp3`, et la lettre est
  devenue un jeu de cartes.
- **Harmonisation** — le CSS et le JS sortent de `index.html` (`main.css`, `main.js`) ; les onze
  boutons partagent un seul dessin (`pill`, `pill--lead`, `pill--quiet`, `round`) ; le démarrage
  direct, écrit deux fois, n'existe plus que dans `settle()` ; toutes les cibles tactiles à 44 px.
- **La lettre passe à l'horizontale** — on glisse sur le côté pour changer de passage, vers le
  bas pour descendre : les deux gestes ne se mélangent plus.
- **Audit UX/UI et corrections** — chien de garde vidéo, repli sur média introuvable,
  aperçu flou pendant le chargement, mise en page paysage, adresses relues à chaud et
  historique, fenêtre modale accessible, contrastes tous au-dessus de la norme AA,
  cibles tactiles à 46 px, aperçu de partage.
