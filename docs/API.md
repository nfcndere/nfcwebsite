# Contrat d'API `nfcwebsite` (consommé par le site public et `nfcmanager`)

URL de base canonique : `https://www.ngaounderefc.cm` (ne pas utiliser le domaine nu afin d'éviter qu'une redirection 308 perde l'en-tête `Authorization`).

---

## Conventions générales

### Authentification et rôles

Toutes les routes protégées attendent un jeton d'accès dans l'en-tête :

```http
Authorization: Bearer <accessToken>
```

| Rôle | Droits |
|---|---|
| `ADMIN` | Toutes les routes (`EDITOR` + gestion des utilisateurs, réglages du club, journal d'audit). |
| `EDITOR` | Contenu (articles, matchs, joueurs, classement, saisons, galerie/uploads, partenaires, formulaires, e-mails, notifications). |
| `USER` | Compte membre du site public ; refusé sur les routes d'administration (`403`) et au login lorsque `scope: "admin"`. |

Codes d'erreur d'authentification homogènes sur toutes les routes :

| Code HTTP | Situation | Corps JSON |
|---|---|---|
| `401` | Pas d'en-tête `Bearer`, jeton expiré/invalide/révoqué (`tokenVersion`), compte supprimé ou désactivé (`active = false`). | `{ "status": "error", "message": "Session expirée ou invalide. Veuillez vous reconnecter." }` |
| `403` | Jeton valide mais rôle insuffisant (`USER` sur une route `EDITOR`, ou `EDITOR` sur une route `ADMIN`). | `{ "status": "error", "message": "Accès réservé aux administrateurs et éditeurs." }` (ou `"... aux administrateurs."`) |
| `500` | `JWT_SECRET` ou `JWT_REFRESH_SECRET` non configuré sur le serveur. | `{ "status": "error", "message": "Configuration de sécurité indisponible." }` |

### Enveloppe de réponse (`src/lib/api-response.ts`)

Les lectures et mises à jour de ressources renvoient :

```json
{
  "status": "ok | empty | stale | partial",
  "data": "...",
  "updatedAt": "2026-10-26T12:00:00.000Z"
}
```

Les erreurs renvoient :

```json
{
  "status": "error",
  "message": "Description lisible en français",
  "issues": [{ "path": "played", "message": "..." }]
}
```

(`issues` est présent sur les erreurs de validation `400`.)

En cas de dépassement de limite de débit (`429`), l'en-tête HTTP `Retry-After: <secondes>` est systématiquement présent.

---

## 0. Santé et déploiement

### `GET /api/health`

- **Auth** : aucune (public, sans exposition de secrets).
- **Réponse `200`** (ou `503` si une variable critique ou une table manque) :

```json
{
  "status": "ok",
  "data": {
    "healthy": true,
    "env": {
      "DATABASE_URL": true,
      "JWT_SECRET": true,
      "JWT_REFRESH_SECRET": true
    },
    "optionalEnv": {
      "DIRECT_URL": true,
      "CLOUDINARY": true,
      "RESEND_API_KEY": true,
      "WEB_PUSH": false
    },
    "database": {
      "reachable": true,
      "latencyMs": 14,
      "schemaReady": true,
      "missingTables": []
    }
  },
  "updatedAt": "2026-10-26T12:00:00.000Z"
}
```

---

## 1. Authentification

### `POST /api/auth/login`

- **Auth** : public (limité à 20 req / 15 min par IP et 8 req / 15 min par e-mail, `429` + `Retry-After`).
- **Corps** :
  ```json
  { "email": "admin@nfc.cm", "password": "secret", "scope": "admin" }
  ```
  `scope` est optionnel (`"admin" | "site"`). Avec `"admin"`, un compte de rôle `USER` reçoit `403`.
- **Réponse `200`** (contrat existant préservé, champs `expiresIn` et `user.mustChangePassword` ajoutés) :
  ```json
  {
    "success": true,
    "message": "Connexion réussie",
    "token": "<jwt-access-15m>",
    "refreshToken": "<jwt-refresh-7d>",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "name": "Henry",
      "email": "admin@nfc.cm",
      "role": "ADMIN",
      "mustChangePassword": false
    }
  }
  ```
- **Erreurs** : `400` (champs invalides), `401` (identifiants incorrects), `403` (`"Compte sans droits d'administration"` ou `"Compte désactivé. Contactez un administrateur."`), `429`, `500` (`"Configuration de sécurité indisponible."`).

### `POST /api/auth/refresh`

- **Auth** : public (limité à 60 req / 15 min par IP).
- **Corps** : `{ "refreshToken": "<jwt-refresh>" }`
- **Réponse `200`** : même forme que `/api/auth/login` (`success`, `token` 15 min, nouveau `refreshToken` 7 j, `expiresIn`, `user`).
- **Erreurs** : `401` si le jeton est absent, expiré, de type `access`, révoqué (`tokenVersion`), ou si l'utilisateur n'existe plus / est désactivé.

### `GET /api/auth/me`

- **Auth** : `Bearer` (tout rôle actif).
- **Réponse `200`** : `{ "status": "ok", "data": { "id", "name", "email", "role", "active", "mustChangePassword", "lastLoginAt", "createdAt", "updatedAt" }, "updatedAt": "..." }` (jamais de `passwordHash`).
- **Erreurs** : `401`, `500`.

### `POST /api/auth/password`

- **Auth** : `Bearer` (utilisateur connecté). Limité à 5 req / 15 min par utilisateur.
- **Corps** :
  ```json
  { "currentPassword": "AncienMotDePasse1", "newPassword": "NouveauMotDePasse2" }
  ```
  Politique `newPassword` : 10–128 caractères, au moins une lettre et un chiffre, différent de l'actuel.
- **Effet** : incrémente `tokenVersion` (invalide tous les jetons précédents), met `mustChangePassword = false`, crée une entrée `AuditLog` (`PASSWORD_CHANGE`).
- **Réponse `200`** : `{ "status": "ok", "message": "Mot de passe modifié.", "token", "refreshToken", "expiresIn", "user" }`.
- **Erreurs** : `400` (mot de passe actuel erroné ou nouveau mot de passe non conforme), `401`, `429`.

### `POST /api/auth/forgot`

- **Auth** : public (10 req / h par IP, 3 req / h par e-mail).
- **Corps** : `{ "email": "admin@nfc.cm" }`
- **Effet** : si un compte actif existe, invalide les anciens jetons de réinitialisation, crée un `PasswordResetToken` (hash SHA-256, expire en 1 h, usage unique) et envoie l'e-mail via Resend.
- **Réponse `200`** (identique que l'adresse existe ou non) :
  ```json
  { "status": "ok", "message": "Si un compte correspond à cette adresse, un e-mail de réinitialisation vient d’être envoyé." }
  ```

### `POST /api/auth/reset`

- **Auth** : public (10 req / h par IP).
- **Corps** : `{ "token": "<jeton-reçu-par-email>", "password": "NouveauMotDePasse2" }`
- **Effet** : consomme atomiquement le jeton (`usedAt = now()`), met à jour le hash, incrémente `tokenVersion`, écrit `AuditLog` (`PASSWORD_RESET`).
- **Réponse `200`** : `{ "status": "ok", "message": "Mot de passe réinitialisé. Vous pouvez vous connecter." }`
- **Erreurs** : `400` (jeton inconnu, déjà utilisé ou expiré ; mot de passe trop faible), `429`.

---

## 2. Contenu

### Articles — `/api/articles` et `/api/articles/[id]`

- **`GET /api/articles`**
  - **Auth** : public ; si un en-tête `Bearer` d'éditeur/admin valide est fourni, le paramètre `?status=all|draft|published` est pris en compte (pour le public, seuls les articles `published: true` et `deletedAt: null` sont renvoyés, même si `?status=all` est passé).
  - **Query** : `category` (optionnel), `slug` (optionnel), `limit` (1–100, défaut 20), `status` (`all | draft | published`, éditeur uniquement).
  - **Réponse `200`** : `{ status, data: Article[], updatedAt }`.
- **`POST /api/articles`** (`EDITOR` | `ADMIN`)
  - **Corps** : `{ slug, title, content, summary?, category?, videoUrl?, coverId?, authorId?, published? }`
  - **Réponse `201`** : `{ status: "ok", data: Article, updatedAt }`.
- **`GET /api/articles/[id]`** : par `id` ou `slug` (`deletedAt: null` ; brouillon lisible uniquement avec un jeton éditeur).
- **`PATCH /api/articles/[id]`** (`EDITOR` | `ADMIN`)
  - **Corps** : champs partiels + `restore?: true` pour annuler une suppression logique.
- **`DELETE /api/articles/[id]`** (`EDITOR` | `ADMIN`)
  - **Effet** : suppression logique (`deletedAt = now()`, aucune suppression SQL).
  - **Réponse `200`** : `{ status: "ok", data: { id, deleted: true, deletedAt }, updatedAt }`.

### Matchs — `/api/matches` et `/api/matches/[id]`

- Statuts autorisés (inchangés) : `PROGRAMME | EN_COURS | TERMINE | REPORTE | ANNULE`.
- **`GET /api/matches`** (public, filtre `deletedAt: null`) : query `status`, `page`, `pageSize`.
- **`POST /api/matches`** (`EDITOR` | `ADMIN`) : `{ homeTeam, awayTeam, date (ISO avec offset), stadium?, competition?, status?, summary?, homeScore?, awayScore? }` → `201`.
- **`GET /api/matches/[id]`** (public, `deletedAt: null`).
- **`PATCH /api/matches/[id]`** (`EDITOR` | `ADMIN`) : champs partiels + `restore?: true`.
- **`DELETE /api/matches/[id]`** (`EDITOR` | `ADMIN`) : suppression logique (`deletedAt = now()`).

### Joueurs — `/api/players` et `/api/players/[id]`

- Postes autorisés (inchangés) : `GARDIEN | DEFENSEUR | MILIEU | ATTAQUANT`.
- **`GET /api/players`** (public, filtre `deletedAt: null`, tri par `number asc`).
- **`POST /api/players`** (`EDITOR` | `ADMIN`) : `{ firstName, lastName, number?, position?, nationality?, bio?, photoId?, photoUrl?, isCaptain?, birthDate?, height?, weight?, joinedYear? }` → `201`.
- **`GET /api/players/[id]`** (public, `deletedAt: null`, inclut `media`).
- **`PATCH /api/players/[id]`** (`EDITOR` | `ADMIN`) : champs partiels + `restore?: true`.
- **`DELETE /api/players/[id]`** (`EDITOR` | `ADMIN`) : suppression logique (`deletedAt = now()`).

### Classement du NFC — `/api/standings` et `/api/standings/history`

- **`GET /api/standings`** (public, forme **strictement inchangée**) :
  ```json
  {
    "status": "ok",
    "data": {
      "season": { "id": "uuid", "label": "2026-2027" },
      "nfc": {
        "id": "uuid",
        "seasonId": "uuid",
        "rank": 1,
        "position": 1,
        "teamName": "Ngaoundéré FC",
        "played": 5,
        "won": 3,
        "drawn": 1,
        "lost": 1,
        "goalsFor": 8,
        "goalsAgainst": 4,
        "goalDifference": 4,
        "points": 10,
        "form": "V-V-N-D-V",
        "updatedAt": "2026-10-26T12:00:00.000Z"
      }
    },
    "updatedAt": "2026-10-26T12:00:00.000Z"
  }
  ```
- **`PUT /api/standings`** (`EDITOR` | `ADMIN`)
  - **Corps** (validé par zod) :
    ```json
    {
      "seasonId": "optionnel (défaut = saison isCurrent)",
      "rank": 1,
      "played": 5,
      "won": 3,
      "drawn": 1,
      "lost": 1,
      "goalsFor": 8,
      "goalsAgainst": 4,
      "form": "V-V-N-D-V"
    }
    ```
    Règles : entiers ≥ 0 (`rank` ≥ 1), `played === won + drawn + lost`, `form` optionnel au format `^[VND](-[VND]){0,4}$` (1 à 5 résultats séparés par `-`, insensible à la casse, normalisé en majuscules).
  - **Effet** : `upsert` de `ClubStanding`, insertion dans `ClubStandingHistory` (avec `changedById`) et `AuditLog`.
  - **Réponse `200`** : même enveloppe `{ status, data: { season, nfc }, updatedAt }` que le `GET`.
  - **Erreurs** : `400` (validation), `401`/`403`, `404` (aucune saison courante ni `seasonId` valide).
- **`GET /api/standings/history`** (`EDITOR` | `ADMIN`)
  - **Query** : `seasonId` (défaut : saison courante), `limit` (1–100, défaut 50).
  - **Réponse `200`** : `{ status, data: Array<ClubStandingHistory & { points, goalDifference, season, changedBy }>, updatedAt }`.

### Saisons — `/api/seasons` et `/api/seasons/[id]`

- **`GET /api/seasons`** (public) : liste des saisons triées par `startsAt desc`.
- **`POST /api/seasons`** (`EDITOR` | `ADMIN`) : `{ label, startsAt, endsAt, isCurrent? }`. Si `isCurrent: true`, désactive l'ancienne saison courante dans la même transaction.
- **`PATCH /api/seasons/[id]`** (`EDITOR` | `ADMIN`)
  - **Corps** : `{ label?, startsAt?, endsAt?, isCurrent? }` (`endsAt > startsAt` vérifié). Si `isCurrent: true`, toutes les autres saisons passent à `isCurrent: false` dans la même transaction.
  - **Réponse `200`** : `{ status: "ok", data: Season, updatedAt }`.

### Réglages du club — `/api/settings` et `/api/club-overview`

Clés autorisées :
`facebookUrl`, `whatsappPartenaire`, `whatsappBilletterie`, `homeIntroText`, `academyCompletionRate`, `academyGraduates`, `academyLabel`.

- **`GET /api/club-overview`** (public, contrat inchangé) : `{ status, data: { nextMatch, liveMatch, settings }, updatedAt }` (les matchs supprimés logiquement sont exclus).
- **`GET /api/settings`** (`EDITOR` | `ADMIN`) : `{ status, data: { keys, values, items }, updatedAt }`.
- **`PUT /api/settings`** (`ADMIN` uniquement)
  - **Corps** (3 formats acceptés) :
    - objet direct : `{ "facebookUrl": "https://...", "homeIntroText": "..." }`
    - enveloppé : `{ "settings": { "facebookUrl": "https://..." } }`
    - liste : `{ "items": [{ "key": "facebookUrl", "value": "https://..." }] }`
  - **Réponse `200`** : `{ status: "ok", data: { keys, values, items }, updatedAt }`.

### Partenaires / Sponsors — `/api/partners` et `/api/partners/[id]`

- **`GET /api/partners`**
  - **Public** : renvoie uniquement les sponsors `active: true`, triés par `priority asc, name asc`, avec `{ id, name, link, logoId, logoUrl, priority, active }`.
  - **Éditeur** (`Bearer` + `?includeInactive=true` ou `?status=all`) : inclut aussi les inactifs.
- **`POST /api/partners`** (`EDITOR` | `ADMIN`) : `{ name, link?, logoId?, priority?: number, active?: boolean (défaut true) }` → `201`.
- **`PATCH /api/partners/[id]`** (`EDITOR` | `ADMIN`) : `{ name?, link?, logoId?, priority?, active? }`.
- **`DELETE /api/partners/[id]`** (`EDITOR` | `ADMIN`) : `{ status: "ok", data: { id, deleted: true }, updatedAt }`.

---

## 3. Médias et téléversement

### `POST /api/uploads/sign` (voie principale : envoi direct navigateur → Cloudinary)

- **Auth** : `EDITOR` | `ADMIN` (limité à 40 req / 15 min par utilisateur).
- **Corps** :
  ```json
  { "mimeType": "image/webp", "size": 1843200, "resourceType": "image", "filename": "match.webp" }
  ```
  Limites :
  - images (`image/jpeg`, `png`, `webp`, `gif`, `avif`, `heic`, `heif`) : **≤ 10 Mio** (`10 485 760` octets) ;
  - vidéos (`video/mp4`, `quicktime`, `webm`, `x-matroska`, `3gpp`) : **≤ 50 Mio** (`52 428 800` octets).
- **Réponse `200`** (**ne contient jamais `CLOUDINARY_API_SECRET`**) :
  ```json
  {
    "status": "ok",
    "data": {
      "timestamp": 1761480000,
      "signature": "<sha1-hex>",
      "apiKey": "<CLOUDINARY_API_KEY>",
      "cloudName": "<CLOUDINARY_CLOUD_NAME>",
      "folder": "nfc-media",
      "resourceType": "image",
      "allowedFormats": "jpg,jpeg,png,webp,gif,avif,heic,heif",
      "maxBytes": 10485760,
      "uploadUrl": "https://api.cloudinary.com/v1_1/<cloudName>/image/upload",
      "limits": { "imageMaxBytes": 10485760, "videoMaxBytes": 52428800 }
    },
    "updatedAt": "2026-10-26T12:00:00.000Z"
  }
  ```
  Le navigateur envoie ensuite un `FormData` à `uploadUrl` avec `file`, `api_key`, `timestamp`, `signature`, `folder: "nfc-media"`, `allowed_formats`, puis enregistre l'asset via `POST /api/galerie`.

### `POST /api/galerie`

- **Auth** : `EDITOR` | `ADMIN`.
- **Corps** :
  ```json
  {
    "publicId": "nfc-media/abc123",
    "url": "https://res.cloudinary.com/<cloudName>/image/upload/v1761480000/nfc-media/abc123.webp",
    "mimeType": "image/webp",
    "width": 1600,
    "height": 900,
    "size": 1843200,
    "title": "Entraînement",
    "altText": "Séance au stade",
    "album": "Saison 2026-2027",
    "mediaType": "IMAGE",
    "playerId": null
  }
  ```
- **Validation** : `publicId` doit commencer par `nfc-media/` (sans `..`), `url` doit être en HTTPS sur `res.cloudinary.com/<CLOUDINARY_CLOUD_NAME>/<image|video>/upload/...` et contenir `publicId`, `size` ≤ limite du type.
- **Réponse `201`** : `{ status: "ok", data: Media, updatedAt }`.

### `GET /api/galerie`, `GET /api/galerie/[id]`, `PATCH /api/galerie/[id]`, `DELETE /api/galerie/[id]`

- **`DELETE /api/galerie/[id]`** (`EDITOR` | `ADMIN`) : détruit l'asset sur Cloudinary (`image` ou `video` selon le média, best effort avec journalisation) puis supprime l'entrée `Media` et écrit `AuditLog`. Réponse : `{ status: "ok", data: { id, deleted: true, cloudinaryResult }, updatedAt }`.

### `POST /api/uploads` (voie de secours multipart)

- **Auth** : `EDITOR` | `ADMIN`. `multipart/form-data` avec `file`, `title`, `altText`, `album`, `playerId`.

---

## 4. Utilisateurs et audit (`ADMIN`)

### `GET /api/users`

- **Auth** : `ADMIN`.
- **Réponse `200`** : `{ status, data: UserSansMotDePasse[], updatedAt }` (`passwordHash` et `tokenVersion` sont toujours exclus).

### `POST /api/users`

- **Auth** : `ADMIN`.
- **Corps** :
  ```json
  {
    "name": "Paul",
    "email": "paul@nfc.cm",
    "role": "EDITOR",
    "temporaryPassword": "optionnel (généré si omis)",
    "sendInviteEmail": true
  }
  ```
- **Réponse `201`** :
  ```json
  {
    "status": "ok",
    "data": {
      "user": { "id": "uuid", "name": "Paul", "email": "paul@nfc.cm", "role": "EDITOR", "active": true, "mustChangePassword": true },
      "temporaryPassword": "<mot-de-passe-temporaire>"
    },
    "updatedAt": "..."
  }
  ```

### `PATCH /api/users/[id]`

- **Auth** : `ADMIN` (interdiction de se désactiver ou de se retirer le rôle `ADMIN` soi-même).
- **Corps** : `{ name?, role?: "ADMIN"|"EDITOR"|"USER", active?: boolean, temporaryPassword?, resetTemporaryPassword?: boolean }`.
- Tout changement de `role`, `active` ou mot de passe temporaire incrémente `tokenVersion` (révocation immédiate des sessions de cet utilisateur).

### `DELETE /api/users/[id]`

- **Auth** : `ADMIN`.
- **Effet** : désactive le compte (`active: false`, `tokenVersion++`) sans supprimer la ligne SQL afin de conserver l'intégrité des articles, médias et journaux d'audit.
- **Réponse `200`** : `{ status: "ok", data: { id, active: false, deactivated: true, user }, updatedAt }`.

### `GET /api/audit`

- **Auth** : `ADMIN`.
- **Query** : `entity`, `entityId`, `userId`, `action`, `page` (défaut 1), `pageSize` (1–100, défaut 50).
- **Réponse `200`** : `{ status, data: Array<AuditLog & { user }>, updatedAt }`.

---

## 5. Formulaires, e-mails, notifications Web Push

### Formulaires — `/api/academie`, `/api/forms`, `/api/forms/[id]`

- **`POST /api/academie`** (public, 5 req / h par IP) : crée une `FormSubmission` (`type: "ACADEMIE"`, `followUpStatus: "NOUVEAU"`) et déclenche une notification Web Push si activée.
- **`POST /api/forms`** (public, 5 req / h par IP) : `{ type?: "CONTACT"|"BILLETTERIE", name, email?, phone?, subject?, message }` → crée une `FormSubmission` et déclenche une notification Web Push si activée.
- **`GET /api/forms`** (`EDITOR` | `ADMIN`) : query `type` (`ACADEMIE|NEWSLETTER|CONTACT|BILLETTERIE`), `processed` (`true|false`), `followUpStatus` (`NOUVEAU|CONTACTE|CONVOQUE|ADMIS|REFUSE`).
- **`PATCH /api/forms/[id]`** (`EDITOR` | `ADMIN`) :
  ```json
  {
    "processed": true,
    "adminNotes": "Convoqué pour la détection de samedi à 9h.",
    "followUpStatus": "CONVOQUE"
  }
  ```
  `followUpStatus` (ou alias `status`) accepte `NOUVEAU | CONTACTE | CONVOQUE | ADMIS | REFUSE` (ainsi que `nouveau`, `contacté`, `convoqué`, `admis`, `refusé`).
  Les notes internes sont stockées dans la colonne dédiée `adminNotes` (le `payload` soumis par le candidat reste intact). Si `processed` est omis : un passage à `CONTACTE`/`CONVOQUE`/`ADMIS`/`REFUSE` met `processed = true` (`NOUVEAU` → `false`) ; un appel historique `{}` ou `{ processed: true }` continue de marquer `processed = true`.

### E-mails — `/api/emails`

- **`GET /api/emails`** (`EDITOR` | `ADMIN`) : 50 derniers `EmailLog`.
- **`POST /api/emails`** (`EDITOR` | `ADMIN`, 30 req / h)
  - **Corps** : `{ to, subject, body?, html? }` ou `{ emailLogId }` pour réexpédier un envoi existant.
  - **Effet** : envoi réel via Resend (`src/lib/server/resend.ts`) et création d'un `EmailLog` avec `status: "SUCCESS" | "FAILED" | "SKIPPED"`, `providerId`, `error`.
  - **Réponses** : `200` si envoyé (`SUCCESS`), `502` si Resend renvoie une erreur (`FAILED`), `503` si `RESEND_API_KEY` n'est pas configurée (`SKIPPED`).

### Web Push (VAPID) — `/api/push/subscribe`

Actif uniquement si `PUSH_NOTIFICATIONS_ENABLED="true"`, `VAPID_PUBLIC_KEY` et `VAPID_PRIVATE_KEY` sont définis.

- **`GET /api/push/subscribe`** (`EDITOR` | `ADMIN`) : `{ status: "ok", data: { enabled: boolean, publicKey: string | null }, updatedAt }`.
- **`POST /api/push/subscribe`** (`EDITOR` | `ADMIN`) : `{ endpoint, keys: { p256dh, auth } }` → enregistre l'abonnement du navigateur (`503` si désactivé).
- **`DELETE /api/push/subscribe`** (`EDITOR` | `ADMIN`) : `{ endpoint }`.
