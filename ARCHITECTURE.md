# Architecture Onyx Data Intelligence 3.1

## Objectif de cette version

Professionnaliser le dépôt sans modifier brutalement le comportement du moteur analytique existant.

## Couches actuelles

### `index.html`
Structure de l'interface et composants du dashboard.

### `public/css/onyx.css`
Tous les styles extraits du fichier HTML d'origine.

### `public/js/01-onyx-core.js`
Moteur historique principal : import, profilage, analyses, graphiques, rapports et interactions principales.

### `public/js/02-onyx-expert-engine.js`
Fonctionnalités expertes : gouvernance des variables, nettoyage, qualité multidimensionnelle, anomalies, tests et prévisions.

### `public/js/03-onyx-adaptive-reporting.js`
Moteur de reporting adaptatif selon l'audience, l'objectif et la profondeur.

### `public/js/04-onyx-report-polish.js`
Finitions et enrichissements visuels/narratifs du rapport.

## Pourquoi les quatre scripts restent séparés

Le code existant contient des extensions et redéfinitions intentionnelles de fonctions définies plus tôt. Le chargement séquentiel préserve ce comportement. Une fusion ou conversion immédiate en modules ES pourrait provoquer des conflits de déclarations ou modifier la portée des variables.

## Architecture cible 4.x

```text
src/
├── core/
├── data/
├── analytics/
├── intelligence/
├── quality/
├── reporting/
├── charts/
└── ui/
```

La migration doit se faire fonctionnalité par fonctionnalité avec tests de non-régression.
