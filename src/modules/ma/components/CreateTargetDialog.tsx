import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateTargetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTargetCreated: (target: any) => void;
}

export function CreateTargetDialog({ open, onOpenChange, onTargetCreated }: CreateTargetDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    location: '',
    revenue: '',
    ebitda: '',
    employees: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const target = {
      id: `target-${Date.now()}`,
      name: formData.name,
      sector: formData.sector,
      location: formData.location,
      revenue: parseFloat(formData.revenue) || 0,
      ebitda: parseFloat(formData.ebitda) || 0,
      employees: parseInt(formData.employees) || 0,
      description: formData.description,
      created_at: new Date().toISOString()
    };

    onTargetCreated(target);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      sector: '',
      location: '',
      revenue: '',
      ebitda: '',
      employees: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle cible</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle cible pour vos opérations M&A
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'entreprise *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="sector">Secteur *</Label>
            <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un secteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech/IT">Tech/IT</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Santé">Santé</SelectItem>
                <SelectItem value="Éducation">Éducation</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revenue">CA (€)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="ebitda">EBITDA (€)</Label>
              <Input
                id="ebitda"
                type="number"
                value={formData.ebitda}
                onChange={(e) => setFormData(prev => ({ ...prev, ebitda: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="employees">Effectifs</Label>
            <Input
              id="employees"
              type="number"
              value={formData.employees}
              onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la cible
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
