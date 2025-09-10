import { useEffect, useRef } from 'react';
import { useGamification } from '@/modules/gamification/hooks/useGamification';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook that silently monitors user activity in the background
 * and registers their daily activity without any UI indication
 */
export function useBackgroundActivityDetector() {
  const { user } = useAuthContext();
  const { progress, performDailyActivity } = useGamification(user?.id || '');
  const queryClient = useQueryClient();
  
  // Track activity state
  const activityRef = useRef({
    activityRegistered: false,
    lastInteractionTime: Date.now(),
    interactionCount: 0,
    timeOnPage: 0,
    checkPerformed: false,
    checkInProgress: false
  });

  // Check if activity already registered for today
  useEffect(() => {
    if (!progress?.dailyActions) return;
    
    // Check if already active today
    const today = new Date().toISOString().split('T')[0];
    if (
      progress.dailyActions.date === today && 
      progress.dailyActions.login_count > 0
    ) {
      activityRef.current.activityRegistered = true;
      activityRef.current.checkPerformed = true;
    }
  }, [progress]);
  
  // Monitor activity passively
  useEffect(() => {
    if (!user?.id || activityRef.current.activityRegistered) return;
    
    // Setup activity tracking
    let pageVisibilityTimer: NodeJS.Timeout | null = null;
    
    // Track time on page
    if (document.visibilityState === 'visible') {
      pageVisibilityTimer = setInterval(() => {
        activityRef.current.timeOnPage += 1;
        checkActivityThreshold();
      }, 1000);
    }
    
    // Monitor visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !pageVisibilityTimer) {
        pageVisibilityTimer = setInterval(() => {
          activityRef.current.timeOnPage += 1;
          checkActivityThreshold();
        }, 1000);
      } else if (document.visibilityState === 'hidden' && pageVisibilityTimer) {
        clearInterval(pageVisibilityTimer);
        pageVisibilityTimer = null;
      }
    };
    
    // Track minimal user interactions with throttling
    let lastInteractionTime = 0;
    const throttleDelay = 1000; // 1 second between interactions
    
    const trackInteraction = () => {
      const now = Date.now();
      if (now - lastInteractionTime < throttleDelay) return;
      
      lastInteractionTime = now;
      activityRef.current.interactionCount += 1;
      activityRef.current.lastInteractionTime = Date.now();
      checkActivityThreshold();
    };
    
    // Event listeners for minimal activity tracking
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('click', trackInteraction, { passive: true });
    window.addEventListener('scroll', trackInteraction, { passive: true });
    window.addEventListener('keypress', trackInteraction, { passive: true });
    window.addEventListener('mousemove', trackInteraction, { passive: true });
    
    // Check for activity threshold
    function checkActivityThreshold() {
      const { activityRegistered, interactionCount, timeOnPage, checkPerformed, checkInProgress } = activityRef.current;
      
      // If already registered or check already performed, do nothing
      if (activityRegistered || checkPerformed || checkInProgress) return;
      
      // Check if thresholds are met (just 3 interactions and 5 seconds)
      if (interactionCount >= 3 && timeOnPage >= 5) {
        // Mark check as performed to prevent multiple calls
        activityRef.current.checkPerformed = true;
        activityRef.current.checkInProgress = true;
        
        // Silently register activity
        setTimeout(() => {
          performDailyActivity()
            .then(() => {
              activityRef.current.activityRegistered = true;
              activityRef.current.checkInProgress = false;
              console.log('Background activity check successful');
              // Prevent UI resets by properly invalidating only necessary queries
              try {
                if (queryClient && typeof queryClient.invalidateQueries === 'function') {
                  queryClient.invalidateQueries({ queryKey: ['gamification', user?.id], exact: true });
                }
              } catch (error) {
                console.warn('Failed to invalidate queries:', error);
              }
            })
            .catch(err => {
              // If it's a "already logged in" error, mark as registered
              if (err?.message?.includes('Déjà connecté')) {
                activityRef.current.activityRegistered = true;
              } else {
                // For other errors, log silently
                console.error('Silent activity check error:', err);
                // Allow retrying later
                activityRef.current.checkPerformed = false;
              }
              activityRef.current.checkInProgress = false;
            });
        }, 5000); // Longer delay to allow app to stabilize
      }
    }

    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('click', trackInteraction);
      window.removeEventListener('scroll', trackInteraction);
      window.removeEventListener('keypress', trackInteraction);
      window.removeEventListener('mousemove', trackInteraction);
      
      if (pageVisibilityTimer) {
        clearInterval(pageVisibilityTimer);
      }
    };
  }, [user, performDailyActivity, queryClient]);
}