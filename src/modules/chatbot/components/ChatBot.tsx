import React, { useState } from 'react';
import { useChatBot } from '../hooks/useChatBot';
import { ChatMessage } from '../types';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Bot, 
  User,
  Loader2,
  RotateCcw
} from 'lucide-react';

interface ChatMessageComponentProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageComponentProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'text-white' 
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
      }`} style={{
        backgroundColor: isUser ? '#5b2c2c' : undefined
      }}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`flex-1 max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'text-white rounded-tr-md' 
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-tl-md'
        }`} style={{
          backgroundColor: isUser ? '#5b2c2c' : undefined
        }}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

const ChatBot: React.FC = () => {
  const {
    isOpen,
    isMinimized,
    messages,
    isLoading,
    error,
    toggleChatBot,
    minimizeChatBot,
    closeChatBot,
    sendMessage,
    clearMessages,
    messagesEndRef
  } = useChatBot();

  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={toggleChatBot}
          className="fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
          style={{
            background: 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)'
          }}
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle size={24} />
          <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[32rem]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 text-white rounded-t-2xl" style={{
            background: 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)'
          }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">TGIM Guild</h3>
                <p className="text-xs opacity-90">Assistant communautaire</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <button
                  onClick={clearMessages}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Effacer la conversation"
                >
                  <RotateCcw size={16} />
                </button>
              )}
              <button
                onClick={minimizeChatBot}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? "Agrandir" : "Réduire"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={closeChatBot}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Fermer le chatbot"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Contenu */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 h-80">
                <div className="space-y-1">
                  {messages.map((message) => (
                    <ChatMessageComponent key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Bot size={16} />
                      </div>
                      <div className="flex-1 max-w-[70%]">
                        <div className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-md px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm">En train de réfléchir...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Zone de saisie */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                {error && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent max-h-24 min-h-[2.5rem]"
                    style={{
                      '--tw-ring-color': '#5b2c2c'
                    } as React.CSSProperties}
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-3 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center"
                    style={{
                      background: !inputValue.trim() || isLoading ? undefined : 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)'
                    }}
                    aria-label="Envoyer le message"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Appuyez sur Entrée pour envoyer • Maj+Entrée pour une nouvelle ligne
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
