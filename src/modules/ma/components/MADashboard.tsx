import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Target, TrendingUp, Clock, CheckCircle, Lock, Building2, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useMAData } from '../hooks/useMAData';
import { Target as TargetType, Deal, DealModule } from '../types';
import { CreateTargetDialog } from './CreateTargetDialog';
import { ImportDealsDialog } from './ImportDealsDialog';
import { DealCard } from './DealCard';
import { TargetCard } from './TargetCard';
import { AIConfigDialog } from './AIConfigDialog';

export function MADashboard() {
  const { targets, deals, dealModules, loading, importDeals } = useMAData();
  const navigate = useNavigate();
  const [showCreateTarget, setShowCreateTarget] = useState(false);
  const [showImportDeals, setShowImportDeals] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<TargetType | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // MODIFICATION : Seulement les deals qualifiés
  const qualifiedDeals = deals.filter(d => d.status === 'Qualifié');
  const activeDeals = qualifiedDeals.filter(d => d.status === 'Qualifié' && d.status !== 'Fermé');
  const completedDeals = deals.filter(d => d.status === 'Fermé');

  const getModuleStatus = (dealId: string) => {
    const modules = dealModules.filter(dm => dm.deal_id === dealId);
    const completed = modules.filter(dm => dm.state === 'done').length;
    const total = modules.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const getDealsByTarget = (targetId: string) => {
    return deals.filter(d => d.target_id === targetId);
  };

  const handleDealsImported = (newTargets: TargetType[], newDeals: Deal[], newModules: DealModule[]) => {
    // Utiliser la nouvelle méthode d'import
    importDeals(newTargets, newDeals, newModules);
    setShowImportDeals(false);
    
    // Afficher un message de succès
    toast.success(`${newTargets.length} deal(s) importé(s) avec succès !`);
    console.log(`✅ ${newTargets.length} deal(s) importé(s) avec succès !`);
  };

  const handleContinueDeal = (dealId: string) => {
    navigate(`/negotiator/deals/${dealId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TGIM Negotiator</h1>
          <p className="text-muted-foreground">
            Gestion des deals qualifiés et négociation M&A
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateTarget(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle cible
          </Button>
          <Button onClick={() => setShowImportDeals(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Importer deals qualifiés
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cibles actives</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targets.length}</div>
            <p className="text-xs text-muted-foreground">
              {targets.filter(t => getDealsByTarget(t.id).length > 0).length} avec deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals qualifiés</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeDeals.length} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules complétés</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealModules.filter(dm => dm.state === 'done').length}
            </div>
            <p className="text-xs text-muted-foreground">
              sur {dealModules.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals clos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeals.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedDeals.length > 0 ? 'Succès' : 'Aucun'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="deals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deals">Deals qualifiés</TabsTrigger>
          <TabsTrigger value="targets">Cibles</TabsTrigger>
        </TabsList>

        <TabsContent value="deals" className="space-y-4">
          {qualifiedDeals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun deal qualifié</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Importez des deals qualifiés depuis le pipeline ou créez de nouvelles cibles
                </p>
                <Button onClick={() => setShowImportDeals(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Importer des deals qualifiés
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {qualifiedDeals.map((deal) => {
                const target = targets.find(t => t.id === deal.target_id);
                if (!target) return null;
                
                return (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    target={target}
                    onContinue={handleContinueDeal}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          {targets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune cible</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Créez votre première cible pour commencer
                </p>
                <Button onClick={() => setShowCreateTarget(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle cible
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {targets.map((target) => (
                <TargetCard key={target.id} target={target} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateTargetDialog
        open={showCreateTarget}
        onOpenChange={setShowCreateTarget}
        onTargetCreated={(target) => {
          console.log('Nouvelle cible créée:', target);
          setShowCreateTarget(false);
        }}
      />

      <ImportDealsDialog
        open={showImportDeals}
        onOpenChange={setShowImportDeals}
        onDealsImported={handleDealsImported}
      />

      <AIConfigDialog />
    </div>
  );
}
