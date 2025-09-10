import { Target, Deal, DealModule, Message, Artifact, Task } from '../types';

export const mockTargets: Target[] = [
  {
    id: 'target-1',
    name: 'TechSoft Solutions',
    sector: 'Tech/IT',
    location: 'Île-de-France',
    revenue: 2500000,
    ebitda: 400000,
    employees: 25,
    founded: '2018-01-01',
    description: 'Éditeur de logiciels SaaS pour la gestion d\'entreprise',
    financial_health: 'good',
    market_position: 'niche',
    created_at: '2025-01-25T09:00:00Z'
  },
  {
    id: 'target-2',
    name: 'GreenEnergy Corp',
    sector: 'Énergie',
    location: 'Occitanie',
    revenue: 8000000,
    ebitda: 1200000,
    employees: 45,
    founded: '2015-06-01',
    description: 'Installateur de panneaux solaires et solutions énergétiques',
    financial_health: 'excellent',
    market_position: 'challenger',
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 'target-3',
    name: 'BioFood Industries',
    sector: 'Agroalimentaire',
    location: 'Nouvelle-Aquitaine',
    revenue: 15000000,
    ebitda: 1800000,
    employees: 120,
    founded: '2010-03-01',
    description: 'Production de produits bio et transformation alimentaire',
    financial_health: 'good',
    market_position: 'leader',
    created_at: '2025-02-15T14:00:00Z'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    target_id: 'target-1',
    perimeter: 75,
    context: 'Acquisition stratégique pour expansion européenne',
    asking_price: 6000000,
    timeline: 'Moyen (6-12 mois)',
    status: 'Qualifié',
    created_at: '2025-01-25T09:00:00Z'
  },
  {
    id: 'deal-2',
    target_id: 'target-2',
    perimeter: 100,
    context: 'Acquisition complète pour diversification portefeuille',
    asking_price: 12000000,
    timeline: 'Long (> 12 mois)',
    status: 'En cours',
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 'deal-3',
    target_id: 'target-3',
    perimeter: 60,
    context: 'Acquisition majoritaire pour synergies opérationnelles',
    asking_price: 20000000,
    timeline: 'Urgent (< 6 mois)',
    status: 'Qualifié',
    created_at: '2025-02-15T14:00:00Z'
  }
];

export const mockDealModules: DealModule[] = [
  // Deal 1 - TechSoft
  {
    id: 'module-1-1',
    deal_id: 'deal-1',
    code: 'M1',
    title: 'Qualification et Acceptation',
    description: 'Être accepté comme acheteur crédible',
    state: 'done',
    progress: 100,
    created_at: '2025-01-30T16:00:00Z'
  },
  {
    id: 'module-1-2',
    deal_id: 'deal-1',
    code: 'M2',
    title: 'LOI et Négociation des termes',
    description: 'Cadrer la valuation et les termes',
    state: 'in_progress',
    progress: 60,
    created_at: '2025-02-05T10:00:00Z'
  },
  {
    id: 'module-1-3',
    deal_id: 'deal-1',
    code: 'M3',
    title: 'Due Diligence',
    description: 'Piloter les DD et transformer en leviers',
    state: 'locked',
    progress: 0,
    created_at: '2025-01-25T09:00:00Z'
  },
  {
    id: 'module-1-4',
    deal_id: 'deal-1',
    code: 'M4',
    title: 'Négociation finale et Closing',
    description: 'Boucler les points critiques et organiser le closing',
    state: 'locked',
    progress: 0,
    created_at: '2025-01-25T09:00:00Z'
  },
  
  // Deal 2 - GreenEnergy
  {
    id: 'module-2-1',
    deal_id: 'deal-2',
    code: 'M1',
    title: 'Qualification et Acceptation',
    description: 'Être accepté comme acheteur crédible',
    state: 'in_progress',
    progress: 40,
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 'module-2-2',
    deal_id: 'deal-2',
    code: 'M2',
    title: 'LOI et Négociation des termes',
    description: 'Cadrer la valuation et les termes',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 'module-2-3',
    deal_id: 'deal-2',
    code: 'M3',
    title: 'Due Diligence',
    description: 'Piloter les DD et transformer en leviers',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-01T11:00:00Z'
  },
  {
    id: 'module-2-4',
    deal_id: 'deal-2',
    code: 'M4',
    title: 'Négociation finale et Closing',
    description: 'Boucler les points critiques et organiser le closing',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-01T11:00:00Z'
  },
  
  // Deal 3 - BioFood
  {
    id: 'module-3-1',
    deal_id: 'deal-3',
    code: 'M1',
    title: 'Qualification et Acceptation',
    description: 'Être accepté comme acheteur crédible',
    state: 'in_progress',
    progress: 75,
    created_at: '2025-02-15T14:00:00Z'
  },
  {
    id: 'module-3-2',
    deal_id: 'deal-3',
    code: 'M2',
    title: 'LOI et Négociation des termes',
    description: 'Cadrer la valuation et les termes',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-15T14:00:00Z'
  },
  {
    id: 'module-3-3',
    deal_id: 'deal-3',
    code: 'M3',
    title: 'Due Diligence',
    description: 'Piloter les DD et transformer en leviers',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-15T14:00:00Z'
  },
  {
    id: 'module-3-4',
    deal_id: 'deal-3',
    code: 'M4',
    title: 'Négociation finale et Closing',
    description: 'Boucler les points critiques et organiser le closing',
    state: 'locked',
    progress: 0,
    created_at: '2025-02-15T14:00:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    deal_module_id: 'module-1-1',
    role: 'assistant',
    content: 'Bienvenue dans le module M1 ! Je vais vous aider à être accepté comme acheteur crédible pour TechSoft Solutions.',
    metadata: { action: 'welcome' },
    created_at: '2025-01-30T16:00:00Z'
  },
  {
    id: 'msg-2',
    deal_module_id: 'module-1-1',
    role: 'user',
    content: 'Comment structurer mon pitch de présentation ?',
    metadata: {},
    created_at: '2025-01-30T16:05:00Z'
  },
  {
    id: 'msg-3',
    deal_module_id: 'module-1-1',
    role: 'assistant',
    content: 'Voici la structure recommandée pour votre pitch :\n\n1. **Introduction** : Présentation de votre expertise tech et réseau européen\n2. **Vision stratégique** : Comment TechSoft s\'intègre dans votre expansion\n3. **Valeur ajoutée** : Ressources et synergies que vous apportez\n4. **Approche** : Respect de l\'équipe et continuité opérationnelle\n5. **Financement** : Confirmation de vos capacités',
    metadata: { action: 'generate_pitch' },
    created_at: '2025-01-30T16:06:00Z'
  }
];

export const mockArtifacts: Artifact[] = [
  {
    id: 'art-1',
    deal_module_id: 'module-1-1',
    type: 'template',
    title: 'Structure de pitch - M1',
    content: {
      sections: [
        'Introduction et expertise tech',
        'Vision stratégique européenne',
        'Valeur ajoutée et synergies',
        'Approche et respect de l\'équipe',
        'Financement confirmé'
      ]
    },
    created_at: '2025-01-30T16:06:00Z'
  },
  {
    id: 'art-2',
    deal_module_id: 'module-1-2',
    type: 'document',
    title: 'Draft LOI - M2',
    content: {
      sections: [
        'Prix et structure (6M€, 75%)',
        'Conditions suspensives',
        'Garanties et engagements',
        'Calendrier et closing'
      ]
    },
    created_at: '2025-02-05T10:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    deal_module_id: 'module-1-1',
    title: 'Analyser le profil de TechSoft',
    description: 'Étudier le secteur tech, la taille et la position marché',
    status: 'completed',
    priority: 'high',
    created_at: '2025-01-30T16:00:00Z'
  },
  {
    id: 'task-2',
    deal_module_id: 'module-1-1',
    title: 'Préparer le pitch de présentation',
    description: 'Structurer l\'argumentaire de crédibilité',
    status: 'completed',
    priority: 'high',
    created_at: '2025-01-30T16:00:00Z'
  },
  {
    id: 'task-3',
    deal_module_id: 'module-1-2',
    title: 'Analyser la valuation demandée',
    description: 'Comparer 6M€ avec les multiples sectoriels tech',
    status: 'in_progress',
    priority: 'high',
    created_at: '2025-02-05T10:00:00Z'
  }
];
