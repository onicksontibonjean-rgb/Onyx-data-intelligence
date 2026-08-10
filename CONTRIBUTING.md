# Contribution à Onyx Data Intelligence

## Branches

- `main` : version de production.
- `develop` : intégration avant production.
- `feature/<nom>` : nouvelles fonctionnalités.
- `fix/<nom>` : corrections.

## Workflow recommandé

1. Créer une branche depuis `develop`.
2. Effectuer la modification.
3. Exécuter `npm run check`.
4. Exécuter `npm run build`.
5. Tester manuellement les parcours concernés.
6. Ouvrir une Pull Request vers `develop`.
7. Après validation, préparer une Pull Request `develop` → `main`.

Ne pas modifier directement `main` pour les évolutions importantes.
