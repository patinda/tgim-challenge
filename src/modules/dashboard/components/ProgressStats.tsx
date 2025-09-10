import { Progress } from "@/components/ui/progress";
import { StatCard } from './StatCard';
import { Card } from '@/components/ui/card';
import { Trophy, Calendar, Star } from 'lucide-react';
import { LEVELS } from '@/modules/gamification/constants/levels';

interface ProgressStatsProps {
  progress: number;
  level: number;
}

export function ProgressStats({ progress, level }: ProgressStatsProps) {
  const currentLevel = LEVELS.find(l => l.id === level);
  const nextLevel = LEVELS.find(l => l.id === level + 1);

  if (!currentLevel || !nextLevel) return null;

  const progressPercentage = ((progress - currentLevel.minPoints) / 
    (nextLevel.minPoints - currentLevel.minPoints)) * 100;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Votre progression</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Niveau {level}</span>
          <span className="text-primary">{progress} points</span>
        </div>
        <Progress value={progressPercentage} className="h-4 bg-primary/10" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentLevel.minPoints} pts</span>
          <span>Niveau {level + 1} : {nextLevel.minPoints} pts</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Points gagnés</p>
            <p className="text-2xl font-bold">{progress}</p>
            <p className="text-xs text-emerald-600">Total cumulé</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Star className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Niveau actuel</p>
            <p className="text-2xl font-bold">{level}</p>
            <p className="text-xs text-emerald-600">Sur 40 niveaux</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Calendar className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Présence</p>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-xs text-emerald-600">Aujourd'hui</p>
          </div>
        </Card>
      </div>
    </section>
  );
}