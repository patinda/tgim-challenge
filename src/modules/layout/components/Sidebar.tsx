import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings2, HelpCircle, ChevronLeft, Target, Calculator, Brain, Bot, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from '@/modules/user/hooks/useProfile';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useChatbotContext } from '@/components/ChatbotProvider';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  disabled?: boolean;
  status?: string;
  action?: () => void;
}

export function Sidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useProfile();
  const { signOut } = useAuthContext();
  const { toast } = useToast();
  const { openChatbot } = useChatbotContext();

  const handleNavigation = (path?: string, disabled?: boolean, action?: () => void) => {
    if (action) {
      action();
      // Fermer la sidebar sur mobile après l'action
      if (window.innerWidth < 1024) {
        onToggle();
      }
    } else if (path && !disabled) {
      navigate(path);
      // Fermer la sidebar sur mobile après la navigation
      if (window.innerWidth < 1024) {
        onToggle();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleHelp = () => {
    const mailtoLink = `mailto:support@tgimcap.com?subject=Demande d'aide - ${profile?.full_name}&body=Bonjour,%0D%0A%0D%0AJ'ai besoin d'aide concernant...%0D%0A%0D%0ACordialement,%0D%0A${profile?.full_name}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Email d'aide",
      description: "Votre client mail va s'ouvrir pour contacter le support",
    });
  };

  const mainNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
    { icon: Target, label: 'Mon Profil', path: '/profil' },
    { icon: Settings2, label: 'Paramètres', path: '/settings' },
  ];

  const challengeNavItems: NavItem[] = [
    { icon: Calculator, label: 'TGIM Valuator', path: '/valuator' },
    { icon: Brain, label: 'TGIM Negotiator', path: '/negotiator-ai' },
    { icon: Bot, label: 'Chatbot IA', action: openChatbot },
    { icon: Mail, label: 'Système Email', path: '/email-system' },
  ];

  return (
    <aside 
      className={`fixed h-screen top-0 left-0 z-50 flex flex-col bg-card/95 backdrop-blur-sm border-r border-border/40 transition-all duration-300 ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      }`}
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-3 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 bg-primary/20 rounded flex items-center justify-center">
                <span className="text-primary font-bold text-sm">TGIM</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <motion.div 
            className="mb-6 bg-accent/40 rounded-lg p-3 border border-primary/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'Avatar'} />
                  <AvatarFallback>
                    {((profile?.full_name || 'U D').split(' ').map(p => p[0]).join('').slice(0,2)).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-medium leading-none mb-1">{profile?.full_name || 'Utilisateur'}</h3>
                <p className="text-xs text-muted-foreground">Utilisateur</p>
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-1">
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start group transition-all duration-200 ${
                      item.disabled 
                        ? 'text-muted-foreground hover:text-muted-foreground cursor-not-allowed opacity-60'
                        : 'text-card-foreground hover:text-accent-foreground'
                    } ${
                      location.pathname === item.path && !item.disabled 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : ''
                    }`}
                    onClick={() => handleNavigation(item.path, item.disabled, item.action)}
                  >
                    <div className="flex items-center w-full transition-transform duration-200 ease-out">
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Section Défi TGIM */}
          <div className="mt-6">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Défi TGIM - IA
              </h3>
            </div>
            <nav className="space-y-1">
              {challengeNavItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start group transition-all duration-200 ${
                      item.disabled 
                        ? 'text-muted-foreground hover:text-muted-foreground cursor-not-allowed opacity-60'
                        : 'text-card-foreground hover:text-accent-foreground'
                    } ${
                      location.pathname === item.path && !item.disabled 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : ''
                    }`}
                    onClick={() => handleNavigation(item.path, item.disabled, item.action)}
                  >
                    <div className="flex items-center w-full transition-transform duration-200 ease-out">
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-3 bg-accent/20 backdrop-blur-sm border-t border-border/30">
          <Separator className="mb-3 opacity-50" />
          <div className="grid grid-cols-4 gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleHelp}
                className="justify-center col-span-1 group transition-all duration-200 text-muted-foreground hover:text-card-foreground hover:bg-primary/10 rounded-xl"
              >
                <div className="flex items-center w-full justify-center">
                  <HelpCircle className="h-4 w-4" />
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-3"
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="justify-start col-span-3 group transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 w-full rounded-xl"
              >
                <div className="flex items-center w-full transition-transform duration-200 ease-out group-hover:translate-x-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </div>
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </aside>
  );
}
