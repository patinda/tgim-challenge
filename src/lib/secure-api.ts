// Client API sécurisée pour Supabase
// Ce fichier fournit une interface pour appeler les Edge Functions Supabase

import { toast } from 'sonner';

// URL de base pour les Edge Functions
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` 
  : '';

// Clé anonyme pour l'authentification des Edge Functions
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fonction utilitaire pour les appels API
async function callEdgeFunction(endpoint: string, data: any, token?: string | null) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Ajouter le token d'authentification s'il est fourni
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Pour les appels sans authentification, utiliser la clé anonyme
      headers['apikey'] = ANON_KEY;
    }

    const response = await fetch(`${EDGE_FUNCTION_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(errorData.error || 'Une erreur est survenue');
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Erreur lors de l'appel à l'Edge Function ${endpoint}:`, error);
    toast.error(`Erreur: ${error?.message || 'Une erreur est survenue'}`);
    throw error;
  }
}

// API d'authentification sécurisée
export const secureAuth = {
  signIn: async (email: string, password: string) => {
    return callEdgeFunction('auth', {
      action: 'signIn',
      email,
      password,
    });
  },

  signUp: async (email: string, password: string, userData?: any) => {
    return callEdgeFunction('auth', {
      action: 'signUp',
      email,
      password,
      userData,
    });
  },

  signOut: async (token: string) => {
    return callEdgeFunction('auth', {
      action: 'signOut',
    }, token);
  },

  resetPassword: async (email: string) => {
    return callEdgeFunction('auth', {
      action: 'resetPassword',
      email,
    });
  },
};

// API de base de données sécurisée
export const secureDB = {
  select: async (table: string, options: { 
    select?: string, 
    filters?: any 
  }, token: string | null | undefined) => {
    return callEdgeFunction('db-operations', {
      operation: 'select',
      table,
      data: { select: options.select },
      filters: options.filters,
    }, token);
  },

  insert: async (table: string, data: any, token: string | null | undefined) => {
    return callEdgeFunction('db-operations', {
      operation: 'insert',
      table,
      data,
    }, token);
  },

  update: async (table: string, data: any, match: any, token: string | null | undefined) => {
    return callEdgeFunction('db-operations', {
      operation: 'update',
      table,
      data,
      filters: { match },
    }, token);
  },

  delete: async (table: string, match: any, token: string | null | undefined) => {
    return callEdgeFunction('db-operations', {
      operation: 'delete',
      table,
      filters: { match },
    }, token);
  },
};

// Fonction pour obtenir le token de session actuel
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    // Récupérer la session depuis le localStorage
    const sessionStr = localStorage.getItem('supabase.auth.token');
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr);
    return session?.access_token || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};
