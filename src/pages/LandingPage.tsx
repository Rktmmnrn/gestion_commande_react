import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutGrid, RefreshCw, ClipboardList } from 'lucide-react';

const features = [
  { icon: LayoutGrid, title: 'Gestion des tables', desc: "Vue en temps réel de l'occupation et du statut de chaque table." },
  { icon: RefreshCw, title: 'Menu en temps réel', desc: "Mettez à jour vos plats et catégories instantanément." },
  { icon: ClipboardList, title: 'Suivi des commandes', desc: "Suivez chaque commande de la prise à la livraison." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-10 px-6 max-w-3xl w-full">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-6xl font-bold tracking-tight text-amber-400">
            Gérer les commandes de votre restau
          </h1>
          <p className="text-slate-400 text-lg">
            La solution pour gérer votre restaurant avec efficacité et élégance.
          </p>
        </div>
        {/* features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 space-y-3 text-center"
            >
              <div className="mx-auto w-11 h-11 rounded-lg flex items-center justify-center bg-amber-400/10">
                <f.icon className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <Button
          onClick={() => navigate('/pos')}
          size="lg"
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-10 text-base"
        >
          Entrer
        </Button>
      </div>
    </div>
  );
}
