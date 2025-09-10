import { supabase } from '@/lib/supabase';
import { Negotiation, NegotiationContext, NegotiationMessage, AIResponse } from '../types/negotiator';

// Configuration OpenAI (réutilise l'existant)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class NegotiatorAI {
  private static instance: NegotiatorAI;
  
  private constructor() {}
  
  static getInstance(): NegotiatorAI {
    if (!NegotiatorAI.instance) {
      NegotiatorAI.instance = new NegotiatorAI();
    }
    return NegotiatorAI.instance;
  }

  /**
   * Génère une réponse IA pour la négociation M&A
   */
  async generateNegotiationResponse(
    userMessage: string,
    context: NegotiationContext,
    conversationHistory: NegotiationMessage[]
  ): Promise<AIResponse> {
    // Si pas d'API key, utiliser le mode mock
    if (!OPENAI_API_KEY) {
      return this.generateMockResponse(userMessage, context);
    }

    try {
      const systemPrompt = this.buildNegotiationPrompt(context);
      const messages = this.buildConversationContext(
        systemPrompt,
        conversationHistory,
        userMessage
      );

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 800,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || '';

      return this.parseNegotiationResponse(aiContent, context);

    } catch (error) {
      console.error('Erreur API OpenAI Negotiator:', error);
      return this.generateMockResponse(userMessage, context);
    }
  }

  /**
   * Construit le prompt système pour la négociation M&A
   */
  private buildNegotiationPrompt(context: NegotiationContext): string {
    return `Tu es un expert en négociation M&A, spécialisé dans l'acquisition de PME. 

CONTEXTE DE LA NÉGOCIATION:
- Entreprise cible: ${context.target_name || 'Non spécifiée'}
- Secteur: ${context.sector || 'Non spécifié'}
- Type de négociation: ${context.negotiation_type}
- Étape actuelle: ${context.stage}
- Rôle de l'utilisateur: ${context.user_role}
- Rôle de la contrepartie: ${context.counterpart_role}
- Valorisation: ${context.valuation ? `${context.valuation.toLocaleString()}€` : 'Non spécifiée'}
- Prix demandé: ${context.asking_price ? `${context.asking_price.toLocaleString()}€` : 'Non spécifié'}

STRATÉGIES DE NÉGOCIATION M&A:
1. **Approche collaborative**: Créer de la valeur mutuelle
2. **Analyse de multiples**: Comparer avec le marché
3. **Gestion des objections**: Anticiper et répondre
4. **Timing stratégique**: Identifier les moments clés
5. **Création de valeur**: Proposer des synergies

TON RÔLE:
- Analyser la situation de négociation
- Proposer des stratégies adaptées
- Donner des arguments concrets
- Anticiper les objections
- Suggérer des contre-propositions
- Évaluer les risques et opportunités

RÉPONSE ATTENDUE:
- Analyse de la situation
- Stratégie recommandée
- Arguments à utiliser
- Actions concrètes à entreprendre
- Évaluation des risques

Sois précis, professionnel et orienté résultats.`;
  }

  /**
   * Construit le contexte de conversation
   */
  private buildConversationContext(
    systemPrompt: string,
    history: NegotiationMessage[],
    userInput: string
  ) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Ajouter l'historique récent (derniers 10 messages)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Ajouter le message utilisateur actuel
    messages.push({
      role: 'user',
      content: userInput
    });

    return messages;
  }

  /**
   * Parse la réponse IA pour extraire les éléments structurés
   */
  private parseNegotiationResponse(content: string, context: NegotiationContext): AIResponse {
    // Extraire la stratégie recommandée
    const strategyMatch = content.match(/stratégie[:\s]*(.+?)(?:\n|$)/i);
    const strategy = strategyMatch ? strategyMatch[1].trim() : 'Analyse de la situation';

    // Extraire les actions suggérées
    const actionsMatch = content.match(/actions?[:\s]*(.+?)(?:\n\n|$)/is);
    const suggestedActions = actionsMatch 
      ? actionsMatch[1].split(/[•\-\n]/).map(a => a.trim()).filter(a => a.length > 0)
      : ['Analyser la contre-proposition', 'Préparer des arguments'];

    // Calculer la confiance basée sur la longueur et la structure
    const confidence = Math.min(95, Math.max(60, content.length / 10));

    // Évaluer le risque basé sur le contexte
    const riskLevel = this.assessRiskLevel(context, content);

    return {
      message: content,
      strategy,
      confidence,
      suggested_actions: suggestedActions,
      risk_assessment: riskLevel,
      next_steps: this.generateNextSteps(context, content),
      emotional_guidance: this.generateEmotionalGuidance(content)
    };
  }

  /**
   * Génère une réponse mock en cas d'erreur
   */
  private generateMockResponse(userMessage: string, context: NegotiationContext): AIResponse {
    const mockStrategies = [
      'Approche collaborative pour créer de la valeur mutuelle',
      'Analyse comparative avec les multiples du marché',
      'Négociation basée sur les synergies identifiées',
      'Gestion des objections avec des contre-arguments solides'
    ];

    const mockActions = [
      'Préparer une contre-proposition détaillée',
      'Analyser les multiples du secteur',
      'Identifier les synergies potentielles',
      'Anticiper les objections de la contrepartie'
    ];

    return {
      message: `Basé sur votre situation de négociation avec ${context.target_name || 'cette entreprise'}, je recommande une approche structurée. 

**Analyse de la situation:**
- Prix demandé: ${context.asking_price ? `${context.asking_price.toLocaleString()}€` : 'À négocier'}
- Valorisation estimée: ${context.valuation ? `${context.valuation.toLocaleString()}€` : 'À déterminer'}
- Étape: ${context.stage}

**Stratégie recommandée:** ${mockStrategies[Math.floor(Math.random() * mockStrategies.length)]}

**Actions suggérées:**
${mockActions.map(action => `• ${action}`).join('\n')}

**Prochaines étapes:**
1. Préparer votre argumentaire
2. Analyser les multiples du marché
3. Identifier les points de négociation
4. Planifier la prochaine réunion`,
      
      strategy: mockStrategies[0],
      confidence: 75,
      suggested_actions: mockActions,
      risk_assessment: 'Risque modéré - négociation standard',
      next_steps: ['Préparer l\'argumentaire', 'Analyser le marché', 'Planifier la suite'],
      emotional_guidance: 'Restez professionnel et orienté résultats'
    };
  }

  /**
   * Évalue le niveau de risque de la négociation
   */
  private assessRiskLevel(context: NegotiationContext, content: string): string {
    let riskScore = 50; // Base

    // Facteurs de risque
    if (context.asking_price && context.valuation) {
      const premium = (context.asking_price - context.valuation) / context.valuation;
      if (premium > 0.3) riskScore += 20;
      if (premium < -0.1) riskScore -= 10;
    }

    if (context.stage === 'initial') riskScore += 10;
    if (context.stage === 'final_terms') riskScore -= 5;

    if (content.includes('risque') || content.includes('problème')) riskScore += 15;
    if (content.includes('opportunité') || content.includes('synergie')) riskScore -= 10;

    if (riskScore > 70) return 'Risque élevé - négociation complexe';
    if (riskScore < 30) return 'Risque faible - négociation favorable';
    return 'Risque modéré - négociation standard';
  }

  /**
   * Génère les prochaines étapes
   */
  private generateNextSteps(context: NegotiationContext, content: string): string[] {
    const baseSteps = [
      'Analyser la réponse de la contrepartie',
      'Préparer la contre-proposition',
      'Planifier la prochaine réunion'
    ];

    if (context.stage === 'initial') {
      return ['Préparer l\'argumentaire initial', 'Analyser les multiples du marché', 'Planifier la première réunion'];
    }

    if (context.stage === 'valuation') {
      return ['Négocier le prix', 'Analyser les synergies', 'Préparer le term sheet'];
    }

    if (context.stage === 'due_diligence') {
      return ['Analyser les documents', 'Identifier les risques', 'Négocier les ajustements'];
    }

    return baseSteps;
  }

  /**
   * Génère des conseils émotionnels
   */
  private generateEmotionalGuidance(content: string): string {
    if (content.includes('agressif') || content.includes('pression')) {
      return 'Restez calme et professionnel. Évitez l\'escalade.';
    }
    if (content.includes('collaboratif') || content.includes('synergie')) {
      return 'Excellente approche collaborative. Continuez dans cette direction.';
    }
    if (content.includes('doute') || content.includes('hésitation')) {
      return 'Prenez le temps de bien analyser. La précipitation peut être risquée.';
    }
    return 'Restez confiant et orienté résultats.';
  }

  /**
   * Sauvegarde une négociation dans Supabase
   */
  async saveNegotiation(negotiation: Omit<Negotiation, 'id' | 'created_at'>): Promise<Negotiation> {
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .insert([negotiation])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur sauvegarde négociation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une négociation existante (messages, résumé, score...)
   */
  async updateNegotiation(
    id: string,
    update: Partial<Pick<Negotiation, 'messages' | 'summary' | 'score' | 'context'>>
  ): Promise<Negotiation | null> {
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Negotiation;
    } catch (error) {
      console.error('Erreur mise à jour négociation:', error);
      return null;
    }
  }

  /**
   * Récupère l'historique des négociations
   */
  async getNegotiationHistory(userId: string): Promise<Negotiation[]> {
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }
}

// Export de l'instance singleton
export const negotiatorAI = NegotiatorAI.getInstance();
