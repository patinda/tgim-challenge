// Mock storage service
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'userPreferences',
  SIDEBAR_STATE: 'sidebarState',
  THEME: 'theme',
} as const;

export const storageService = {
  get: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silent fail
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch {
      // Silent fail
    }
  }
};
