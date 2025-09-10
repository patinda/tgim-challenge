import { supabase } from '@/lib/supabase';
import { ChatMessage, ChatContextData } from '../types';

// Fonction pour générer un UUID simple
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback pour les environnements qui ne supportent pas crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class ChatService {
  private static instance: ChatService;
  private context: ChatContextData | null = null;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Collecte toutes les données du SaaS pour le contexte IA
   */
  async gatherContextData(): Promise<ChatContextData> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Récupération parallèle de toutes les données
      const [
        userProfile,
        userAchievements,
        userDeals,
        userCalendar,
        announcements,
        members,
        intervenants
      ] = await Promise.allSettled([
        this.getUserProfile(user.id),
        this.getUserAchievements(user.id),
        this.getUserDeals(user.id),
        this.getUserCalendar(user.id),
        this.getAnnouncements(),
        this.getMembers(),
        this.getIntervenants()
      ]);

      this.context = {
        user_profile: userProfile.status === 'fulfilled' ? userProfile.value : null,
        user_achievements: userAchievements.status === 'fulfilled' ? userAchievements.value : [],
        user_deals: userDeals.status === 'fulfilled' ? userDeals.value : [],
        user_calendar: userCalendar.status === 'fulfilled' ? userCalendar.value : [],
        announcements: announcements.status === 'fulfilled' ? announcements.value : [],
        members: members.status === 'fulfilled' ? members.value : [],
        intervenants: intervenants.status === 'fulfilled' ? intervenants.value : [],
        context_type: 'full_saas_context',
        timestamp: new Date()
      };

      return this.context;
    } catch (error) {
      console.error('Erreur lors de la collecte des données de contexte:', error);
      throw error;
    }
  }

  /**
   * Envoie un message au chatbot IA avec le contexte du SaaS
   */
  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      // Créer un contexte minimal pour éviter les timeouts
      const minimalContext = {
        user_profile: null,
        user_achievements: [],
        user_deals: [],
        user_calendar: [],
        announcements: [],
        members: [],
        intervenants: [],
        context_type: 'minimal_context',
        timestamp: new Date()
      };

      // Appeler l'edge function pour traiter le message avec l'IA
      const { data, error } = await supabase.functions.invoke('chat-module', {
        body: {
          message: message,
          context: minimalContext,
          stream: false
        }
      });

      if (error) {
        throw new Error(`Erreur lors de l'appel à l'IA: ${error.message}`);
      }

      const response: ChatMessage = {
        id: generateUUID(),
        content: data.response || "Désolé, je n'ai pas pu traiter votre demande.",
        sender: 'assistant',
        timestamp: new Date()
      };

      return response;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  /**
   * Vérifie si le contexte est obsolète (plus de 5 minutes)
   */
  private isContextStale(): boolean {
    if (!this.context) return true;
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.context.timestamp < fiveMinutesAgo;
  }

  // Méthodes privées pour récupérer les données spécifiques
  private async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  private async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  private async getUserDeals(userId: string) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  private async getUserCalendar(userId: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(10);
    
    if (error) throw error;
    return data;
  }

  private async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    return data;
  }

  private async getMembers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, status')
      .eq('is_active', true)
      .limit(50);
    
    if (error) throw error;
    return data;
  }

  private async getIntervenants() {
    const { data, error } = await supabase
      .from('intervenants')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }
}

export const chatService = ChatService.getInstance();
