import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Connexion rétablie', {
        description: 'L\'application fonctionne normalement',
      });
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.error('Mode hors-ligne', {
        description: 'Vérifiez votre connexion internet',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};