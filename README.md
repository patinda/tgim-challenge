# TGIM Challenge – Mini-app de Reprise d’Entreprise (React + IA + Supabase)

## Présentation

Ce projet répond au défi TGIM : une mini-app web connectée à Supabase, intégrant des fonctionnalités IA pour accompagner l’évaluation et la négociation de reprise d’entreprise.

**Stack** :
- Frontend : React (Vite) + Tailwind CSS + shadcn/ui
- Backend : Supabase (auth, database, RLS)
- IA : service OpenAI/ElementAI (mocké ou réel)

---

## Setup rapide

1. **Cloner le repo** (accès privé)
   ```sh
   git clone <repo-url>
   cd tgim-challenge
   ```
2. **Installer les dépendances**
   ```sh
   npm install
   ```
3. **Configurer l’environnement local**
   Copie le modèle d’environnement :
   ```sh
   cp .env.example .env
   # puis édite .env pour mettre tes vraies clés →
   # VITE_SUPABASE_URL=ton-url
   # VITE_SUPABASE_ANON_KEY=ta-cle
   # VITE_OPENAI_KEY=ta-cle
   ```

---

## Fonctionnalité : TGIM Valuator

- Accès : via la sidebar > « TGIM Valuator » ou route `/valuator`
- **Objectif :** Évaluer automatiquement une cible d’entreprise à partir de données financières et qualitatives (inputs formulaires)
- **Parcours :**
  1. Remplir le formulaire complet (CA, EBITDA, dette, secteur, digital, etc.)
  2. Cliquer « Évaluer avec l’IA »
  3. Un service dédié appelle l’IA (mock ou OpenAI). Le prompt et l’agrégation de données sont faits côté service (`src/modules/ma/services/valuator-ai.ts`).
  4. Résultat : fourchette de valorisation, score de risque, rapport auto.

- **Bonnes pratiques :**
  - Aucune clé ou secret n’est commité → voir `.env.example`
  - Logique IA séparée, remplaçable selon la prod/demo (OpenAI proxy or local mock)
  - Tous les champs financiers/qualitatifs ont un `placeholder` pour UX claire.

- **À venir :**
  - Sauvegarde et historique des évaluations dans Supabase (RLS activé)
  - Affichage de l’historique par utilisateur

---

## Variables d’environnement
À ne jamais partager publiquement (tu mets les vraies valeurs dans `.env` !)
```
VITE_SUPABASE_URL=<url_supabase>
VITE_SUPABASE_ANON_KEY=<clé_anon_supabase>
VITE_OPENAI_KEY=<clé_openai>
```

---

## IA : usage, limites et justification
- Démo : l’appel IA est simulé (mock) pour économie et rapidité en dev
- En prod : passe par un service backend/proxy pour sécuriser la clé OpenAI
- Le prompt est modulaire et contextualisé (inputs utilisateur + analyse métier)

---

## À suivre…
- Historique, RLS, puis modules Negotiator, Emailing, Chatbot IA
- Chaque étape sera documentée ici à l’avancement
