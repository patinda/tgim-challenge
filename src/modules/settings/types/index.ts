export interface Settings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  showActivity: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}