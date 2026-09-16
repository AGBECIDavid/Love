# Travailler à deux — Claude dans le terminal, Claude sur le web

Deux Claude, un seul projet. Ils ne se parlent pas directement : **le point de
rendez-vous, c'est la branche git** `claude/relaxed-knuth-js7beq`. Tout ce qui
est poussé là, l'autre le voit ; tout ce qui reste sur ton disque, l'autre
l'ignore.

| | Claude terminal (chez toi) | Claude web (ici) |
|---|---|---|
| Voit tes fichiers locaux | oui | non |
| Ouvre le site dans ton navigateur | oui | non |
| Voit tes photos et tes vidéos | oui | seulement celles qui sont poussées |
| Travaille pendant que tu fais autre chose | non | oui |

En clair : **le terminal pour tout ce qui se regarde** (ouvrir la page, juger un
rythme, ajouter des photos lourdes), **le web pour tout ce qui s'écrit** (du
code, de la relecture, une fonctionnalité entière pendant que tu dors).

---

## Le rituel — trois lignes à retenir

Au début de chaque séance dans le terminal :

```bash
git checkout claude/relaxed-knuth-js7beq
git pull origin claude/relaxed-knuth-js7beq
```

À la fin :

```bash
git push -u origin claude/relaxed-knuth-js7beq
```

Si les deux Claude ont touché le même fichier, git le dira au `pull`. Tu peux
alors coller l'erreur telle quelle à l'un des deux : il démêle.

---

## Prompts à copier — dans le terminal

**Ouvrir la séance** (le meilleur premier message, il remet Claude dans le bain)

> Lis `DOCUMENTATION.md` puis `PROMPTS.md`. On est sur la branche
> `claude/relaxed-knuth-js7beq`. Fais `git pull` avant de commencer et
> résume-moi en cinq lignes où en est le projet.

**Voir la page**

> Lance `python3 -m http.server 8000` et ouvre `http://localhost:8000/index.html#cadeau`
> dans mon navigateur. Ne ferme pas le serveur, je veux tester depuis mon téléphone aussi.

**Ajouter des photos ou des vidéos**

> J'ai mis de nouvelles photos dans `img_life/`. Fabrique les vignettes dans
> `img_life/thumbs/`, ajoute les entrées dans la liste `MEDIA` de `gallery.js`
> en suivant la section 6 de `DOCUMENTATION.md`, et vérifie que la galerie les
> affiche bien avant de committer.

**Régler un rythme** (c'est à l'œil que ça se juge — donc dans le terminal)

> L'acte 2 défile trop vite. Ouvre la page, regarde, et propose-moi deux
> réglages dans la section 7 de `DOCUMENTATION.md`. Change, montre-moi, on ajuste.

**Refaire le QR code** (après avoir changé l'adresse du site)

> `pip install segno` puis `python3 tools/qr.py https://mon-adresse/#cadeau`.
> Vérifie que le PNG se scanne avec mon téléphone avant de committer.

**Clore la séance**

> Commit tout ce qu'on a fait avec des messages clairs en français, mets à jour
> le journal (section 11) de `DOCUMENTATION.md`, et pousse sur
> `claude/relaxed-knuth-js7beq`.

---

## Prompts à copier — ici, sur le web

Ceux-là, tu les lances et tu pars. Le travail arrive poussé sur la branche.

**Une nouvelle fonctionnalité**

> Sur la branche `claude/relaxed-knuth-js7beq` : ajoute [ce que tu veux].
> Respecte les décisions de la section 9 de `DOCUMENTATION.md` — aucune
> dépendance, aucun outil de build, tout doit marcher hors ligne. Mets le
> carnet de bord à jour et pousse.

**Une relecture**

> Relis `gallery.js` et `birthday.js` : cherche les fuites de mémoire, les
> écouteurs jamais retirés et ce qui rame sur un téléphone. Dis-moi ce que tu
> trouves avant de toucher à quoi que ce soit.

**Le texte**

> Relis tous les textes visibles de la page — la lettre, les phrases de
> l'anniversaire, les boutons. Corrige l'orthographe et propose-moi une version
> plus juste quand une phrase sonne faux. Montre-moi avant/après.

**Fusionner dans `main`** (la seule chose qui manque pour que le QR marche)

> Les cinq commits de `claude/relaxed-knuth-js7beq` ne sont pas dans `main`.
> Prépare la fusion et explique-moi ce qui change.

---

## Ce qui ne marche pas, autant le savoir

- Claude web ne peut pas ouvrir ton navigateur ni juger une animation à l'œil.
- Claude terminal ne continue pas à travailler quand tu fermes le terminal.
- Les deux ne partagent aucune mémoire. Ce qui doit survivre à une séance
  s'écrit dans `DOCUMENTATION.md` — c'est à ça qu'il sert.
