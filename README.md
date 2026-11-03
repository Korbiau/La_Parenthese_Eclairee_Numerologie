# Numérologie Claire — mise à jour

## Installer sur votre site GitHub existant

Décompressez le ZIP. Dans votre dépôt, utilisez Add file → Upload files et envoyez tous les fichiers de ce dossier au même niveau que votre index.html existant. Validez avec Commit changes. Attendez la fin de la publication puis rechargez le site.

Tout est à la racine, y compris pdf-lib.min.js : aucun dossier vendor n’est nécessaire pour cette version. Les sauvegardes du navigateur restent compatibles.

## Changements

- Champ « Année universelle », vide pour un nouveau tableau. L’année saisie est réduite dans la case correspondante (2026 → 1) et sa couleur s’applique automatiquement.
- Suppression du millésime placé au-dessus des lignes du tableau.
- Le nom complet et l’année saisie figurent dans l’en-tête du document.
- Bouton « Télécharger le PDF ».
- PDF A4 paysage d’une page. Le nom complet et l’année figurent dans le document et dans le nom du fichier téléchargé.
- Un tableau incomplet reste téléchargeable.

Le champ Prénom et nom permet de saisir les deux ensemble. Les domiciles, réductions de l’âge, calculatrice, couleurs et sauvegardes sont conservés.

Pour un nouveau dépôt : Settings → Pages → Deploy from a branch → main → /(root) → Save.

Les données sont sauvegardées dans le navigateur, sans synchronisation entre appareils. Pour les transférer, utilisez Sauvegarder le fichier puis Ouvrir un fichier. Ne publiez pas les sauvegardes JSON personnelles sur GitHub.

pdf-lib est inclus sous licence MIT : voir pdf-lib-LICENSE.md.
