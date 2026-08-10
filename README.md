# Onyx Data Intelligence

**Adaptive Analytics & Professional Reporting Platform**

Onyx Data Intelligence transforme des fichiers CSV, XLSX, XLS et JSON en analyses exploratoires, statistiques et décisionnelles directement dans le navigateur.

## Version

**3.2.0 — GitHub + Netlify Production Setup**

Cette version prépare le projet pour un workflow professionnel :

- GitHub comme dépôt source et historique des modifications ;
- Netlify comme plateforme de build et d'hébergement ;
- déploiement continu depuis la branche `main` ;
- HTML, styles et moteurs JavaScript séparés ;
- validation automatique du projet ;
- build de production dans `dist/` ;
- CI GitHub Actions ;
- documentation technique ;
- version monolithique historique conservable dans `legacy/`.

## Démarrage local

```bash
npm run check
npm run dev
```

Puis ouvrir `http://127.0.0.1:5173`.

## Build de production

```bash
npm run build
npm run preview
```

Le build crée le dossier `dist/`. Ce dossier est généré automatiquement et ne doit pas être versionné.

## Déploiement Netlify

La configuration est enregistrée dans `netlify.toml` :

- commande de build : `npm run build`
- dossier publié : `dist`
- version Node : `22`

Connecter le dépôt GitHub à Netlify suffit ensuite pour activer le déploiement continu.

Voir `docs/NETLIFY-DEPLOYMENT.md`.

## Structure

```text
onyx-data-intelligence/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docs/
├── legacy/                         # optionnel
├── public/
│   ├── css/
│   │   └── onyx.css
│   ├── js/
│   │   ├── 01-onyx-core.js
│   │   ├── 02-onyx-expert-engine.js
│   │   ├── 03-onyx-adaptive-reporting.js
│   │   └── 04-onyx-report-polish.js
│   └── samples/
│       └── demo.csv
├── scripts/
│   ├── build.mjs
│   ├── check-project.mjs
│   └── dev-server.mjs
├── index.html
├── netlify.toml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Confidentialité

Les données importées dans la version actuelle sont traitées côté navigateur. Ne placez jamais de vrais fichiers clients, RH, financiers ou autres données sensibles dans le dépôt GitHub.

Voir `docs/DATA-PRIVACY.md`.
