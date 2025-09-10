import React, { useState } from 'react';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { useProfile } from '../hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, FileText, Target, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfilePage() {
  const { user } = useAuthContext();
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    geography: profile?.project_info?.investment_thesis?.geography || '',
    sector: profile?.project_info?.investment_thesis?.sector || '',
    role: profile?.project_info?.investment_thesis?.role || '',
    horizon: profile?.project_info?.investment_thesis?.horizon || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        project_info: {
          investment_thesis: {
            geography: formData.geography,
            sector: formData.sector,
            role: formData.role,
            horizon: formData.horizon
          }
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos informations de profil de base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'Avatar'} />
                <AvatarFallback>{(profile?.full_name || 'U D').split(' ').map(p => p[0]).join('').slice(0,2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-muted-foreground">Connecté en tant que</div>
                <div className="text-lg font-semibold">{profile?.full_name || user?.email}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Photo à venir. Un avatar par défaut est affiché.
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Décrivez-vous brièvement..."
                    rows={3}
                  />
                </div>
                <Button type="submit">Enregistrer</Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Nom complet</Label>
                  <p className="text-sm text-muted-foreground">{profile?.full_name || 'Non défini'}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <Label>Biographie</Label>
                  <p className="text-sm text-muted-foreground">{profile?.bio || 'Aucune biographie définie'}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Thèse d'investissement
            </CardTitle>
            <CardDescription>
              Définissez votre stratégie de reprise d'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="geography">Géographie</Label>
                  <Input
                    id="geography"
                    value={formData.geography}
                    onChange={(e) => handleChange('geography', e.target.value)}
                    placeholder="ex: France, Europe..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Input
                    id="sector"
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    placeholder="ex: Tech, Industrie..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Posture</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="ex: Dirigeant, Investisseur..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horizon">Horizon temporel</Label>
                  <Input
                    id="horizon"
                    value={formData.horizon}
                    onChange={(e) => handleChange('horizon', e.target.value)}
                    placeholder="ex: 2-5 ans, Long terme..."
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Géographie</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.geography || 'Non définie'}
                  </p>
                </div>
                <div>
                  <Label>Secteur d'activité</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.sector || 'Non défini'}
                  </p>
                </div>
                <div>
                  <Label>Posture</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.role || 'Non définie'}
                  </p>
                </div>
                <div>
                  <Label>Horizon temporel</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.horizon || 'Non défini'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
