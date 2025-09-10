import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Brain, AlertCircle, Sparkles } from 'lucide-react';

export function TGIMChatbot() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">TGIM Assistant IA</h1>
        <Badge variant="secondary" className="ml-2">
          <Brain className="h-3 w-3 mr-1" />
          Formé sur TGIM
        </Badge>
      </div>

      {/* Section défi */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertCircle className="h-5 w-5" />
            Défi TGIM - Chatbot IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-amber-700 dark:text-amber-300">
              <strong>Objectif :</strong> Créer un chatbot IA spécialisé formé sur tout le contenu de la plateforme TGIM 
              pour accompagner les utilisateurs dans leur parcours de reprise d'entreprise.
            </p>
            
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Fonctionnalités à implémenter :</h4>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                <li>• <strong>Formation sur le contenu :</strong> Ingestion de tous les documents, guides et ressources TGIM</li>
                <li>• <strong>RAG (Retrieval Augmented Generation) :</strong> Recherche intelligente dans la base de connaissances</li>
                <li>• <strong>Contexte conversationnel :</strong> Mémorisation du contexte de la conversation</li>
                <li>• <strong>Sources et citations :</strong> Références précises aux documents sources</li>
                <li>• <strong>Personnalisation :</strong> Adaptation aux besoins spécifiques de chaque utilisateur</li>
                <li>• <strong>Intégration workflow :</strong> Connexion avec les outils TGIM existants</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Technologies suggérées :</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  OpenAI GPT-4
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  LangChain
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Pinecone/Weaviate
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                  Embeddings
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
