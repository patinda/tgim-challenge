import { useState, useEffect } from 'react';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Outlet } from 'react-router-dom';
import { useProfile } from '@/modules/user/hooks/useProfile';
import { useOnlineStatus } from '@/modules/user/hooks/useOnlineStatus';

export function Layout() {
  const { user } = useAuthContext();
  const { profile } = useProfile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useOnlineStatus();

  // Set initial sidebar state based on screen width
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      // Only auto-open on desktop
      if (!isMobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    
    // Initial setup
    handleResize();
    
    // Add resize listener to handle responsive behavior
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Fermer la sidebar sur mobile quand on clique en dehors
  const handleOverlayClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Overlay sombre sur mobile quand la sidebar est ouverte */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="p-6">
          <Outlet />
        </main>
        <MobileNav isVisible={!isSidebarOpen} />
      </div>
      {/* Onboarding et ChatBot temporairement désactivés */}
    </div>
  );
}
