import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/modules/user/hooks/useUser';

interface ErrorInfo {
  message: string;
  details?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  stack?: string;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';

  const handleError = useCallback((error: Error, context?: string) => {
    const errorInfo: ErrorInfo = {
      message: error.message,
      details: context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      stack: error.stack
    };

    // Ajouter l'erreur à l'historique
    setErrors(prev => [errorInfo, ...prev.slice(0, 9)]); // Garder les 10 dernières erreurs

    // Log pour le débogage
    console.error(`[${context || 'App'}] Error:`, error);

    // Toast pour les utilisateurs
    if (isAdmin) {
      toast.error(`Erreur technique: ${error.message}`, {
        description: `Contexte: ${context || 'Application'}`,
        duration: 8000,
        action: {
          label: 'Voir détails',
          onClick: () => {
            // Afficher les détails dans la console pour les admins
            console.group('🔍 Détails de l\'erreur');
            console.log('Message:', error.message);
            console.log('Stack:', error.stack);
            console.log('Contexte:', context);
            console.log('URL:', window.location.href);
            console.log('Timestamp:', errorInfo.timestamp);
            console.groupEnd();
          }
        }
      });
    } else {
      toast.error('Une erreur s\'est produite', {
        description: 'Veuillez réessayer ou contacter le support si le problème persiste',
        duration: 5000
      });
    }

    // Optionnel: Envoyer l'erreur à un service de monitoring
    // sendErrorToMonitoring(errorInfo);
  }, [isAdmin]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const copyErrorReport = useCallback((errorIndex: number = 0) => {
    const error = errors[errorIndex];
    if (!error) return;

    const report = `=== RAPPORT D'ERREUR TGIM ===
Timestamp: ${error.timestamp}
URL: ${error.url}
Contexte: ${error.details || 'Application'}
User Agent: ${error.userAgent}

ERREUR:
${error.message}

${error.stack ? `Stack:\n${error.stack}` : ''}

=== FIN DU RAPPORT ===`;

    navigator.clipboard.writeText(report).then(() => {
      toast.success('Rapport d\'erreur copié');
    }).catch(() => {
      toast.error('Impossible de copier le rapport');
    });
  }, [errors]);

  const getErrorSummary = useCallback(() => {
    if (errors.length === 0) return null;

    const recentErrors = errors.slice(0, 5);
    const errorTypes = new Map<string, number>();
    
    recentErrors.forEach(error => {
      const type = error.message.split(':')[0] || 'Unknown';
      errorTypes.set(type, (errorTypes.get(type) || 0) + 1);
    });

    return {
      total: errors.length,
      recent: recentErrors.length,
      types: Array.from(errorTypes.entries()).map(([type, count]) => ({ type, count }))
    };
  }, [errors]);

  return {
    errors,
    handleError,
    handleAsyncError,
    clearErrors,
    copyErrorReport,
    getErrorSummary,
    isAdmin
  };
}
