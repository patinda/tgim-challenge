import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building2, TrendingUp, MapPin, Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DealSubmission } from '../../deals/types';
import { Target, Deal, DealModule } from '../types';
import { RealDataTransformer } from '../services/real-data-transformer';

interface ImportDealsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealsImported: (targets: Target[], deals: Deal[], modules: DealModule[]) => void;
}

export function ImportDealsDialog({ open, onOpenChange, onDealsImported }: ImportDealsDialogProps) {
  const [dealSubmissions, setDealSubmissions] = useState<DealSubmission[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealSubmission[]>([]);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Récupérer les deals depuis Supabase
  useEffect(() => {
    if (open) {
      fetchDealSubmissions();
    }
  }, [open]);

  const fetchDealSubmissions = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les deals soumis
      const { data, error } = await supabase
        .from('deal_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Erreur récupération deals:', error);
        return;
      }

      if (data) {
        setDealSubmissions(data);
        setFilteredDeals(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les deals selon la recherche et le statut
  useEffect(() => {
    let filtered = dealSubmissions;

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(deal => deal.internal_status === statusFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(deal => 
        deal.legal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.activity_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeals(filtered);
  }, [dealSubmissions, searchTerm, statusFilter]);

  const handleDealSelection = (dealId: string) => {
    setSelectedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleImportSelected = () => {
    const selectedDealSubmissions = dealSubmissions.filter(deal => selectedDeals.includes(deal.id));
    
    // Transformer les deals en cibles et deals M&A
    const targets: Target[] = [];
    const deals: Deal[] = [];
    const modules: DealModule[] = [];

    selectedDealSubmissions.forEach(dealSubmission => {
      try {
        // Créer la cible
        const target = RealDataTransformer.transformToTarget(dealSubmission);
        targets.push(target);

        // Créer le deal
        const deal = RealDataTransformer.transformToDeal(dealSubmission);
        deals.push(deal);

        // Créer les modules
        const dealModules = RealDataTransformer.createModulesForDeal(deal.id);
        modules.push(...dealModules);

        console.log(`✅ Deal importé: ${target.name} (${target.sector})`);
      } catch (error) {
        console.error(`❌ Erreur import deal ${dealSubmission.id}:`, error);
      }
    });

    // Passer les données transformées au composant parent
    onDealsImported(targets, deals, modules);
    onOpenChange(false);
    
    // Reset
    setSelectedDeals([]);
    setSearchTerm('');
    setStatusFilter('all');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified': return <Badge variant="default">Qualifié</Badge>;
      case 'in_review': return <Badge variant="secondary">En cours</Badge>;
      case 'new': return <Badge variant="outline">Nouveau</Badge>;
      case 'dropped': return <Badge variant="destructive">Abandonné</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Importer des deals existants</DialogTitle>
          <DialogDescription>
            Sélectionnez les deals que vous souhaitez transformer en simulations M&A
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtres et recherche */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, secteur, localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="qualified">Qualifiés</SelectItem>
                  <SelectItem value="in_review">En cours</SelectItem>
                  <SelectItem value="new">Nouveaux</SelectItem>
                  <SelectItem value="dropped">Abandonnés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Liste des deals */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun deal trouvé
              </div>
            ) : (
              filteredDeals.map((deal) => (
                <Card 
                  key={deal.id} 
                  className={`cursor-pointer transition-all ${
                    selectedDeals.includes(deal.id) 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleDealSelection(deal.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-medium">{deal.legal_name || 'Nom non spécifié'}</h3>
                          {getStatusBadge(deal.internal_status || 'new')}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {deal.region || 'Localisation non spécifiée'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {deal.employees_fte || 0} employés
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(deal.turnover_yr_n)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(deal.submitted_at || '').toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {deal.activity_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {deal.activity_description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedDeals.includes(deal.id) && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedDeals.length} deal(s) sélectionné(s)
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleImportSelected}
                disabled={selectedDeals.length === 0}
              >
                Importer {selectedDeals.length} deal(s)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
