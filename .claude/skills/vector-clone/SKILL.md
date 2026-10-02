---
name: vector-clone
description: Reproduire une maquette (image, mockup de carte de visite, flyer, logo) en PDF/SVG vectoriel prêt à imprimer — vectorisation locale par potrace des illustrations et calligraphies, textes convertis en tracés, fond perdu, traits de coupe, PDF via Chromium. À utiliser quand on demande de « cloner », « refaire exactement », « mettre en vectoriel » ou « préparer pour l'impression » un visuel fourni en image.
---

# Clonage vectoriel d'une maquette (impression)

Objectif : obtenir un PDF/SVG **vectoriel** qui ressemble *exactement* à la maquette, avec fond perdu et traits de coupe.
Rien n'est envoyé à un service externe : tout se fait en local (sharp, potrace, opentype.js, Chromium).

## Méthode
1. **Mesurer la maquette** : ouvrir l'image, relever en px le rectangle de chaque face (x, y, largeur, hauteur) et déduire `px/mm` (largeur px ÷ largeur réelle en mm). Demander/confirmer le format réel (ex. 100×42 mm ≠ 90×50 mm : respecter les proportions de la maquette).
2. **Trier les éléments**
   - *Illustrations, calligraphies, ornements* → **vectoriser** (étape 3).
   - *Textes courants, icônes simples* → **refaire** avec polices libres (fontsource) converties en tracés.
   - *Photo* → image incrustée (≥ 300 dpi à la taille d'impression ; vérifier la licence) ; remonter le noir de la photo à la couleur du fond de la carte pour éviter une cassure.
3. **Vectoriser une zone** : `node .claude/skills/vector-clone/scripts/trace-region.mjs <image> x,y,w,h <carte x,y,w> <largeur_mm> [seuil] [out.json]`
   - Sur-échantillonne ×5, seuil de luminance (≈ 100–120 : plus bas = traits plus épais), potrace.
   - Résultat en mm ; l'insérer avec `transform="translate(fond_perdu fond_perdu) {transform}"`, `fill-rule="evenodd"`, dégradé or.
   - Contrôler visuellement à fort zoom ; ajuster le seuil (traits trop gras → monter ; traits perdus → baisser).
4. **Textes → tracés** avec opentype.js (`@fontsource/*`, fichiers .woff). ⚠️ `Path.toPathData()` produit parfois `NaN` (mots tronqués dans le PDF) : sérialiser soi-même les `commands` avec `toFixed(3)` (voir `reference/pathData.md`).
5. **Fond perdu** : 3 mm. Les éléments qui touchent le bord doivent le dépasser ; pour un tracé coupé net au bord, étirer une bande de 0,35 mm dans le fond perdu (clipPath + scaleX négatif).
6. **PDF** : assembler un HTML (une `<section>` par face, `@page` à la taille fond perdu + 6 mm de marge), traits de coupe en `<path>`, puis `page.pdf({ preferCSSPageSize: true, printBackground: true })` avec Playwright/Chromium. Identifiants de dégradés uniques par page.
7. **Vérifier** : `pdffonts` → 0 police (tout est en tracés) ; `grep -c NaN *.svg` → 0 ; rendu `pdftoppm -r 450` regardé de près ; comparer avec la maquette (alignements, tailles, espacements).
8. **Livrer** : PDF recto/verso avec traits de coupe, SVG, aperçu JPG ; noter formats, dorure (calques `gold-foil*`), RVB→CMJN à valider sur épreuve, droits de la photo.

## Pièges rencontrés
- Maquette basse résolution → le tracé est fidèle mais perd les détails < 1 px : le dire.
- Le visuel d'origine peut contenir des fautes (ex. pseudo Instagram) : utiliser les vraies données du client et le signaler.
- Ne pas mettre d'adresse/QR/photo si le client les refuse ; garder les infos fournies par le client uniquement.
