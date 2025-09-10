import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OnlineStatusProps {
  onlineAt: string | null | undefined;
  className?: string;
  showLabel?: boolean;
}

export function OnlineStatus({ onlineAt, className, showLabel = false }: OnlineStatusProps) {
  const isOnline = onlineAt && new Date(onlineAt).getTime() > Date.now() - 1000 * 60 * 5; // 5 minutes

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
              isOnline ? "bg-emerald-500" : "bg-muted",
              className
            )} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOnline ? 'En ligne' : 'Hors ligne'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "h-2 w-2 rounded-full",
        isOnline ? "bg-emerald-500" : "bg-muted"
      )} />
      <span className="text-sm text-muted-foreground">
        {isOnline ? 'En ligne' : 'Hors ligne'}
      </span>
    </div>
  );
}