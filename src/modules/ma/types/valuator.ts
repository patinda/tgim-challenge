// Types partagés pour TGIM Valuator

export interface ValuatorInputs {
  ca: string;
  ca_n1: string;
  ca_n2: string;
  ebitda: string;
  debt: string;
  treasury: string;
  growth: string;
  sector: string;
  country: string;
  employees: string;
  barriers: string;
  clients: string;
  digital: string;
  brand: string;
  comment: string;
}

export interface ValuationResult {
  minValuation: number;
  maxValuation: number;
  riskScore: number;
  report: string;
}