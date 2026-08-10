# Déploiement Onyx avec GitHub et Netlify

## Architecture de déploiement

```text
Développement local
       ↓
GitHub / branche main
       ↓
Netlify Continuous Deployment
       ↓
npm run build
       ↓
dist/
       ↓
Site de production
```

## Configuration incluse

Le fichier `netlify.toml` définit :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

## Connexion du dépôt

Dans Netlify :

1. Ouvrir le tableau de bord.
2. Choisir **Add new project**.
3. Choisir **Import an existing project**.
4. Sélectionner GitHub comme fournisseur Git.
5. Autoriser Netlify à accéder au dépôt si nécessaire.
6. Sélectionner `onyx-data-intelligence`.
7. Vérifier la commande de build `npm run build`.
8. Vérifier le dossier de publication `dist`.
9. Publier le projet.

## Déploiements suivants

Une fois le dépôt lié, un push sur GitHub déclenche automatiquement un nouveau build et un nouveau déploiement Netlify.

## Fichiers à ne pas versionner

- `dist/`
- `node_modules/`
- données clients ou autres fichiers confidentiels

## GitHub Actions

Le workflow `.github/workflows/ci.yml` vérifie la structure et le build. Le déploiement de production est laissé à Netlify ; aucun workflow GitHub Pages n'est nécessaire.
