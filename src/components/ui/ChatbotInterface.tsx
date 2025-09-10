import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabase';

interface Message {
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

interface ChatbotInterfaceProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ChatbotInterface({ className, isOpen = false, onToggle }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-module', {
        body: {
          message: userMessage.content,
          context: {
            user_profile: {
              first_name: "Utilisateur",
              last_name: "TGIM",
              role: "user"
            },
            context_type: "chat_interface",
            timestamp: new Date().toISOString()
          },
          stream: false
        }
      });

      if (error) {
        throw new Error(error.message || 'Edge function error');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.response,
        role: 'assistant',
        timestamp: new Date(),
        metadata: data?.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '❌ Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Convertir le markdown simple en JSX
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={index} className="font-semibold text-primary mb-2">
              {line.slice(2, -2)}
            </div>
          );
        }
        if (line.startsWith('• ')) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-primary mt-1">•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        if (line.startsWith('*') && line.endsWith('*')) {
          return (
            <div key={index} className="italic text-muted-foreground text-sm">
              {line.slice(1, -1)}
            </div>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        );
      });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        style={{
          background: 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)',
          border: 'none'
        }}
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl border-0 z-50 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Header avec branding TGIM */}
      <CardHeader 
        className="pb-3"
        style={{
          background: 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                alt="TGIM Guild"
              />
              <AvatarFallback className="bg-white/20 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">TGIM Guild</h3>
              <p className="text-xs opacity-90">Assistant communautaire</p>
            </div>
          </div>
          <div className="text-[10px] opacity-90">
            {import.meta.env.VITE_OPENAI_API_KEY ? 'Connecté OpenAI' : 'Mode mock'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0 flex-1 flex flex-col">
        <ScrollArea className="h-[460px] p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage 
                      src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                      alt="TGIM Guild"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                  style={{
                    borderRadius: '12px'
                  }}
                >
                  <div className="text-sm leading-relaxed">
                    {formatMessage(message.content)}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage 
                    src="https://qvvqpirarindpxmxetap.supabase.co/storage/v1/object/public/Logo//TGIM%20900x300%20(1).png"
                    alt="TGIM Guild"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    TGIM réfléchit...
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="flex-1"
              style={{
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              style={{
                background: 'linear-gradient(135deg, #5b2c2c 0%, #7c3a3a 100%)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
