import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/modules/user/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Video, MapPin, Sparkles, Target, AlertCircle, Trophy, Star, TrendingUp, Calculator, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  // Mock data pour la démo
  const mockProgress = {
    points: 420,
    level: 3,
    achievements: []
  };

  const mockEvents = [
    {
      id: '1',
      title: 'Webinaire M&A - Stratégies de croissance',
      date: new Date(Date.now() + 86400000).toISOString(), // Demain
      startTime: '14:00',
      location: 'En ligne',
      type: 'webinar'
    },
    {
      id: '2',
      title: 'Workshop - Due Diligence',
      date: new Date(Date.now() + 172800000).toISOString(), // Dans 2 jours
      startTime: '10:00',
      location: 'Paris',
      type: 'workshop'
    }
  ];
  
  // Vérifier si la thèse d'investissement est complète
  const investmentThesis = profile?.project_info?.investment_thesis;
  const isThesisIncomplete = !investmentThesis || 
    !investmentThesis.geography?.trim() || 
    !investmentThesis.sector?.trim() || 
    !investmentThesis.role?.trim() || 
    !investmentThesis.horizon?.trim();

  return (
    <div className="space-y-6 px-0">
      <motion.div
        key="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Message de bienvenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Bienvenue sur votre tableau de bord TGIM
            </CardTitle>
            <CardDescription>
              Suivez votre progression et accédez aux outils essentiels pour votre projet de reprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">{mockProgress.points} points</div>
                  <div className="text-sm text-muted-foreground">Points gagnés</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-semibold">Niveau {mockProgress.level}</div>
                  <div className="text-sm text-muted-foreground">Progression</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-500/5 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-semibold">{mockEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Événements à venir</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte thèse d'investissement */}
        {isThesisIncomplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="h-5 w-5" />
                  Complétez votre thèse d'investissement
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  Définissez votre stratégie de reprise pour optimiser votre parcours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  Une thèse d'investissement claire vous aide à cibler les bonnes opportunités 
                  et à structurer votre approche de reprise d'entreprise.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {!investmentThesis?.geography?.trim() && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Géographie manquante
                    </Badge>
                  )}
                  {!investmentThesis?.sector?.trim() && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Secteur manquant
                    </Badge>
                  )}
                  {!investmentThesis?.role?.trim() && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Posture manquante
                    </Badge>
                  )}
                  {!investmentThesis?.horizon?.trim() && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                      Horizon manquant
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={() => navigate('/profil')}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Définir ma thèse
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Événements à venir */}
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>Vos prochains rendez-vous TGIM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long'
                          })} • {event.startTime}
                        </span>
                        <div className="flex items-center gap-1">
                          {event.location === 'En ligne' ? (
                            <>
                              <Video className="h-3 w-3" />
                              <span>En ligne</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Raccourcis utiles */}
          <Card>
            <CardHeader>
              <CardTitle>Raccourcis utiles</CardTitle>
              <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/valuator')}
                  className="h-20 flex-col gap-2"
                >
                  <Calculator className="h-6 w-6" />
                  <span className="text-xs">TGIM Valuator</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/negotiator-ai')}
                  className="h-20 flex-col gap-2"
                >
                  <Brain className="h-6 w-6" />
                  <span className="text-xs">TGIM Negotiator</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/chatbot')}
                  className="h-20 flex-col gap-2"
                >
                  <Sparkles className="h-6 w-6" />
                  <span className="text-xs">Chatbot IA</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/profil')}
                  className="h-20 flex-col gap-2"
                >
                  <Target className="h-6 w-6" />
                  <span className="text-xs">Mon Profil</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
