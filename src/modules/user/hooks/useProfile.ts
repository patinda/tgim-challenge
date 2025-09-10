import { useAuthContext } from '@/modules/auth/components/AuthProvider';

export function useProfile() {
  const { user } = useAuthContext();
  
  // Mock profile pour la démo
  const mockProfile = {
    id: user?.id || '1',
    user_id: user?.id || '1',
    full_name: 'Utilisateur Demo',
    avatar_url: null,
    bio: 'Entrepreneur passionné par la reprise d\'entreprise',
    project_info: {
      investment_thesis: {
        geography: '',
        sector: '',
        role: '',
        horizon: ''
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const updateProfile = async (data: any) => {
    // Mock update
    return { data: mockProfile, error: null };
  };
  
  const updateAvatar = async (file: File) => {
    // Mock update avatar
    return { data: { avatar_url: '/mock-avatar.jpg' }, error: null };
  };
  
  return {
    profile: mockProfile,
    isLoading: false,
    updateProfile,
    updateAvatar
  };
}
