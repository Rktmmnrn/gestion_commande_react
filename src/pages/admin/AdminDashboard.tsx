import { useEffect, useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LayoutGrid, UtensilsCrossed, ClipboardList,
  ChevronLeft, BarChart3, FileText, LogOut } from 'lucide-react';


function AdminRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/pos', { replace: true });
  }, [navigate]);
  return null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAdmin) return <AdminRedirect />;

  const handleLogout = () => {
    logout();
    navigate('/pos');
  };

  const navigation = [
    { label: 'Tableau de bord', icon: BarChart3, path: '/admin/dashboard' },
    { label: 'Catégories', icon: LayoutGrid, path: '/admin/categories' },
    { label: 'Produits', icon: UtensilsCrossed, path: '/admin/products' },
    { label: 'Commandes', icon: ClipboardList, path: '/admin/orders' },
    { label: 'Logs', icon: FileText, path: '/admin/logs' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-56' : 'w-20'
        } flex flex-col z-40`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex-1">
                <h1 className="text-lg font-bold text-amber-400">CommandeResto</h1>
                <p className="text-xs text-slate-400">Administration</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-slate-800 rounded-md transition"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-amber-500">
              <AvatarFallback className="bg-amber-500 text-slate-950 font-bold">A</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs mt-1">Admin</p>
                <p className="text-sm font-semibold truncate">Accès complet</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition text-sm ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </button>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <NavLink to="/pos">
            {({ isActive }) => (
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition text-left ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>↩</span>
                {sidebarOpen && <span className="truncate">Retour POS</span>}
              </button>
            )}
          </NavLink>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className={`w-full justify-start gap-3 text-slate-300 hover:bg-red-600/20 hover:text-red-300 ${
              !sidebarOpen ? 'p-2' : ''
            }`}
            size={sidebarOpen ? 'sm' : 'icon'}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm truncate">Déconnexion</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b h-16 flex items-center px-8 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Administration</h2>
            <p className="text-xs text-gray-500">Gestion du restaurant et analyse des performances</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
