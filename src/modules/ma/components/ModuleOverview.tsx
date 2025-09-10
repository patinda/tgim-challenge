import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DealModule, Target, Deal } from '../types';

interface ModuleOverviewProps {
  module: DealModule;
  target: Target;
  deal: Deal;
}

export function ModuleOverview({ module, target, deal }: ModuleOverviewProps) {
  const getModuleSpecificInfo = (code: string) => {
    switch (code) {
      case 'M1':
        return {
          objectives: [
            'Être accepté comme acheteur crédible',
            'Démontrer la valeur ajoutée',
            'Établir la confiance'
          ],
          keyMetrics: [
            'Score de crédibilité',
            'Qualité du pitch',
            'Engagement du vendeur'
          ],
          deliverables: [
            'Pitch profil validé',
            'Templates de communication',
            'Score de readiness'
          ]
        };
      case 'M2':
        return {
          objectives: [
            'Cadrer la valuation',
            'Négocier les termes',
            'Préparer la LOI'
          ],
          keyMetrics: [
            'Prix négocié',
            'Conditions acceptées',
            'Timeline validé'
          ],
          deliverables: [
            'Draft LOI',
            'Term sheet',
            'Matrice Give/Get'
          ]
        };
      case 'M3':
        return {
          objectives: [
            'Conduire les DD',
            'Identifier les points durs',
            'Transformer en leviers'
          ],
          keyMetrics: [
            'Progression DD',
            'Points durs identifiés',
            'Ajustements obtenus'
          ],
          deliverables: [
            'Issue log priorisé',
            'Demande d\'ajustement',
            'Plan d\'actions'
          ]
        };
      case 'M4':
        return {
          objectives: [
            'Boucler les points critiques',
            'Organiser le closing',
            'Finaliser la transaction'
          ],
          keyMetrics: [
            'Points arbitrés',
            'Checklist complétée',
            'Closing réalisé'
          ],
          deliverables: [
            'Liste des points à arbitrer',
            'Checklist de closing',
            'Récap deal'
          ]
        };
      default:
        return { objectives: [], keyMetrics: [], deliverables: [] };
    }
  };

  const info = getModuleSpecificInfo(module.code);

  // Vérification de sécurité
  if (!info || !info.deliverables || !Array.isArray(info.deliverables)) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Informations du module non disponibles
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statut du module */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Statut du module {module.code}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-2xl font-bold">{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {module.state === 'done' ? '100%' : module.state === 'in_progress' ? '60%' : '0%'}
              </div>
              <div className="text-xs text-muted-foreground">Complétion</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {module.state === 'done' ? 'Terminé' : module.state === 'in_progress' ? 'En cours' : 'Verrouillé'}
              </div>
              <div className="text-xs text-muted-foreground">Statut</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {module.state === 'locked' ? '1' : '0'}
              </div>
              <div className="text-xs text-muted-foreground">Prérequis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectifs */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs du module</CardTitle>
          <CardDescription>
            Ce que nous devons accomplir dans cette étape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {info.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{objective}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques clés */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques clés</CardTitle>
          <CardDescription>
            Indicateurs de progression et de succès
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {info.keyMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm font-medium">{metric}</span>
                <Badge variant="outline">À mesurer</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Livrables attendus */}
      <Card>
        <CardHeader>
          <CardTitle>Livrables attendus</CardTitle>
          <CardDescription>
            Documents et outputs à produire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {info.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="text-sm">{deliverable}</span>
                <Badge variant="outline">À créer</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contexte du deal */}
      <Card>
        <CardHeader>
          <CardTitle>Contexte du deal</CardTitle>
          <CardDescription>
            Informations sur la cible et le contexte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Cible :</span>
              <p className="font-medium">{target.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Secteur :</span>
              <p className="font-medium">{target.sector}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Périmètre :</span>
              <p className="font-medium">
                {deal.perimeter === '100' ? '100%' : deal.perimeter}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Contexte :</span>
              <p className="font-medium">{deal.context}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
