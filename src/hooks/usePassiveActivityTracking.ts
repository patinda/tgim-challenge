import { useEffect, useRef } from 'react';
import { useGamification } from '@/modules/gamification/hooks/useGamification';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';

/**
 * Hook to passively track user activity and automatically trigger daily check-in
 * 
 * This hook silently monitors user actions and, after a sufficient activity
 * threshold has been met, automatically validates their daily activity without
 * requiring explicit button presses.
 */
export function usePassiveActivityTracking() {
  const { user } = useAuthContext();
  const { progress, performDailyActivity } = useGamification(user?.id || '');
  const toastShownRef = useRef(false);
  
  // Reference to tracking state
  const trackingRef = useRef({
    interactions: 0,
    interactionThreshold: 5, // Lower number of interactions needed to trigger activity
    timeOnSite: 0,
    timeThreshold: 10, // Lower time in seconds needed on site
    lastActivity: Date.now(),
    activityTracked: false,
    timer: null as NodeJS.Timeout | null,
    initialized: false
  });

  // Verify if daily activity already completed
  useEffect(() => {
    if (!progress || typeof progress !== 'object' || !('dailyActions' in progress) || !progress.dailyActions) return;

    const today = new Date().toISOString().split('T')[0];
    const dailyActions = progress.dailyActions as any;
    const dailyDate = dailyActions.date;
    const loginCount = dailyActions.login_count || 0;
    
    // If daily activity already completed for today, mark as tracked
    if (dailyDate === today && loginCount > 0) {
      trackingRef.current.activityTracked = true;
    } else if (!trackingRef.current.initialized) {
      // Only initialize once
      trackingRef.current.initialized = true;
      
      // Start the timer to track time on site
      trackingRef.current.timer = setInterval(() => {
        // Only count time if there was activity in the last 60 seconds
        if (Date.now() - trackingRef.current.lastActivity < 60000) {
          trackingRef.current.timeOnSite++;
          checkActivityThreshold();
        }
      }, 1000);
    }
  }, [progress, performDailyActivity]);

  // Track various user interactions
  useEffect(() => {
    if (!user || trackingRef.current.activityTracked) return;
    
    const updateActivity = () => {
      trackingRef.current.interactions++;
      trackingRef.current.lastActivity = Date.now();
      checkActivityThreshold();
    };

    // Track mouse movements (throttled)
    let lastMove = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastMove > 1000) {  // Throttle to once per second
        lastMove = now;
        updateActivity();
      }
    };

    // Track clicks
    const handleClick = () => {
      updateActivity();
    };

    // Track scrolling (throttled)
    let lastScroll = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScroll > 1000) {  // Throttle to once per second
        lastScroll = now;
        updateActivity();
      }
    };

    // Track keyboard activity
    const handleKeyPress = () => {
      updateActivity();
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyPress, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyPress);
      
      if (trackingRef.current.timer) {
        clearInterval(trackingRef.current.timer);
      }
    };
  }, [user, performDailyActivity, trackingRef.current.activityTracked]);

  // Function to check if activity threshold has been reached
  const checkActivityThreshold = async () => {
    const { interactions, interactionThreshold, timeOnSite, timeThreshold, activityTracked } = trackingRef.current;
    
    if (activityTracked) return;
    
    // Check if both interaction count and time on site thresholds are met
    if (interactions >= interactionThreshold && timeOnSite >= timeThreshold) {
      // Mark as tracked to prevent duplicate calls
      trackingRef.current.activityTracked = true;
      
      try {
        // Perform the daily activity check-in
        await performDailyActivity();
        // Only show toast once per session, and only if not already shown
        if (!toastShownRef.current) {
          toastShownRef.current = true;
          console.log('Daily activity validated silently');
        }
      } catch (error) {
        console.error('Error in automatic activity tracking:', error);
        // Reset tracking flag on error so it can try again
        trackingRef.current.activityTracked = false;
      }
    }
  };
}
