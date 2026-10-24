# Réponses pour la soutenance (perso, non versionné)

Chaque réponse est tirée du code réel du repo. Les chemins sont donnés pour pouvoir ouvrir le fichier pendant la démo.

---

## 1. Un endroit où on peut supprimer le compte, modifier les creds, etc.

**Page `/profile`** ([Profile.jsx](frontend/src/pages/Profile.jsx)), accessible depuis la sidebar, protégée par `ProtectedRoute`.

Elle contient trois blocs :

| Bloc | Ce qu'on peut faire | Route backend |
| --- | --- | --- |
| Account details | changer nom, email, mot de passe | `PATCH /api/auth/me` |
| Share my dashboard | activer / couper le lien public de partage | `POST` / `DELETE /api/dashboard/share` |
| Delete account | supprimer définitivement son compte | `DELETE /api/auth/me` |

Règles de sécurité (dans [authService.js](backend/src/services/authService.js)) :

- Le **nom** se change librement.
- Changer l'**email** ou le **mot de passe** exige le **mot de passe actuel** (`assertPassword`).
- Un **nouvel email** repasse en `isConfirmed = false` et un nouveau mail de confirmation part (comme à l'inscription).
- La **suppression** redemande le mot de passe (une session volée ne suffit pas à tout effacer).
  - Un mauvais mot de passe renvoie **403 et pas 401** : le front traite tout 401 comme "session expirée" et déconnecterait l'utilisateur.
  - Le **dernier admin** ne peut pas se supprimer (409).
  - `prisma.user.delete` fait un **cascade** : les `ServiceSubscription` (avec leurs tokens chiffrés) et les `WidgetInstance` disparaissent avec le user. C'est le "droit à l'effacement" RGPD.

Côté **admin** : page `/admin` ([Admin.jsx](frontend/src/pages/Admin.jsx)), réservée au rôle ADMIN (`AdminRoute` + `requireAdmin`). Lister les users, changer un rôle (`PATCH /api/admin/users/:id`), supprimer un user (`DELETE /api/admin/users/:id`). Le premier admin se crée via la variable `ADMIN_EMAILS` du `.env`.

Les **credentials des services** (GitHub, Spotify...) se gèrent sur `/services` : connecter = OAuth, déconnecter = `DELETE /api/services/:name/subscribe`.

---

## 2. Mentions légales RGPD

**Page publique `/legal`** ([Legal.jsx](frontend/src/pages/Legal.jsx)), accessible sans compte. Lien depuis la page Login ("Legal notice & privacy") et depuis Register (phrase d'information sous le bouton, pas une case à cocher).

Contenu, **rédigé à partir de ce que fait vraiment le code** :

- **Éditeur** : projet étudiant Epitech G-WEB-500, le déployeur de l'instance est le responsable de traitement. Le mail de contact vient de `LEGAL_CONTACT_EMAIL` (`.env` → `VITE_LEGAL_CONTACT_EMAIL`), sinon mention générique "administrateur".
- **Données collectées** : compte (nom, email, rôle, confirmé ou non), mot de passe (**hash bcrypt uniquement**), dashboard (widgets, config, taille, position), tokens des services liés (**chiffrés AES-256-GCM**), tokens techniques (confirmation email, lien de partage).
- **Ce qu'on ne fait pas** : pas de log d'IP, pas d'analytics, pas de pub, pas de cookies, pas de revente.
- **Tiers côté serveur** : OpenWeatherMap, GitHub, Google/YouTube, Spotify, Pinterest, Open-Meteo/OSRM, Wikipedia/Wikidata, RDAP, flux RSS / URLs configurées.
- **Tiers côté navigateur** : Google Fonts, sites affichés par le widget website, Wikimedia, Pinterest (images).
- **localStorage** : `token`, `dashboard-theme`, `dashboard-wallpaper`, `dashboard-sidebar-collapsed` (aucun cookie).
- **Droits RGPD** : accès, rectification (page Profile), effacement (Delete account), contact pour le reste.

Décision associée : #21 dans [DECISIONS.md](docs/DECISIONS.md).

---

## 3. Comment le front communique avec le back

- Front : **React + Vite** (port 5173). Back : **Express** (port 8080). Doc détaillée : [FRONTEND_BACKEND_COMMUNICATION.md](docs/FRONTEND_BACKEND_COMMUNICATION.md).
- Le front utilise **un seul client axios** ([client.js](frontend/src/api/client.js)) avec `baseURL: '/api'`. Un module par domaine dans `frontend/src/api/` (auth, dashboard, services, admin, places, share, about).
- **Proxy Vite** ([vite.config.js](frontend/vite.config.js)) : `/api` et `/about.json` sont redirigés vers `VITE_BACKEND_URL` (`http://backend:8080` dans Docker). Donc pour le navigateur tout est same-origin, pas de souci de CORS.
- **Authentification** : JWT stocké dans `localStorage`. Un **intercepteur de requête** ajoute `Authorization: Bearer <token>` à chaque appel. Un **intercepteur de réponse** : sur un **401**, il supprime le token et redirige vers `/login`.
- **Backend** : `requireAuth` ([auth.js](backend/src/middleware/auth.js)) vérifie le JWT puis recharge l'utilisateur en base (un compte supprimé ne passe plus).
- **Données** : JSON partout. Erreurs au format `{ error: "..." }`. Validation avec `express-validator` sur les routes d'auth.
- **Exception notable** : le retour OAuth. Le navigateur ne peut pas mettre un Bearer sur une redirection, donc le front appelle `/oauth/start` via axios, reçoit `{ url }`, puis navigue lui-même vers le fournisseur.

Routes principales :

| Zone | Routes |
| --- | --- |
| Auth | `POST /api/auth/register`, `GET /api/auth/confirm/:token`, `POST /api/auth/login`, `GET/PATCH/DELETE /api/auth/me` |
| Dashboard | `GET/POST /api/dashboard/widgets`, `PATCH/DELETE /api/dashboard/widgets/:id`, `GET /api/dashboard/widgets/:id/data`, `GET/POST/DELETE /api/dashboard/share` |
| Services | `GET /api/services`, `POST/DELETE /api/services/:name/subscribe`, `GET /api/services/:service/oauth/start` et `/callback` |
| Admin | `GET /api/admin/users`, `PATCH/DELETE /api/admin/users/:id` |
| Public | `GET /api/public/dashboards/:token`, `GET /about.json`, `GET /api/health` |

---

## 4. Comment on hash les mots de passe

- Librairie **bcryptjs**, **10 salt rounds** (`SALT_ROUNDS = 10` dans [authService.js](backend/src/services/authService.js)).
- **Inscription** : `bcrypt.hash(password, 10)` → stocké dans `User.passwordHash`. Le mot de passe en clair n'est jamais stocké ni loggé. Minimum 8 caractères (validé côté route **et** côté service).
- **Login** : `bcrypt.compare(password, user.passwordHash)`. Même message d'erreur ("Invalid email or password") si l'email n'existe pas ou si le mot de passe est faux → on ne révèle pas quels emails existent.
- **Pourquoi bcrypt** : hash lent et adaptatif, **salt aléatoire intégré** dans le hash (deux users avec le même mot de passe ont deux hash différents), résiste au brute force et aux rainbow tables. Un SHA-256 simple serait trop rapide à attaquer. Décision #6 de [DECISIONS.md](docs/DECISIONS.md).
- À ne pas confondre avec les tokens OAuth des services : ceux-ci doivent être **relus** donc ils sont **chiffrés** (AES-256-GCM, réversible), pas hashés. Voir [crypto.js](backend/src/services/crypto.js).

---

## 5. Comment les widgets se déplacent

**Drag & drop natif HTML5** (pas de librairie), positionnement **libre en pixels** (pas de grille).

Dans [Dashboard.jsx](frontend/src/pages/Dashboard.jsx) :

1. `onDragStart` (`handleDragStart`) : on mémorise le décalage entre le curseur et le coin du widget (`dragOffset`), pour que le widget ne "saute" pas sous la souris.
2. `onDragOver` sur le canvas : `preventDefault()` pour autoriser le drop.
3. `onDrop` : position = `clientX/Y` − coin du canvas − décalage, bornée à `>= 0`.
4. **Mise à jour optimiste** de l'état React (le widget bouge tout de suite).
5. **Persistance** : `PATCH /api/dashboard/widgets/:id` avec `{ position: { x, y } }`. Si l'appel échoue, message d'erreur "Could not save the new widget position."

Stockage : colonne `WidgetInstance.position` (JSON `{x, y}`), validée côté back (`validatePosition` : doit être un objet). Au rechargement, le dashboard est reconstruit avec les positions sauvegardées.

**Redimensionnement** (bonus) : poignée en bas à droite de la carte ([WidgetCard.jsx](frontend/src/components/WidgetCard.jsx)). 4 tailles prédéfinies : `square` 1×1, `wide` 2×1, `tall` 1×2, `large` 2×2. Un seuil de 50 px fait basculer une dimension. Sauvegardé dans `WidgetInstance.size` via le même `PATCH`.

---

## 6. Comment la connexion aux services se fait

Deux types de services (page `/services`, [Services.jsx](frontend/src/pages/Services.jsx)) :

**a) Services sans compte tiers** (météo, horloge, calendrier, notes, RSS, maps, monitoring, website) : clic sur "Subscribe" → `POST /api/services/:name/subscribe` → ligne `ServiceSubscription` (sans credentials). Les clés API éventuelles (ex. `OPENWEATHER_API_KEY`) sont côté serveur dans le `.env`.

**b) Services OAuth2** (GitHub, YouTube, Spotify, Pinterest) : voir section 8. Le compte de l'utilisateur est lié, ses tokens sont stockés **chiffrés** dans `ServiceSubscription.credentials`.

Architecture interne (registre auto-descriptif, décisions #10 et #11) :

- Chaque service a une **définition** dans `backend/src/services/definitions/*.js` (nom, widgets, paramètres) et un **provider** (`<service>/provider.js`) qui sait récupérer les données.
- [loadDefinitions.js](backend/src/services/loadDefinitions.js) / [widgetRegistry.js](backend/src/services/widgetRegistry.js) construisent le catalogue. Il est exposé par **`GET /about.json`** (contrat imposé par le sujet). Les services avec moins de 3 widgets sont volontairement exclus de ce fichier.
- [providerRegistry.js](backend/src/services/providerRegistry.js) route `fetchWidgetData(service, widget, config, credentials)` vers le bon provider, **en process** (pas de micro-services séparés).
- Un widget ne peut être ajouté que si le service est souscrit (`available` dans `GET /api/services`).

Flux de récupération des données d'un widget :

```
Browser (timer) → GET /api/dashboard/widgets/:id/data
  → requireAuth → dashboardService charge l'instance + la subscription
  → credentialsStore.loadCredentials (déchiffre, rafraîchit le token si expiré)
  → providerRegistry → provider → API externe
  → { data, fetchedAt } renvoyé au widget
```

---

## 7. Refresh rate

- Chaque **instance** de widget a son propre `refreshRate` en **secondes** (`WidgetInstance.refreshRate`, défaut **60**, **minimum 5** validé côté back : `MIN_REFRESH_RATE_SECONDS`).
- Réglable dans la modale de création/édition ([WidgetFormModal.jsx](frontend/src/components/WidgetFormModal.jsx)), champ "Refresh rate (seconds)".
- Le **Timer** est le hook [useWidgetRefresh.js](frontend/src/hooks/useWidgetRefresh.js) : un `fetch` immédiat au montage, puis un `setInterval(tick, refreshRate * 1000)` **par widget**. Nettoyage (`clearInterval` + flag `cancelled`) au démontage ou quand `refreshRate` / la config change, pour éviter les fuites et les mises à jour d'un composant démonté.
- Le modèle est **pull depuis le navigateur**, pas de WebSocket (décision #12). Simple, stateless, et le timer s'arrête quand le widget n'est plus à l'écran.
- En cas d'erreur de refresh, l'ancienne donnée reste affichée avec le message d'erreur (`fetchedAt` permet d'afficher la fraîcheur).
- Certains widgets (horloge, timer) tournent localement (`useLiveClock`) et n'ont pas besoin du back.

---

## 8. OAuth2

**Flux Authorization Code, écrit à la main (pas de Passport)**, décisions #13 et #14. Quatre providers : GitHub, YouTube (Google), Spotify, Pinterest. Même interface pour tous : `buildAuthorizeUrl(userId)`, `verifyState(state)`, `exchangeCodeForToken(code)`, `refreshAccessToken(refreshToken)`.

Déroulé ([services.controller.js](backend/src/controllers/services.controller.js)) :

1. Le front appelle `GET /api/services/:service/oauth/start` (authentifié) et reçoit `{ url }`.
2. Le back fabrique l'URL d'autorisation avec `client_id`, `redirect_uri`, `scope` et un **`state` = JWT signé** (contient l'id user, expire en **10 min**). C'est la protection **anti-CSRF** et c'est aussi ce qui permet de savoir à quel user rattacher le retour, sans session serveur.
3. Le front redirige le navigateur vers le fournisseur (écran de consentement).
4. Le fournisseur redirige vers `GET /api/services/:service/oauth/callback?code=...&state=...` (route **sans** `requireAuth`, puisque c'est le fournisseur qui l'appelle).
5. Le back vérifie le `state` (`verifyState`), échange le `code` contre un token (`exchangeCodeForToken`, appel serveur à serveur avec le `client_secret`).
6. Les tokens sont **chiffrés** (AES-256-GCM) et sauvegardés en `upsert` dans `ServiceSubscription.credentials`.
7. Redirection vers `/services?linked=<service>` (ou `&error=...` si l'utilisateur a refusé).

**Refresh des tokens** ([credentialsStore.js](backend/src/services/credentialsStore.js)) : avant chaque appel, si `expiresAt` est dépassé et qu'il y a un `refreshToken`, on rafraîchit et on re-sauvegarde chiffré. Transparent pour l'utilisateur.

Détails à connaître :

- Spotify refuse `localhost` comme redirect URI : il faut `127.0.0.1` (déjà géré dans [env.js](backend/src/config/env.js)).
- Les tokens GitHub d'une OAuth App n'expirent pas (`expiresAt = null`).
- Les tokens ne sont **jamais renvoyés au client**.

---

## 9. Trois POC

Deux documents, deux sens du mot "POC" (à expliquer clairement) :

1. **[TECH_POC.md](docs/TECH_POC.md)** : les **trois outils par catégorie** réellement installés et testés (exigence du sujet §9) :
   - Front : **React** vs Vue 3 vs Svelte, sur le composant `CityTemperature`.
   - Back : **Express** vs Fastify vs NestJS, sur la route `/about.json`.
   - Base : **PostgreSQL** vs SQLite vs MongoDB, sur le schéma Prisma.
   Tout a été vraiment exécuté (installation, build, erreurs rencontrées incluses), dans un workspace jetable hors du repo.
2. **[POC.md](docs/POC.md)** : trois POC de **conception** pour des choix risqués, validés avant de construire dessus :
   - **POC 1** : livraison réelle de l'email de confirmation via SMTP (nodemailer + MailHog), testée bout en bout (register, mail reçu, confirm, login).
   - **POC 2** : theming clair/sombre par un seul attribut CSS (variables `--color-*`).
   - **POC 3** : remapper l'échec d'auth d'un provider pour qu'il ne déclenche pas une déconnexion globale (lié à la règle "401 réservé à l'API", décision #8).

Si on te demande "tes 3 POC" : les trois de POC.md (SMTP, theming, remap d'auth), et TECH_POC.md pour la comparaison des outils front/back/base.

---

## 10. DECISIONS.md

[docs/DECISIONS.md](docs/DECISIONS.md) : journal des décisions d'architecture (ADR), **21 entrées**, chacune au format **contexte → décision → conséquences**. Règle : on ne réécrit jamais une entrée, une décision qui change obtient une nouvelle entrée qui la remplace.

Index :

| # | Décision |
| --- | --- |
| 1 | Monorepo npm workspaces + un seul `docker-compose.yml` |
| 2 | React + Vite |
| 3 | Express |
| 4 | PostgreSQL + Prisma |
| 5 | Sessions JWT stateless |
| 6 | bcrypt pour les mots de passe |
| 7 | Confirmation email, MailHog par défaut |
| 8 | 401 réservé à l'auth de l'API |
| 9 | Actions sensibles = mot de passe actuel |
| 10 | Registre de widgets auto-descriptif (`/about.json`) |
| 11 | Providers appelés en process |
| 12 | Refresh pull : un timer par widget dans le navigateur |
| 13 | OAuth2 écrit à la main |
| 14 | Une seule paire de routes OAuth générique |
| 15 | Tokens tiers chiffrés au repos (AES-256-GCM) |
| 16 | YouTube et Spotify en OAuth, service `streaming` retiré |
| 17 | Retry des erreurs réseau, DNS IPv4 d'abord |
| 18 | Thèmes en variables CSS, un seul attribut |
| 19 | Thème et wallpaper stockés par navigateur |
| 20 | App shell flottant en `position: fixed` |
| 21 | RGPD rédigé depuis le code, contact par déploiement |

---

## 11. Benchmark sur les stacks

Deux documents complémentaires :

- **[STACK_COMPARISON.md](docs/STACK_COMPARISON.md)** : comparatif **qualitatif** (3 outils par catégorie, critères communs : équipe de 2, délai court, contraintes du sujet), avec le choix final justifié.
- **[BENCHMARK.md](docs/BENCHMARK.md)** : mesures de **performance réelles** (autocannon sur la même machine, 2026-09-29).

Chiffres clés à retenir :

| Question | Résultat mesuré |
| --- | --- |
| Backend le plus rapide sur `/about.json` | **Fastify : 18 973 req/s**, ~2,5× Express (7 520) et ~3,1× NestJS (6 031) |
| Latence p99 | Fastify 9 ms, Express 23 ms, NestJS 29 ms |
| Démarrage / mémoire au repos | Express : 155 ms, 61 Mo (NestJS : 539 ms, 97 Mo) |
| Vrai backend | `/about.json` 3 247 req/s ; route authentifiée avec DB 213 req/s à 100 connexions |
| PostgreSQL vs SQLite | SQLite in-process ≈ 12× plus rapide en lecture mono-client, **mais notre schéma ne tourne pas dessus** |
| MongoDB | **Non mesuré** (disque plein), c'est dit honnêtement dans le doc |

**Pourquoi on garde Express malgré Fastify plus rapide** : même Express sert des milliers de req/s, et le vrai coût d'une requête est la base et les API tierces, pas le framework. Et l'équipe connaît Express. PostgreSQL reste le seul moteur qui fait tourner le schéma réel (JSON, enums, cascade).

---

## 12. Les clés API dans le `.env`

- **Aucune clé dans le code.** Tout passe par `process.env`, centralisé dans [backend/src/config/env.js](backend/src/config/env.js) (chargé via `dotenv`).
- **`.env` est ignoré par git** ([.gitignore](.gitignore) : `.env` et `.env.*`, sauf `!.env.example`). On versionne seulement **`.env.example`** (racine et `backend/`), avec les noms des variables et des valeurs vides.
- `docker-compose.yml` lit le `.env` de la racine et injecte les variables dans le conteneur backend (`${VAR:-défaut}`), donc `docker compose up` marche même sans `.env` (avec des valeurs par défaut de dev).
- Variables concernées :
  - Clés / secrets : `OPENWEATHER_API_KEY`, `GITHUB_CLIENT_ID/SECRET`, `YOUTUBE_CLIENT_ID/SECRET`, `SPOTIFY_CLIENT_ID/SECRET`, `PINTEREST_CLIENT_ID/SECRET`.
  - Sécurité interne : `JWT_SECRET`, `CREDENTIALS_ENCRYPTION_KEY` (32 octets en hex, génération : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
  - Infra : `DATABASE_URL`, `POSTGRES_*`, `SMTP_*`, `MAIL_FROM`, `ADMIN_EMAILS`, `FRONTEND_URL`, URLs de callback OAuth, `LEGAL_CONTACT_EMAIL`.
- **Deux niveaux de secrets** à expliquer : (1) les secrets de l'**application** (client_id/secret OAuth, clé météo) dans le `.env` serveur ; (2) les tokens **par utilisateur** dans la base, **chiffrés** avec `CREDENTIALS_ENCRYPTION_KEY`. Le front ne voit jamais aucun secret (seul `VITE_LEGAL_CONTACT_EMAIL` lui est passé, et c'est public).
- Point d'attention : `JWT_SECRET` a une valeur par défaut `change-me-in-production` dans [env.js](backend/src/config/env.js). OK pour le dev, **à changer en production**.

---

## 13. Un outil pour montrer la base de données (type Prisma Studio)

**Prisma Studio** est déjà disponible : Prisma est dans les devDependencies du backend. Aucun outil supplémentaire à installer.

Point d'attention : dans [docker-compose.yml](docker-compose.yml) le service `db` **n'expose aucun port** sur l'hôte. Pour y accéder depuis ta machine, il faut soit publier le port, soit passer par le conteneur.

**Option A (recommandée pour la démo), Prisma Studio depuis l'hôte :**

1. Publier le port en local sans toucher au compose versionné. Créer un fichier `docker-compose.override.yml` à la racine (à ne pas commit) :

   ```yaml
   services:
     db:
       ports:
         - '5432:5432'
   ```

2. Relancer la base : `docker compose up -d db`
3. Ouvrir Studio :

   ```bash
   cd backend
   DATABASE_URL=postgresql://dashboard:dashboard@localhost:5432/dashboard npx prisma studio
   ```

4. Ouvrir http://localhost:5555 : tables `User`, `ServiceSubscription`, `WidgetInstance`, édition des lignes possible.

**Option B, sans rien modifier, en terminal :**

```bash
docker compose exec db psql -U dashboard -d dashboard -c 'SELECT id, email, role, "isConfirmed" FROM "User";'
```

**Ce qu'on peut montrer** : le `passwordHash` (bcrypt, illisible), la colonne `credentials` de `ServiceSubscription` (`{iv, tag, ciphertext}`, illisible sans la clé), `position` / `size` / `refreshRate` d'un widget qui changent quand on déplace ou redimensionne dans l'app, et le cascade quand on supprime un compte.

Schéma complet et cycle de vie des données : [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md).

---

## Pense-bête pour la démo

- Mail de confirmation : MailHog sur http://localhost:8025.
- Premier admin : mettre son email dans `ADMIN_EMAILS` avant de s'inscrire.
- Vérifier le contrat du sujet : `curl localhost:8080/about.json`.
