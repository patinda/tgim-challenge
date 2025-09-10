import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthUser } from '@/modules/auth/types';
import { useToast } from '@/hooks/use-toast';
import { User, Globe, Share2, Hash, Briefcase, Phone, MapPin, Target, Goal, Users, Clock } from 'lucide-react';
import { useGamification } from '@/modules/gamification/hooks/useGamification';
import { POINTS } from '@/modules/gamification/constants/levels';



interface EditProfileDialogProps {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<AuthUser>) => void;
}

export function EditProfileDialog({ user, open, onOpenChange, onSave }: EditProfileDialogProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const { addAchievement } = useGamification(user.id);
  const formInitializedRef = useRef(false);
  
  // Maintain form state at dialog level
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    location: user.location || '',
    company: user.company || '',
    bio: user.bio || '',
    website: user.website || '',
    expertise: user.expertise?.join(', ') || '',
    interests: user.interests?.join(', ') || '',
    instagram: user.social_links?.instagram || '',
    x: user.social_links?.x || '',
    youtube: user.social_links?.youtube || '',
    linkedin: user.social_links?.linkedin || '',
    facebook: user.social_links?.facebook || '',
    // Investment thesis fields
    geography: user.project_info?.investment_thesis?.geography || '',
    sector: user.project_info?.investment_thesis?.sector || '',
    role: user.project_info?.investment_thesis?.role || '',
    horizon: user.project_info?.investment_thesis?.horizon || ''
  });

  // Update form data when user prop changes and dialog opens
  useEffect(() => {
    if (open && !formInitializedRef.current) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        company: user.company || '',
        bio: user.bio || '',
        website: user.website || '',
        expertise: user.expertise?.join(', ') || '',
        interests: user.interests?.join(', ') || '',
        instagram: user.social_links?.instagram || '',
        x: user.social_links?.x || '',
        youtube: user.social_links?.youtube || '',
        linkedin: user.social_links?.linkedin || '',
        facebook: user.social_links?.facebook || '',
        // Investment thesis fields
        geography: user.project_info?.investment_thesis?.geography || '',
        sector: user.project_info?.investment_thesis?.sector || '',
        role: user.project_info?.investment_thesis?.role || '',
        horizon: user.project_info?.investment_thesis?.horizon || ''
      });
      formInitializedRef.current = true;
    }
    
    // Reset the initialization flag when dialog closes
    if (!open) {
      formInitializedRef.current = false;
    }
  }, [user, open]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction pour vérifier si la thèse d'investissement est complète
  const isInvestmentThesisComplete = (thesis: any) => {
    return thesis && 
           thesis.geography?.trim() && 
           thesis.sector?.trim() && 
           thesis.role?.trim() && 
           thesis.horizon?.trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Vérifier l'état de la thèse avant mise à jour
      const wasThesisComplete = isInvestmentThesisComplete(user.project_info?.investment_thesis);
      
      const newThesis = {
        geography: formData.geography || '',
        sector: formData.sector || '',
        role: formData.role || '',
        horizon: formData.horizon || ''
      };
      
      const isThesisNowComplete = isInvestmentThesisComplete(newThesis);

      const updates = {
        name: formData.name || user.name || '',
        email: formData.email || user.email || '',
        location: formData.location || '',
        company: formData.company || undefined,
        bio: formData.bio || '',
        website: formData.website || undefined,
        social_links: {
          instagram: formData.instagram || undefined,
          x: formData.x || undefined,
          youtube: formData.youtube || undefined,
          linkedin: formData.linkedin || undefined,
          facebook: formData.facebook || undefined
        },
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        project_info: {
          // Preserve existing values
          phone: user.project_info?.phone || '',
          linkedin: user.project_info?.linkedin || '',
          expertise: user.project_info?.expertise || '',
          sectors: user.project_info?.sectors || '',
          motivations: user.project_info?.motivations || '',
          locations: user.project_info?.locations || '',
          investment_thesis: newThesis
        }
      };

      await onSave(updates);
      
      // Attribuer des points si la thèse vient d'être complétée
      if (!wasThesisComplete && isThesisNowComplete) {
        try {
          await addAchievement({
            type: 'feedback',
            title: 'Thèse d\'investissement complétée',
            description: 'Vous avez défini votre stratégie de reprise d\'entreprise',
            points: POINTS.INVESTMENT_THESIS,
            data: { 
              completedAt: new Date().toISOString(),
              geography: newThesis.geography,
              sector: newThesis.sector,
              role: newThesis.role,
              horizon: newThesis.horizon
            }
          });
        } catch (error) {
          console.error('Error awarding investment thesis points:', error);
          // Ne pas bloquer la sauvegarde si l'attribution de points échoue
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive"
      });
    }
  };

  // Check if user is admin
  const isAdmin = user.role === 'admin';

  // Detect if we're on mobile
  const isMobile = window.innerWidth < 640;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-card-foreground">Modifier le profil</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="w-full justify-start px-6 pt-4 bg-transparent">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : "inline"}>Profil</span>
            </TabsTrigger>
            <TabsTrigger value="expertise" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : "inline"}>Expertise</span>
            </TabsTrigger>
            <TabsTrigger value="thesis" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : "inline"}>Thèse</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : "inline"}>Réseaux sociaux</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto px-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <TabsContent value="profile" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise (optionnel)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="h-24 bg-background resize-none"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expertise" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="expertise">Expertise</Label>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Textarea
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    className="h-24 bg-background resize-none"
                    placeholder="Ex: Finance, Marketing, RH..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez vos domaines d'expertise par des virgules (ex: "Gestion de projet, Finance, Marketing")
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="interests">Centres d'intérêt</Label>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    className="h-24 bg-background resize-none"
                    placeholder="Ex: Innovation, Digital, RSE..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Séparez vos centres d'intérêt par des virgules (ex: "Innovation, Digital, RSE")
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="thesis" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-card-foreground">
                    <Globe className="h-4 w-4 text-primary" />
                    Géographie ciblée
                  </Label>
                  <Textarea
                    value={formData.geography}
                    onChange={(e) => handleInputChange('geography', e.target.value)}
                    placeholder="Local, régional, national, européen, international..."
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Dans quelle zone souhaitez-vous racheter une entreprise ?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-card-foreground">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Secteur d'activité visé
                  </Label>
                  <Textarea
                    value={formData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    placeholder="Soyez précis sur les secteurs que vous ciblez..."
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quel(s) secteur(s) ciblez-vous ? Plus votre réponse est précise, plus elle sera exploitable.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-card-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    Posture dans la reprise
                  </Label>
                  <Textarea
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Opérateur (mains dans le cambouis) ou actionnaire (rôle plus stratégique)..."
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Souhaitez-vous opérer l'entreprise au quotidien ou préférez-vous un rôle plus stratégique/actionnarial ?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-card-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Horizon de détention
                  </Label>
                  <Textarea
                    value={formData.horizon}
                    onChange={(e) => handleInputChange('horizon', e.target.value)}
                    placeholder="5 ans ? 10 ans ? 20 ans ? Plus ?"
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quelle est votre vision temporelle sur vos acquisitions ? Cet élément influe fortement sur votre stratégie globale.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="x">X (Twitter)</Label>
                  <Input
                    id="x"
                    name="x"
                    value={formData.x}
                    onChange={(e) => handleInputChange('x', e.target.value)}
                    placeholder="https://x.com/username"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    placeholder="https://youtube.com/@username"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/username"
                    className="bg-background"
                  />
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 sticky bottom-0 pt-4 pb-6 bg-card border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="text-card-foreground hover:text-accent-foreground"
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}