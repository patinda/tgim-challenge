import { useAuthContext } from '../components/AuthProvider';

export function useAuth() {
  const { user, signOut } = useAuthContext();
  
  return {
    user,
    signOut,
    loading: false // Pour la démo, pas de loading
  };
}
