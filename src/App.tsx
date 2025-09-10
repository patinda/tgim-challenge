import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppRoutes } from './Routes';
import { AuthProvider } from './modules/auth/components/AuthProvider';
import { ErrorBoundary } from './components/ui/error-boundary';
import './App.css';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChatbotProvider } from '@/components/ChatbotProvider';

// Créer un client Query avec une configuration robuste
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function App() {
  

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <ChatbotProvider>
            <AppRoutes />
          </ChatbotProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={5000}
          />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;