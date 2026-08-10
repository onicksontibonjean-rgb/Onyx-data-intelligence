# GitHub dans l'architecture Onyx

GitHub sert de dépôt source et de système de versionnement. La production est hébergée par Netlify.

## Flux recommandé

```text
feature/* -> develop -> main -> Netlify
```

Pour une mise en place simple, il est également possible de travailler directement avec `main` au début, puis d'introduire `develop` et les branches de fonctionnalités lorsque le projet grandit.

## Dépôt

Nom recommandé : `onyx-data-intelligence`

Les fichiers `index.html`, `netlify.toml` et `package.json` doivent être à la racine.

## CI

Le workflow `.github/workflows/ci.yml` exécute :

```bash
npm run check
npm run build
```

Le déploiement n'est pas effectué par GitHub Actions. Netlify se charge du déploiement continu après connexion au dépôt.
