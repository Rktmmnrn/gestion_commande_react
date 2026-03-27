# POS - Gestion Commandes Restaurant

Application React TypeScript pour gérer les commandes d'un restaurant. Frontend moderne avec interface intuitive pour la gestion des tables, du menu et des commandes.

## Stack Technique

- **React 18** - Framework UI
- **TypeScript** - Typage strict
- **Tailwind CSS v4** - Design système et styling
- **TanStack Query (React Query) v5** - Gestion d'état et cache API
- **Axios** - Requêtes HTTP
- **Vite** - Bundler haute performance

## Architecture du Projet

```
src/
├── types/
│   └── index.ts              # Interfaces TypeScript
├── api/
│   ├── client.ts             # Instance Axios configurée
│   ├── categories.ts         # API catégories
│   ├── products.ts           # API produits
│   └── orders.ts             # API commandes
├── hooks/
│   ├── index.ts              # Export des hooks
│   ├── useCategories.ts      # Query categories
│   ├── useProducts.ts        # Query products avec filtres
│   └── useOrders.ts          # Queries et mutations commandes
├── components/
│   ├── TableGrid.tsx         # Grille des tables (3 colonnes)
│   ├── MenuPanel.tsx         # Menu avec catégories
│   └── OrderSummary.tsx      # Récapitulatif commande
├── pages/
│   └── POSPage.tsx           # Layout principal 3 colonnes
├── App.tsx                   # Provider React Query
├── main.tsx                  # Entrée application
└── index.css                 # Tailwind CSS
```

## Types TypeScript

```typescript
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: number;
  category_name: string;
  available: boolean;
}

interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}

interface Order {
  id: number;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  created_at: string;
  updated_at: string;
}
```

## Installation et Démarrage

### Prérequis
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Construction
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Configuration API

L'application consomme une API Django sur:
```
http://localhost:8000/api/
```

Endpoints requis:
- `GET /api/categories/` - Liste des catégories
- `GET /api/products/` - Liste des produits (avec filtres category, available)
- `PATCH /api/products/{id}/` - Mise à jour disponibilité produit
- `GET /api/orders/` - Liste des commandes (avec filtres status, table_number)
- `POST /api/orders/` - Créer une commande
- `PATCH /api/orders/{id}/status/` - Changer le statut
- `POST /api/orders/{id}/add_item/` - Ajouter un article

## Structure des Composants

### TableGrid (4 colonnes)
- Affiche 12 tables en grille 3x4
- Code couleur par statut (libre/pending/preparing/ready/delivered)
- Sélection de table avec anneau amber
- Affiche le nombre d'articles

### MenuPanel (4 colonnes)
- Onglets catégories
- Liste des plats disponibles
- Sélecteur de quantité
- Bouton Ajouter

### OrderSummary (4 colonnes)
- Liste des articles avec prix
- Calculatrice de total en temps réel
- Sélecteur de statut (si commande créée)
- Bouton Créer/Ajouter articles
- Badge table sélectionnée

### POSPage
- Layout 3 colonnes flexibles
- Responsive (base Tailwind)
- Auto-refresh des commandes (2s)
- Gestion d'état locale avec useState
- Mutations API optimistes

## Design

**Thème**: Dark sidebar avec accent amber (#D97706)

- Background: `bg-gray-900` gradients
- Panels: `bg-gray-800` avec séparation `border-gray-700`
- Accent: Amber-500/600 pour actions et highlights
- Texte: `text-white` sur dark bg
- Scrollbar personnalisée

## Fonctionnalités

✅ Gestion des 12 tables du restaurant
✅ Sélection rapide par catégorie
✅ Visualisation prix en temps réel
✅ Changement de statut commande
✅ Ajout/suppression d'articles
✅ Sync auto des commandes (polling 2s)
✅ Cache intelligent avec React Query
✅ Typage strict TypeScript
✅ Interface intuitive avec Tailwind

## Notes de Développement

- Les requêtes API utilisent `axios` avec interceptors globaux
- React Query gère le caching et la synchronisation
- Les mutations invalident les queries concernées
- Tailwind CSS v4 avec `@tailwindcss/postcss`
- Configuration path alias `@/` pour imports

## Prochaines Étapes

- Authentification et autorisation
- Historique des commandes
- Édition des articles existants
- Impression des commandes
- Notifications temps réel (WebSocket)
- Mode hors ligne avec synchronisation
- Tests unitaires et E2E
