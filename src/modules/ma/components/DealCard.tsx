import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, MapPin, Users, DollarSign } from 'lucide-react';
import { Deal, Target } from '../types';

interface DealCardProps {
  deal: Deal;
  target: Target;
  onContinue: (dealId: string) => void;
}

export function DealCard({ deal, target, onContinue }: DealCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Qualifié': return <Badge variant="default">Qualifié</Badge>;
      case 'En cours': return <Badge variant="secondary">En cours</Badge>;
      case 'Nouveau': return <Badge variant="outline">Nouveau</Badge>;
      case 'Fermé': return <Badge variant="destructive">Fermé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Section gauche - Informations principales */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                {target.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3" />
                {target.sector} • {target.location}
              </CardDescription>
            </div>
            {getStatusBadge(deal.status)}
          </div>

          {/* Informations financières */}
          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div className="text-center">
              <div className="font-semibold text-lg">{formatCurrency(target.revenue)}</div>
              <div className="text-xs text-muted-foreground">CA</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{formatCurrency(target.ebitda)}</div>
              <div className="text-xs text-muted-foreground">EBITDA</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{target.employees}</div>
              <div className="text-xs text-muted-foreground">Employés</div>
            </div>
          </div>

          {/* Contexte */}
          {deal.context && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded mb-4">
              {deal.context}
            </div>
          )}
        </div>

        {/* Section droite - Détails du deal */}
        <div className="w-80 p-6 border-l border-border">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Périmètre :</span>
              <span className="font-medium">{deal.perimeter}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Prix demandé :</span>
              <span className="font-medium">{formatCurrency(deal.asking_price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Timeline :</span>
              <span className="font-medium">{deal.timeline}</span>
            </div>
          </div>

          {/* Action */}
          <Button 
            onClick={() => onContinue(deal.id)} 
            className="w-full mt-6"
            size="sm"
          >
            Continuer
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
