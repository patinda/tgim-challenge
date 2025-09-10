import { LayoutDashboard, Users, Calendar, Play, BookText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';


import { useUser } from '@/modules/user/hooks/useUser';
import { useToast } from '@/hooks/use-toast';

interface MobileNavProps {
  isVisible: boolean;
}

export function MobileNav({ isVisible }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const items = [
    {
      icon: LayoutDashboard,
      label: 'Accueil',
      path: '/'
    },
    {
      icon: Users,
      label: 'Membres',
      path: '/membres'
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/calendar'
    },
    {
      icon: Play,
      label: 'Replay',
      path: '/replay'
    },
    {
      icon: BookText,
      label: 'Hub',
      path: '/hub'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t sm:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="grid grid-cols-5">
            {items.map((item) => (
              <button
                key={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 gap-1 transition-colors',
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}