import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  emailNotifications: true,
  pushNotifications: true,
  publicProfile: true,
  showActivity: true,
  theme: 'system',
  language: 'fr'
};

export function useSettings() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Récupérer les paramètres
  const { data: settings = DEFAULT_SETTINGS } = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return DEFAULT_SETTINGS;

      const { data, error } = await supabase
        .from('profiles')
        .select('settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return {
        ...DEFAULT_SETTINGS,
        ...data.settings
      };
    },
    enabled: !!user?.id
  });

  // Mettre à jour les paramètres
  const { mutateAsync: updateSettings } = useMutation({
    mutationFn: async (updates: Partial<Settings>) => {
      if (!user?.id) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          settings: {
            ...settings,
            ...updates
          }
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', user?.id] });
    }
  });

  return {
    settings,
    updateSettings
  };
}