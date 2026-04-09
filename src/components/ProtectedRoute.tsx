import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireWaiter?: boolean;
}

export const ProtectedRoute = ({ requireAdmin = false, requireWaiter = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Accès non autorisé', {
        description: 'Veuillez vous connecter pour accéder à cette page.',
      });
    } else if (!isLoading && requireAdmin && !isAdmin) {
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas les droits administrateur nécessaires.',
      });
    } else if (!isLoading && requireWaiter && isAdmin) {
      // Waiters are regular users, admins can also access waiter routes
      // This is fine
    }
  }, [isLoading, isAuthenticated, requireAdmin, isAdmin, requireWaiter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Chargement..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/pos" replace />;
  }

  return <Outlet />;
};
