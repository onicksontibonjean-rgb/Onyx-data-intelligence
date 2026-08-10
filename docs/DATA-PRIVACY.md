# Données et confidentialité

## Comportement actuel

Onyx traite les fichiers importés dans le navigateur. Le dépôt GitHub contient le code de l'application, pas les données analysées par les utilisateurs.

## Règles de dépôt

Ne jamais ajouter dans GitHub :

- bases clients réelles ;
- fichiers RH ;
- données financières confidentielles ;
- exports contenant des données personnelles ;
- fichiers de production utilisés pour les tests.

Utiliser des données synthétiques ou anonymisées pour les démonstrations.

## Bibliothèques tierces

La version 3.1 charge PapaParse, SheetJS et Plotly via les CDN déjà utilisés dans l'application d'origine. Cela télécharge le code de ces bibliothèques dans le navigateur, mais Onyx n'est pas conçu pour envoyer le contenu des fichiers importés à ces CDN.

Toute future intégration d'API, télémétrie ou stockage distant devra être documentée séparément.
