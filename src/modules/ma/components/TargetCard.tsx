import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Target } from '../types';

interface TargetCardProps {
  target: Target;
}

export function TargetCard({ target }: TargetCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getFinancialHealthBadge = (health?: string) => {
    if (!health) return null;
    
    switch (health) {
      case 'excellent': return <Badge variant="default">Excellent</Badge>;
      case 'good': return <Badge variant="secondary">Bon</Badge>;
      case 'average': return <Badge variant="outline">Moyen</Badge>;
      case 'challenging': return <Badge variant="destructive">Difficile</Badge>;
      default: return null;
    }
  };

  const getMarketPositionBadge = (position?: string) => {
    if (!position) return null;
    
    switch (position) {
      case 'leader': return <Badge variant="default">Leader</Badge>;
      case 'challenger': return <Badge variant="secondary">Challenger</Badge>;
      case 'niche': return <Badge variant="outline">Niche</Badge>;
      case 'emerging': return <Badge variant="secondary">Émergent</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
          <div className="flex flex-col gap-1">
            {getFinancialHealthBadge(target.financial_health)}
            {getMarketPositionBadge(target.market_position)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informations financières */}
        <div className="grid grid-cols-3 gap-4 text-sm">
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

        {/* Description */}
        {target.description && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
            {target.description}
          </div>
        )}

        {/* Métadonnées */}
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Fondée en {new Date(target.founded).getFullYear()}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {target.employees} ETP
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
