export type NotificationType = 'mention' | 'like' | 'comment' | 'event' | 'achievement' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  data?: {
    postId?: string;
    commentId?: string;
    eventId?: string;
    achievementId?: string;
    userId?: string;
  };
}