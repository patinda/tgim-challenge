import { DealModule, Message, Target, Deal } from '../types';
import { RealDataTransformer } from './real-data-transformer';

// Types pour l'API OpenAI
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  action?: string;
  artifact?: {
    type: 'template' | 'document' | 'checklist' | 'matrix' | 'plan';
    title: string;
    content: any;
  };
}

// Configuration de l'API
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Vérification de la configuration
if (!OPENAI_API_KEY) {
  console.warn('⚠️ VITE_OPENAI_API_KEY non configurée. Utilisation du mode mock.');
}

export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Génère une réponse IA contextuelle pour un module M&A
   */
  async generateResponse(
    userInput: string,
    module: DealModule,
    target: Target,
    deal: Deal,
    conversationHistory: Message[]
  ): Promise<AIResponse> {
    // Si pas d'API key, utiliser le mode mock
    if (!OPENAI_API_KEY) {
      return this.generateMockResponse(userInput, module.code);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(module, target, deal);
      const messages = this.buildConversationContext(
        systemPrompt,
        conversationHistory,
        userInput
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
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || '';

      // Parser la réponse pour extraire l'action et l'artifact
      return this.parseAIResponse(aiContent, module.code);

    } catch (error) {
      console.error('Erreur API OpenAI:', error);
      // Fallback vers le mode mock en cas d'erreur
      return this.generateMockResponse(userInput, module.code);
    }
  }

  /**
   * Construit le prompt système contextuel enrichi
   */
  private buildSystemPrompt(module: DealModule, target: Target, deal: Deal): string {
    // Récupérer le contexte enrichi si disponible
    let enrichedContext = '';
    try {
      // Essayer de récupérer le contexte depuis les artifacts existants
      // Si pas disponible, utiliser le contexte de base
      enrichedContext = `
CONTEXTE ENRICHI :
- Secteur: ${target.sector}
- Localisation: ${target.location}
- Taille: ${target.revenue > 50000000 ? 'Large' : target.revenue > 10000000 ? 'Moyenne' : 'Petite'}
- Santé financière: ${target.financial_health || 'Non évaluée'}
- Position marché: ${target.market_position || 'Non évaluée'}
      `.trim();
    } catch (error) {
      console.warn('Impossible de récupérer le contexte enrichi:', error);
    }

    const basePrompt = `Vous êtes un expert en M&A spécialisé dans ${this.getModuleSpecialization(module.code)}.

CIBLE: ${target.name}
- Secteur: ${target.sector}
- CA: ${target.revenue.toLocaleString('fr-FR')}€
- EBITDA: ${target.ebitda.toLocaleString('fr-FR')}€
- Employés: ${target.employees}
- Localisation: ${target.location}

DEAL: ${deal.perimeter}% - ${deal.context}
${enrichedContext}

VOTRE RÔLE: ${this.getModuleRole(module.code)}

Répondez de manière structurée, proposez des actions concrètes et générez des livrables utiles.
Adaptez vos conseils au contexte spécifique de cette cible et de ce deal.`;

    return basePrompt;
  }

  private getModuleSpecialization(code: string): string {
    switch (code) {
      case 'M1': return 'la qualification et l\'acceptation d\'acheteurs';
      case 'M2': return 'la négociation de LOI et de termes de deal';
      case 'M3': return 'la Due Diligence et la transformation des findings';
      case 'M4': return 'la négociation finale et le closing';
      default: return 'la gestion de transactions M&A';
    }
  }

  private getModuleRole(code: string): string {
    switch (code) {
      case 'M1': return 'Aider l\'acheteur à être accepté comme partenaire crédible par le vendeur';
      case 'M2': return 'Aider à structurer la LOI et négocier les termes clés de la transaction';
      case 'M3': return 'Aider à planifier la DD et transformer les findings en leviers de négociation';
      case 'M4': return 'Aider à finaliser les points critiques et organiser le processus de closing';
      default: return 'Guider l\'utilisateur dans le processus M&A';
    }
  }

  /**
   * Construit le contexte de conversation
   */
  private buildConversationContext(
    systemPrompt: string,
    history: Message[],
    userInput: string
  ): ChatMessage[] {
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Ajouter l'historique récent (derniers 10 messages pour éviter de dépasser les tokens)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      });
    });

    // Ajouter le message actuel
    messages.push({ role: 'user', content: userInput });

    return messages;
  }

  /**
   * Parse la réponse IA pour extraire l'action et l'artifact
   */
  private parseAIResponse(content: string, moduleCode: string): AIResponse {
    // Détecter automatiquement l'action basée sur le contenu
    let action = 'general_help';
    let artifact = undefined;

    if (content.includes('template') || content.includes('pitch')) {
      action = 'generate_pitch';
      artifact = {
        type: 'template' as const,
        title: `Template généré - ${moduleCode}`,
        content: { content: content }
      };
    } else if (content.includes('checklist') || content.includes('liste')) {
      action = 'generate_checklist';
      artifact = {
        type: 'checklist' as const,
        title: `Checklist générée - ${moduleCode}`,
        content: { items: this.extractChecklistItems(content) }
      };
    } else if (content.includes('document') || content.includes('draft')) {
      action = 'generate_document';
      artifact = {
        type: 'document' as const,
        title: `Document généré - ${moduleCode}`,
        content: { content: content }
      };
    } else if (content.includes('matrice') || content.includes('give/get')) {
      action = 'generate_matrix';
      artifact = {
        type: 'matrix' as const,
        title: `Matrice générée - ${moduleCode}`,
        content: { give: [], get: [] }
      };
    } else if (content.includes('plan') || content.includes('planning')) {
      action = 'generate_plan';
      artifact = {
        type: 'plan' as const,
        title: `Plan généré - ${moduleCode}`,
        content: { phases: [] }
      };
    }

    return { content, action, artifact };
  }

  /**
   * Extrait les éléments de checklist du texte
   */
  private extractChecklistItems(content: string): string[] {
    const items: string[] = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.trim().match(/^[-•*]\s+/)) {
        items.push(line.trim().replace(/^[-•*]\s+/, ''));
      }
    });
    
    return items.length > 0 ? items : ['Item 1', 'Item 2', 'Item 3'];
  }

  /**
   * Mode mock en cas d'absence d'API ou d'erreur
   */
  private generateMockResponse(userInput: string, moduleCode: string): AIResponse {
    const mockResponses = {
      'M1': {
        content: `Je comprends votre demande "${userInput}". En mode M1, je vous recommande de structurer votre approche autour de la crédibilité et de l'expertise. Voulez-vous que je génère un template de pitch personnalisé ?`,
        action: 'generate_pitch',
        artifact: {
          type: 'template' as const,
          title: `Template M1 - ${moduleCode}`,
          content: { sections: ['Introduction', 'Expertise', 'Approche'] }
        }
      },
      'M2': {
        content: `Pour votre demande "${userInput}" en M2, concentrez-vous sur la structure de la LOI et les termes clés. Je peux vous aider à générer un draft de LOI.`,
        action: 'generate_loi',
        artifact: {
          type: 'document' as const,
          title: `Draft LOI - ${moduleCode}`,
          content: { sections: ['Prix', 'Conditions', 'Garanties'] }
        }
      },
      'M3': {
        content: `En M3, votre question "${userInput}" concerne la DD. Je recommande de planifier une approche structurée. Voulez-vous un plan de DD détaillé ?`,
        action: 'generate_dd_plan',
        artifact: {
          type: 'plan' as const,
          title: `Plan DD - ${moduleCode}`,
          content: { phases: ['Phase 1', 'Phase 2', 'Phase 3'] }
        }
      },
      'M4': {
        content: `Pour le M4 et votre demande "${userInput}", concentrez-vous sur le closing et l'arbitrage final. Je peux générer une checklist de closing.`,
        action: 'generate_closing_checklist',
        artifact: {
          type: 'checklist' as const,
          title: `Checklist Closing - ${moduleCode}`,
          content: { items: ['Document 1', 'Document 2', 'Signature'] }
        }
      }
    };

    return mockResponses[moduleCode] || mockResponses['M1'];
  }

  /**
   * Vérifie la connectivité de l'API
   */
  async checkAPIConnectivity(): Promise<boolean> {
    if (!OPENAI_API_KEY) return false;
    
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        })
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const aiService = AIService.getInstance();
