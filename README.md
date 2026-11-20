# Pokédex – Gestion des créatures

## Description

Ce projet est une application web permettant de consulter, rechercher, filtrer, trier et gérer des créatures à partir d'une API REST.

L'application utilise JavaScript, HTML, Tailwind CSS et json-server pour simuler une API.

## Fonctionnalités

### Consultation
- Affichage des créatures depuis l'API.
- Affichage du numéro, de l'image, du nom et du type.
- Consultation des détails d'une créature.
- Gestion du chargement des données.

### Recherche et filtrage
- Recherche par nom.
- Filtrage par type.
- Combinaison de la recherche et du filtre.
- Sauvegarde du dernier filtre dans LocalStorage.

### Tri
- Nom A → Z.
- Nom Z → A.
- Numéro de créature.

### Gestion des créatures
- Ajouter une créature avec POST.
- Modifier une créature avec PUT.
- Supprimer une créature avec DELETE après confirmation.
- Validation des données du formulaire.
- Sauvegarde du brouillon dans SessionStorage.

### Gestion des erreurs
- Serveur API inaccessible.
- Créature introuvable.
- Erreurs lors des opérations CRUD.
- Affichage des messages de succès et d'erreur.
- Désactivation des boutons pendant les requêtes.

## Technologies utilisées

- HTML5
- CSS3
- Tailwind CSS
- JavaScript ES6+
- Fetch API
- json-server
- LocalStorage
- SessionStorage

## Installation

### 1. Cloner le projet

```bash
git clone URL_DU_REPOSITORY
```

```bash
cd NOM_DU_PROJET
```

### 2. Installer json-server

```bash
npm install json-server
```

### 3. Lancer l'API

```bash
npx json-server db.json --port 3000
```

L'API sera disponible à l'adresse :

http://localhost:3000

### 4. Lancer l'application

Ouvrir le fichier `index.html` avec Live Server.

## Structure du projet

```text
project/
│
├── index.html
├── db.json
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    ├── main.js
    ├── api.js
    ├── ui.js
    └── state.js
```

## API Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/creatures` | Récupérer toutes les créatures |
| GET | `/creatures/:id` | Récupérer une créature |
| POST | `/creatures` | Ajouter une créature |
| PUT | `/creatures/:id` | Modifier une créature |
| DELETE | `/creatures/:id` | Supprimer une créature |

### Exemples

Recherche :

```http
GET /creatures?q=kit
```

Filtrage :

```http
GET /creatures?type=Feu
```

Tri :

```http
GET /creatures?_sort=name&_order=asc
```

## Validation

Les données du formulaire sont vérifiées avant l'envoi :

- Le nom est obligatoire.
- Le type doit être sélectionné.
- Les statistiques doivent être comprises entre 1 et 255.

## Gestion des erreurs

L'application affiche des messages adaptés en cas de problème :

- Impossible de contacter le serveur.
- Créature introuvable.
- Erreur lors de l'ajout.
- Erreur lors de la modification.
- Erreur lors de la suppression.

## Tests

Les fonctionnalités à tester :

- Chargement des créatures.
- Recherche et filtrage.
- Tri.
- Ajout d'une créature.
- Modification d'une créature.
- Suppression avec confirmation.
- Gestion des erreurs API.
- Conservation de la recherche, du filtre et du tri après une opération CRUD.

## Auteur

Projet réalisé dans le cadre de la formation développement web.
