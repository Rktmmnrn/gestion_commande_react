# 🍽️ CommandeResto - Système de Gestion de Commandes

Une application web moderne de gestion de commandes (Point of Sale) construite avec **React 18.3**, **TypeScript**, **Vite** et **shadcn/ui**. Solution complète pour la gestion des commandes en restaurant avec support du mode hors-ligne et interface d'administration.

**Version** : 0.0.0 | **Type** : Module ES | **Licence** : MIT

---

## 📑 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🛠️ Stack Technologique](#️-stack-technologique)
- [📦 Installation & Démarrage Rapide](#-installation--démarrage-rapide)
- [📜 Commandes Disponibles](#-commandes-disponibles)
- [🏗️ Structure du Projet](#️-structure-du-projet)
- [📊 Modèles de Données](#-modèles-de-données)
- [✨ Fonctionnalités Principales](#-fonctionnalités-principales)
- [🎨 Design System & UI](#-design-system--ui)
- [🧩 Architecture & Composants](#-architecture--composants)
- [🪝 Hooks Personnalisés](#-hooks-personnalisés)
- [🧪 Tests](#-tests)
- [⚙️ Configuration](#️-configuration)
- [⚠️ Problèmes Connus & À Corriger](#️-problèmes-connus--à-corriger)
- [🐛 Dépannage](#-dépannage)
- [📚 Ressources](#-ressources)

---

## 🎯 Vue d'ensemble

**CommandeResto** est une application de Point of Sale (POS) complète permettant :

✅ **Gestion des Commandes**
- Création et modification des commandes en temps réel
- Suivi des états (pending → preparing → ready → delivered/cancelled)
- Gestion des tables et numérotation
- Panier intelligent avec mise à jour dynamique

✅ **Gestion Admin**
- Tableau de bord avec métriques clés (KPI)
- Gestion des catégories et produits
- Historique et logs d'activité
- Export de données (PDF, Excel)
- Graphiques et tendances de vente

✅ **Authentification & Sécurité**
- Authentification JWT avec tokens
- Contrôle d'accès basé sur les rôles (Admin/Waiter)
- Gestion sécurisée des sessions

✅ **Expérience Utilisateur**
- Interface responsive et moderne
- Mode hors-ligne avec synchronisation automatique
- Persistance des données en localStorage
- Détection et gestion des connexions réseau
- Notifications temps réel (sonner)
- Support tactile optimisé

---

## 🛠️ Stack Technologique

### 🎨 Frontend & UI
| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | ^18.3.1 | Framework UI principal |
| **TypeScript** | Latest | Typage statique |
| **Vite** | Latest | Bundler & dev server (port 8080) |
| **React Router** | ^6.30.1 | Routage client-side |
| **shadcn/ui** | Latest | Composants UI accessibles (Radix UI) |
| **TailwindCSS** | ^3 | Framework CSS utilitaire |

### 📡 Gestion d'État & API
| Technologie | Version | Rôle |
|-------------|---------|------|
| **@tanstack/react-query** | ^5.83.0 | Gestion du cache API & synchronisation |
| **@tanstack/react-table** | ^8.21.3 | Gestion avancée des tableaux |
| **Axios** | ^1.13.6 | Client HTTP |
| **React Hook Form** | ^7.72.1 | Gestion des formulaires |
| **Zod** | ^3.25.76 | Validation de schémas TypeScript |

### 📊 Visualisation & Graphiques
| Technologie | Version | Rôle |
|-------------|---------|------|
| **Recharts** | ^2.15.4 | Graphiques et charts |
| **lucide-react** | ^0.462.0 | Icônes modernes |
| **react-to-pdf** | ^3.2.2 | Export en PDF |

### 🎯 Utilitaires
| Technologie | Version | Rôle |
|-------------|---------|------|
| **date-fns** | ^3.6.0 | Manipulation des dates |
| **sonner** | ^1.7.4 | Notifications toast |
| **class-variance-authority** | ^0.7.1 | Gestion des variantes CSS |
| **clsx** | ^2.1.1 | Conditionnels CSS |
| **tailwind-merge** | ^2.6.0 | Fusion intelligente des classes |

### 🧪 Développement & Testing
- **Vitest** - Test runner ultra-rapide
- **@testing-library/react** - Utilitaires de test React
- **@playwright/test** - E2E testing (fixtures en TypeScript)
- **ESLint 9** - Linting du code JavaScript/TypeScript
- **Autoprefixer** - Préfixes CSS automatiques

---

## 📦 Installation & Démarrage Rapide

### Prérequis
- **Node.js** ≥ 18.x
- **npm** ≥ 10.x (ou yarn/pnpm)
- **Backend API** disponible sur `http://localhost:8000/api/` (Django/DRF par défaut)

### 1️⃣ Installation des dépendances

```bash
npm install
```

### 2️⃣ Configuration (optionnel)

Créer un fichier `.env` à la racine (si API sur autre hôte) :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3️⃣ Démarrage du serveur de développement

```bash
npm run dev
```

Accédez à l'application : **http://localhost:8080**

### 📱 Accès aux pages
- **Page d'accueil** : http://localhost:8080/
- **Interface POS** : http://localhost:8080/pos
- **Tableau de bord Admin** : http://localhost:8080/admin (login requis)
- **404** : http://localhost:8080/any-invalid-route

---

## 📜 Commandes Disponibles

```bash
# ✅ Développement
npm run dev              # Démarrer le serveur dev (Vite)

# 🏗️ Production
npm run build            # Build optimisé pour production
npm run build:dev        # Build en mode développement

# 🔍 Qualité du Code
npm run lint             # Linter tout le projet avec ESLint

# 👁️ Aperçu
npm run preview          # Prévisualiser la build en local

# 🧪 Tests
npm test                 # Lancer tous les tests (run une seule fois)
npm run test:watch      # Mode watch pour développement (TDD)
```

---

## 🏗️ Structure du Projet

```
react_gestion_commande/
│
├── 📄 Configuration & Build
│   ├── vite.config.ts           # Config Vite (alias @/, port 8080)
│   ├── tsconfig.json            # Config TypeScript principale
│   ├── tsconfig.app.json        # Spécifique à l'app
│   ├── tsconfig.node.json       # Pour les fichiers config
│   ├── eslint.config.js         # Configuration ESLint 9
│   ├── postcss.config.cjs       # PostCSS (Tailwind)
│   ├── tailwind.config.js       # TailwindCSS
│   ├── components.json          # Config shadcn/ui
│   ├── vitest.config.ts         # Config Vitest
│   ├── playwright.config.ts      # Config Playwright E2E
│   └── package.json             # Dépendances & scripts
│
├── 📑 Public
│   └── public/
│       └── robots.txt           # SEO
│
├── 🎯 Source Code (src/)
│   ├── App.tsx                  # Composant racine + Routes
│   ├── main.tsx                 # Point d'entrée React
│   ├── index.css                # Styles globaux
│   ├── App.css                  # Styles App
│   ├── vite-env.d.ts            # Types Vite
│   │
│   ├── 📡 API (src/api/)
│   │   ├── client.ts            # Instance Axios centralisée
│   │   ├── admin.ts             # Endpoints admin
│   │   ├── auth.ts              # Endpoints authentification
│   │   ├── categories.ts        # Endpoints catégories
│   │   ├── orders.ts            # Endpoints commandes
│   │   ├── products.ts          # Endpoints produits
│   │   └── client.ts            # Endpoints client
│   │
│   ├── 🎨 Composants (src/components/)
│   │   ├── Composants Principaux
│   │   │   ├── MenuPanel.tsx           # Menu des produits
│   │   │   ├── TableGrid.tsx           # Sélection des tables
│   │   │   ├── OrderSummary.tsx        # Résumé du panier
│   │   │   ├── NavLink.tsx             # Lien de navigation
│   │   │   ├── LoadingSpinner.tsx      # Spinner de chargement
│   │   │   ├── ErrorMessage.tsx        # Affichage des erreurs
│   │   │   └── ErrorBoundary.tsx       # Boundary pour erreurs React
│   │   │
│   │   ├── Modal & Dialogs
│   │   │   └── AdminPasswordModal.tsx  # Modal de login admin
│   │   │
│   │   ├── 🎯 Admin (src/components/admin/)
│   │   │   ├── Dashboard.tsx           # Vue du dashboard
│   │   │   ├── KPICard.tsx             # Cartes KPI
│   │   │   ├── OrdersList.tsx          # Liste des commandes
│   │   │   ├── ActivityLog.tsx         # Log d'activité
│   │   │   ├── ExportButtons.tsx       # Boutons d'export (PDF, CSV)
│   │   │   └── TrendIndicator.tsx      # Indicateurs de tendance
│   │   │
│   │   ├── 📊 Graphiques (src/components/charts/)
│   │   │   ├── RevenueChart.tsx        # Graphique des revenus
│   │   │   ├── OrdersStatusChart.tsx   # Graphique des statuts
│   │   │   └── BestSellersChart.tsx    # Graphique top produits
│   │   │
│   │   └── 🎭 UI Components (src/components/ui/) - shadcn/ui
│   │       ├── accordion.tsx           # Accordéon
│   │       ├── button.tsx              # Boutons
│   │       ├── card.tsx                # Cartes
│   │       ├── dialog.tsx              # Dialogs modaux
│   │       ├── form.tsx                # Intégration React Hook Form
│   │       ├── input.tsx               # Champs input
│   │       ├── table.tsx               # Tableaux
│   │       ├── tabs.tsx                # Onglets
│   │       ├── toast.tsx & toaster.tsx # Notifications
│   │       ├── dropdown-menu.tsx       # Menus déroulants
│   │       ├── select.tsx              # Sélecteurs
│   │       ├── sidebar.tsx             # Barre latérale
│   │       ├── skeleton.tsx            # Placeholders de chargement
│   │       ├── badge.tsx               # Badges
│   │       ├── calendar.tsx            # Calendrier
│   │       ├── chart.tsx               # Wrapper Recharts
│   │       └── ... (30+ composants UI)
│   │
│   ├── 🧠 Context (src/context/)
│   │   └── AdminAuthContext.tsx        # Context authentification admin
│   │
│   ├── 🪝 Hooks (src/hooks/)
│   │   ├── index.ts                    # Export des hooks
│   │   ├── useAuth.ts                  # Hook auth (legacy)
│   │   ├── useAdminStats.ts            # Statistiques admin
│   │   ├── useCategories.ts            # Gestion catégories
│   │   ├── useOfflineMode.ts           # Détection mode hors-ligne
│   │   ├── useOrders.ts                # Gestion commandes
│   │   ├── useProducts.ts              # Gestion produits
│   │   ├── use-mobile.tsx              # Détection mobile
│   │   ├── use-toast.ts                # Hook notifications
│   │   └── useAdminStats.ts            # Statistiques admin
│   │
│   ├── 📚 Lib (src/lib/)
│   │   └── utils.ts                    # Fonctions utilitaires (cn())
│   │
│   ├── 📄 Pages (src/pages/)
│   │   ├── Index.tsx                   # Accueil
│   │   ├── LandingPage.tsx             # Page d'accueil
│   │   ├── POSPage.tsx                 # Interface principale POS
│   │   ├── NotFound.tsx                # 404
│   │   │
│   │   └── 🎯 Admin (src/pages/admin/)
│   │       ├── AdminDashboard.tsx      # Layout admin (erreur: manque import isAdmin)
│   │       ├── AdminDashboardPage.tsx  # Page dashboard
│   │       ├── CategoriesAdmin.tsx     # Gestion catégories
│   │       ├── ProductsAdmin.tsx       # Gestion produits
│   │       ├── OrdersListPage.tsx      # Liste commandes
│   │       ├── OrdersAdmin.tsx         # Gestion commandes
│   │       └── ActivityLogPage.tsx     # Logs d'activité
│   │
│   ├── 🧪 Tests (src/test/)
│   │   ├── example.test.ts             # Tests exemple
│   │   └── setup.ts                    # Config tests
│   │
│   └── 📋 Types (src/types/)
│       └── index.ts                    # Types globaux TypeScript
│
├── 📖 Documentation
│   ├── README.md                       # Ce fichier
│   ├── playwright-fixture.ts           # Fixtures Playwright
│   └── index.html                      # Point d'entrée HTML
│
└── 🔧 Autres
    └── .gitignore
```

---

## 📊 Modèles de Données

### 🛒 Product
```typescript
interface Product {
  id: number;
  name: string;
  price: string;           // Format "10.50"
  category: number;        // ID catégorie
  category_name: string;   // Nom catégorie
  available: boolean;      // Disponibilité
}
```

### 📂 Category
```typescript
interface Category {
  id: number;
  name: string;
}
```

### 🛍️ Order
```typescript
interface Order {
  id: number;
  table_number: number;        // 1-99
  status: OrderStatus;         // pending | preparing | ready | delivered | cancelled
  items: OrderItem[];          // Articles de la commande
  total: number;               // Total en euros
  created_at: string;          // ISO datetime
  updated_at: string;          // ISO datetime
}

interface OrderItem {
  id: number;
  product: number;             // ID produit
  product_name: string;        // Nom produit
  quantity: number;            // Quantité
  price: string;               // Prix unitaire
  subtotal: number;            // quantity * price
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
```

### 👤 Auth
```typescript
interface AuthTokens {
  access: string;      // JWT access token
  refresh: string;     // JWT refresh token
}

interface AuthUser {
  id: number;
  username: string;
  is_staff: boolean;   // Admin?
  is_superuser: boolean;
}
```

---

## ✨ Fonctionnalités Principales

### 🏪 Interface POS (src/pages/POSPage.tsx)

| Fonctionnalité | Détails |
|---|---|
| **Sélection de table** | Grille de tables 1-20 avec numérotation |
| **Menu produits** | Filtrage par catégories, recherche |
| **Panier** | Ajout/suppression d'articles, modification quantités |
| **Persistance cart** | Sauvegarde automatique en localStorage |
| **Sync multi-onglets** | Les changements se synchronisent en temps réel |
| **Mode hors-ligne** | Les commandes s'enfilent et se synchro au retour |
| **Création commande** | POST /orders/ avec articles |
| **Admin login** | Modal mot de passe pour accès admin |

### 🎯 Tableau de Bord Admin (src/pages/admin/AdminDashboard.tsx)

| Section | Composants | Fonctionnalité |
|---|---|---|
| **Sidebar** | MenuPanel + NavLink | Navigation 5 sections |
| **Header** | Avatar user + logout | Gestion session |
| **Dashboard** | KPICard, Charts | Métriques clés (chiffre d'affaires, commandes) |
| **Graphiques** | RevenueChart, OrdersStatusChart, BestSellersChart | Tendances et analytics |
| **Gestion produits** | ProductsAdmin | CRUD complet |
| **Gestion catégories** | CategoriesAdmin | CRUD complet |
| **Gestion commandes** | OrdersListPage | Statuts, détails |
| **Logs** | ActivityLogPage | Historique d'activité |

### 🔐 Authentification

- **Login waiter** : `POSPage` - Pas de mot de passe requis
- **Login admin** : `AdminPasswordModal` - Mot de passe sécurisé
- **JWT tokens** : Stockage en localStorage
- **Token refresh** : Automatique via React Query

---

## 🎨 Design System & UI

### 🎭 Composants UI (shadcn/ui)

Tous les composants shadcn/ui sont installés et accessibles dans `src/components/ui/` :

**Navigation & Layout**
- `sidebar.tsx` - Barre latérale responsive
- `navigation-menu.tsx` - Menu de navigation
- `breadcrumb.tsx` - Fil d'Ariane
- `menubar.tsx` - Barre de menu

**Forms & Input**
- `form.tsx` - Intégration React Hook Form
- `input.tsx`, `textarea.tsx` - Champs de saisie
- `select.tsx`, `checkbox.tsx`, `radio-group.tsx` - Sélecteurs
- `slider.tsx` - Curseur
- `input-otp.tsx` - Codes OTP

**Data Display**
- `table.tsx` - Tableaux (intégration React Table)
- `tabs.tsx` - Onglets
- `accordion.tsx` - Accordéon
- `pagination.tsx` - Pagination
- `skeleton.tsx` - Placeholders

**Feedback & Modals**
- `dialog.tsx`, `alert-dialog.tsx` - Modals
- `drawer.tsx` - Tiroir latéral
- `toast.tsx`, `toaster.tsx` - Notifications
- `alert.tsx` - Alertes
- `progress.tsx` - Barres de progression

**Styling**
- **Framework** : TailwindCSS v3
- **Couleurs** : Palette cohérente (slate, amber, accent colors)
- **Responsive** : Mobile-first avec breakpoints sm, md, lg, xl, 2xl
- **Animations** : Transitions fluides avec `tailwindcss-animate`

### 🎨 Architecture CSS

- **Global styles** : `src/index.css` (Tailwind directives)
- **Component styles** : Inline Tailwind classes (utility-first)
- **CSS-in-JS** : Zéro - utilisé Tailwind purement
- **Dark mode** : Support via `next-themes` (configurable)

---

## 🧩 Architecture & Composants

### 🏗️ Flux d'Arborescence

```
App (routing root)
├── ErrorBoundary (gestion erreurs)
├── AdminAuthProvider (context auth)
├── QueryClientProvider (@tanstack/react-query)
│   └── TooltipProvider (shadcn)
│       └── Sonner (notifications)
│           └── BrowserRouter
│               └── Routes
│                   ├── / (LandingPage)
│                   ├── /pos (POSPage)
│                   ├── /admin (AdminDashboard) [PROTECTED]
│                   │   ├── /admin/dashboard (AdminDashboardPage)
│                   │   ├── /admin/categories (CategoriesAdmin)
│                   │   ├── /admin/products (ProductsAdmin)
│                   │   ├── /admin/orders (OrdersListPage)
│                   │   └── /admin/logs (ActivityLogPage)
│                   └── /* (NotFound)
```

### 📡 Flux de Données (Requêtes API)

```
React Component
    ↓
useHook (useProducts, useOrders, etc.)
    ↓
@tanstack/react-query (caching)
    ↓
api/ (client.ts) → Axios instance
    ↓
Django DRF Backend (http://localhost:8000/api)
```

### 🔄 Gestion d'État

| Niveau | Outil | Usage |
|---|---|---|
| **Global** | AdminAuthContext | Authentification admin (JWT) |
| **API/Cache** | React Query | Requêtes API, caching intelligent |
| **Local Component** | useState | État local UI (modals, inputs) |
| **Persistant** | localStorage | Cart, table sélectionnée, auth tokens |

---

## 🪝 Hooks Personnalisés

### Core Hooks

#### 📊 `useAdminStats()`
Récupère les statistiques du tableau de bord admin.
```typescript
const { stats, isLoading, error } = useAdminStats();
// stats: { revenue, orderCount, topProducts, trends }
```

#### 🛒 `useProducts()`
Gestion complète des produits avec filtrage.
```typescript
const { products, isLoading, refetch } = useProducts(categoryId?);
```

#### 📂 `useCategories()`
Récupère et gère les catégories.
```typescript
const { categories, isLoading } = useCategories();
```

#### 🛍️ `useOrders()`
Gestion des commandes avec statuts.
```typescript
const { orders, createOrder, updateOrder, isLoading } = useOrders();
```

#### 🔐 `useAuth()` (legacy)
Hook d'authentification (deprecated, préférer context).

#### 📱 `useOfflineMode()`
Détecte si l'app est en mode hors-ligne.
```typescript
const { isOffline } = useOfflineMode();
// Sync automatique au retour en ligne
```

#### 🍞 `use-toast.ts`
Hook des notifications sonner.
```typescript
const { toast } = useToast();
toast({ title: "Succès", description: "Commande créée" });
```

---

## 🧪 Tests

### Configuration

- **Test runner** : Vitest (ultra-rapide, compatible Jest)
- **React Testing Library** : Tests intégrés
- **E2E Testing** : Playwright avec fixtures TypeScript

### Lancer les tests

```bash
# Run une fois
npm test

# Watch mode (TDD)
npm run test:watch
```

### Exemple de test

```typescript
// src/test/example.test.ts
import { describe, it, expect } from 'vitest';

describe('Example', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
```

### Fixtures Playwright

```typescript
// playwright-fixture.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Custom fixtures here
});
```

---

## ⚙️ Configuration

### Vite (src/vite.config.ts)

```typescript
{
  server: {
    host: '::',        // IPv6 support
    port: 8080,        // Port développement
    hmr: {
      overlay: false   // Erreurs HMR sans popup
    }
  },
  resolve: {
    alias: {
      '@': './src'     // Path alias @/
    }
  }
}
```

### TypeScript (tsconfig.json)

- **Target** : ES2020
- **Module** : ESNext (Vite gère la bundling)
- **Strict mode** : Activé
- **Path aliases** : `@/*` → `src/*`

### TailwindCSS (tailwind.config.js)

- **Content scanning** : `src/**/*.tsx`
- **Extends** : Couleurs custom, espacements
- **Plugins** : `@tailwindcss/typography`, animations

### ESLint (eslint.config.js)

Configuration ESLint 9 (flat config) :
- Règles JavaScript modernes
- Support TypeScript
- Recommandations React

```bash
npm run lint  # Vérifie tout
```

---

## ⚠️ Problèmes Connus & À Corriger

### 🔴 CRITIQUE - App.tsx (ligne 23)

**Erreur** : `useAdminAuth` utilisé comme JSX component
```typescript
// ❌ MAUVAIS
<useAdminAuth>
```

**Correction** : Utiliser le Provider
```typescript
// ✅ BON
import { AdminAuthProvider } from '@/context/AdminAuthContext';

<AdminAuthProvider>
  <QueryClientProvider>
    ...
  </QueryClientProvider>
</AdminAuthProvider>
```

### 🔴 CRITIQUE - AdminDashboard.tsx (ligne 16)

**Erreur** : Variable `isAdmin` non déclarée
```typescript
// ❌ MAUVAIS - Ligne 16
const { isAdmin } = useAdminAuth();  // MANQUE

useEffect(() => {
  if (!isAdmin) {  // undefined!
    navigate('/pos', { replace: true })
  }
}, [isAdmin, navigate]);
```

**Correction** : Ajouter le destructuring
```typescript
// ✅ BON
const { isAdmin } = useAdminAuth();  // ← Ajouter cette ligne
```

### ⚠️ À Améliorer - AdminDashboard.tsx (ligne ~95)

**Observation** : Le footer de la sidebar est vide
```typescript
// Ligne ~95
<div className="p-4 border-t border-slate-800 space-y-2"></div>
```

**Suggestion** : Ajouter le bouton logout
```typescript
<div className="p-4 border-t border-slate-800 space-y-2">
  <Button 
    onClick={handleLogout}
    variant="outline"
    size="sm"
    className="w-full gap-2"
  >
    <LogOut className="w-4 h-4" />
    {sidebarOpen && 'Déconnexion'}
  </Button>
</div>
```

---

## 🐛 Dépannage

### "Connection refused" sur API

**Symptôme** : Erreurs `ECONNREFUSED` quand vous cliquez sur un produit
**Cause** : Backend Django pas en cours d'exécution
**Solution** :
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (projet Django)
python manage.py runserver 0.0.0.0:8000
```

### Cart vide après rechargement

**Symptôme** : Le panier se vide en rechargement page
**Cause** : Mauvaise clé localStorage ou JSON invalide
**Solution** :
```javascript
// Console browser
localStorage.clear();
localStorage.setItem('pos_cart', JSON.stringify([]));
```

### Mode hors-ligne non détecté

**Symptôme** : `isOffline` toujours false
**Cause** : Événement `online/offline` du navigateur non déclenché
**Solution** : Basculer mode airplane ou déconnecter le WiFi

### Admin Dashboard blanc/ne charge pas

**Symptômes** : Page vide ou erreur
**Cause** : Voir section "Problèmes Connus" ci-dessus (manque isAdmin)
**Solution** : Appliquer les corrections du ticket CRITIQUE

---

## 📚 Ressources

### Documentation Officielle
- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev)
- [React Router v6](https://reactrouter.com)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org)

### Componentes & Patterns
- [Radix UI Primitives](https://www.radix-ui.com) - Base shadcn/ui
- [Lucide Icons](https://lucide.dev) - Icônes utilisées
- [React Hook Form](https://react-hook-form.com) - Gestion formulaires
- [Zod](https://zod.dev) - Validation schémas

### Tutoriels & Guides
- [Building Modern UIs with shadcn/ui](https://www.youtube.com/results?search_query=shadcn+ui+tutorial)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/overview)
- [Tailwind CSS Tips & Tricks](https://tailwindcss.com/docs/customization)

---

## 📋 Prochaines Étapes Recommandées

1. ✅ **Corriger les 2 bugs critiques** (voir section "Problèmes Connus")
2. ✅ **Ajouter le logout button** dans la sidebar admin
3. ✅ **Mettre en place l'authentification complète** (refresh tokens)
4. 🧪 **Écrire des tests unitaires** pour les hooks
5. 📱 **Optimiser responsive design** pour mobile
6. 🎨 **Affiner le design** avec custom colors
7. 📊 **Ajouter plus de graphiques** au dashboard
8. 🔐 **Implémenter rate limiting** des API calls

---

**Dernière mise à jour** : 30 avril 2026 | **Auteur** : ENI L3 Team | **Status** : 🚧 En développement
- **shadcn/ui** - Composants UI réutilisables et accessibles
- **Sonner** - Notifications toast élégantes
- **Lucide React** - Icônes SVG performantes

### Outils de Développement & QA
- **ESLint** - Linting et qualité du code
- **Vitest** - Framework de test unitaire haute performance
- **Playwright** - Tests end-to-end
- **PostCSS** - Transformations CSS

### Connexion API
- **Axios** - Client HTTP avec intercepteurs
- **Endpoint API** : `http://localhost:8000/api/`
- Support du **mode hors-ligne** avec détection automatique

## 📦 Installation & Démarrage Rapide

### Prérequis
- **Node.js** >= 18
- **npm** ou **yarn**
- **Serveur API** accessible sur `http://localhost:8000/api/`

### Installation

1. **Cloner le projet**
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
   L'application sera accessible sur **http://localhost:5173**

4. **Vérifier la connexion API**
   - Assurez-vous que l'API est disponible sur `http://localhost:8000/api/`
   - L'application affichera une alerte si la connexion échoue

### Accès à l'Application
- **Développement** : http://localhost:5173
- **Production** : À déployer selon votre configuration

## � Authentification & Rôles

### Système d'Authentification

L'application utilise un **système d'authentification JWT** avec gestion complète des rôles :

#### 1. Page de Connexion
- Adresse : `/login`
- Accepte un **username** et un **password**
- Génère un **token JWT** utilisé pour toutes les requêtes

#### 2. Gestion des Tokens
- Token **access** : Utilisé pour authentifier les requêtes (durée: 60 minutes)
- Token **refresh** : Utilisé pour obtenir un nouveau token (durée: 7 jours)
- Les tokens sont **stockés dans localStorage**
- **Rehydratation automatique** : L'utilisateur reste connecté après rafraîchissement de page

#### 3. Contexte d'Authentification

Le contexte `AuthContext` gère :
```typescript
{
  user,                    // Utilisateur actuellement connecté
  isAuthenticated,        // Booléen d'authentification
  isAdmin,                // Booléen pour vérifier le rôle admin
  accessToken,            // Token JWT courant
  login(payload),         // Fonction de connexion
  logout(),              // Fonction de déconnexion
  refreshToken(),        // Fonction de rafraîchissement du token
}
```

### Rôles & Permissions Frontend

#### Rôle Waiter (Serveur)
- ✅ Accès au POS (gestion des commandes)
- ✅ Visualiser les produits et catégories
- ✅ Créer et modifier les commandes de ses tables
- ❌ Pas d'accès au dashboard admin
- ❌ Pas de gestion des utilisateurs

#### Rôle Admin (Administrateur)
- ✅ Accès complet au POS
- ✅ Accès au dashboard admin `/admin`
- ✅ Gestion des utilisateurs
- ✅ Gestion des produits et catégories
- ✅ Vue d'ensemble des commandes

### Routes Protégées

```typescript
// Route public
<Route path="/login" element={<Login />} />

// Routes protégées (authentifié requis)
<Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
<Route path="/pos" element={<ProtectedRoute><POSPage /></ProtectedRoute>} />

// Routes admin seulement
<Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
```

### Déconnexion

Un bouton **"Déconnexion"** est disponible en haut à droite dans le POS :
- Supprime les tokens du localStorage
- Redirige vers la page de login
- Affiche une notification de confirmation
## 📌 Gestion Intelligente des Commandes (Option B)

L'application implémente une **logique intelligente** pour gérer les commandes :

### Comportement

1. **Première commande** pour une table
   - Lance une **nouvele commande** avec le statut "pending"
   - Ajoute les articles sélectionnés
   
2. **Commandes suivantes** pour la même table
   - **Réutilise la commande "pending" existante**
   - Ajoute les nouveaux articles
   - **Augmente les quantités** si un article identique existe
   
3. **Avantages**
   - ✅ Une seule commande active par table
   - ✅ Accumulation progressive des articles
   - ✅ Gestion simplifiée du panier
   - ✅ Meilleure traçabilité des commandes

### Exemple d'Utilisation

```
Table 1 → Ajoute Café (qty: 1) → Commande #5 créée
Table 1 → Ajoute Croissant (qty: 1) → Café (qty: 1) + Croissant (qty: 1) ajoutés à #5
Table 1 → Ajoute Café (qty: 1) → Café (qty: 2) + Croissant (qty: 1) dans #5
```

### Appels à l'API

```bash
# Première commande
POST /api/orders/
{
  "table_number": 1,
  "items": [
    {"product": 1, "quantity": 1}
  ]
}
# Résultat: Création de la commande #5

# Deuxième appel (même table)
POST /api/orders/
{
  "table_number": 1,
  "items": [
    {"product": 2, "quantity": 1}
  ]
}
# Résultat: Articles ajoutés à la commande #5 existante
```
## �🚀 Commandes Disponibles

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
├── api/                           # Clients API
│   ├── client.ts                 # Configuration Axios avec intercepteurs
│   ├── categories.ts             # API des catégories
│   ├── orders.ts                 # API des commandes
│   └── products.ts               # API des produits
├── components/                    # Composants React
│   ├── ui/                       # Composants shadcn/ui (30+)
│   ├── MenuPanel.tsx             # Panneau de sélection des catégories
│   ├── TableGrid.tsx             # Grille des commandes par table
│   ├── OrderSummary.tsx          # Résumé et détails de la commande
│   ├── NavLink.tsx               # Lien de navigation
│   ├── ErrorBoundary.tsx         # Gestion des erreurs
│   ├── ErrorMessage.tsx          # Affichage des messages d'erreur
│   └── LoadingSpinner.tsx        # Indicateur de chargement
├── hooks/                         # Custom hooks React
│   ├── index.ts                  # Exports des hooks
│   ├── useCategories.ts          # Récupération des catégories
│   ├── useOrders.ts              # Récupération et modification des commandes
│   ├── useProducts.ts            # Récupération des produits
│   ├── useOfflineMode.ts         # Détection du mode hors-ligne
│   └── use-toast.ts              # Hook pour les notifications
├── pages/                         # Pages principales
│   ├── Index.tsx                 # Page d'accueil (route /)
│   ├── POSPage.tsx               # Page POS (Point of Sale) - interface principale
│   └── NotFound.tsx              # Page 404
├── types/                         # Définitions TypeScript
│   └── index.ts                  # Types et interfaces (Category, Product, Order, etc.)
├── lib/                           # Utilitaires
│   └── utils.ts                  # Fonctions utilitaires
├── test/                          # Tests
│   ├── example.test.ts           # Exemple de test
│   └── setup.ts                  # Configuration des tests
├── App.tsx                        # Composant racine avec routing
├── main.tsx                       # Point d'entrée React
└── index.css                      # Styles Tailwind globaux et variables CSS
```

## � Modèles de Données

### Category
```typescript
interface Category {
  id: number;
  name: string;
}
```

### Product
```typescript
interface Product {
  id: number;
  name: string;
  price: string;
  category: number;
  category_name: string;
  available: boolean;
}
```

### OrderItem
```typescript
interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}
```

### Order
```typescript
interface Order {
  id: number;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  // ... autres champs
}
```

### États des Commandes
- **pending** - Commande en attente de traitement
- **preparing** - Commande en préparation
- **ready** - Commande prête
- **delivered** - Commande livrée
- **cancelled** - Commande annulée

## 🔌 Intégration API

### Configuration

L'application utilise **Axios** pour communiquer avec une API REST :

**Base URL** : `http://localhost:8000/api/`

**Configuration** : Voir [src/api/client.ts](src/api/client.ts)

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/categories` | Récupère toutes les catégories |
| GET | `/products` | Récupère tous les produits |
| GET | `/products?category=ID` | Récupère les produits d'une catégorie |
| GET | `/orders` | Récupère toutes les commandes |
| POST | `/orders` | Crée une nouvelle commande |
| GET | `/orders/ID` | Récupère les détails d'une commande |
| PUT | `/orders/ID` | Modifie une commande existante |
| DELETE | `/orders/ID` | Annule une commande |

### Intercepteurs Axios

Les intercepteurs sont configurés pour :
- Gérer les erreurs globales
- Ajouter des headers d'authentification si nécessaire
- Formatter les requêtes et réponses

## 🌐 Fonctionnalités Principales

### Authentification & Autorisation
- **Système JWT complet** avec tokens d'accès et rafraîchissement
- **Gestion des rôles** (Admin et Waiter) avec permissions granulaires
- **Contexte d'authentification** global pour toute l'application
- **Routes protégées** avec redirection automatique vers le login
- **Rehydratation automatique** de la session après rafraîchissement de page
- **Déconnexion sécurisée** avec suppression des tokens
- Implémentation : [src/context/AuthContext.tsx](src/context/AuthContext.tsx)

### Gestion Intelligente des Commandes (Option B)
- **Réutilisation automatique** des commandes "pending" existantes
- **Ajout progressif des articles** à la même commande
- **Augmentation des quantités** si un article existe déjà
- **Une seule commande active** par table
- **Meilleure traçabilité** des modifications

### Mode Hors-Ligne
- **Détection automatique** de la perte de connexion internet
- **Notifications toast** pour informer l'utilisateur de l'état de connexion
- **Gestion gracieuse** des erreurs réseau
- Implémentation : [src/hooks/useOfflineMode.ts](src/hooks/useOfflineMode.ts)

### Gestion du Panier
- **Ajout/Suppression** d'articles
- **Modification des quantités**
- **Calcul automatique** du sous-total et total
- **Panier persistant** durant la session
- **Synchronisation entre onglets** via événements storage

### Gestion des Commandes
- **Création** de nouvelles commandes par table
- **Ajout intelligent** d'articles aux commandes existantes
- **Suivi du statut** en temps réel (pending, preparing, ready, delivered, cancelled)
- **Historique** des commandes avec filtrage
- **Mise à jour des statuts** en temps réel

## 🎨 Design System

### Nombre de Composants
- **30+ composants UI** de shadcn/ui incluant :
  - Accordions, Alertes, Avatars, Badges
  - Boutons, Calendriers, Cartes, Carrousels
  - Checkboxes, Dialogues, Menus déroulants
  - Formulaires, Onglets, Sélecteurs, Sliders
  - Toasts, Tooltips, etc.

### Thème & Couleurs (CSS Variables)

Les couleurs sont définies en **HSL** dans [src/index.css](src/index.css) :

```css
--background: 220 20% 97%     /* Fond principal */
--foreground: 220 20% 10%     /* Texte principal */
--primary: 36 90% 45%         /* Couleur primaire */
--secondary: 260 60% 50%      /* Couleur secondaire */
--destructive: 0 100% 50%     /* Actions destructives */
--border: 220 15% 88%         /* Bordures */
--card: 0 0% 100%             /* Cartes */
--muted: 220 10% 60%          /* Texte atténué */
```

### Support du Mode Sombre
Support du thème sombre via la classe `.dark` sur l'élément racine.

### Responsive Design
L'application est **100% responsive** et s'adapte à tous les écrans :
- Mobile (320px+)
- Tablette (768px+)
- Desktop (1024px+)

## 📱 Composants Principaux

### MenuPanel
Panneau de navigation affichant les catégories de produits.
- Navigation interactive entre les catégories
- Affichage dynamique des produits par catégorie
- Sélection fluide et responsive

**Localisation** : [src/components/MenuPanel.tsx](src/components/MenuPanel.tsx)

### TableGrid
Tableau affichant les commandes en cours classées par table.
- Vue en grille des commandes
- Statuts visuels avec badges
- Gestion des commandes par table

**Localisation** : [src/components/TableGrid.tsx](src/components/TableGrid.tsx)

### OrderSummary
Panneau latéral avec résumé et détails de la commande en cours.
- Affichage des articles du panier
- Calcul du total (TTC)
- Actions (ajouter, retirer articles)
- Validation et envoi de commande

**Localisation** : [src/components/OrderSummary.tsx](src/components/OrderSummary.tsx)

### ErrorBoundary & ErrorMessage
Gestion complète des erreurs :
- **ErrorBoundary** : Capture les erreurs React
- **ErrorMessage** : Affiche les messages d'erreur utilisateur
- **LoadingSpinner** : Indicateur de chargement

**Localisations** : 
- [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx)
- [src/components/ErrorMessage.tsx](src/components/ErrorMessage.tsx)

## 🪝 Hooks Personnalisés

- **`useCategories()`** - Récupère et met en cache les catégories
- **`useProducts(categoryId?)`** - Récupère les produits (filtrés par catégorie optionnellement)
- **`useOrders()`** - Récupère les commandes avec polling
- **`useCreateOrder()`** - Crée une nouvelle commande
- **`useUpdateOrderStatus()`** - Met à jour le statut d'une commande
- **`useAddOrderItem()`** - Ajoute un article à une commande
- **`useOfflineMode()`** - Détecte l'état de connexion internet

## 🧪 Tests

### Exécution des tests

```bash
# Exécuter tous les tests une fois
npm run test

# Mode watcher (surveillance des changements)
npm run test:watch
```

**À propos** : Les tests unitaires sont situés dans [src/test/](src/test/)

### Couverture de test
- Tests unitaires avec **Vitest**
- Tests d'intégration
- Configuration : [vitest.config.ts](vitest.config.ts)

### Tests end-to-end
- Framework : **Playwright**
- Configuration : [playwright.config.ts](playwright.config.ts)
- Fixtures : [playwright-fixture.ts](playwright-fixture.ts)

## 👥 Contribution

Les contributions sont bienvenues! Pour contribuer :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Assurez-vous que :
- ✅ Le code passe le lint (`npm run lint`)
- ✅ Les tests passent (`npm run test`)
- ✅ TypeScript compile sans erreur

## 📝 Dépendances Clés

| Package | Version | Use Case |
|---------|---------|----------|
| react | 19.x | Librarie UI |
| typescript | 5.x | Typage statique |
| @tanstack/react-query | 5.x | Gestion du cache API |
| axios | 1.x | Client HTTP |
| tailwindcss | 4.x | Framework CSS |
| sonner | Latest | Notifications |
| vite | 6.x | Bundler |

Pour voir la liste complète, consultez [package.json](package.json)

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

**Symptôme** : Messages d'erreur API, le panier ne se charge pas

**Solutions** :
1. Vérifier que le serveur API est lancé sur `http://localhost:8000`
2. Vérifier les logs du navigateur (F12 > Console)
3. Vérifier que CORS est configuré correctement sur l'API backend
4. Relancer le serveur frontend : `npm run dev`

```bash
# Test rapide de l'API
curl http://localhost:8000/api/categories
```

### Mode hors-ligne déclenché incorrectement

**Symptôme** : Alerte "Mode hors-ligne" bien que l'internet soit actif

**Solutions** :
1. Vérifier la connexion internet
2. Ouvrir les DevTools (F12) et regarder l'onglet Network
3. Vérifier que l'API est accessible
4. Rafraîchir la page (F5)

### Erreurs Tailwind CSS

**Symptôme** : Styles manquants ou cassés après mise à jour

**Solutions** :
1. Nettoyer les caches :
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```
2. Vérifier que `tailwind.config.ts` inclut tous les fichiers :
   ```typescript
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']
   ```

### TypeScript : Erreur de type

**Symptôme** : Erreurs TypeScript non-bloqu­antes après chaque changement

**Solutions** :
1. Redémarrer le serveur TypeScript : `Ctrl + Shift + P` > "TypeScript: Restart TS Server"
2. Nettoyer le build cache :
   ```bash
   rm -rf dist
   npm run build
   ```

### Port 5173 déjà utilisé

**Symptôme** : Erreur "EADDRINUSE" en lançant `npm run dev`

**Solution** :
```bash
# Utiliser un port différent
npm run dev -- --port 3000
```

### Les dépendances ne s'installent pas

**Symptôme** : Erreurs lors de `npm install`

**Solutions** :
```bash
# Vider le cache npm
npm cache clean --force

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Tests Vitest qui échouent

**Symptôme** : Les tests plantent avec des erreurs de modules

**Solutions** :
1. Vérifier que `vitest.config.ts` est correctement configuré
2. Relancer les tests :
   ```bash
   npm run test -- --no-cache
   ```

**Besoin d'aide ?**
- Consulter les [Issues du projet](https://github.com/your-repo/issues)
- Vérifier les logs du navigateur (F12 > Console & Network)

## 📚 Ressources

- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [TypeScript](https://www.typescriptlang.org)

## 📄 Licence

Projet ENI - L3 IHM
