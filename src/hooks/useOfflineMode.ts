import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data?: any;
  timestamp: number;
}

export const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('offline_queue');
    if (stored) {
      try {
        setQueuedRequests(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse offline queue:', e);
      }
    }
  }, []);

  // Save queued requests to localStorage
  useEffect(() => {
    localStorage.setItem('offline_queue', JSON.stringify(queuedRequests));
  }, [queuedRequests]);

  const queueRequest = useCallback((request: Omit<QueuedRequest, 'id' | 'timestamp'>) => {
    const queued: QueuedRequest = {
      ...request,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setQueuedRequests(prev => [...prev, queued]);
    toast.warning('Requête mise en file d\'attente', {
      description: 'Sera exécutée automatiquement quand la connexion sera rétablie.',
    });
  }, []);

  const clearQueuedRequests = useCallback(() => {
    setQueuedRequests([]);
    localStorage.removeItem('offline_queue');
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Connexion rétablie', {
        description: `${queuedRequests.length} requête(s) en attente d'exécution.`,
      });
      
      // Replay queued requests
      queuedRequests.forEach(async (request) => {
        try {
          await fetch(request.url, {
            method: request.method,
            headers: { 'Content-Type': 'application/json' },
            body: request.data ? JSON.stringify(request.data) : undefined,
          });
          toast.success(`Requête exécutée: ${request.url}`);
        } catch (error) {
          console.error('Failed to replay queued request:', error);
        }
      });
      
      clearQueuedRequests();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.error('Mode hors-ligne', {
        description: 'Vérifiez votre connexion internet. Les modifications seront synchronisées automatiquement.',
        duration: Infinity,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedRequests, clearQueuedRequests]);

  return { isOffline, queueRequest, queuedRequests };
};