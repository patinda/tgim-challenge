import { useAuthContext } from '@/modules/auth/components/AuthProvider';

export function useUser() {
  const { user: authUser } = useAuthContext();
  
  // Mock user pour la démo
  const mockUser = {
    id: authUser?.id || '1',
    email: authUser?.email || 'demo@example.com',
    name: 'Utilisateur Demo',
    avatar: null
  };
  
  return {
    user: mockUser,
    isLoading: false
  };
}
