import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { useProfile } from '@/modules/user/hooks/useProfile';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { user, signOut } = useAuthContext();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = (pathname: string): string => {
    const segments = pathname.split('/').filter(Boolean);
    
    const titles: Record<string, string> = {
      '': 'Tableau de bord',
      'profil': 'Mon Profil',
      'settings': 'Paramètres',
      'negotiator': 'TGIM Negotiator'
    };

    if (segments[0] === 'negotiator' && segments[1] === 'deals') {
      return 'Détails du deal';
    }

    return titles[segments[0]] || 'Page';
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 w-full items-center px-4">
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mr-4 flex">
          <h1 className="text-lg font-semibold">{currentTitle}</h1>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || user?.email || 'Avatar'} />
                    <AvatarFallback>
                      {((profile?.full_name || user?.email || 'U').split(' ').map(p => p[0]).join('').slice(0,2)).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Utilisateur
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profil')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
