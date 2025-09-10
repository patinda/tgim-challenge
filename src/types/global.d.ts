// Type declarations to fix common errors

// Fix for toast variants
declare module '@/components/ui/toast' {
  export interface Toast {
    variant?: 'default' | 'destructive' | 'warning' | null | undefined;
  }
}

// Fix for missing properties
declare global {
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<any>;
    };
  }
}

export {};
