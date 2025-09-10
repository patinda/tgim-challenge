import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Briefcase, Target, MapPin, Goal, Save, CheckCircle, ChevronDown, ChevronUp, Globe, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '../hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';

export function ProjectInfoForm() {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const formInitializedRef = useRef(false);
  
  // Récupérer les informations du projet depuis le profil
  const projectInfo = profile?.project_info || {};
  const investmentThesis = projectInfo.investment_thesis || {};
  
  const [formData, setFormData] = useState({
    // Investment thesis fields
    geography: investmentThesis.geography || '',
    sector: investmentThesis.sector || '',
    role: investmentThesis.role || '',
    horizon: investmentThesis.horizon || ''
  });

  // Initialize form data only once when component mounts or profile changes
  useEffect(() => {
    if (!formInitializedRef.current && profile) {
      setFormData({
        // Investment thesis fields
        geography: profile.project_info?.investment_thesis?.geography || '',
        sector: profile.project_info?.investment_thesis?.sector || '',
        role: profile.project_info?.investment_thesis?.role || '',
        horizon: profile.project_info?.investment_thesis?.horizon || ''
      });
      formInitializedRef.current = true;
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset success state when form is modified
    if (saveSuccess) setSaveSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Mettre à jour le profil avec les nouvelles informations de projet
      await updateProfile({
        project_info: {
          // Preserve existing values
          phone: profile?.project_info?.phone || '',
          linkedin: profile?.project_info?.linkedin || '',
          expertise: profile?.project_info?.expertise || '',
          sectors: profile?.project_info?.sectors || '',
          motivations: profile?.project_info?.motivations || '',
          locations: profile?.project_info?.locations || '',
          investment_thesis: {
            geography: formData.geography || '',
            sector: formData.sector || '',
            role: formData.role || '',
            horizon: formData.horizon || ''
          }
        }
      });
      
      // Invalider le cache pour forcer le rechargement des données
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Informations enregistrées",
        description: "Vos informations de projet de reprise ont été mises à jour avec succès"
      });
      
      // Show success state
      setSaveSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations de projet:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des informations",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 bg-card shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-medium">Projet de reprise</h2>
        </div>
        <Button 
          type="submit" 
          form="project-form"
          size="sm"
          className={`${saveSuccess ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary hover:bg-primary/90'} text-primary-foreground transition-colors duration-300`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="h-3 w-3 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Enregistrement...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-3 w-3 mr-2" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="h-3 w-3 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
      
      <form id="project-form" onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-medium">Ma thèse d'investissement</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Géographie ciblée */}
              <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Géographie ciblée</h3>
                </div>
                <Textarea
                  value={formData.geography}
                  onChange={(e) => handleChange('geography', e.target.value)}
                  placeholder="Local, régional, national, européen, international, 100% remote, online uniquement..."
                  className="min-h-[80px] text-sm bg-background/50 border-input/50 focus-visible:ring-primary/30 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Dans quelle zone souhaitez-vous racheter une entreprise ?
                </p>
              </div>
              
              {/* Secteur d'activité visé */}
              <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Secteur d'activité visé</h3>
                </div>
                <Textarea
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  placeholder="Soyez précis sur les secteurs que vous ciblez..."
                  className="min-h-[80px] text-sm bg-background/50 border-input/50 focus-visible:ring-primary/30 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Quel(s) secteur(s) ciblez-vous ? Plus votre réponse est précise, plus elle sera exploitable.
                </p>
              </div>
              
              {/* Posture dans la reprise */}
              <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Posture dans la reprise</h3>
                </div>
                <Textarea
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="Opérateur (mains dans le cambouis) ou actionnaire (rôle plus stratégique)..."
                  className="min-h-[80px] text-sm bg-background/50 border-input/50 focus-visible:ring-primary/30 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Souhaitez-vous opérer l'entreprise au quotidien ou préférez-vous un rôle plus stratégique/actionnarial ?
                </p>
              </div>
              
              {/* Horizon de détention */}
              <div className="bg-accent/20 p-4 rounded-lg border border-accent/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Horizon de détention</h3>
                </div>
                <Textarea
                  value={formData.horizon}
                  onChange={(e) => handleChange('horizon', e.target.value)}
                  placeholder="5 ans ? 10 ans ? 20 ans ? Plus ?"
                  className="min-h-[80px] text-sm bg-background/50 border-input/50 focus-visible:ring-primary/30 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Quelle est votre vision temporelle sur vos acquisitions ? Cet élément influe fortement sur votre stratégie globale.
                </p>
              </div>
            </div>
        </div>
      </form>
    </Card>
  );
}