import { useAuthContext } from '@/modules/auth/components/AuthProvider';

export function useOnlineStatus() {
  const { user } = useAuthContext();
  
  // Mock hook pour la démo
  return {
    isOnline: true,
    lastSeen: new Date()
  };
}
