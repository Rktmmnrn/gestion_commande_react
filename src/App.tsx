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
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import CategoriesAdmin from '@/pages/admin/CategoriesAdmin';
import ProductsAdmin from '@/pages/admin/ProductsAdmin';
import OrdersListPage from '@/pages/admin/OrdersListPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import ActivityLogPage from '@/pages/admin/ActivityLogPage';
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
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="categories" element={<CategoriesAdmin />} />
                  <Route path="products" element={<ProductsAdmin />} />
                  <Route path="orders" element={<OrdersListPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="logs" element={<ActivityLogPage />} />
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
