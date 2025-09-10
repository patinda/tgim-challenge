export interface Target {
  id: string;
  name: string;
  sector: string;
  location: string;
  revenue: number;
  ebitda: number;
  employees: number;
  founded: string;
  description: string;
  financial_health?: 'excellent' | 'good' | 'average' | 'challenging';
  market_position?: 'leader' | 'challenger' | 'niche' | 'emerging';
  created_at: string;
}

export interface Deal {
  id: string;
  target_id: string;
  perimeter: number;
  context: string;
  asking_price: number;
  timeline: string;
  status: string;
  created_at: string;
}

export interface DealModule {
  id: string;
  deal_id: string;
  code: 'M1' | 'M2' | 'M3' | 'M4';
  title: string;
  description: string;
  state: 'locked' | 'in_progress' | 'done';
  progress: number;
  created_at: string;
}

export interface Message {
  id: string;
  deal_module_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Artifact {
  id: string;
  deal_module_id: string;
  type: 'checklist' | 'template' | 'matrix' | 'document' | 'plan';
  title: string;
  content: Record<string, any>;
  created_at: string;
}

export interface Task {
  id: string;
  deal_module_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string;
  created_at: string;
}

// Types spécifiques aux modules
export interface M1Context {
  credibility_score: number;
  pitch_profile: string;
  strategic_angle: string;
  funding_proof: string;
  agenda: string;
  contact_templates: {
    first_contact: string;
    follow_up: string;
  };
}

export interface M2Context {
  valuation: number;
  price_per_share: number;
  earn_out_terms: string;
  warranties: string[];
  timeline: string;
  term_sheet: string;
  concessions: string[];
  give_get_matrix: Record<string, any>;
}

export interface M3Context {
  dd_financial: boolean;
  dd_legal: boolean;
  dd_social: boolean;
  dd_it: boolean;
  issues: Array<{
    description: string;
    impact: 'low' | 'medium' | 'high';
    probability: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  renegotiation_strategy: string;
  price_adjustments: number;
}

export interface M4Context {
  final_points: Array<{
    description: string;
    position_a: string;
    position_b: string;
    compromise: string;
  }>;
  closing_checklist: string[];
  deal_summary: string;
  concessions_log: Array<{
    date: string;
    description: string;
    value: string;
  }>;
}



