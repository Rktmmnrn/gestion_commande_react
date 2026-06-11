# 🍽️ CommandeResto — Frontend React

**React 18.3** · **TypeScript** · **Vite** · **TailwindCSS** · **shadcn/ui**

---

## Prérequis

- Node.js 18+
- npm
- Backend Django disponible sur `http://localhost:8000`

## Installation

```bash
npm install
npm run dev   # → http://localhost:8080
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_API_TIMEOUT=10000
VITE_POLLING_INTERVAL=30000
VITE_TABLE_COUNT=12
```

## Scripts

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm run build:dev    # Build développement
npm run lint         # Linting ESLint
npm run preview      # Prévisualiser le build
npm run test         # Tests (Vitest)
npm run test:watch   # Tests en mode watch
```

---

## Dépendances principales

```
react ^18.3.1
typescript ^5.8.3
vite ^5.4.19
tailwindcss ^3.4.17
@tanstack/react-query ^5.83.0
react-router-dom ^6.30.1
axios ^1.13.6
react-hook-form ^7.72.1
zod ^3.25.76
recharts ^2.15.4
sonner ^1.7.4
lucide-react ^0.462.0
```

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page client (menu, réservation, commande en ligne) |
| `/acces` | Sélecteur de rôle (POS ou Admin) |
| `/pos` | Interface caisse — serveurs |
| `/admin/dashboard` | Tableau de bord KPI + graphiques |
| `/admin/categories` | CRUD catégories |
| `/admin/products` | CRUD produits |
| `/admin/tables` | CRUD tables |
| `/admin/clients` | CRUD clients |
| `/admin/reservations` | Gestion réservations |
| `/admin/orders` | Liste et gestion des commandes |
| `/admin/logs` | Journal d'activité |

---

## Fonctionnalités clés

- **POS** : grille de tables en temps réel (depuis `/api/tables/`), sélection du type de commande (`sur place` / `à emporter` / `en ligne`), indicateur animé pour les réservations du jour.
- **Admin** : CRUD complet sur toutes les entités, dashboard avec KPIs et graphiques Recharts.
- **Auth JWT** : login via modal, token stocké en localStorage, validation à chaque chargement.
- **Offline** : détection automatique de la perte réseau, notification toast.
- **Persistance** : panier et table sélectionnée sauvegardés en localStorage, synchronisation entre onglets.

---

## Structure

```
src/
├── api/          # Fonctions Axios par ressource
├── components/   # Composants UI (POS + Admin + shadcn/ui)
├── context/      # AdminAuthContext (JWT)
├── hooks/        # React Query hooks
├── pages/        # Pages React Router
├── types/        # Types TypeScript + schémas Zod
└── index.css     # Variables CSS Tailwind
```