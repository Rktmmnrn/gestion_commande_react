import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';

export const useRefreshToken = () => {
  const { refreshToken, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isAuthenticated) {
      // Refresh token every 55 minutes (assuming 60 min expiry)
      intervalRef.current = setInterval(() => {
        refreshToken().catch(console.error);
      }, 55 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, refreshToken]);
};