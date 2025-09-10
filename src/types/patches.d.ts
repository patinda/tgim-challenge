// Patches for missing types

// Achievement type fix
export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  createdAt: string;
  data?: any;
}

// User type extensions
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  role: string;
  online_at?: string | null;
  [key: string]: any;
}

// Fix for daily actions
export interface DailyActions {
  date: string;
  loginCount: number;
  communityPosts: number;
  helpfulResponses: number;
  login_count?: number;
  community_posts?: number;
  helpful_responses?: number;
}

// Flexible type for API responses
export type FlexibleObject = {
  [key: string]: any;
}
