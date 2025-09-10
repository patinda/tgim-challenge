import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { aiService } from '../services/ai-service';

export function AIConfigDialog() {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // En production, vous devriez stocker cela de manière sécurisée
    // Pour le développement, on peut utiliser localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    // Recharger la page pour que les variables d'environnement soient prises en compte
    window.location.reload();
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const isConnected = await aiService.checkAPIConnectivity();
      setTestResult(isConnected ? 'success' : 'error');
    } catch (error) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = () => {
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          API Configurée
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <AlertCircle className="h-3 w-3 mr-1" />
        API Non Configurée
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Config IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Configuration de l'Intelligence Artificielle
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Statut actuel :</span>
            {getStatusBadge()}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">Clé API OpenAI</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Obtenez votre clé API sur{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleTest} 
              disabled={!apiKey.trim() || isTesting}
              variant="outline"
            >
              {isTesting ? 'Test en cours...' : 'Tester la connexion'}
            </Button>
            
            {testResult && (
              <Badge 
                variant={testResult === 'success' ? 'default' : 'destructive'}
                className={testResult === 'success' ? 'bg-green-600' : ''}
              >
                {testResult === 'success' ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connexion réussie
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Échec de connexion
                  </>
                )}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              Sauvegarder et redémarrer
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Fonctionnalités disponibles :</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Réponses contextuelles adaptées à chaque module M&A</li>
              <li>• Génération automatique de documents et templates</li>
              <li>• Analyse intelligente des conversations</li>
              <li>• Suggestions personnalisées selon le contexte</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
