export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface ChatBotState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextData {
  // Données utilisateur
  user_profile?: any;
  user_achievements?: any[];
  user_deals?: any[];
  user_calendar?: any[];
  
  // Données système
  announcements?: any[];
  members?: any[];
  intervenants?: any[];
  
  // Métadonnées
  context_type: string;
  timestamp: Date;
}
