import { createContext, useContext, ReactNode } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { ChatbotInterface } from '@/components/ui/ChatbotInterface';

interface ChatbotContextType {
  isOpen: boolean;
  messages: any[];
  isLoading: boolean;
  toggleChatbot: () => void;
  openChatbot: () => void;
  sendMessage: (message: string, context?: any) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const chatbot = useChatbot();

  return (
    <ChatbotContext.Provider value={chatbot}>
      {children}
      <ChatbotInterface 
        isOpen={chatbot.isOpen}
        onToggle={chatbot.toggleChatbot}
      />
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
}
