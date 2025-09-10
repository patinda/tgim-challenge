import { useState, useEffect } from 'react';
import { Button } from './button';
import { Trophy, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGamification } from '@/modules/gamification/hooks/useGamification';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';

export function DailyActivityButton() {
  const [isActive, setIsActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lastActive, setLastActive] = useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();
  const { progress, performDailyActivity } = useGamification(user?.id || '');
  
  // Check if the user has already performed their daily activity
  useEffect(() => {
    if (!progress.dailyActions) return;
    
    const today = new Date().toISOString().split('T')[0];
    const dailyDate = progress.dailyActions.date;
    const loginCount = progress.dailyActions.login_count || 0;
    
    // If today's date matches and there's a login count, they've already checked in
    if (dailyDate === today && loginCount > 0) {
      setIsActive(true);
      
      // Find the latest login achievement from today
      const todayStart = new Date(today);
      const todayAchievements = progress.achievements.filter(a => 
        a.type === 'login' && new Date(a.createdAt) >= todayStart
      );
      
      if (todayAchievements.length > 0) {
        // Sort by date (newest first) and get the first one
        todayAchievements.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLastActive(new Date(todayAchievements[0].createdAt));
      }
    } else {
      setIsActive(false);
      setLastActive(null);
    }
  }, [progress]);

  const handleDailyActivity = async () => {
    if (isActive) {
      toast({
        title: "Déjà validé",
        description: "Vous avez déjà validé votre activité quotidienne aujourd'hui",
        variant: "info"
      });
      return;
    }
    
    try {
      await performDailyActivity();
      setIsActive(true);
      setLastActive(new Date());
      
      toast({
        title: "Activité validée !",
        description: "Vous avez gagné 10 points pour votre activité quotidienne",
      });
    } catch (error) {
      console.error('Error performing daily activity:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation de votre activité",
        variant: "destructive"
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`relative flex items-center transition-all duration-300 ${
              isActive 
                ? 'opacity-80'
                : 'opacity-60 hover:opacity-100'
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8"
              onClick={handleDailyActivity}
            >
              {isActive ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Trophy className="h-4 w-4 text-primary" />
              )}
              
              {/* Activity indicator */}
              {isActive && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-background"></span>
              )}
            </Button>
            
            {/* Tooltip-like badge that appears on hover or when active */}
            {(isHovering || isActive) && (
              <Badge 
                variant="outline" 
                className={`absolute top-full right-0 mt-1 whitespace-nowrap ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {isActive ? '+10 pts acquis' : '+10 pts quotidiens'}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isActive && lastActive ? (
            <div className="flex items-center gap-2 p-2">
              <Clock className="h-4 w-4" />
              <span>Validé {formatDistanceToNow(lastActive, { addSuffix: true, locale: fr })}</span>
            </div>
          ) : (
            <div className="p-2">
              Votre activité quotidienne est analysée automatiquement
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}