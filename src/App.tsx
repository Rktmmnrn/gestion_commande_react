import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import POSPage from '@/pages/POSPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import CategoriesAdmin from '@/pages/admin/CategoriesAdmin';
import ProductsAdmin from '@/pages/admin/ProductsAdmin';
import TablesAdmin from '@/pages/admin/TablesAdmin';
import OrdersListPage from '@/pages/admin/OrdersListPage';
import ActivityLogPage from '@/pages/admin/ActivityLogPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <AdminAuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner position="bottom-center" closeButton />
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />

              <Route path="/pos" element={<POSPage />} />

              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="categories" element={<CategoriesAdmin />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="tables" element={<TablesAdmin />} />
                <Route path="orders" element={<OrdersListPage />} />
                <Route path="logs" element={<ActivityLogPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AdminAuthProvider>
  </ErrorBoundary>
);

export default App;
