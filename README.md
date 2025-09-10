# TGIM Challenge – Application de Reprise d'Entreprise

## 📋 Table des matières
- [Présentation](#présentation)
- [Architecture](#architecture)
- [Installation et Configuration](#installation-et-configuration)
- [Fonctionnalités](#fonctionnalités)
- [Structure du Projet](#structure-du-projet)
- [Base de Données](#base-de-données)
- [Déploiement](#déploiement)
- [Maintenance](#maintenance)
- [Support](#support)

---

## 🎯 Présentation

**TGIM Challenge** est une application web complète pour l'évaluation et la négociation de reprises d'entreprise, intégrant l'intelligence artificielle pour automatiser les processus d'analyse financière et de négociation M&A.

### Stack Technologique
- **Frontend** : React 18 + TypeScript + Vite
- **UI/UX** : Tailwind CSS + shadcn/ui + Lucide Icons
- **Backend** : Supabase (Base de données, Authentification, Edge Functions)
- **IA** : OpenAI GPT-4 (via Supabase Edge Functions)
- **Déploiement** : Netlify (Frontend) + Supabase (Backend)

### Fonctionnalités Principales
- ✅ **TGIM Valuator** : Évaluation automatique d'entreprises avec IA
- ✅ **TGIM Negotiator** : Assistant IA pour négociations M&A
- ✅ **Chatbot Global** : Assistant IA intégré avec base de connaissances TGIM
- ✅ **Dashboard** : Suivi des analyses et négociations
- ✅ **Authentification** : Système complet avec profils utilisateurs
- ✅ **Historique** : Persistance des données et analyses

---

## 🏗️ Architecture

### Architecture Générale
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   OpenAI        │
│   (React)       │◄──►│   (Backend)     │◄──►│   (IA)          │
│                 │    │                 │    │                 │
│ • UI Components │    │ • Database      │    │ • GPT-4         │
│ • State Mgmt    │    │ • Auth          │    │ • Edge Functions│
│ • API Calls     │    │ • RLS           │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flux de Données
1. **Utilisateur** → Interface React
2. **React** → Supabase (via client)
3. **Supabase** → OpenAI (via Edge Functions)
4. **OpenAI** → Supabase → React → Utilisateur

---

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Clé API OpenAI

### 1. Cloner le Projet
```bash
git clone <repo-url>
cd tgim-challenge
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configuration de l'Environnement

#### Variables Frontend (.env)
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer avec vos vraies valeurs
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

#### Configuration Supabase
1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)
2. **Exécuter les migrations** (voir section Base de Données)
3. **Configurer les secrets** pour les Edge Functions :
   ```bash
   supabase secrets set OPENAI_API_KEY=votre_cle_openai
   supabase secrets set SUPABASE_URL=https://votre-projet.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

### 4. Déployer les Edge Functions
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à votre projet
supabase login
supabase link --project-ref votre-projet-id

# Déployer les fonctions
supabase functions deploy chat-module
```

### 5. Lancer l'Application
```bash
# Développement
npm run dev

# Production
npm run build
npm run preview
```

---

## 🎨 Fonctionnalités

### 1. TGIM Valuator
**Accès** : Sidebar → "TGIM Valuator" ou route `/valuator`

**Objectif** : Évaluer automatiquement une entreprise cible avec l'IA

**Processus** :
1. **Saisie des données** :
   - Informations financières (CA, EBITDA, dettes, trésorerie)
   - Données qualitatives (secteur, pays, barrières à l'entrée)
   - Métriques de croissance et effectifs

2. **Analyse IA** :
   - Calcul automatique de la fourchette de valorisation
   - Évaluation du score de risque (0-100)
   - Génération d'un rapport détaillé

3. **Résultats** :
   - Affichage immédiat des résultats
   - Sauvegarde automatique dans l'historique
   - Graphiques d'évolution des valorisations

### 2. TGIM Negotiator
**Accès** : Sidebar → "TGIM Negotiator" ou route `/negotiator`

**Objectif** : Assistant IA pour les négociations M&A

**Fonctionnalités** :
- **Chat en temps réel** avec l'IA spécialisée
- **Contexte dynamique** basé sur vos cibles et évaluations
- **Historique des négociations** persistantes
- **Stratégies adaptatives** selon le profil de l'entreprise

**Utilisation** :
1. Sélectionner une cible d'entreprise
2. Démarrer une nouvelle négociation
3. Interagir avec l'IA pour développer des stratégies
4. Consulter l'historique des négociations

### 3. Chatbot Global
**Accès** : Bouton flottant en bas à droite

**Objectif** : Assistant IA général avec base de connaissances TGIM

**Fonctionnalités** :
- **Base de connaissances** intégrée sur TGIM
- **Contexte utilisateur** (cibles, deals, évaluations)
- **Réponses spécialisées** M&A et reprise d'entreprise
- **Interface chat** intuitive et responsive

### 4. Dashboard et Historique
**Accès** : Page d'accueil ou route `/dashboard`

**Fonctionnalités** :
- **Vue d'ensemble** des analyses récentes
- **Statistiques** de performance
- **Compteur de temps** jusqu'à la prochaine session
- **Navigation rapide** vers les modules

### 5. Gestion des Profils
**Accès** : Sidebar → "Profil" ou route `/profile`

**Fonctionnalités** :
- **Informations personnelles** (nom, email, avatar)
- **Préférences** de l'application
- **Gestion du compte** (changement de mot de passe)
- **Statistiques** d'utilisation

---

## 📁 Structure du Projet

```
tgim-challenge/
├── public/                     # Fichiers statiques
├── src/
│   ├── components/            # Composants UI réutilisables
│   │   ├── ui/               # Composants shadcn/ui
│   │   └── ChatbotProvider.tsx
│   ├── hooks/                # Hooks React personnalisés
│   ├── lib/                  # Utilitaires et configuration
│   │   ├── supabase.ts      # Client Supabase
│   │   ├── utils.ts         # Fonctions utilitaires
│   │   └── secure-api.ts    # API sécurisée
│   ├── modules/              # Modules métier
│   │   ├── auth/            # Authentification
│   │   ├── chatbot/         # Chatbot global
│   │   ├── dashboard/       # Tableau de bord
│   │   ├── layout/          # Layout et navigation
│   │   ├── ma/              # M&A (Valuator + Negotiator)
│   │   ├── notifications/   # Système de notifications
│   │   ├── settings/        # Paramètres
│   │   ├── storage/         # Gestion du stockage
│   │   ├── theme/           # Thème et apparence
│   │   └── user/            # Gestion des utilisateurs
│   ├── types/               # Types TypeScript
│   ├── App.tsx              # Composant racine
│   ├── Routes.tsx           # Configuration des routes
│   └── main.tsx             # Point d'entrée
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── chat-module/     # Fonction pour le chatbot
│   └── migrations/          # Migrations de base de données
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### Modules Principaux

#### `/modules/ma/` - M&A (Mergers & Acquisitions)
- **`components/ValuatorPage.tsx`** : Interface d'évaluation d'entreprise
- **`components/NegotiatorAIPage.tsx`** : Interface de négociation
- **`services/valuator-ai.ts`** : Service d'évaluation IA
- **`services/negotiator-ai.ts`** : Service de négociation IA
- **`types/`** : Types TypeScript pour M&A

#### `/modules/auth/` - Authentification
- **`components/LoginForm.tsx`** : Formulaire de connexion
- **`components/RegisterForm.tsx`** : Formulaire d'inscription
- **`hooks/useAuth.ts`** : Hook d'authentification

#### `/modules/layout/` - Interface Utilisateur
- **`components/Header.tsx`** : En-tête de l'application
- **`components/Sidebar.tsx`** : Navigation latérale
- **`components/Layout.tsx`** : Layout principal

---

## 🗄️ Base de Données

### Tables Principales

#### `evaluations`
Stocke les évaluations d'entreprises
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- created_at (timestamp)
- company_name (text)
- input_data (jsonb) -- Données du formulaire
- min_valuation (numeric)
- max_valuation (numeric)
- risk_score (integer)
- report (text) -- Rapport IA
```

#### `negotiations`
Stocke les négociations
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)
- target_company (text)
- context (jsonb) -- Contexte de négociation
- messages (jsonb) -- Messages du chat
- status (text) -- Statut de la négociation
```

#### `tgim_knowledge`
Base de connaissances TGIM
```sql
- id (uuid, primary key)
- category (text)
- title (text)
- content (text)
- keywords (text[])
```

### Migrations
```bash
# Appliquer les migrations
supabase db reset
# ou
supabase migration up
```

### Row Level Security (RLS)
Toutes les tables sont protégées par RLS :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les politiques sont définies dans les migrations

---

## 🚀 Déploiement

### Frontend (Netlify)
1. **Connecter le repository** à Netlify
2. **Configurer les variables d'environnement** :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```
3. **Build settings** :
   - Build command: `npm run build`
   - Publish directory: `dist`

### Backend (Supabase)
1. **Déployer les Edge Functions** :
   ```bash
   supabase functions deploy chat-module
   ```
2. **Configurer les secrets** :
   ```bash
   supabase secrets set OPENAI_API_KEY=votre_cle
   ```
3. **Appliquer les migrations** :
   ```bash
   supabase db push
   ```

### Variables d'Environnement Production
```bash
# Frontend (Netlify)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme

# Backend (Supabase Secrets)
OPENAI_API_KEY=votre_cle_openai
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anonyme
```

---

## 🔧 Maintenance

### Développement Local
```bash
# Démarrer le serveur de développement
npm run dev

# Lancer les tests
npm run test

# Linter
npm run lint

# Build de production
npm run build
```

### Mise à Jour des Dépendances
```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour
npm update

# Mise à jour majeure (attention aux breaking changes)
npm install package@latest
```

### Base de Données
```bash
# Sauvegarder la base
supabase db dump > backup.sql

# Restaurer
supabase db reset
psql -f backup.sql

# Appliquer de nouvelles migrations
supabase migration new nom_de_la_migration
supabase db push
```

### Monitoring
- **Supabase Dashboard** : Monitoring de la base de données
- **Netlify Analytics** : Performance du frontend
- **Console du navigateur** : Debugging côté client

---

### Logs et Debugging
```bash
# Logs des Edge Functions
supabase functions logs chat-module

# Logs de la base de données
supabase logs db

# Debug local
npm run dev
# Ouvrir F12 > Console pour voir les erreurs
```

## 📚 Ressources

### Documentation Externe
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Outils de Développement
- **IDE recommandé** : VS Code avec extensions React/TypeScript
- **Debugging** : React Developer Tools, Supabase Dashboard
- **API Testing** : Postman ou Insomnia

---

*Dernière mise à jour : septembre 2025*