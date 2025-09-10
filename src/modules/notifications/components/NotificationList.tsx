import { motion } from 'framer-motion';
import { Bell, Check, Trash2, MessageSquare, ThumbsUp, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationType } from '../types';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  mention: <MessageSquare className="h-4 w-4" />,
  like: <ThumbsUp className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  achievement: <Trophy className="h-4 w-4" />,
  system: <Bell className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />
};

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleNotificationClick = async (notification: typeof notifications[0]) => {
    try {
      // Marquer comme lu
      await markAsRead(notification.id);

      // Si la notification a un lien, naviguer vers celui-ci
      if (notification.link) {
        // Invalider les requêtes pertinentes selon le type de notification
        if (notification.type === 'comment' || notification.type === 'like') {
          await queryClient.invalidateQueries({ queryKey: ['posts'] });
          if (notification.data?.postId) {
            await queryClient.invalidateQueries({ 
              queryKey: ['comments', notification.data.postId] 
            });
          }
        } else if (notification.type === 'event') {
          await queryClient.invalidateQueries({ queryKey: ['events'] });
        }

        // Naviguer vers le lien
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[400px]">
      <div className="p-3 border-b flex items-center gap-2 bg-card">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-1 ml-auto mr-7 sm:mr-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={markAllAsRead}
            className="text-muted-foreground hover:text-card-foreground h-8 px-2"
          >
            <Check className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Tout lire</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAll}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Effacer</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 hover:bg-accent/50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-accent/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    !notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {NOTIFICATION_ICONS[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h4 className="font-medium mb-2 title-left">Aucune notification</h4>
            <p className="text-sm text-muted-foreground title-left">
              Vous serez notifié ici des activités importantes
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}