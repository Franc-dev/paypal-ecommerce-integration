'use client';

import { useState, useEffect, useCallback } from 'react';

export function useMediaQuery(query: string): boolean {
  // Initialize with null to handle SSR
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Memoize the handler to prevent unnecessary re-renders
  const handleChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setMatches(e.matches);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener for subsequent changes
    // Use the appropriate event listener based on browser support
    const addListener = mediaQuery.addEventListener ??
      mediaQuery.addListener?.bind(mediaQuery);
    const removeListener = mediaQuery.removeEventListener ??
      mediaQuery.removeListener?.bind(mediaQuery);

    if (addListener) {
      // Modern browsers
      addListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup function
    return () => {
      if (removeListener) {
        removeListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query, handleChange]); // Only re-run if query changes

  // Return false during SSR, actual value after mount
  return mounted ? matches : false;
}

// Usage example:
/*
function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
*/