import React, { useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import ValuationHistoryChart from './ValuationHistoryChart';
import RiskScoreGauge from './RiskScoreGauge';

interface Eval {
  id: string;
  created_at: string;
  company_name: string;
  min_valuation: number;
  max_valuation: number;
  risk_score: number;
  report: string;
}


interface Props {
  history: Eval[];
  loading?: boolean;
  companyName?: string;
}

export const ValuationHistoryDashboard: React.FC<Props> = ({ history, loading, companyName }) => {
  // Liste toutes les sociétés distinctes avec leurs noms d'affichage (mémorisé)
  const companyMap = useMemo(() => {
    const map = new Map();
    history.forEach(item => {
      if (item.company_name && item.company_name.trim()) {
        const normalized = item.company_name.trim().toLowerCase();
        map.set(normalized, item.company_name);
      }
    });
    return map;
  }, [history]);
  
  const companies = Array.from(companyMap.keys());

  const [selectedCompany, setSelectedCompany] = React.useState<string>('');
  
  const filteredHistory = useMemo(() => {
    if (!selectedCompany) return [];
    const filtered = history.filter(item => 
      item.company_name && 
      item.company_name.trim().toLowerCase() === selectedCompany
    );
    return filtered;
  }, [selectedCompany, history]);

  // Gestion de la sélection d'entreprise - FORCER la mise à jour
  React.useEffect(() => {
    console.log('Dashboard useEffect triggered:', { companyName, companies, selectedCompany });
    
    // Priorité 1: Si on a un companyName du formulaire, l'utiliser
    if (companyName && companyName.trim()) {
      const normalized = companyName.trim().toLowerCase();
      console.log('Trying to set company:', normalized, 'Available:', companies);
      if (companies.includes(normalized)) {
        console.log('Setting selectedCompany to:', normalized);
        setSelectedCompany(normalized);
        return;
      }
    }
    
    // Priorité 2: Si pas de sélection et qu'on a des sociétés, prendre la première
    if (companies.length > 0 && !selectedCompany) {
      console.log('Setting to first company:', companies[0]);
      setSelectedCompany(companies[0]);
    }
  }, [companyName, companies.length, history.length]); // Retirer selectedCompany des deps pour éviter les boucles

  // Pour récupérer le nom formaté pour affichage
  const displayName = companyMap.get(selectedCompany) || '';

  return (
    <section className="flex flex-col md:flex-row gap-8 w-full mt-8">
      <div className="flex-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base mb-4">
              📊 Historique des analyses
            </CardTitle>
            {history.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {history.length} analyse{history.length > 1 ? 's' : ''} disponible{history.length > 1 ? 's' : ''}
              </div>
            )}
            <Select
              value={selectedCompany}
              onValueChange={setSelectedCompany}
              disabled={loading || companies.length < 1}
            >
              <SelectTrigger>
                <SelectValue placeholder={companies.length < 1 ? "Aucune société disponible" : `Sélectionner une société (${companies.length} disponible${companies.length > 1 ? 's' : ''})`}/>
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>{companyMap.get(company)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {selectedCompany && filteredHistory.length > 0 ? (
              <ValuationHistoryChart data={filteredHistory.map(item => ({ date: item.created_at, min: item.min_valuation, max: item.max_valuation }))} />
            ) : (
              <div className="text-sm text-muted-foreground py-8">Aucune donnée à afficher.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 flex flex-col gap-6 min-w-[250px] md:max-w-[410px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score de risque (dernier)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[190px]">
            {selectedCompany && filteredHistory.length > 0 ? (
              <RiskScoreGauge score={filteredHistory[filteredHistory.length - 1]?.risk_score ?? 0} />
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dernière évaluation IA</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCompany && filteredHistory.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <span>🕒</span>
                  <span>Dernière analyse : {new Date(filteredHistory[filteredHistory.length - 1].created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-blue-50 p-3 rounded border">
                    <div className="text-sm font-medium text-blue-700">Fourchette de valeur</div>
                    <div className="text-lg font-bold text-blue-800">
                      {filteredHistory[filteredHistory.length - 1].min_valuation.toLocaleString()} € – {filteredHistory[filteredHistory.length - 1].max_valuation.toLocaleString()} €
                    </div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded border">
                    <div className="text-sm font-medium text-orange-700">Score de risque</div>
                    <div className="text-lg font-bold text-orange-800">
                      {filteredHistory[filteredHistory.length - 1].risk_score} / 100
                    </div>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    📋 Voir le rapport détaillé
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded border text-sm text-gray-700 max-h-36 overflow-auto">
                    {filteredHistory[filteredHistory.length - 1].report}
                  </div>
                </details>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                Aucune évaluation récente pour cette société.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ValuationHistoryDashboard;
