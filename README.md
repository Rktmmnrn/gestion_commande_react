# Gestion de Commandes - Application React (POS)

Une application web moderne de gestion de commandes (Point of Sale) construite avec React 19, TypeScript, Vite et shadcn/ui. Application complète pour la gestion des commandes avec support du mode hors-ligne.

## 📑 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Stack Technologique](#-stack-technologique)
3. [Installation & Démarrage Rapide](#-installation--démarrage-rapide)
4. [Commandes Disponibles](#-commandes-disponibles)
5. [Structure du Projet](#-structure-du-projet)
6. [Modèles de Données](#--modèles-de-données)
7. [Fonctionnalités Principales](#-fonctionnalités-principales)
8. [Design System](#-design-system)
9. [Composants Principaux](#-composants-principaux)
10. [Hooks Personnalisés](#-hooks-personnalisés)
11. [Tests](#-tests)
12. [Contribution](#-contribution)
13. [Dépendances Clés](#--dépendances-clés)
14. [Linting](#-linting)
15. [Déploiement](#-déploiement)
16. [Conventions de Code](#--conventions-de-code)
17. [Dépannage](#-troubleshooting)
18. [Ressources](#-ressources)
19. [Licence](#--licence)

## 🎯 Vue d'ensemble

Cette application permet de :
- **Authentification sécurisée** avec JWT et gestion des rôles (Admin/Waiter)
- **Visualiser les catégories** de produits disponibles
- **Consulter les produits** avec leurs détails, prix et disponibilité
- **Gérer un panier d'articles** avec quantités
- **Créer et modifier les commandes** en temps réel (logique intelligente Option B)
- **Suivre l'état des commandes** (pending, preparing, ready, delivered, cancelled)
- **Interface utilisateur responsive** et accessible avec composants modernes
- **Gestion des tables** pour les commandes (numéro de table)
- **Mode hors-ligne** avec détection automatique de la connexion
- **Tableau de bord Admin** pour les administrateurs (rôle admin uniquement)

## 🛠️ Stack Technologique

### Frontend
- **React 19** - Bibliothèque UI moderne
- **TypeScript** - Typage statique complet
- **Vite** - Bundler ultra-rapide et serveur de développement
- **React Router** - Routage client-side
- **React Query (@tanstack/react-query)** - Gestion du cache et des requêtes API
- **React Hook Form** - Gestion des formulaires
- **TailwindCSS** - Framework CSS utilitaire
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
