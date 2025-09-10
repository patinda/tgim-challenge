import { DealSubmission } from '../../deals/types';
import { Target, Deal, DealModule } from '../types';

export interface RealDataContext {
  sector: string;
  region: string;
  size: 'small' | 'medium' | 'large';
  financialHealth: 'excellent' | 'good' | 'average' | 'challenging';
  marketPosition: 'leader' | 'challenger' | 'niche' | 'emerging';
}

export class RealDataTransformer {
  /**
   * Transforme un DealSubmission en Target M&A
   */
  static transformToTarget(dealSubmission: DealSubmission): Target {
    const context = this.analyzeContext(dealSubmission);
    
    return {
      id: `target-${dealSubmission.id}`,
      name: dealSubmission.legal_name || dealSubmission.trade_name || 'Cible anonymisée',
      sector: dealSubmission.naf_code || dealSubmission.activity_description || 'Secteur non spécifié',
      location: dealSubmission.region || dealSubmission.hq_address || 'Localisation non spécifiée',
      revenue: dealSubmission.turnover_yr_n || 0,
      ebitda: dealSubmission.ebitda_yr_n || 0,
      employees: dealSubmission.employees_fte || 0,
      founded: dealSubmission.incorporation_date || 'Date non spécifiée',
      description: dealSubmission.activity_description || 'Description non disponible',
      financial_health: context.financialHealth,
      market_position: context.marketPosition,
      created_at: dealSubmission.submitted_at || new Date().toISOString()
    };
  }

  /**
   * Transforme un DealSubmission en Deal M&A
   */
  static transformToDeal(dealSubmission: DealSubmission): Deal {
    const target = this.transformToTarget(dealSubmission);
    
    return {
      id: `deal-${dealSubmission.id}`,
      target_id: target.id,
      perimeter: this.mapDealType(dealSubmission.deal_type),
      context: this.mapContext(dealSubmission),
      asking_price: dealSubmission.asking_price || 0,
      timeline: this.mapTimeline(dealSubmission.timeline),
      status: this.mapStatus(dealSubmission.internal_status),
      created_at: dealSubmission.submitted_at || new Date().toISOString()
    };
  }

  /**
   * Crée les modules M&A pour un deal
   */
  static createModulesForDeal(dealId: string): DealModule[] {
    return [
      {
        id: `module-${dealId}-M1`,
        deal_id: dealId,
        code: 'M1',
        title: 'Qualification et Acceptation',
        description: 'Être accepté comme acheteur crédible',
        state: 'in_progress',
        progress: 25,
        created_at: new Date().toISOString()
      },
      {
        id: `module-${dealId}-M2`,
        deal_id: dealId,
        code: 'M2',
        title: 'LOI et Négociation des termes',
        description: 'Cadrer la valuation et les termes',
        state: 'locked',
        progress: 0,
        created_at: new Date().toISOString()
      },
      {
        id: `module-${dealId}-M3`,
        deal_id: dealId,
        code: 'M3',
        title: 'Due Diligence',
        description: 'Piloter les DD et transformer en leviers',
        state: 'locked',
        progress: 0,
        created_at: new Date().toISOString()
      },
      {
        id: `module-${dealId}-M4`,
        deal_id: dealId,
        code: 'M4',
        title: 'Négociation finale et Closing',
        description: 'Boucler les points critiques et organiser le closing',
        state: 'locked',
        progress: 0,
        created_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Analyse le contexte d'un deal pour enrichir les prompts IA
   */
  static analyzeContext(dealSubmission: DealSubmission): RealDataContext {
    // Analyse du secteur
    const sector = this.categorizeSector(dealSubmission.naf_code, dealSubmission.activity_description);
    
    // Analyse de la taille
    const size = this.categorizeSize(dealSubmission.turnover_yr_n, dealSubmission.employees_fte);
    
    // Analyse de la santé financière
    const financialHealth = this.analyzeFinancialHealth(dealSubmission);
    
    // Analyse de la position marché
    const marketPosition = this.analyzeMarketPosition(dealSubmission);
    
    return {
      sector,
      region: dealSubmission.region || 'France',
      size,
      financialHealth,
      marketPosition
    };
  }

  /**
   * Génère un contexte enrichi pour l'IA
   */
  static generateEnrichedContext(dealSubmission: DealSubmission): string {
    const context = this.analyzeContext(dealSubmission);
    const financials = this.analyzeFinancials(dealSubmission);
    
    return `
CONTEXTE ENRICHI DU DEAL :

**Cible :** ${dealSubmission.legal_name || 'Anonymisée'}
**Secteur :** ${context.sector} (${dealSubmission.naf_code || 'N/A'})
**Localisation :** ${dealSubmission.region || 'France'}
**Taille :** ${context.size} (${dealSubmission.employees_fte || 0} employés, CA: ${dealSubmission.turnover_yr_n || 0}€)

**Santé financière :** ${context.financialHealth}
- EBITDA : ${dealSubmission.ebitda_yr_n || 0}€
- Dette : ${dealSubmission.financial_debt || 0}€
- Trésorerie : ${dealSubmission.cash_position || 0}€
- Comptes audités : ${dealSubmission.audited_accounts ? 'Oui' : 'Non'}

**Position marché :** ${context.marketPosition}
- Revenus récurrents : ${dealSubmission.recurring_revenue_pct || 0}%
- Principaux clients : ${dealSubmission.main_clients_share || 0}% du CA
- Export : ${dealSubmission.export_pct || 0}% du CA

**Motivation de vente :** ${dealSubmission.sale_motivation || 'Non spécifiée'}
**Type de transaction :** ${dealSubmission.deal_type || 'Non spécifié'}
**Prix demandé :** ${dealSubmission.asking_price || 'Non spécifié'}€

**Risques identifiés :**
- Litiges en cours : ${dealSubmission.ongoing_litigation ? 'Oui' : 'Non'}
- Risques sociaux : ${dealSubmission.social_risks || 'Non spécifiés'}
- Risques environnementaux : ${dealSubmission.environmental_risks || 'Non spécifiés'}
    `.trim();
  }

  // Méthodes privées d'analyse
  private static categorizeSector(nafCode: string, activityDescription: string): string {
    if (nafCode?.includes('62') || activityDescription?.toLowerCase().includes('informatique')) return 'Tech/IT';
    if (nafCode?.includes('47') || activityDescription?.toLowerCase().includes('commerce')) return 'Commerce';
    if (nafCode?.includes('43') || activityDescription?.toLowerCase().includes('construction')) return 'Construction';
    if (nafCode?.includes('86') || activityDescription?.toLowerCase().includes('santé')) return 'Santé';
    if (nafCode?.includes('85') || activityDescription?.toLowerCase().includes('éducation')) return 'Éducation';
    return 'Autre';
  }

  private static categorizeSize(turnover: number, employees: number): 'small' | 'medium' | 'large' {
    if (turnover > 50000000 || employees > 250) return 'large';
    if (turnover > 10000000 || employees > 50) return 'medium';
    return 'small';
  }

  private static analyzeFinancialHealth(dealSubmission: DealSubmission): 'excellent' | 'good' | 'average' | 'challenging' {
    const ebitda = dealSubmission.ebitda_yr_n || 0;
    const turnover = dealSubmission.turnover_yr_n || 1;
    const debt = dealSubmission.financial_debt || 0;
    const cash = dealSubmission.cash_position || 0;
    
    const ebitdaMargin = ebitda / turnover;
    const debtRatio = debt / (ebitda * 3); // 3x EBITDA comme référence
    
    if (ebitdaMargin > 0.15 && debtRatio < 0.5 && cash > ebitda) return 'excellent';
    if (ebitdaMargin > 0.10 && debtRatio < 1.0) return 'good';
    if (ebitdaMargin > 0.05 && debtRatio < 2.0) return 'average';
    return 'challenging';
  }

  private static analyzeMarketPosition(dealSubmission: DealSubmission): 'leader' | 'challenger' | 'niche' | 'emerging' {
    const recurringRevenue = dealSubmission.recurring_revenue_pct || 0;
    const mainClientsShare = dealSubmission.main_clients_share || 0;
    const exportPct = dealSubmission.export_pct || 0;
    
    if (recurringRevenue > 70 && mainClientsShare < 30) return 'leader';
    if (recurringRevenue > 50 && exportPct > 20) return 'challenger';
    if (recurringRevenue > 30) return 'niche';
    return 'emerging';
  }

  private static analyzeFinancials(dealSubmission: DealSubmission): string {
    const turnover = dealSubmission.turnover_yr_n || 0;
    const ebitda = dealSubmission.ebitda_yr_n || 0;
    const netResult = dealSubmission.net_result_yr_n || 0;
    
    const ebitdaMargin = turnover > 0 ? ((ebitda / turnover) * 100).toFixed(1) : '0';
    const netMargin = turnover > 0 ? ((netResult / turnover) * 100).toFixed(1) : '0';
    
    return `EBITDA: ${ebitdaMargin}%, Résultat net: ${netMargin}%`;
  }

  private static mapDealType(dealType: string): number {
    switch (dealType) {
      case 'full_shares': return 100;
      case 'majority': return 75;
      case 'minority': return 25;
      case 'contribution_transfer': return 100;
      default: return 100;
    }
  }

  private static mapContext(dealSubmission: DealSubmission): string {
    if (dealSubmission.asking_price && dealSubmission.asking_price > 0) return 'Prix défini';
    if (dealSubmission.timeline === 'less_than_6_months') return 'Urgence';
    if (dealSubmission.handover_period && dealSubmission.handover_period > 12) return 'Transition longue';
    return 'Standard';
  }

  private static mapTimeline(timeline: string): string {
    switch (timeline) {
      case 'less_than_6_months': return 'Urgent (< 6 mois)';
      case '6_to_12_months': return 'Moyen (6-12 mois)';
      case 'more_than_12_months': return 'Long (> 12 mois)';
      default: return 'Non défini';
    }
  }

  private static mapStatus(status: string): string {
    switch (status) {
      case 'qualified': return 'Qualifié';
      case 'in_review': return 'En cours';
      case 'new': return 'Nouveau';
      case 'dropped': return 'Abandonné';
      default: return 'En cours';
    }
  }
}
