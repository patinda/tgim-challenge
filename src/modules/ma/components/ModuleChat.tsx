import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, FileText, CheckCircle, BarChart3, CheckSquare, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DealModule, Message, Target, Deal } from '../types';
import { useMAData } from '../hooks/useMAData';
import { aiService } from '../services/ai-service';

interface ModuleChatProps {
  module: DealModule;
  messages: Message[];
  target: Target;
  deal: Deal;
}

export function ModuleChat({ module, messages, target, deal }: ModuleChatProps) {
  const { addMessage, createArtifact } = useMAData();
  const [isAIConnected, setIsAIConnected] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Log des messages pour debug
  useEffect(() => {
    console.log('🔄 Messages mis à jour dans ModuleChat:', messages);
  }, [messages]);

  // Log des messages pour debug
  useEffect(() => {
    console.log('🔄 ModuleChat - Messages reçus:', messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Vérifier la connectivité de l'IA au montage
  useEffect(() => {
    const checkAI = async () => {
      const connected = await aiService.checkAPIConnectivity();
      setIsAIConnected(connected);
    };
    checkAI();
  }, []);

  const getModuleContext = (code: string) => {
    switch (code) {
      case 'M1':
        return {
          welcome: "Module M1 - Qualification et Acceptation. Nous allons vous aider à être accepté comme acheteur crédible.",
          suggestions: [
            "Comment structurer mon pitch ?",
            "Comment prouver ma crédibilité ?",
            "Quels sont mes arguments clés ?",
            "Générer un template de contact"
          ]
        };
      case 'M2':
        return {
          welcome: "Module M2 - LOI et Négociation des termes. Nous allons cadrer la valuation et les termes du deal.",
          suggestions: [
            "Comment structurer la LOI ?",
            "Quels sont les points clés ?",
            "Comment négocier le prix ?",
            "Générer un draft de LOI"
          ]
        };
      case 'M3':
        return {
          welcome: "Module M3 - Due Diligence. Nous allons piloter les DD et transformer les findings en leviers.",
          suggestions: [
            "Comment planifier la DD ?",
            "Comment transformer en leviers ?",
            "Quels sont les points durs ?",
            "Générer une demande d\'ajustement"
          ]
        };
      case 'M4':
        return {
          welcome: "Module M4 - Négociation finale et Closing. Nous allons boucler les points critiques et organiser le closing.",
          suggestions: [
            "Quels sont les points à arbitrer ?",
            "Comment préparer l\'argumentaire final ?",
            "Comment organiser le closing ?",
            "Générer la checklist de closing"
          ]
        };
      default:
        return { welcome: "", suggestions: [] };
    }
  };

  const context = getModuleContext(module.code);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    console.log('🚀 Envoi du message:', inputValue);
    console.log('📊 Contexte:', { module: module.code, target: target.name, deal: deal.id });

    const userMessage: Omit<Message, 'id' | 'created_at'> = {
      deal_module_id: module.id,
      role: 'user',
      content: inputValue,
      metadata: {}
    };

    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Utiliser l'IA réelle ou le mode mock
    try {
      console.log('🤖 Appel du service IA...');
      const aiResponse = await aiService.generateResponse(
        inputValue,
        module,
        target,
        deal,
        messages
      );

      console.log('✅ Réponse IA reçue:', aiResponse);

      const aiMessage: Omit<Message, 'id' | 'created_at'> = {
        deal_module_id: module.id,
        role: 'assistant',
        content: aiResponse.content,
        metadata: { action: aiResponse.action }
      };

      addMessage(aiMessage);
      setIsTyping(false);

      // Créer un artifact si nécessaire
      if (aiResponse.artifact) {
        createArtifact({
          deal_module_id: module.id,
          type: aiResponse.artifact.type,
          title: aiResponse.artifact.title,
          content: aiResponse.artifact.content
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la réponse IA:', error);
      
      // Fallback vers une réponse simple
      const fallbackMessage: Omit<Message, 'id' | 'created_at'> = {
        deal_module_id: module.id,
        role: 'assistant',
        content: 'Désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?',
        metadata: { action: 'error' }
      };
      
      addMessage(fallbackMessage);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du module */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{context.welcome}</h3>
            <div className="flex items-center gap-2">
              {isAIConnected ? (
                <Badge variant="default" className="bg-green-600">
                  <Zap className="h-3 w-3 mr-1" />
                  IA Connectée
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Mode Mock
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {context.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {console.log('🔍 ModuleChat - Rendu des messages:', messages)}
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Aucun message pour le moment. Posez votre première question !
          </div>
        ) : (
          messages.map((message) => {
            console.log('🔍 Rendu du message:', message);
            return (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {message.role === 'user' ? 'Vous' : 'Assistant IA'}
                    </span>
                    {message.metadata?.action && (
                      <Badge variant="secondary" className="text-xs">
                        {message.metadata.action}
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium">Assistant IA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">En train d'écrire...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tapez votre message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
