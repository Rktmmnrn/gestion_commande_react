import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCreateClient } from '@/hooks/useClients';
import { useCreateReservation } from '@/hooks/useReservations';
import { clientSchema, reservationSchema, ClientPayload, ReservationPayload } from '@/types';
import { getProductsAsync } from '@/api/products';
import { getCategoriesAsync } from '@/api/categories';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  UtensilsCrossed, CalendarCheck, ShoppingBag, ChevronRight,
  Star, Clock, MapPin, Phone, ArrowRight, Lock
} from 'lucide-react';

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '#menu', label: 'Notre Carte' },
    { href: '#reservation', label: 'Réserver' },
    { href: '#order', label: 'Commander' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-amber-400" />
          <span className="font-bold text-white text-lg tracking-tight">{'< Resto >'}</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm text-slate-300 hover:text-amber-400 transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/acces')}
            className="text-slate-400 hover:text-white text-xs gap-1"
          >
            <Lock className="w-3 h-3" />
            Accès personnel
          </Button>
          <a href="#reservation">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold hidden md:flex">
              Réserver
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen top-[20px] flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-slate-950 to-slate-900" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-8">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-400 text-sm font-medium">Restaurant • Bar • Événements</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Une expérience<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            culinaire unique
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Découvrez notre carte, réservez votre table ou passez commande directement en ligne.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#menu">
            <Button size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 text-base gap-2 shadow-lg shadow-amber-500/20">
              Voir la carte <ChevronRight className="w-5 h-5" />
            </Button>
          </a>
          <a href="#reservation">
            <Button size="lg" variant="outline"
              className="border-white/20 hover:bg-white/10 font-semibold px-8 text-base gap-2">
              <CalendarCheck className="w-5 h-5" />
              Réserver une table
            </Button>
          </a>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400 text-sm">
          {[
            { icon: Clock, text: 'Ouvert 7j/7 — 11h à 23h' },
            { icon: MapPin, text: 'Jarding des mers, Tuléar' },
            { icon: Phone, text: '+261 34 28 752 34' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-amber-500" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Menu Section ─────────────────────────────────────────────────────────────
function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products', { available: true }],
    queryFn: () => getProductsAsync({ available: true }),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
  });

  const filtered = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <section id="menu" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Notre Carte</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Des saveurs authentiques préparées avec passion, chaque jour.</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? 'bg-amber-500 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tout voir
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <div key={product.id}
                className="group bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-slate-800 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-amber-400 font-bold text-lg">
                    {parseFloat(product.price).toFixed(2)} €
                  </span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{product.name}</h3>
                <p className="text-slate-500 text-xs uppercase tracking-wider">{product.category_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Reservation Section ──────────────────────────────────────────────────────
function ReservationSection() {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientId, setClientId] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const createClient = useCreateClient();
  const createReservation = useCreateReservation();

  const clientForm = useForm<ClientPayload>({
    resolver: zodResolver(clientSchema),
  });
  const reservationForm = useForm<ReservationPayload>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { type_commande: 'on_site' },
  });

  const onClientSubmit = (data: ClientPayload) => {
    const payload = data as Required<ClientPayload>;
    createClient.mutate(payload, {
      onSuccess: (client) => {
        setClientId(client.id);
        setStep(2);
        toast.success('Informations enregistrées !');
      },
      onError: () => toast.error('Erreur lors de l\'enregistrement'),
    });
  };

  const onReservationSubmit = (data: ReservationPayload) => {
    const payload = data as Required<ReservationPayload>;
    if (!clientId) return;
    createReservation.mutate(
      { ...payload, client: clientId },
      {
        onSuccess: () => {
          setDone(true);
          toast.success('Réservation confirmée ! Un email de confirmation vous sera envoyé.');
        },
        onError: () => toast.error('Erreur lors de la réservation'),
      }
    );
  };

  return (
    <section id="reservation" className="py-24 bg-slate-950">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Réserver une Table</h2>
          <p className="text-slate-400">Réservez votre table en quelques secondes. Un mail de confirmation vous sera envoyé.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Réservation confirmée !</h3>
              <p className="text-slate-400 text-sm mb-6">Nous avons bien reçu votre demande. Vérifiez votre email pour confirmer.</p>
              <Button onClick={() => { setDone(false); setStep(1); clientForm.reset(); reservationForm.reset(); }}
                variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Faire une autre réservation
              </Button>
            </div>
          ) : (
            <>
              {/* Steps indicator */}
              <div className="flex items-center gap-3 mb-8">
                {[1, 2].map(s => (
                  <div key={s} className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                      step >= s ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-500'
                    }`}>{s}</div>
                    <span className={`text-sm font-medium ${step >= s ? 'text-white' : 'text-slate-500'}`}>
                      {s === 1 ? 'Vos informations' : 'Votre réservation'}
                    </span>
                    {s === 1 && <div className="flex-1 h-px bg-slate-800" />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nom complet *</Label>
                      <Input {...clientForm.register('nom')}
                        placeholder="Jean Dupont"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                      {clientForm.formState.errors.nom && (
                        <p className="text-red-400 text-xs">{clientForm.formState.errors.nom.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Téléphone *</Label>
                      <Input {...clientForm.register('telephone')}
                        placeholder="+261 34 00 000 00"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                      {clientForm.formState.errors.telephone && (
                        <p className="text-red-400 text-xs">{clientForm.formState.errors.telephone.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Email *</Label>
                    <Input {...clientForm.register('email')}
                      type="email" placeholder="jean@example.com"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                    {clientForm.formState.errors.email && (
                      <p className="text-red-400 text-xs">{clientForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Adresse *</Label>
                    <Input {...clientForm.register('adresse')}
                      placeholder="12 Rue Exemple, Antananarivo"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                    {clientForm.formState.errors.adresse && (
                      <p className="text-red-400 text-xs">{clientForm.formState.errors.adresse.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={createClient.isPending}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold gap-2">
                    {createClient.isPending ? 'Enregistrement...' : 'Continuer'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={reservationForm.handleSubmit(onReservationSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Date et heure *</Label>
                      <Input
                        {...reservationForm.register('date_heure')}
                        type="datetime-local"
                        className="bg-slate-800 border-slate-700 text-white"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {reservationForm.formState.errors.date_heure && (
                        <p className="text-red-400 text-xs">{reservationForm.formState.errors.date_heure.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nombre de personnes *</Label>
                      <Input
                        {...reservationForm.register('nb_personnes')}
                        type="number" min={1} max={20}
                        placeholder="2"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                      {reservationForm.formState.errors.nb_personnes && (
                        <p className="text-red-400 text-xs">{reservationForm.formState.errors.nb_personnes.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Type de réservation</Label>
                    <div className="flex gap-3">
                      {[
                        { val: 'on_site', label: 'Sur place' },
                        { val: 'take_away', label: 'À emporter' },
                        { val: 'online', label: 'En ligne' },
                      ].map(({ val, label }) => (
                        <button
                          key={val} type="button"
                          onClick={() => reservationForm.setValue('type_commande', val as any)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                            reservationForm.watch('type_commande') === val
                              ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                              : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      Retour
                    </Button>
                    <Button type="submit" disabled={createReservation.isPending}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold gap-2">
                      {createReservation.isPending ? 'Envoi...' : 'Confirmer la réservation'}
                      <CalendarCheck className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Order Online Section ─────────────────────────────────────────────────────
function OrderSection() {
  return (
    <section id="order" className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-2 mb-6">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Click & Collect</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Commandez<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                où que vous soyez
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Parcourez notre menu, ajoutez vos plats préférés au panier, et passez votre commande en ligne. Récupérez-la au restaurant ou faites-vous livrer.
            </p>
            <div className="space-y-4 mb-10">
              {[
                'Choisissez vos plats depuis notre carte',
                'Renseignez vos informations de contact',
                'Récupérez votre commande prête',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 text-sm font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-300">{step}</span>
                </div>
              ))}
            </div>
            <a href="#menu">
              <Button size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold px-8 gap-2 shadow-lg shadow-amber-500/20">
                <ShoppingBag className="w-5 h-5" />
                Commander maintenant
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock, title: 'Livraison rapide', desc: '30 min en moyenne' },
              { icon: Star, title: 'Qualité garantie', desc: 'Fraîcheur à chaque commande' },
              { icon: ShoppingBag, title: 'Click & Collect', desc: 'Commandez, récupérez' },
              { icon: Phone, title: 'Support 7j/7', desc: 'On est toujours là' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-5 hover:border-amber-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white">{'< Resto >'}</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Une expérience culinaire unique au cœur de la ville. Réservez votre table dès aujourd'hui.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <div className="space-y-2">
              {['#menu', '#reservation', '#order'].map((href, i) => (
                <a key={href} href={href}
                  className="block text-slate-500 hover:text-amber-400 text-sm transition-colors">
                  {['Notre Carte', 'Réserver', 'Commander'][i]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Nous trouver</h4>
            <div className="space-y-2 text-slate-500 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500 shrink-0" />Jarding des mers, Tuléar</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500 shrink-0" />+261 34 28 752 34</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500 shrink-0" />Lun – Dim : 11h00 – 23h00</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© 2026 {'<Resto >'}. Tous droits réservés. Design by Fenohery</p>
          <button
            onClick={() => navigate('/acces')}
            className="text-slate-700 hover:text-slate-500 text-xs flex items-center gap-1 transition-colors"
          >
            <Lock className="w-3 h-3" />
            Accès personnel (POS / Admin)
          </button>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <MenuSection />
      <ReservationSection />
      <OrderSection />
      <Footer />
    </div>
  );
}
