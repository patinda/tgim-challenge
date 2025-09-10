import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Copy, 
  Eye, 
  X,
  Clock,
  Globe
} from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

export function ErrorWidget() {
  const { errors, clearErrors, copyErrorReport, getErrorSummary, isAdmin } = useErrorHandler();
  const [isOpen, setIsOpen] = useState(false);

  const summary = getErrorSummary();

  // Ne pas afficher si pas d'erreurs ou si pas admin
  if (!summary || !isAdmin) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-lg text-amber-800">
              Erreurs récentes
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
              {summary.recent} récentes
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-amber-700">
          {summary.total} erreurs au total - {summary.types.length} types différents
        </CardDescription>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Types d'erreurs */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-amber-800">Types d'erreurs :</h4>
              <div className="flex flex-wrap gap-2">
                {summary.types.map(({ type, count }) => (
                  <Badge key={type} variant="secondary" className="bg-amber-200 text-amber-800">
                    {type}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Liste des erreurs récentes */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-amber-800">Erreurs récentes :</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {errors.slice(0, 5).map((error, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {error.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(error.timestamp).toLocaleTimeString()}</span>
                          {error.details && (
                            <>
                              <span>•</span>
                              <span>{error.details}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Globe className="w-3 h-3" />
                          <span className="truncate">{error.url}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyErrorReport(index)}
                        className="h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyErrorReport()}
                className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                <Copy className="w-4 h-4" />
                Copier tout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearErrors}
                className="flex items-center gap-2 text-red-700 border-red-300 hover:bg-red-100"
              >
                <X className="w-4 h-4" />
                Effacer
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
