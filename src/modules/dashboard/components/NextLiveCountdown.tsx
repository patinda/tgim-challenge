import { useState, useEffect } from 'react';
import { Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/modules/calendar/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NextLiveCountdown() {
  const { events } = useEvents();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [nextEvent, setNextEvent] = useState<any | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Detect if we're on mobile
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    // Find the next upcoming event
    const now = new Date();
    const upcomingEvents = events
      .filter(event => {
        const eventDate = new Date(event.date);
        
        // If it's today, check the time
        if (eventDate.toDateString() === now.toDateString()) {
          const [eventHours, eventMinutes] = event.startTime.split(':').map(Number);
          const eventDateTime = new Date(event.date);
          eventDateTime.setHours(eventHours, eventMinutes);
          
          return eventDateTime > now;
        }
        
        // For future dates
        return eventDate > now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (upcomingEvents.length > 0) {
      setNextEvent(upcomingEvents[0]);
    }
  }, [events]);

  useEffect(() => {
    if (!nextEvent) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const eventDate = new Date(nextEvent.date);
      const [eventHours, eventMinutes] = nextEvent.startTime.split(':').map(Number);
      eventDate.setHours(eventHours, eventMinutes, 0, 0);
      
      const difference = eventDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const remainingSeconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ 
        days, 
        hours: remainingHours, 
        minutes: remainingMinutes, 
        seconds: remainingSeconds 
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent || !timeLeft || dismissed) return null;

  const handleJoinOrView = () => {
    if (nextEvent.meetingLink) {
      window.open(nextEvent.meetingLink, '_blank');
    } else {
      navigate('/calendar');
    }
  };

  // Mobile version (sticky popup at bottom)
  if (isMobile) {
    return (
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-16 left-4 right-4 z-50"
      >
        <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/20 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1 right-1 h-6 w-6 text-muted-foreground"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
          
          <div className="flex items-center gap-2 mb-1">
            <Video className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium truncate">{nextEvent.title}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-semibold">{timeLeft.days}j</span>
              <span>:</span>
              <span className="font-semibold">{timeLeft.hours.toString().padStart(2, '0')}h</span>
              <span>:</span>
              <span className="font-semibold">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 py-0 text-xs text-primary hover:bg-primary/10 hover:text-primary"
              onClick={handleJoinOrView}
            >
              {nextEvent.meetingLink ? "Rejoindre" : "Voir"}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop version (in header)
  return (
    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full">
      <div className="flex items-center gap-1.5">
        <Video className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
          {nextEvent.title}
        </span>
      </div>
      
      <div className="hidden sm:flex items-center gap-1 text-xs">
        <span className="font-semibold">{timeLeft.days}j</span>
        <span>:</span>
        <span className="font-semibold">{timeLeft.hours.toString().padStart(2, '0')}h</span>
        <span>:</span>
        <span className="font-semibold">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
        <span>:</span>
        <span className="font-semibold">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2 py-0 text-xs text-primary hover:bg-primary/10 hover:text-primary"
        onClick={handleJoinOrView}
      >
        {nextEvent.meetingLink ? "Rejoindre" : "Voir"}
      </Button>
    </div>
  );
}