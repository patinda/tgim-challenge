import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatBotState } from '../types';
import { chatService } from '../services/chatService';

// Fonction pour générer un UUID simple
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const useChatBot = () => {
  const [state, setState] = useState<ChatBotState>({
    isOpen: false,
    isMinimized: false,
    messages: [
      {
        id: generateUUID(),
        content: "🎉 Bonjour ! Je suis votre assistant TGIM Guild. Je suis là pour vous accompagner dans votre parcours entrepreneurial et vous aider à naviguer dans notre communauté. Comment puis-je vous aider aujourd'hui ?",
        sender: 'assistant',
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const toggleChatBot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMinimized: false
    }));
  }, []);

  const minimizeChatBot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }));
  }, []);

  const closeChatBot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      isMinimized: false
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: generateUUID(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      // Envoyer le message au service IA avec timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: La réponse prend trop de temps')), 30000)
      );
      
      const aiResponse = await Promise.race([
        chatService.sendMessage(content.trim()),
        timeoutPromise
      ]) as ChatMessage;
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        isLoading: false
      }));
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Message d'erreur pour l'utilisateur
      const errorMessage: ChatMessage = {
        id: generateUUID(),
        content: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
        sender: 'assistant',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }));
    }
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [
        {
          id: generateUUID(),
          content: "🎉 Bonjour ! Je suis votre assistant TGIM Guild. Je suis là pour vous accompagner dans votre parcours entrepreneurial et vous aider à naviguer dans notre communauté. Comment puis-je vous aider aujourd'hui ?",
          sender: 'assistant',
          timestamp: new Date()
        }
      ],
      error: null
    }));
  }, []);

  return {
    ...state,
    toggleChatBot,
    minimizeChatBot,
    closeChatBot,
    sendMessage,
    clearMessages,
    messagesEndRef
  };
};
