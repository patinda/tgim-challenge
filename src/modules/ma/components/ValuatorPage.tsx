import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calculator, Sparkles, Info } from 'lucide-react';
import { valuateBusinessAI } from '../services/valuator-ai';
import type { ValuatorInputs, ValuationResult } from '../types/valuator';
import { supabase } from '@/lib/supabase';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import ValuationHistoryDashboard from './ValuationHistoryDashboard';
import { useToast } from '@/hooks/use-toast';
// plus besoin de combobox, Input simple

export function ValuatorPage() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<ValuatorInputs & { companyName: string }>({
    companyName: '',
    ca: '',
    ca_n1: '',
    ca_n2: '',
    ebitda: '',
    debt: '',
    treasury: '',
    growth: '',
    sector: '',
    country: '',
    employees: '',
    barriers: '',
    clients: '',
    digital: '',
    brand: '',
    comment: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // pour affichage dynamique

  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(false);
  const [lastAnalyzedCompany, setLastAnalyzedCompany] = useState<string>('');

  // Pour la sélection d'entreprise (distincte)
  const companies = Array.from(new Set(history.map(item => item.company_name).filter(Boolean)));
  const [selectedCompany, setSelectedCompany] = React.useState<string>(companies[0] || '');
  const filteredHistory = (selectedCompany && history.length > 0)
    ? history.filter(item => item.company_name === selectedCompany)
    : [];

  React.useEffect(() => {
    if (companies.length && !selectedCompany) {
      setSelectedCompany(companies[0]);
    }
  }, [companies.length, selectedCompany]);

  // Effet pour mettre à jour la sélection quand l'historique change
  React.useEffect(() => {
    if (history.length > 0 && inputs.companyName) {
      const companyExists = companies.includes(inputs.companyName.toLowerCase());
      if (companyExists && selectedCompany !== inputs.companyName.toLowerCase()) {
        setSelectedCompany(inputs.companyName.toLowerCase());
      }
    }
  }, [history, inputs.companyName, companies, selectedCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setInputs({ ...inputs, [name]: value });
  };

  // Charger l'historique à l'initialisation
  useEffect(() => {
    async function fetchHistory() {
      setLoadingHistory(true);
      setErrorHistory(false);
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) throw new Error('Utilisateur non authentifié');

        const { data, error } = await supabase
          .from('evaluations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        setHistory(data || []);
      } catch (e) {
        setErrorHistory(true);
      } finally {
        setLoadingHistory(false);
      }
    }
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await valuateBusinessAI(inputs);
      setResult(res);

      // Récupérer l'ID utilisateur avant l'insertion
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) throw new Error('Utilisateur non authentifié');

      // Sauvegarde dans Supabase
      const { data, error } = await supabase.from('evaluations').insert([{ 
        user_id: userId,
        created_at: new Date().toISOString(),
        company_name: inputs.companyName,
        input_data: { ...inputs },
        min_valuation: res.minValuation,
        max_valuation: res.maxValuation,
        risk_score: res.riskScore,
        report: res.report,
      }]);

      if (error) throw error;
      
      // Mettre à jour l'historique avec la nouvelle analyse
      const newEvaluation = {
        id: data?.[0]?.id,
        created_at: new Date().toISOString(),
        company_name: inputs.companyName,
        min_valuation: res.minValuation,
        max_valuation: res.maxValuation,
        risk_score: res.riskScore,
        report: res.report,
        input_data: { ...inputs }
      };
      
      setHistory(prev => [newEvaluation, ...prev]);
      
      // Sélectionner automatiquement la société qui vient d'être analysée
      setSelectedCompany(inputs.companyName.toLowerCase());
      setLastAnalyzedCompany(inputs.companyName);
      
      toast({
        title: "Analyse terminée",
        description: `Analyse réussie pour ${inputs.companyName}`,
        variant: "default"
      });
    } catch (err) {
      console.error("[ValuatorPage] ERREUR de sauvegarde ou IA:", err);
      setResult(null); // S'assurer qu'aucun résultat erroné n'est affiché
      toast({
        title: "❌ Erreur d'analyse",
        description: "L'analyse ou la sauvegarde a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const SECTORS = [
    "Services",
    "Industrie",
    "Tech",
    "Santé",
    "Distribution",
    "Construction",
    "Autre"
  ];

  const COUNTRIES = [
    "France",
    "Belgique",
    "Luxembourg",
    "Suisse",
    "Canada",
    "Autre"
  ];

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 max-w-4xl w-full">
        {/* Header/titre global */}
        <div className="flex items-center gap-2 mb-8">
          <Calculator className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">TGIM Valuator</h1>
          <Badge variant="secondary" className="ml-2">
            <Sparkles className="h-3 w-3 mr-1" />
            IA
          </Badge>
        </div>

        {/* ===== FORMULAIRE (TOP PRIORITAIRE, UNIQUE) ===== */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Nouvelle évaluation d'entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nom de la cible */}
              <div className="flex flex-col gap-1 mb-3">
                <label htmlFor="companyName" className="text-sm font-medium mb-1">
                  Nom de la société cible <span className="text-destructive">*</span>
                </label>
                <Input
                  id="companyName"
                  name="companyName"
                  required
                  value={inputs.companyName}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Ex : Dupont SAS, Happy Corp..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="ca" className="text-sm font-medium">Chiffre d'affaires</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" tabIndex={-1} style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}>
                          <Info className="w-4 h-4 cursor-pointer text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Le chiffre d'affaires correspond au total des ventes de biens ou de services de l'entreprise sur l'exercice.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="ca" name="ca" required value={inputs.ca} onChange={handleChange} type="number" placeholder="Ex : 1000000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="ca_n1" className="text-sm font-medium">Chiffre d'affaires N-1</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Chiffre d'affaires réalisé l'année précédente.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="ca_n1" name="ca_n1" value={inputs.ca_n1} onChange={handleChange} type="number" placeholder="Ex : 950000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="ca_n2" className="text-sm font-medium">Chiffre d'affaires N-2</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Chiffre d'affaires réalisé il y a deux ans.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="ca_n2" name="ca_n2" value={inputs.ca_n2} onChange={handleChange} type="number" placeholder="Ex : 900000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="ebitda" className="text-sm font-medium">EBITDA</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        EBITDA = Résultat opérationnel avant dépréciation, intérêts et impôts. Permet d'estimer la performance pure d'exploitation.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="ebitda" name="ebitda" required value={inputs.ebitda} onChange={handleChange} type="number" placeholder="Ex : 150000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="debt" className="text-sm font-medium">Dettes nettes</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Total des dettes de l'entreprise moins la trésorerie disponible.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="debt" name="debt" value={inputs.debt} onChange={handleChange} type="number" placeholder="Ex : 50000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="treasury" className="text-sm font-medium">Trésorerie</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Montant d'argent immédiatement disponible (en banque, caisse, placements liquides).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="treasury" name="treasury" value={inputs.treasury} onChange={handleChange} type="number" placeholder="Ex : 10000 €" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="growth" className="text-sm font-medium">Croissance prévue (%)</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Estimation du pourcentage de croissance du chiffre d'affaires sur l'année à venir.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="growth" name="growth" value={inputs.growth} onChange={handleChange} type="number" placeholder="Ex : 7 (%)" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor="employees" className="text-sm font-medium">Nombre d'employés</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span><Info className="w-4 h-4 cursor-pointer text-muted-foreground" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Effectif total de l'entreprise (salariés CDI/CDD en ETP).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input id="employees" name="employees" value={inputs.employees} onChange={handleChange} type="number" min={1} placeholder="Ex : 30 employés" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select onValueChange={val => handleSelect('sector', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Secteur d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map(sector => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={val => handleSelect('country', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(cty => (
                      <SelectItem key={cty} value={cty}>{cty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select onValueChange={val => handleSelect('barriers', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Barrières à l'entrée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="élevées">Élevées</SelectItem>
                    <SelectItem value="moyennes">Moyennes</SelectItem>
                    <SelectItem value="basses">Basses</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={val => handleSelect('clients', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Répartition clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peu dépendant">Peu dépendant</SelectItem>
                    <SelectItem value="dépendance moyenne">Dépendance moyenne</SelectItem>
                    <SelectItem value="très dépendant">Très dépendant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select onValueChange={val => handleSelect('digital', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Maturité digitale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="élevée">Élevée</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="faible">Faible</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={val => handleSelect('brand', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Notoriété/Marque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forte">Forte</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="faible">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea name="comment" placeholder="Commentaires/notions qualitatives complémentaires" value={inputs.comment} onChange={handleChange} />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyse en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Évaluer avec l'IA
                  </div>
                )}
              </Button>
            </form>

            {/* Affichage dynamique du dernier résultat juste en dessous du formulaire, version lisible et pédagogique */}
            {result && (
              <Card className="mb-8 border-green-600 shadow-lg animate-fade-in">
                <CardHeader className="bg-green-50">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Sparkles className="h-5 w-5" />
                    ✅ Analyse terminée avec succès pour « {inputs.companyName} »
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-700 font-medium mb-2">
                      📊 Résultats de l'évaluation :
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-600">Estimation de valeur</div>
                        <div className="text-lg font-bold text-green-700">
                          {result.minValuation.toLocaleString()} € — {result.maxValuation.toLocaleString()} €
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-600">Score de risque</div>
                        <div className="text-lg font-bold text-orange-600">
                          {result.riskScore}/100
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-base text-gray-800 bg-gray-50 p-3 rounded border">
                    <div className="font-medium text-gray-700 mb-2">📋 Rapport d'analyse :</div>
                    {result.report}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    💡 Les résultats sont automatiquement sauvegardés et disponibles dans l'historique ci-dessous.
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* ===== HISTORIQUE/RESULTATS (JAMAIS DE FORMULAIRE ICI) ===== */}
        {/* Synthèse société/graph pour le nom en cours de saisie */}
        <ValuationHistoryDashboard
          key={`dashboard-${history.length}-${lastAnalyzedCompany}`}
          companyName={lastAnalyzedCompany || inputs.companyName}
          history={history}
          loading={loadingHistory}
        />
      </div>
    </TooltipProvider>
  );
}