import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Bug, 
  Copy, 
  Home, 
  RefreshCw, 
  Code, 
  User, 
  ExternalLink,
  FileText
} from 'lucide-react';
import { useUser } from '@/modules/user/hooks/useUser';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  consoleLogs: string[];
  userAgent: string;
  timestamp: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    consoleLogs: [],
    userAgent: '',
    timestamp: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      consoleLogs: [],
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capturer les logs de la console
    const consoleLogs = this.captureConsoleLogs();
    
    this.setState({
      error,
      errorInfo,
      consoleLogs,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Log l'erreur pour le débogage
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private captureConsoleLogs(): string[] {
    const logs: string[] = [];
    
    // Capturer les erreurs récentes de la console
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`);
      originalError.apply(console, args);
    };
    
    console.warn = (...args) => {
      logs.push(`WARN: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`);
      originalWarn.apply(console, args);
    };
    
    console.log = (...args) => {
      logs.push(`LOG: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`);
      originalLog.apply(console, args);
    };

    // Restaurer après un court délai
    setTimeout(() => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    }, 100);

    return logs;
  }

  private copyErrorDetails = () => {
    const errorReport = this.generateErrorReport();
    navigator.clipboard.writeText(errorReport).then(() => {
      toast.success('Rapport d\'erreur copié dans le presse-papiers');
    }).catch(() => {
      toast.error('Impossible de copier le rapport d\'erreur');
    });
  };

  private generateErrorReport(): string {
    const { error, errorInfo, consoleLogs, userAgent, timestamp } = this.state;
    
    return `=== RAPPORT D'ERREUR TGIM ===
Timestamp: ${timestamp}
URL: ${window.location.href}
User Agent: ${userAgent}

ERREUR:
${error?.name}: ${error?.message}
Stack: ${error?.stack}

COMPOSANT:
${errorInfo?.componentStack}

LOGS CONSOLE:
${consoleLogs.join('\n')}

=== FIN DU RAPPORT ===`;
  }

  private reloadPage = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        consoleLogs={this.state.consoleLogs}
        userAgent={this.state.userAgent}
        timestamp={this.state.timestamp}
        onCopy={this.copyErrorDetails}
        onReload={this.reloadPage}
        onGoHome={this.goHome}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  consoleLogs: string[];
  userAgent: string;
  timestamp: string;
  onCopy: () => void;
  onReload: () => void;
  onGoHome: () => void;
}

function ErrorFallback({ 
  error, 
  errorInfo, 
  consoleLogs, 
  userAgent, 
  timestamp, 
  onCopy, 
  onReload, 
  onGoHome 
}: ErrorFallbackProps) {
  const { user } = useUser();
  // Vérifier si l'utilisateur est admin, avec fallback si pas encore chargé
  const isAdmin = user?.role === 'admin';
  const userLoaded = user !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 mb-2">
            Oups ! Une erreur s'est produite
          </h1>
          <p className="text-lg text-red-600">
            {userLoaded && isAdmin ? 'Erreur technique détectée' : 'Une erreur inattendue s\'est produite'}
          </p>
        </div>

        {/* Actions de récupération pour tous les utilisateurs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Actions de récupération
            </CardTitle>
            <CardDescription>
              Essayez ces solutions pour résoudre le problème
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button onClick={onReload} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Recharger la page
              </Button>
              <Button onClick={onGoHome} variant="outline" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Button>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Page précédente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Détails techniques pour les admins - seulement si l'utilisateur est chargé et admin */}
        {userLoaded && isAdmin && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Détails techniques (Admin)
                </CardTitle>
                <CardDescription>
                  Informations de débogage pour le support technique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timestamp:</span>
                  <Badge variant="outline">{timestamp}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">URL:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {window.location.href}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Agent:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                    {userAgent}
                  </code>
                </div>
              </CardContent>
            </Card>

            {/* Erreur principale */}
            {error && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    Détails de l'erreur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{error.name}:</strong> {error.message}
                    </AlertDescription>
                  </Alert>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stack trace du composant */}
            {errorInfo && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Stack trace du composant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Logs de la console */}
            {consoleLogs.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Logs de la console ({consoleLogs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto max-h-64">
                    <pre className="text-xs">
                      {consoleLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bouton de copie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="w-5 h-5" />
                  Copier le rapport d'erreur
                </CardTitle>
                <CardDescription>
                  Copiez ces informations pour les partager avec le support technique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onCopy} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le rapport complet
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Message pour les membres ou utilisateurs non chargés */}
        {(!userLoaded || !isAdmin) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Besoin d'aide ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Si le problème persiste après avoir essayé les actions de récupération, 
                contactez le support technique.
              </p>
              <Button 
                onClick={() => {
                  const mailtoLink = `mailto:quentin@tgimcap.com?subject=Problème technique - ${window.location.href}&body=Bonjour,%0D%0A%0D%0AJ'ai rencontré une erreur sur la page: ${window.location.href}%0D%0A%0D%0APouvez-vous m'aider ?%0D%0A%0D%0AMerci.`;
                  window.location.href = mailtoLink;
                }}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contacter le support
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
