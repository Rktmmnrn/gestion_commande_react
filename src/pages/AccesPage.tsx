import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, MonitorSmartphone, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AccesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
      {/* Back to client portal */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au portail client
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <UtensilsCrossed className="w-7 h-7 text-amber-400" />
        <span className="font-bold text-white text-xl tracking-tight">{'< Resto >'}</span>
        <span className="ml-2 text-slate-500 text-sm font-normal">— Accès personnel</span>
      </div>

      <h1 className="text-3xl font-bold text-white mb-2 text-center">Choisissez votre espace</h1>
      <p className="text-slate-500 mb-12 text-center text-sm">Sélectionnez votre profil pour accéder à votre interface.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* POS Card */}
        <button
          onClick={() => navigate('/pos')}
          className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-amber-500/5"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:bg-amber-500/20 transition-colors">
            <MonitorSmartphone className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Caisse / POS</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Interface de prise de commande pour les serveurs et caissiers. Gérez les tables et envoyez les commandes en cuisine.
          </p>
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold group-hover:gap-3 transition-all">
            <span>Accéder au POS</span>
            <span className="text-lg">→</span>
          </div>
        </button>

        {/* Admin Card */}
        <button
          onClick={() => navigate('/admin')}
          className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 text-left transition-all duration-300 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-indigo-500/5"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Administration</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Espace réservé aux gérants. Gérez les produits, tables, réservations, clients et consultez les statistiques.
          </p>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold group-hover:gap-3 transition-all">
            <span>Accéder à l'Admin</span>
            <span className="text-lg">→</span>
          </div>
        </button>
      </div>

      <p className="mt-12 text-slate-700 text-xs">Accès réservé au personnel autorisé</p>
    </div>
  );
}
