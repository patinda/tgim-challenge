import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { NegotiatorChat } from './NegotiatorChat';
import type { NegotiationContext } from '../types/negotiator';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function NegotiatorAIPage() {
  const [context, setContext] = useState<NegotiationContext | null>(null);
  const [targets, setTargets] = useState<any[]>([]);
  const [, setDeals] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedNegotiation, setSelectedNegotiation] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [chatKey, setChatKey] = useState<string>('default');
  const chatRef = useRef<HTMLDivElement>(null);

  // Charger les données de l'utilisateur
  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) return;

        const [targetsRes, dealsRes, evaluationsRes, negotiationsRes] = await Promise.all([
          supabase.from('targets').select('*').eq('user_id', userId),
          supabase.from('deals').select('*').eq('user_id', userId),
          supabase.from('evaluations').select('*').eq('user_id', userId),
          supabase.from('negotiations').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        ]);

        setTargets(targetsRes.data || []);
        setDeals(dealsRes.data || []);
        setEvaluations(evaluationsRes.data || []);
        setNegotiations(negotiationsRes.data || []);

        // Créer un contexte par défaut si pas de données
        if (targetsRes.data?.length === 0) {
          setContext({
            negotiation_type: 'acquisition',
            stage: 'initial',
            user_role: 'buyer',
            counterpart_role: 'seller',
            target_name: 'Nouvelle cible',
            sector: 'Non spécifié',
            valuation: 0,
            asking_price: 0,
            key_issues: ['Valorisation', 'Conditions', 'Garanties'],
            constraints: {
              budget_limit: 0,
              timeline: 'À définir',
              must_haves: ['Accès aux données financières'],
              nice_to_haves: ['Accompagnement dirigeant']
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  // Mettre à jour le contexte quand une cible est sélectionnée
  useEffect(() => {
    if (selectedTarget && targets.length > 0) {
      const target = targets.find(t => t.id === selectedTarget);
      const evaluation = evaluations.find(e => e.target_id === selectedTarget);
      
      if (target) {
        setContext({
          negotiation_type: 'acquisition',
          stage: 'initial',
          user_role: 'buyer',
          counterpart_role: 'seller',
          target_name: target.name,
          sector: target.sector || 'Non spécifié',
          valuation: evaluation ? (evaluation.min_valuation + evaluation.max_valuation) / 2 : 0,
          asking_price: evaluation ? evaluation.max_valuation * 1.2 : 0, // Prix demandé supposé 20% plus élevé
          key_issues: ['Valorisation', 'Conditions', 'Garanties'],
          constraints: {
            budget_limit: evaluation ? evaluation.max_valuation : 0,
            timeline: '3 mois',
            must_haves: ['Accès aux données financières', 'Garanties de passif'],
            nice_to_haves: ['Accompagnement dirigeant 6 mois']
          }
        });
      }
    }
  }, [selectedTarget, targets, evaluations]);

  // Charger une négociation existante
  useEffect(() => {
    if (selectedNegotiation && negotiations.length > 0) {
      const negotiation = negotiations.find(n => n.id === selectedNegotiation);
      if (negotiation && negotiation.context) {
        setContext(negotiation.context);
        setShowHistory(true);
      }
    }
  }, [selectedNegotiation, negotiations]);
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">TGIM Negotiator</h1>
        <Badge variant="secondary" className="ml-2">
          <Bot className="h-3 w-3 mr-1" />
          Agent IA
        </Badge>
      </div>

      {/* Section défi masquée */}
      {false && (
      <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5" />
            🎯 Défi : Agent IA de Négociation M&A
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              🎯 Objectif du Défi
            </h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
              Créer un agent IA spécialisé en négociation M&A qui assiste les repreneurs dans leurs négociations d'acquisition.
            </p>
            
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              🚀 Fonctionnalités à Implémenter
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• <strong>Chat en temps réel</strong> avec l'agent IA de négociation</li>
              <li>• <strong>Analyse contextuelle</strong> des situations de négociation</li>
              <li>• <strong>Stratégies adaptatives</strong> basées sur le profil de l'entreprise</li>
              <li>• <strong>Simulation de négociation</strong> avec différents scénarios</li>
              <li>• <strong>Recommandations personnalisées</strong> en temps réel</li>
              <li>• <strong>Gestion des objections</strong> et contre-arguments</li>
              <li>• <strong>Suivi des progrès</strong> de négociation</li>
            </ul>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              🛠️ Technologies Suggérées
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                OpenAI GPT-4
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                LangChain
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Vector Database
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                WebSocket
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                React Query
              </Badge>
            </div>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              📋 Consignes Techniques
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• Intégrer <strong>OpenAI API</strong> pour les réponses intelligentes</li>
              <li>• Utiliser <strong>LangChain</strong> pour la gestion des conversations</li>
              <li>• Implémenter un <strong>système de contexte</strong> persistant</li>
              <li>• Créer des <strong>templates de stratégies</strong> de négociation</li>
              <li>• Ajouter un <strong>système de scoring</strong> des négociations</li>
              <li>• Intégrer des <strong>données de marché</strong> en temps réel</li>
            </ul>

            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 mt-4">
              🎨 Interface Utilisateur
            </h4>
            <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1 ml-4">
              <li>• <strong>Chat interface</strong> moderne et intuitive</li>
              <li>• <strong>Contexte de négociation</strong> (entreprise, deal, étape)</li>
              <li>• <strong>Stratégies recommandées</strong> avec explications</li>
              <li>• <strong>Historique des négociations</strong> et analyses</li>
              <li>• <strong>Métriques de performance</strong> en temps réel</li>
            </ul>

            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700">
              <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                💡 <strong>Astuce :</strong> Commencez par créer un système de chat basique, puis ajoutez progressivement l'intelligence contextuelle et les stratégies de négociation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Exemples masqués */}
      {false && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Exemples d'Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">💬 Conversation Type</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <strong>Utilisateur :</strong> "Le vendeur demande 5M€ mais je pense que c'est trop cher"
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <strong>IA :</strong> "Basé sur les multiples du secteur, je recommande de négocier autour de 4.2M€. Voici les arguments..."
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📊 Stratégies Suggérées</h4>
              <ul className="text-sm space-y-1">
                <li>• Approche collaborative</li>
                <li>• Création de valeur</li>
                <li>• Timing stratégique</li>
                <li>• Analyse de risque</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Historique des négociations */}
      {negotiations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Historique des négociations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant={showHistory ? "default" : "outline"}
                  onClick={() => setShowHistory(!showHistory)}
                  size="sm"
                >
                  {showHistory ? "Masquer" : "Afficher"} l'historique
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedNegotiation('');
                    setSelectedTarget('');
                    setShowHistory(false);
                    // Créer un contexte par défaut pour une nouvelle négociation
                    setContext({
                      negotiation_type: 'acquisition',
                      stage: 'initial',
                      user_role: 'buyer',
                      counterpart_role: 'seller',
                      target_name: 'Nouvelle négociation',
                      sector: 'À définir',
                      valuation: 0,
                      asking_price: 0,
                      key_issues: ['Valorisation', 'Conditions', 'Garanties'],
                      constraints: {
                        budget_limit: 0,
                        timeline: 'À définir',
                        must_haves: ['Accès aux données financières'],
                        nice_to_haves: ['Accompagnement dirigeant']
                      }
                    });
                    // Générer une nouvelle clé pour forcer la réinitialisation du chat
                    setChatKey(`new-${Date.now()}`);
                    // Scroll vers le chat après un court délai
                    setTimeout(() => {
                      chatRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  size="sm"
                >
                  Nouvelle négociation
                </Button>
              </div>
              
              {showHistory && (
                <div className="space-y-2">
                  <Select value={selectedNegotiation} onValueChange={setSelectedNegotiation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisissez une négociation à continuer" />
                    </SelectTrigger>
                    <SelectContent>
                      {negotiations.map((negotiation) => (
                        <SelectItem key={negotiation.id} value={negotiation.id}>
                          {negotiation.scenario} - {new Date(negotiation.created_at).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedNegotiation && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        💬 Cette négociation contient {negotiations.find(n => n.id === selectedNegotiation)?.messages?.length || 0} messages.
                        Vous pouvez continuer la conversation où vous l'avez laissée.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélection de la cible pour nouvelle négociation */}
      {targets.length > 0 && !showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Nouvelle négociation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez une cible à négocier" />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.name} ({target.sector || 'Secteur non spécifié'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTarget && context && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Contexte de négociation :</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Entreprise :</strong> {context.target_name}
                    </div>
                    <div>
                      <strong>Secteur :</strong> {context.sector}
                    </div>
                    <div>
                      <strong>Valorisation :</strong> {context.valuation?.toLocaleString() || 'Non spécifiée'}€
                    </div>
                    <div>
                      <strong>Prix demandé :</strong> {context.asking_price?.toLocaleString() || 'Non spécifié'}€
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Démarrer une négociation (chat en temps réel) */}
      <Card ref={chatRef}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Démarrer une négociation (temps réel)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Chargement des données...
            </div>
          ) : (context || selectedNegotiation) ? (
            <NegotiatorChat 
              key={selectedNegotiation ? `existing-${selectedNegotiation}` : chatKey}
              context={context || {
                negotiation_type: 'acquisition',
                stage: 'initial',
                user_role: 'buyer',
                counterpart_role: 'seller',
                target_name: 'Négociation en cours',
                sector: 'Non spécifié',
                valuation: 0,
                asking_price: 0,
                key_issues: ['Valorisation', 'Conditions', 'Garanties'],
                constraints: {
                  budget_limit: 0,
                  timeline: 'À définir',
                  must_haves: ['Accès aux données financières'],
                  nice_to_haves: ['Accompagnement dirigeant']
                }
              }}
              existingNegotiationId={selectedNegotiation || undefined}
            />
          ) : targets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Veuillez d'abord ajouter des cibles dans le TGIM Valuator</p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.href = '/valuator'}
              >
                Aller au Valuator
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Veuillez sélectionner une cible ci-dessus pour commencer une nouvelle négociation</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
