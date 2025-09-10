// Types pour le TGIM Negotiator basés sur le schéma Supabase

export interface Negotiation {
  id: string;
  user_id: string;
  created_at: string;
  scenario: string;
  context: NegotiationContext;
  messages: NegotiationMessage[];
  summary?: string;
  score?: number;
}

export interface NegotiationContext {
  deal_id?: string;
  target_id?: string;
  target_name?: string;
  sector?: string;
  valuation?: number;
  asking_price?: number;
  negotiation_type: 'acquisition' | 'partnership' | 'investment' | 'joint_venture';
  stage: 'initial' | 'valuation' | 'due_diligence' | 'final_terms' | 'closing';
  user_role: 'buyer' | 'seller' | 'advisor';
  counterpart_role: 'buyer' | 'seller' | 'advisor';
  key_issues: string[];
  constraints: {
    budget_limit?: number;
    timeline?: string;
    must_haves: string[];
    nice_to_haves: string[];
  };
  market_data?: {
    comparable_deals: Array<{
      company: string;
      sector: string;
      valuation: number;
      multiple: number;
      date: string;
    }>;
    market_trends: string[];
  };
}

export interface NegotiationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    strategy?: string;
    confidence?: number;
    suggested_actions?: string[];
    risk_level?: 'low' | 'medium' | 'high';
    emotional_tone?: 'professional' | 'friendly' | 'firm' | 'collaborative';
  };
}

export interface NegotiationStrategy {
  id: string;
  name: string;
  description: string;
  applicable_stages: NegotiationContext['stage'][];
  tactics: NegotiationTactic[];
  success_metrics: string[];
}

export interface NegotiationTactic {
  id: string;
  name: string;
  description: string;
  when_to_use: string;
  example_phrases: string[];
  risks: string[];
  alternatives: string[];
}

export interface NegotiationSession {
  id: string;
  negotiation_id: string;
  started_at: string;
  ended_at?: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  current_stage: NegotiationContext['stage'];
  progress: {
    stage_completion: Record<NegotiationContext['stage'], number>;
    key_issues_resolved: number;
    total_issues: number;
  };
  ai_insights: {
    counterpart_behavior: string;
    negotiation_dynamics: string;
    recommended_next_steps: string[];
    risk_assessment: string;
  };
}

export interface NegotiationTemplate {
  id: string;
  name: string;
  description: string;
  scenario: string;
  context_template: Partial<NegotiationContext>;
  initial_messages: string[];
  success_criteria: string[];
  common_challenges: string[];
  best_practices: string[];
}

export interface NegotiationAnalytics {
  negotiation_id: string;
  total_messages: number;
  user_messages: number;
  ai_messages: number;
  session_duration: number; // en minutes
  stage_transitions: Array<{
    from: NegotiationContext['stage'];
    to: NegotiationContext['stage'];
    timestamp: string;
    trigger: string;
  }>;
  key_moments: Array<{
    timestamp: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    type: 'breakthrough' | 'setback' | 'strategy_change' | 'deadlock';
  }>;
  sentiment_analysis: {
    user_sentiment: 'positive' | 'neutral' | 'negative';
    counterpart_sentiment: 'positive' | 'neutral' | 'negative';
    overall_tone: 'collaborative' | 'competitive' | 'defensive' | 'aggressive';
  };
  outcome_prediction: {
    probability_of_success: number;
    estimated_timeline: string;
    key_risks: string[];
    recommended_actions: string[];
  };
}

// Types pour les réponses de l'IA
export interface AIResponse {
  message: string;
  strategy: string;
  confidence: number;
  suggested_actions: string[];
  risk_assessment: string;
  next_steps: string[];
  emotional_guidance: string;
}

export interface NegotiationInsight {
  type: 'opportunity' | 'risk' | 'strategy' | 'timing';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  related_messages: string[];
}

// Types pour les templates de négociation
export interface NegotiationScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: string;
  learning_objectives: string[];
  context: Partial<NegotiationContext>;
  initial_situation: string;
  expected_outcomes: string[];
  debrief_questions: string[];
}

// Types pour les statistiques et rapports
export interface NegotiationStats {
  total_negotiations: number;
  successful_negotiations: number;
  average_duration: number;
  most_used_strategies: Array<{
    strategy: string;
    count: number;
    success_rate: number;
  }>;
  improvement_areas: string[];
  strengths: string[];
  recent_trends: Array<{
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }>;
}

