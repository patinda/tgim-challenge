import { useState, useEffect } from 'react';
import { storageService } from '@/modules/storage/services/storage';

type ViewType = 'grid' | 'list';

export function useViewPreference(key: string, defaultView: ViewType = 'grid') {
  const storageKey = `view-preference-${key}`;

  const [view, setView] = useState<ViewType>(() => 
    storageService.getItem<ViewType>(storageKey, defaultView)
  );

  useEffect(() => {
    storageService.setItem(storageKey, view);
  }, [view, storageKey]);

  return {
    view,
    setView,
    isMobileView: window.innerWidth < 640,
    currentView: window.innerWidth < 640 ? 'list' as const : view
  };
}