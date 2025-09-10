import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, CheckSquare, BarChart3, FileImage } from 'lucide-react';
import { DealModule, Artifact } from '../types';

interface ModuleArtifactsProps {
  module: DealModule;
  artifacts: Artifact[];
}

export function ModuleArtifacts({ module, artifacts }: ModuleArtifactsProps) {
  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'template':
        return <FileText className="h-5 w-5" />;
      case 'checklist':
        return <CheckSquare className="h-5 w-5" />;
      case 'matrix':
        return <BarChart3 className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'plan':
        return <FileImage className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getArtifactTypeLabel = (type: string) => {
    switch (type) {
      case 'template':
        return 'Template';
      case 'checklist':
        return 'Checklist';
      case 'matrix':
        return 'Matrice';
      case 'document':
        return 'Document';
      case 'plan':
        return 'Plan';
      default:
        return type;
    }
  };

  const getArtifactColor = (type: string) => {
    switch (type) {
      case 'template':
        return 'bg-blue-100 text-blue-800';
      case 'checklist':
        return 'bg-green-100 text-green-800';
      case 'matrix':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-orange-100 text-orange-800';
      case 'plan':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (artifact: Artifact) => {
    // TODO: Implement download logic
    console.log('Downloading artifact:', artifact.title);
  };

  const handleView = (artifact: Artifact) => {
    // TODO: Implement view logic
    console.log('Viewing artifact:', artifact.title);
  };

  if (artifacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="font-medium">Aucun livrable créé</p>
        <p className="text-sm">Les livrables apparaîtront ici au fur et à mesure de votre progression</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Livrables du module {module.code}</h3>
          <p className="text-sm text-muted-foreground">
            {artifacts.length} livrable{artifacts.length > 1 ? 's' : ''} créé{artifacts.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exporter tous
        </Button>
      </div>

      {/* Grille des livrables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artifacts.map((artifact) => (
          <Card key={artifact.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getArtifactColor(artifact.type)}`}>
                    {getArtifactIcon(artifact.type)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {artifact.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {getArtifactTypeLabel(artifact.type)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Contenu du livrable */}
              <div className="space-y-3">
                {artifact.type === 'checklist' && artifact.content.items && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Éléments :</p>
                    <div className="space-y-1">
                      {artifact.content.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {artifact.content.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{artifact.content.items.length - 3} autres éléments
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {artifact.type === 'template' && artifact.content.sections && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Sections :</p>
                    <div className="space-y-1">
                      {artifact.content.sections.slice(0, 3).map((section, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                          <span className="line-clamp-1">{section}</span>
                        </div>
                      ))}
                      {artifact.content.sections.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{artifact.content.sections.length - 3} autres sections
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {artifact.type === 'document' && artifact.content.sections && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Contenu :</p>
                    <div className="space-y-1">
                      {artifact.content.sections.slice(0, 3).map((section, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                          <span className="line-clamp-1">{section}</span>
                        </div>
                      ))}
                      {artifact.content.sections.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{artifact.content.sections.length - 3} autres sections
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Date de création */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Créé le {formatDate(artifact.created_at)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleView(artifact)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleDownload(artifact)}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition par type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['template', 'checklist', 'matrix', 'document', 'plan'].map((type) => {
              const count = artifacts.filter(a => a.type === type).length;
              return (
                <div key={type} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-lg ${getArtifactColor(type)} flex items-center justify-center mb-2`}>
                    {getArtifactIcon(type)}
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {getArtifactTypeLabel(type)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
