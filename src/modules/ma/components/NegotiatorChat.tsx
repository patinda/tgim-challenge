import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  DollarSign
} from 'lucide-react';
import { negotiatorAI } from '../services/negotiator-ai';
import { NegotiationContext, NegotiationMessage } from '../types/negotiator';
import { supabase } from '@/lib/supabase';

interface NegotiatorChatProps {
  context: NegotiationContext;
  onContextUpdate?: (context: NegotiationContext) => void;
  existingNegotiationId?: string;
}

export function NegotiatorChat({ context, onContextUpdate, existingNegotiationId }: NegotiatorChatProps) {
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [negotiationId, setNegotiationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Charger les messages existants ou afficher le message de bienvenue
  useEffect(() => {
    async function loadMessages() {
      if (existingNegotiationId) {
        // Charger une négociation existante
        try {
          const { data, error } = await supabase
            .from('negotiations')
            .select('messages')
            .eq('id', existingNegotiationId)
            .single();

          if (!error && data?.messages) {
            setMessages(data.messages);
            setNegotiationId(existingNegotiationId);
            return;
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la négociation:', error);
        }
      }

      // Message de bienvenue pour nouvelle négociation
      if (messages.length === 0) {
        const welcomeMessage: NegotiationMessage = {
          id: 'welcome',
          role: 'assistant',
          content: context.target_name === 'Nouvelle négociation' 
            ? `Bonjour ! Je suis votre assistant IA spécialisé en négociation M&A. 

Je suis là pour vous accompagner dans vos négociations d'acquisition d'entreprises.

**Comment puis-je vous aider ?**
- Analyser une opportunité d'acquisition
- Préparer votre stratégie de négociation
- Gérer les objections du vendeur
- Structurer une offre d'achat
- Négocier les conditions de la transaction

Décrivez-moi votre situation de négociation et je vous donnerai des conseils personnalisés !`
            : `Bonjour ! Je suis votre assistant IA spécialisé en négociation M&A. 

Je vois que vous négociez l'acquisition de **${context.target_name}** dans le secteur **${context.sector}**.

**Contexte actuel :**
- Étape : ${context.stage}
- Type : ${context.negotiation_type}
- Votre rôle : ${context.user_role}
- Prix demandé : ${context.asking_price ? `${context.asking_price.toLocaleString()}€` : 'À négocier'}

Comment puis-je vous aider dans cette négociation ?`,
          timestamp: new Date().toISOString(),
          metadata: {
            strategy: 'Analyse initiale',
            confidence: 85,
            suggested_actions: ['Analyser le contexte', 'Préparer la stratégie'],
            risk_level: 'modéré',
            emotional_tone: 'professionnel'
          }
        };
        setMessages([welcomeMessage]);
      }
    }

    loadMessages();
  }, [context, existingNegotiationId]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: NegotiationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      metadata: {}
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await negotiatorAI.generateNegotiationResponse(
        inputValue,
        context,
        messages
      );

      const aiMessage: NegotiationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date().toISOString(),
        metadata: {
          strategy: aiResponse.strategy,
          confidence: aiResponse.confidence,
          suggested_actions: aiResponse.suggested_actions,
          risk_level: aiResponse.risk_assessment,
          emotional_tone: 'professionnel'
        }
      };

      // Mettre à jour l'état local et persister
      setMessages(prev => {
        const updated = [...prev, aiMessage];
        return updated;
      });
      setCurrentStrategy(aiResponse.strategy);
      setConfidence(aiResponse.confidence);

      // Persistance Supabase: créer ou mettre à jour la négociation
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (userId) {
          const updatedMessages = [...messages, userMessage, aiMessage];
          if (!negotiationId) {
            const scenario = `Négo ${context.target_name || ''} • ${context.stage}`.trim();
            const created = await negotiatorAI.saveNegotiation({
              user_id: userId,
              scenario,
              context,
              messages: updatedMessages,
              summary: '',
              score: undefined
            } as any);
            if (created?.id) setNegotiationId(created.id);
          } else {
            await negotiatorAI.updateNegotiation(negotiationId, {
              messages: updatedMessages,
              context
            });
          }
        }
      } catch (persistErr) {
        console.error('Persistance négociation échouée:', persistErr);
      }

    } catch (error) {
      console.error('Erreur négociation IA:', error);
      const errorMessage: NegotiationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?',
        timestamp: new Date().toISOString(),
        metadata: { strategy: 'Erreur', confidence: 0 }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (role: string) => {
    if (role === 'user') return <User className="h-4 w-4" />;
    return <Bot className="h-4 w-4" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel.includes('élevé')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (riskLevel.includes('faible')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="flex flex-col h-full max-h-[800px]">
      {/* Header avec contexte */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Négociation M&A - {context.target_name || 'Entreprise cible'}
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">
              <DollarSign className="h-3 w-3 mr-1" />
              {context.asking_price ? `${context.asking_price.toLocaleString()}€` : 'Prix à négocier'}
            </Badge>
            <Badge variant="outline">
              Étape: {context.stage}
            </Badge>
            <Badge variant="outline">
              {context.user_role} vs {context.counterpart_role}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Zone de chat */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Conversation IA</CardTitle>
            {currentStrategy && (
              <div className="flex items-center gap-2">
                <Badge className={getConfidenceColor(confidence)}>
                  {confidence}% confiance
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Stratégie: {currentStrategy}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="h-[460px] p-4 overflow-y-auto" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {getMessageIcon(message.role)}
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    
                    {message.metadata && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {message.metadata.risk_level && (
                            <div className="flex items-center gap-1">
                              {getRiskIcon(message.metadata.risk_level)}
                              <span>{message.metadata.risk_level}</span>
                            </div>
                          )}
                          {message.metadata.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.confidence}% confiance
                            </Badge>
                          )}
                        </div>
                        
                        {message.metadata.suggested_actions && (
                          <div className="mt-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                              Actions suggérées:
                            </div>
                            <ul className="text-xs space-y-1">
                              {message.metadata.suggested_actions.slice(0, 3).map((action, index) => (
                                <li key={index} className="flex items-start gap-1">
                                  <span className="text-primary">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      {getMessageIcon(message.role)}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      L'IA analyse votre demande...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input zone */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Décrivez votre situation de négociation..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              💡 Exemples: "Le vendeur demande 5M€ mais je pense que c'est trop cher", 
              "Comment gérer cette objection sur la valorisation ?"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
