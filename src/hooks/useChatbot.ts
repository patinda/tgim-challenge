import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: {
    bot_name?: string;
    bot_tagline?: string;
    context_used?: string;
  };
}

interface ChatbotContext {
  user_profile?: {
    first_name: string;
    last_name: string;
    role: string;
  };
  user_achievements?: any[];
  user_deals?: any[];
  user_calendar?: any[];
  announcements?: any[];
  members?: any[];
  intervenants?: any[];
  context_type: string;
  timestamp: string;
}

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: '🎉 Bonjour ! Je suis votre assistant TGIM Guild. Je suis là pour vous accompagner dans votre parcours entrepreneurial et vous aider à naviguer dans notre communauté. Comment puis-je vous aider aujourd\'hui ?',
      role: 'assistant',
      timestamp: new Date(),
      metadata: {
        bot_name: 'TGIM Guild',
        bot_tagline: 'Votre assistant communautaire'
      }
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChatbot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const sendMessage = useCallback(async (
    message: string, 
    context?: Partial<ChatbotContext>
  ) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/functions/v1/chat-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            user_profile: context?.user_profile || {
              first_name: "Utilisateur",
              last_name: "TGIM",
              role: "user"
            },
            user_achievements: context?.user_achievements || [],
            user_deals: context?.user_deals || [],
            user_calendar: context?.user_calendar || [],
            announcements: context?.announcements || [],
            members: context?.members || [],
            intervenants: context?.intervenants || [],
            context_type: context?.context_type || "chat_interface",
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        metadata: data.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '❌ Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        content: '🎉 Bonjour ! Je suis votre assistant TGIM Guild. Je suis là pour vous accompagner dans votre parcours entrepreneurial et vous aider à naviguer dans notre communauté. Comment puis-je vous aider aujourd\'hui ?',
        role: 'assistant',
        timestamp: new Date(),
        metadata: {
          bot_name: 'TGIM Guild',
          bot_tagline: 'Votre assistant communautaire'
        }
      }
    ]);
  }, []);

  return {
    isOpen,
    messages,
    isLoading,
    toggleChatbot,
    openChatbot,
    sendMessage,
    clearMessages
  };
}
