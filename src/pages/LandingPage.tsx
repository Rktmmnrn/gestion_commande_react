import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, RefreshCw, ClipboardList } from 'lucide-react';

const features = [
  { icon: LayoutGrid, title: 'Gestion des tables', desc: "Vue en temps réel de l'occupation et du statut de chaque table." },
  { icon: RefreshCw, title: 'Menu en temps réel', desc: "Mettez à jour vos plats et catégories instantanément." },
  { icon: ClipboardList, title: 'Suivi des commandes', desc: "Suivez chaque commande de la prise à la livraison." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/pos', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight" style={{ color: 'hsl(var(--primary))' }}>
            RestoPOS
          </h1>
          <p className="text-lg" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>
            La solution tout-en-un pour gérer votre restaurant avec efficacité et élégance.
          </p>
        </div>
        {/* features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border p-6 space-y-3 text-center"
              style={{
                background: 'hsl(220 25% 16%)',
                borderColor: 'hsl(220 20% 22%)',
              }}
            >
              <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
                <f.icon className="w-6 h-6" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <h3 className="font-semibold" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'hsl(220 15% 55%)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <Button
          onClick={() => navigate('/login')}
          size="lg"
          className="mt-8"
        >
          Commencer
        </Button>
      </div>
    </div>
  );
}
