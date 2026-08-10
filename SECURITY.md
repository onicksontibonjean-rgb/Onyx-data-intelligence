# Sécurité

## Données utilisateur

Onyx est actuellement conçu comme une application d'analyse côté navigateur. Les développeurs doivent éviter d'ajouter un transfert de données vers une API, un service d'analytics ou un stockage distant sans documentation explicite et validation préalable.

## Secrets

Ne jamais committer :

- clés API ;
- mots de passe ;
- tokens GitHub ;
- fichiers `.env` contenant des secrets ;
- jeux de données confidentiels ou réels.

## Dépendances externes

La version 3.1 conserve temporairement les versions CDN utilisées par l'application d'origine pour PapaParse, SheetJS et Plotly. Leur migration vers une gestion npm contrôlée fait partie de la prochaine étape de modularisation.
