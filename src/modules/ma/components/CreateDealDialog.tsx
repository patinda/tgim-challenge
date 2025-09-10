import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMAData } from '../hooks/useMAData';
import { Target, Deal } from '../types';

interface CreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targets: Target[];
}

export function CreateDealDialog({ open, onOpenChange, targets }: CreateDealDialogProps) {
  const { createDeal } = useMAData();
  const [formData, setFormData] = useState({
    target_id: '',
    perimeter: '',
    context: '',
    loi_deadline: '',
    dd_start: '',
    dd_end: '',
    closing_target: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const deal: Omit<Deal, 'id' | 'created_at'> = {
      owner: 'user-1', // TODO: Get from auth
      target_id: formData.target_id,
      perimeter: formData.perimeter as '100' | 'majoritaire' | 'minoritaire',
      context: formData.context,
      key_dates: {
        loi_deadline: formData.loi_deadline || undefined,
        dd_start: formData.dd_start || undefined,
        dd_end: formData.dd_end || undefined,
        closing_target: formData.closing_target || undefined
      },
      status: 'draft'
    };

    createDeal(deal);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      target_id: '',
      perimeter: '',
      context: '',
      loi_deadline: '',
      dd_start: '',
      dd_end: '',
      closing_target: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedTarget = targets.find(t => t.id === formData.target_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau deal</DialogTitle>
          <DialogDescription>
            Lancez une nouvelle opération M&A sur une cible existante
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de la cible */}
          <div className="space-y-2">
            <Label htmlFor="target">Cible *</Label>
            <Select value={formData.target_id} onValueChange={(value) => handleInputChange('target_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une cible" />
              </SelectTrigger>
              <SelectContent>
                {targets.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name} - {target.sector} ({target.country})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTarget && (
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">
                <div className="font-medium">{selectedTarget.name}</div>
                <div className="text-muted-foreground">
                  CA: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedTarget.revenue)} | 
                  EBITDA: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedTarget.ebitda)} | 
                  Effectif: {selectedTarget.headcount} ETP
                </div>
              </div>
            )}
          </div>

          {/* Périmètre et contexte */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="perimeter">Périmètre *</Label>
              <Select value={formData.perimeter} onValueChange={(value) => handleInputChange('perimeter', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le périmètre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100% des titres</SelectItem>
                  <SelectItem value="majoritaire">Majorité</SelectItem>
                  <SelectItem value="minoritaire">Minorité significative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Contexte</Label>
              <Input
                id="context"
                value={formData.context}
                onChange={(e) => handleInputChange('context', e.target.value)}
                placeholder="Ex: Acquisition stratégique, diversification..."
              />
            </div>
          </div>

          {/* Dates clés */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Dates clés (optionnel)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loi_deadline">Deadline LOI</Label>
                <Input
                  id="loi_deadline"
                  type="date"
                  value={formData.loi_deadline}
                  onChange={(e) => handleInputChange('loi_deadline', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dd_start">Début Due Diligence</Label>
                <Input
                  id="dd_start"
                  type="date"
                  value={formData.dd_start}
                  onChange={(e) => handleInputChange('dd_start', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dd_end">Fin Due Diligence</Label>
                <Input
                  id="dd_end"
                  type="date"
                  value={formData.dd_end}
                  onChange={(e) => handleInputChange('dd_end', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="closing_target">Closing cible</Label>
                <Input
                  id="closing_target"
                  type="date"
                  value={formData.closing_target}
                  onChange={(e) => handleInputChange('closing_target', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Informations sur le processus */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-2">Processus automatique :</div>
              <ul className="space-y-1 text-xs">
                <li>• 4 modules M&A seront créés automatiquement</li>
                <li>• M1 (Qualification) sera déverrouillé en premier</li>
                <li>• Les modules suivants se déverrouillent séquentiellement</li>
                <li>• Chaque module dispose d'un chatbot dédié</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.target_id || !formData.perimeter}>
              Créer le deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
