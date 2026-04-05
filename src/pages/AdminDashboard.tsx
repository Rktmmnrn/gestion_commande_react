import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Grid3x3, ShoppingCart, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Bienvenue {user?.username}</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4 py-3">
          <Link to="/admin/categories">
            <Button variant="ghost" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Catégories
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="ghost" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="ghost" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Commandes
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
