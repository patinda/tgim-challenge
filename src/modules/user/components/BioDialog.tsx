import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bio: string
  name: string
}

export function BioDialog({ open, onOpenChange, bio, name }: BioDialogProps) {
  // Detect if we're on mobile
  const isMobile = window.innerWidth < 640;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card p-0">
        <DialogHeader className="px-6 py-4 border-b flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="mr-2 -ml-2 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-xl text-card-foreground">
            À propos de {name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6">
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {bio}
            </p>
          </div>
        </ScrollArea>
        
        {isMobile && (
          <div className="p-4 border-t">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}