import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification } from '../types';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupérer les notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user?.id,
    staleTime: 0, // Toujours considérer les données comme périmées
    cacheTime: 0 // Ne pas mettre en cache les données
  });

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!user?.id) return;

    // S'abonner aux changements de la table notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          // Recharger immédiatement les données
          await queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });

          // Afficher une notification toast pour les nouvelles notifications
          if (payload.eventType === 'INSERT') {
            const notification = payload.new as Notification;
            toast({
              title: notification.title,
              description: notification.message,
            });
          }
        }
      )
      .subscribe();

    // Nettoyer l'abonnement
    return () => {
      channel.unsubscribe();
    };
  }, [user?.id, queryClient, toast]);

  // Ajouter une notification
  const { mutateAsync: addNotification } = useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'read' | 'created_at' | 'user_id'> & { userId?: string }) => {
      if (!user?.id && !notification.userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .rpc('create_notification', {
          p_user_id: notification.userId || user?.id,
          p_type: notification.type,
          p_title: notification.title,
          p_message: notification.message,
          p_data: notification.data || {}
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Marquer une notification comme lue
  const { mutateAsync: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Marquer toutes les notifications comme lues
  const { mutateAsync: markAllAsRead } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Supprimer une notification
  const { mutateAsync: deleteNotification } = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Supprimer toutes les notifications
  const { mutateAsync: clearAll } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  };
}