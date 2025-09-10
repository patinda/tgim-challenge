import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';

// Composants d'authentification
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { ResetPasswordPage } from '@/modules/auth/components/ResetPasswordPage';

// Composants principaux
import { Layout } from '@/modules/layout/components/Layout';
import { Dashboard } from '@/modules/dashboard/components/Dashboard';
import { SettingsPage } from '@/modules/settings/components/SettingsPage';
import { UserProfilePage } from '@/modules/user/components/UserProfilePage';
import { DealDetailPage } from '@/modules/ma/components/DealDetailPage';
import { ValuatorPage } from '@/modules/ma/components/ValuatorPage';
import { NegotiatorAIPage } from '@/modules/ma/components/NegotiatorAIPage';
import { TGIMChatbot } from '@/modules/chatbot/components/TGIMChatbot';
import { EmailSystem } from '@/modules/email/components/EmailSystem';

// Composant de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes d'authentification */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginForm />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <RegisterForm />} 
      />
      <Route 
        path="/reset-password" 
        element={<ResetPasswordPage />} 
      />
      
      {/* Application entière protégée derrière ProtectedRoute */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole={["admin", "negotiator", "user"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="settings" element={
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        } />
        <Route path="profil" element={
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        } />
        <Route 
          path="negotiator/deals/:dealId" 
          element={
            <ProtectedRoute requiredRole={["admin", "negotiator"]}>
              <Suspense fallback={<PageLoader />}>
                <DealDetailPage />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        {/* Routes Défi TGIM - IA */}
        <Route 
          path="valuator" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ValuatorPage />
            </Suspense>
          } 
        />
        <Route
          path="negotiator-ai"
          element={
            <ProtectedRoute requiredRole={["admin", "negotiator"]}>
              <Suspense fallback={<PageLoader />}>
                <NegotiatorAIPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route 
          path="chatbot" 
          element={
            <Suspense fallback={<PageLoader />}>
              <TGIMChatbot />
            </Suspense>
          } 
        />
        <Route 
          path="email-system" 
          element={
            <ProtectedRoute requiredRole={["admin"]}>
              <Suspense fallback={<PageLoader />}>
                <EmailSystem />
              </Suspense>
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Route par défaut */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/" : "/login"} replace />} 
      />
    </Routes>
  );
}
