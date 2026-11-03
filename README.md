# Numérologie Claire

Version complète et autonome du site, prête pour GitHub Pages. Aucun compte ChatGPT, serveur, clé API, installation de dépendances ou compilation n’est nécessaire pour l’utiliser. Les scripts, styles et la bibliothèque PDF sont fournis dans ce dossier.

## Publication sur GitHub, étape par étape

1. Décompressez `numerologie-claire-github-pages.zip` sur votre ordinateur.
2. Sur GitHub, créez un nouveau dépôt **Public**, par exemple `numerologie-claire`.
3. Dans ce dépôt, choisissez **Add file → Upload files** (ou **uploading an existing file** sur la page d’un dépôt vide).
4. Ouvrez le dossier décompressé `numerologie-claire`. Glissez **son contenu** dans GitHub : `index.html`, les scripts, `styles.css`, le dossier `vendor` entier et les autres fichiers. N’envoyez pas le ZIP et ne placez pas le dossier parent autour des fichiers : `index.html` doit être directement à la racine du dépôt.
5. Validez avec **Commit changes**.
6. Ouvrez **Settings → Pages** dans le dépôt.
7. Sous **Build and deployment → Source**, choisissez **Deploy from a branch**.
8. Sélectionnez la branche **main** et le dossier **/(root)**, puis **Save**.
9. Attendez la fin de la publication. GitHub affiche le lien du site dans **Settings → Pages**.

Si le fichier caché `.nojekyll` n’a pas été envoyé par glisser-déposer, créez-le avec **Add file → Create new file**, nommez-le `.nojekyll`, puis validez. Aucun contenu n’est nécessaire.

Le site publié est accessible à toute personne ayant son lien, sans connexion ChatGPT. Seul le code de l’outil est fourni ici : aucune adresse ou fiche personnelle n’est incluse.

## Fonctions incluses

- Tableau d’une seule année modifiable : année universelle, année personnelle, âge, maisons astrologiques, quadrimestres, trimestres et mois.
- Mois alignés ; quadrimestres sur quatre mois et trimestres sur trois mois.
- Palette personnalisable pour 1 à 9, 11, 22 et 33.
- Âge saisi à gauche et réduit automatiquement à un chiffre, avec coloration (27 → 9).
- Domiciles multiples : adresse ou repère, date d’arrivée, départ facultatif et numéro brut. Le numéro est réduit (22 → 4) et la largeur de la case suit les dates des déménagements.
- Calculatrice : réduction libre, chemin de vie, année personnelle et nombre d’expression. Les méthodes et l’option de conservation de 11, 22 et 33 sont affichées dans l’interface.
- PDF d’une page A4 paysage, téléchargeable même si les champs sont vides ; couleurs et réductions incluses.
- Sauvegarde automatique locale ; sauvegarde et import manuels au format JSON.

## Retrouver un tableau sur le nouveau site

Les saisies restent dans le navigateur et sur l’adresse du site où elles ont été faites. Elles ne sont pas transférées automatiquement depuis l’ancienne adresse.

Avant le changement, utilisez **Sauvegarder le fichier** sur l’ancien site. Sur le nouveau site GitHub Pages, utilisez **Ouvrir un fichier** et sélectionnez cette sauvegarde JSON. Pour changer d’appareil ou de navigateur, utilisez la même méthode.

Les données saisies ne sont pas envoyées à un serveur par l’application. Il n’y a pas de compte utilisateur ni de synchronisation entre appareils. Conservez vos sauvegardes JSON hors du dépôt public.

## Modifier le site après publication

Vous pouvez toujours modifier les fichiers du dépôt. Une modification validée sur la branche `main` déclenche la mise à jour du site. Actualisez ensuite la page pour afficher les changements.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et textes |
| `styles.css` | Apparence, adaptation mobile et impression |
| `app.js` | Tableau, domiciles, couleurs, sauvegardes et calculatrice |
| `numerology.js` | Réduction automatique de l’âge et des numéros |
| `export-pdf.js` | Construction et téléchargement du PDF |
| `vendor/pdf-lib.min.js` | Bibliothèque PDF embarquée, sans téléchargement externe |
| `vendor/pdf-lib-LICENSE.md` | Licence MIT de pdf-lib |
| `.nojekyll` | Publication des fichiers statiques sans traitement Jekyll |

Les chemins sont relatifs : le site fonctionne aussi dans un sous-dossier GitHub Pages. Conservez les noms de fichiers et le dossier `vendor`.

## Tester sur votre ordinateur

Ouvrez `index.html` dans votre navigateur pour un premier essai. Pour un comportement de sauvegarde plus proche de la version publiée, lancez depuis ce dossier, si Python est installé :

```sh
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`. L’utilisation quotidienne du site ne demande pas Python.

## Dépannage

- **Page 404 :** vérifiez que `index.html` est à la racine, que la source est `main` / `/(root)` et que la publication est terminée. Consultez l’onglet **Actions** en cas d’erreur.
- **Page sans styles ou boutons inactifs :** assurez-vous d’avoir envoyé tous les fichiers, y compris `styles.css` et le dossier `vendor`.
- **PDF :** cliquez sur **Exporter en PDF**, puis, si nécessaire, sur **PDF prêt — télécharger**. Autorisez le téléchargement si votre navigateur le demande.
- **Ancien affichage :** rechargez la page, ou utilisez un rechargement sans cache.
- **Tableau vide sur un autre appareil :** importez votre sauvegarde JSON ; les sauvegardes locales ne sont pas synchronisées.

## Référence de publication

Documentation officielle GitHub :
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Version préparée le 3 novembre 2026, d’après la dernière version du site Numérologie Claire.
