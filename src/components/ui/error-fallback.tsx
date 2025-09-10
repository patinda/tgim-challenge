import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ExternalLink,
  Bug,
  Copy
} from 'lucide-react';
import { useUser } from '@/modules/user/hooks/useUser';
import { toast } from 'sonner';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
  componentName?: string;
  showDetails?: boolean;
}

export function ErrorFallback({ 
  error, 
  resetErrorBoundary, 
  componentName = 'Composant',
  showDetails = false 
}: ErrorFallbackProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';

  const copyErrorDetails = () => {
    const errorReport = `=== ERREUR COMPOSANT ${componentName} ===
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

ERREUR:
${error.name}: ${error.message}
Stack: ${error.stack}

=== FIN DU RAPPORT ===`;

    navigator.clipboard.writeText(errorReport).then(() => {
      toast.success('Détails de l\'erreur copiés');
    }).catch(() => {
      toast.error('Impossible de copier les détails');
    });
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="p-6 bg-gradient-to-b from-red-50 to-red-100 rounded-lg border border-red-200">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Erreur dans {componentName}
        </h2>
        <p className="text-red-600">
          {isAdmin ? 'Erreur technique détectée' : 'Une erreur s\'est produite'}
        </p>
      </div>

      {/* Actions de récupération */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />
            Actions de récupération
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {resetErrorBoundary && (
              <Button onClick={resetErrorBoundary} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-1" />
                Réessayer
              </Button>
            )}
            <Button onClick={reloadPage} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-1" />
              Recharger
            </Button>
            <Button onClick={goHome} size="sm" variant="outline">
              <Home className="w-4 h-4 mr-1" />
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Détails pour les admins */}
      {isAdmin && showDetails && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bug className="w-4 h-4" />
              Détails techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                <strong>{error.name}:</strong> {error.message}
                {error.stack && `\n\nStack:\n${error.stack}`}
              </pre>
            </div>
            <Button onClick={copyErrorDetails} size="sm" className="w-full">
              <Copy className="w-4 h-4 mr-1" />
              Copier les détails
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Message pour les membres */}
      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Besoin d'aide ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Si le problème persiste, contactez le support technique.
            </p>
            <Button 
              onClick={() => {
                const mailtoLink = `mailto:quentin@tgimcap.com?subject=Erreur composant ${componentName}&body=Bonjour,%0D%0A%0D%0AJ'ai rencontré une erreur dans le composant ${componentName} sur la page: ${window.location.href}%0D%0A%0D%0APouvez-vous m'aider ?%0D%0A%0D%0AMerci.`;
                window.location.href = mailtoLink;
              }}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
