# EVANA API — Backend NestJS

API REST pour la plateforme EVANA (événements, billetterie, artistes), avec authentification JWT et autorisation par rôles (RBAC).

## Stack

- **NestJS 10** + TypeScript
- **TypeORM** + **MySQL** (mysql2)
- **JWT** (`@nestjs/jwt`, `passport-jwt`)
- **class-validator** / **class-transformer** pour les DTO
- **bcryptjs** pour le hash des mots de passe

## 1. Installation

```bash
cd evana-api
npm install
cp .env.example .env
```

Éditez `.env` avec vos identifiants MySQL et un `JWT_SECRET` fort.

## 2. Créer la base de données

Importez le schéma fourni :

```bash
mysql -u root -p < sql/schema.sql
```

Cela crée la base `evana_db`, les 5 tables (`users`, `events`, `artists`, `artist_genres`, `tickets`), les contraintes de clés étrangères, et 2 comptes de test :

| Email             | Mot de passe | Rôle  |
|-------------------|--------------|-------|
| admin@evana.com   | admin123     | admin |
| user@evana.com    | user123      | user  |

> ⚠️ `DB_SYNCHRONIZE=false` dans `.env` : TypeORM ne modifiera jamais votre schéma automatiquement. C'est `schema.sql` qui fait référence.

## 3. Lancer l'API

```bash
npm run start:dev
```

L'API démarre sur `http://localhost:3000/api`.

## 4. Architecture

```
src/
├── auth/            # register, login, stratégie JWT
├── users/           # gestion des comptes (admin + self-service)
├── events/          # CRUD événements (lecture publique, écriture admin)
├── artists/         # CRUD artistes (lecture publique, écriture admin)
├── tickets/         # achat/gestion des billets (protégé, RBAC)
├── weather/         # météo (Open-Meteo, protégé)
└── common/
    ├── decorators/  # @Roles(), @Public(), @CurrentUser()
    ├── guards/      # JwtAuthGuard, RolesGuard (appliqués globalement)
    ├── enums/       # Role
    ├── interfaces/  # AuthenticatedUser
    └── filters/     # HttpExceptionFilter (format d'erreur uniforme)
```

Les guards `JwtAuthGuard` et `RolesGuard` sont enregistrés **globalement** dans `AppModule` :
toute route est protégée par défaut, sauf celles marquées `@Public()`.

## 5. Endpoints principaux

### Auth (`/api/auth`) — publics

| Méthode | Route             | Description                        |
|---------|--------------------|-------------------------------------|
| POST    | `/auth/register`  | Créer un compte, renvoie `{user, accessToken}` |
| POST    | `/auth/login`     | Connexion, renvoie `{user, accessToken}` |

### Users (`/api/users`) — authentifié

| Méthode | Route        | Rôle requis        | Description                  |
|---------|--------------|---------------------|-------------------------------|
| GET     | `/users`     | admin               | Liste tous les utilisateurs   |
| GET     | `/users/:id` | admin ou soi-même   | Détail d'un utilisateur       |
| PUT     | `/users/:id` | admin ou soi-même   | Mise à jour (rôle : admin only) |
| DELETE  | `/users/:id` | admin               | Suppression                   |

### Events (`/api/events`)

| Méthode | Route         | Accès      | Description             |
|---------|---------------|------------|--------------------------|
| GET     | `/events`     | public     | Liste des événements     |
| GET     | `/events/:id` | public     | Détail d'un événement    |
| POST    | `/events`     | admin      | Créer un événement       |
| PUT     | `/events/:id` | admin      | Modifier un événement    |
| DELETE  | `/events/:id` | admin      | Supprimer un événement   |

### Artists (`/api/artists`)

Mêmes règles que `events` (lecture publique, écriture admin).

### Tickets (`/api/tickets`) — authentifié

| Méthode | Route                | Rôle requis      | Description                              |
|---------|----------------------|-------------------|-------------------------------------------|
| POST    | `/tickets`           | user ou admin     | Acheter un billet (prix recalculé serveur)|
| GET     | `/tickets`           | admin             | Tous les billets                          |
| GET     | `/tickets/my-tickets`| user ou admin     | Mes billets                               |
| GET     | `/tickets/:id`       | propriétaire/admin| Détail d'un billet                        |
| PATCH   | `/tickets/:id/cancel`| propriétaire/admin| Annuler un billet                         |
| DELETE  | `/tickets/:id`       | admin             | Suppression définitive                    |

### Weather (`/api/weather`) — authentifié

| Méthode | Route                    | Description                       |
|---------|--------------------------|------------------------------------|
| GET     | `/weather/current?city=` | Météo actuelle (Open-Meteo, gratuit) |

## 6. Gestion des erreurs

Toutes les erreurs suivent ce format JSON (via `HttpExceptionFilter`) :

```json
{
  "statusCode": 403,
  "message": "Accès refusé : rôle requis parmi [admin]",
  "error": "Forbidden",
  "path": "/api/events",
  "timestamp": "2026-07-01T12:00:00.000Z"
}
```

Codes utilisés : `400` (validation), `401` (non authentifié), `403` (rôle insuffisant), `404` (ressource introuvable), `409` (conflit, ex. email déjà utilisé).

## 7. Sécurité des prix des billets

Le prix d'un billet n'est **jamais** accepté depuis le frontend : il est recalculé côté serveur
(`TicketsService.create`) à partir du prix de l'événement (`event.ticketsPrice`) et du type de billet
(`early` = tarif normal, `standard` = tarif VIP ×2), afin d'empêcher toute manipulation du prix envoyé par le client.
