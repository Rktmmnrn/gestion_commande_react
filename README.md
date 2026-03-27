# Gestion de Commandes - Application React

Une application web moderne de gestion de commandes (Point of Sale) construite avec React, TypeScript, Vite et shadcn/ui.

## 🎯 Vue d'ensemble

Cette application permet de :
- **Visualiser les catégories** de produits disponibles
- **Consulter les produits** avec leurs détails et prix
- **Gérer les commandes** en temps réel
- **Suivre l'état des commandes** (en attente, en livraison, livrée)
- **Interface utilisateur responsive** et accessible

## 🛠️ Stack Technologique

### Frontend
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Bundler et serveur de développement
- **React Router** - Routage client-side
- **React Query** - Gestion du cache et des requêtes API
- **TailwindCSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI réutilisables

### Outils de Développement
- **ESLint** - Linting du code
- **Vitest** - Framework de test unitaire
- **TypeScript** - Vérification des types

### API
- **Axios** - Client HTTP avec intercepteurs
- **Endpoint API** : `http://localhost:8000/api/`

## 📦 Installation

### Prérequis
- **Node.js** >= 18
- **npm** ou **yarn**
- **Serveur API** accessible sur `http://localhost:8000/api/`

### Étapes d'installation

1. **Cloner le projet** (si nécessaire)
   ```bash
   git clone <url-du-repo>
   cd react_gestion_commande
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`

## 🚀 Commandes Disponibles

```bash
# Développement - Serveur de développement avec hot reload
npm run dev

# Build - Production
npm run build

# Build - Mode développement
npm run build:dev

# Preview - Voir le build en local
npm run preview

# Lint - Vérifier la qualité du code
npm run lint

# Tests - Exécuter les tests une fois
npm run test

# Tests - Mode watcher (re-run à chaque changement)
npm run test:watch
```

## 📁 Structure du Projet

```
src/
├── api/                    # Clients API
│   ├── client.ts          # Configuration Axios
│   ├── categories.ts      # API des catégories
│   ├── orders.ts          # API des commandes
│   └── products.ts        # API des produits
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── MenuPanel.tsx     # Panneau de sélection des catégories
│   ├── TableGrid.tsx     # Grille des commandes
│   ├── OrderSummary.tsx  # Résumé de la commande
│   └── NavLink.tsx       # Lien de navigation
├── hooks/                 # Custom hooks
│   ├── useCategories.ts  # Hook pour les catégories
│   ├── useOrders.ts      # Hook pour les commandes
│   └── useProducts.ts    # Hook pour les produits
├── pages/                 # Pages principales
│   ├── Index.tsx         # Page d'accueil
│   ├── POSPage.tsx       # Page POS (Point of Sale)
│   └── NotFound.tsx      # Page 404
├── types/                 # Définitions TypeScript
├── lib/                   # Utilitaires
├── App.tsx               # Composant racine
├── main.tsx              # Point d'entrée
└── index.css             # Styles Tailwind globaux
```

## 🔌 API Integration

### Configuration

L'application utilise Axios pour communiquer avec une API REST :

**Base URL** : `http://localhost:8000/api/`

**Configuration** : Voir `src/api/client.ts`

### Endpoints utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/categories` | Récupère toutes les catégories |
| GET | `/products` | Récupère tous les produits |
| GET | `/products?category=ID` | Produits d'une catégorie |
| GET | `/orders` | Récupère toutes les commandes |
| POST | `/orders` | Crée une nouvelle commande |
| GET | `/orders/ID` | Détails d'une commande |
| PUT | `/orders/ID` | Modifie une commande |

## 🎨 Design System

### Couleurs (CSS Variables)

Les couleurs sont définies en HSL dans `src/index.css` :

```css
--background: 220 20% 97%     /* Fond principal */
--foreground: 220 20% 10%     /* Texte principal */
--primary: 36 90% 45%         /* Couleur primaire */
--border: 220 15% 88%         /* Bordures */
--card: 0 0% 100%            /* Cartes */
```

### Mode sombre

Supporter le mode sombre en ajoutant la classe `.dark` à l'élément racine.

## 📱 Composants Principaux

### MenuPanel
Affiche les catégories de produits accessibles via clic.

### TableGrid
Tableau affichant toutes les commandes avec statut de livraison.

### OrderSummary
Panneau latéral avec résumé de la commande en cours.

### Hooks personnalisés

- **`useCategories()`** - Récupère et met en cache les catégories
- **`useProducts(categoryId?)`** - Récupère les produits (filtrés par catégorie optionnellement)
- **`useOrders()`** - Récupère les commandes avec polling

## 🧪 Tests

```bash
# Exécuter tous les tests
npm run test

# Mode watcher
npm run test:watch
```

Les tests unitaires sont situés dans `src/test/`

## 🔍 Linting

```bash
npm run lint
```

Vérifie la qualité du code TypeScript et JavaScript.

## 🌐 Déploiement

### Production Build

```bash
npm run build
```

Crée un dossier `dist/` contenant la version optimisée pour la production.

### Variables d'environnement

Créer un fichier `.env` pour les variables :

```env
VITE_API_BASE_URL=http://localhost:8000/api/
```

puis l'utiliser dans le code :

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 📝 Conventions de Code

- **TypeScript** : Types stricts, interfaces pour les données
- **Styling** : TailwindCSS + shadcn/ui
- **Composants** : Fonctionnels avec hooks
- **Nommage** : camelCase pour variables/fonctions, PascalCase pour composants
- **Imports** : Alias `@/` pour `src/`

## 🐛 Troubleshooting

### Erreur de connexion API

- Vérifier que le serveur API est lancé sur `http://localhost:8000`
- Vérifier les logs du navigateur (F12 > Console)
- Vérifier que CORS est configuré correctement sur l'API

### Erreurs Tailwind

- Nettoyer le cache : supprimer `node_modules/.vite`
- Relancer le serveur : `npm run dev`

## 📚 Ressources

- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [TypeScript](https://www.typescriptlang.org)

## 📄 Licence

Projet ENI - L3 IHM
