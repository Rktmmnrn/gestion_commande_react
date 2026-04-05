import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/Login';
import POSPage from '@/pages/POSPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import CategoriesAdmin from '@/pages/admin/CategoriesAdmin';
import ProductsAdmin from '@/pages/admin/ProductsAdmin';
import OrdersAdmin from '@/pages/admin/OrdersAdmin';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner position="bottom-center" closeButton />
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Route POS — utilisateur authentifié */}
              <Route element={<ProtectedRoute />}>
                <Route path="/pos" element={<POSPage />} />
              </Route>

              {/* Routes Admin — authentifié + isAdmin */}
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<Navigate to="/admin/categories" replace />} />
                  <Route path="categories" element={<CategoriesAdmin />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="orders" element={<OrdersAdmin />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
