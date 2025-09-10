import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, AlertCircle, Sparkles } from 'lucide-react';

export function EmailSystem() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Système d'emailing TGIM</h1>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          Workflow
        </Badge>
      </div>

      {/* Section défi */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5" />
            Défi TGIM - Système d'emailing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-amber-700 dark:text-amber-300">
              <strong>Objectif :</strong> Créer un système d'emailing fonctionnel qui s'intègre parfaitement 
              avec les workflows existants de l'application TGIM pour automatiser la communication avec les utilisateurs.
            </p>
            
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Fonctionnalités à implémenter :</h4>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• <strong>Templates dynamiques :</strong> Système de variables et personnalisation</li>
                <li>• <strong>Workflows automatisés :</strong> Déclenchement basé sur les événements utilisateur</li>
                <li>• <strong>Campagnes marketing :</strong> Gestion des envois en masse et segmentation</li>
                <li>• <strong>Analytics avancées :</strong> Suivi des taux d'ouverture, clics et conversions</li>
                <li>• <strong>Intégration API :</strong> Connexion avec SendGrid, Mailgun ou AWS SES</li>
                <li>• <strong>Gestion des bounces :</strong> Nettoyage automatique des listes d'emails</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Technologies suggérées :</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  SendGrid API
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Handlebars
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Queue System
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Webhooks
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
