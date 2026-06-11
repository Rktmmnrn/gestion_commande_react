import { useState } from 'react';
import type { Product, Table } from '@/types';
import { useCreateOrder, useUpdateOrderStatus, useOrders } from '@/hooks/useOrders';
import { useReservations } from '@/hooks/useReservations';
import { useClients } from '@/hooks/useClients';
import { Trash2, Send, ChefHat, Check, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderSummaryProps {
  selectedTable: Table | null;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  onClearCart?: () => void;
}

const STATUS_FLOW: Record<string, { next: string; label: string; icon: React.ReactNode }> = {
  pending: { next: 'preparing', label: 'Envoyer en cuisine', icon: <ChefHat className="h-4 w-4" /> },
  preparing: { next: 'ready', label: 'Marquer prêt', icon: <Check className="h-4 w-4" /> },
  ready: { next: 'delivered', label: 'Livré', icon: <Check className="h-4 w-4" /> },
};

type OrderType = 'on_site' | 'online' | 'take_away';

const isReservationToday = (dateStr: string) => {
  const resDate = new Date(dateStr);
  const today = new Date();
  return (
    resDate.getDate() === today.getDate() &&
    resDate.getMonth() === today.getMonth() &&
    resDate.getFullYear() === today.getFullYear()
  );
};

export default function OrderSummary({ selectedTable, cart, onUpdateCart, onClearCart }: OrderSummaryProps) {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: reservations = [] } = useReservations();
  const { data: clients = [] } = useClients();
  const createOrder = useCreateOrder();
  const updateStatus = useUpdateOrderStatus();
  const [orderType, setOrderType] = useState<OrderType>('on_site');

  const activeOrder = Array.isArray(orders)? orders.find( // verification que order est bien un tableau
    (o) => o.table === selectedTable?.id && o.status !== 'delivered' && o.status !== 'cancelled'
  ) : undefined;

  const total = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  const headerTitle = orderType === 'take_away'
    ? 'À emporter'
    : orderType === 'online'
      ? 'En ligne'
      : selectedTable
        ? `Table ${selectedTable.number}`
        : 'Sélectionnez une table';

  const tableReservations = selectedTable
    ? reservations.filter(
        (r) =>
          r.table === selectedTable.id &&
          r.statut !== 'canceled' &&
          isReservationToday(r.date_heure)
      )
    : [];

  const handleRemove = (productId: number) => {
    onUpdateCart(cart.filter((i) => i.product.id !== productId));
    toast.success('Commande supprimée du panier');
  };

  const handleQuantity = (productId: number, delta: number) => {
    onUpdateCart(
      cart
        .map((i) => (i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleSubmit = () => {
    if ((orderType === 'on_site' && !selectedTable) || cart.length === 0) return;
    createOrder.mutate(
      { table: selectedTable?.id, type_commande: orderType, items: cart.map((i) => ({ product: i.product.id, quantity: i.quantity })) },
      {
        onSuccess: () => {
          toast.success('Commande créée');
          onUpdateCart([]);
          onClearCart?.();
        },
        onError: (e) => {
          toast.error('Erreur lors de la création');
          console.error(e.message);
        },
      }
    );
  };

  const handleStatusChange = () => {
    if (!activeOrder) return;
    const flow = STATUS_FLOW[activeOrder.status];
    if (!flow) return;
    updateStatus.mutate(
      { id: activeOrder.id, status: flow.next },
      {
        onSuccess: () => toast.success(`Statut → ${flow.next}`),
        onError: () => toast.error('Erreur'),
      }
    );
  };

  if (ordersLoading) { // état de chargement
    return (
      <div className="flex flex-col h-full bg-card border-l border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {headerTitle}
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {headerTitle}
        </h2>
        {activeOrder && (
          <span className="text-xs text-primary capitalize font-medium">
            Commande #{activeOrder.id} — {activeOrder.status}
          </span>
        )}
      </div>

      {tableReservations.length > 0 && (
        <div className="p-3 border-b border-amber-500/20 bg-amber-500/5 space-y-2">
          {tableReservations.map((res) => {
            const client = clients.find((c) => c.id === res.client);
            const timeStr = new Date(res.date_heure).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div key={res.id} className="flex gap-2 items-start text-xs text-amber-600 dark:text-amber-400">
                <Calendar className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">
                    Table réservée aujourd'hui à {timeStr}
                  </p>
                  <p className="text-[10px] text-amber-700/90 dark:text-amber-400/90 mt-0.5">
                    Client : {client?.nom || `Client #${res.client}`} ({res.nb_personnes} personnes)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeOrder && activeOrder.items && activeOrder.items.length > 0 && ( // vérif que activeOrder et activeOrder..items existent
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">En cours</p>
          {activeOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between text-xs py-0.5 text-foreground">
              <span>{item.quantity}x {item.product_name}</span>
              <span>{item.subtotal.toFixed(2)} €</span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-bold mt-1 pt-1 border-t border-border text-foreground">
            <span>Total commande</span>
            <span>{activeOrder.total.toFixed(2)} €</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrderType('on_site')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${orderType === 'on_site' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            Sur place
          </button>
          <button
            onClick={() => setOrderType('take_away')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${orderType === 'take_away' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            À emporter
          </button>
          <button
            onClick={() => setOrderType('online')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${orderType === 'online' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >
            En ligne
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-8">Ajoutez des plats depuis le menu</p>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">{parseFloat(item.product.price).toFixed(2)} €</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => handleQuantity(item.product.id, -1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground text-xs font-bold hover:bg-muted/80">−</button>
                  <span className="w-6 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                  <button onClick={() => handleQuantity(item.product.id, 1)} className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground text-xs font-bold hover:bg-muted/80">+</button>
                  <button onClick={() => handleRemove(item.product.id)} className="w-6 h-6 rounded bg-destructive/10 flex items-center justify-center text-destructive ml-1 hover:bg-destructive/20">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        {cart.length > 0 && (
          <>
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Nouveau total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={(orderType === 'on_site' && !selectedTable) || createOrder.isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {createOrder.isPending ? 'Envoi...' : 'Envoyer la commande'}
            </button>
          </>
        )}
        {activeOrder && STATUS_FLOW[activeOrder.status] && (
          <button
            onClick={handleStatusChange}
            disabled={updateStatus.isPending}
            className="w-full py-2 rounded-lg border border-primary text-primary font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            {STATUS_FLOW[activeOrder.status].icon}
            {STATUS_FLOW[activeOrder.status].label}
          </button>
        )}
      </div>
    </div>
  );
}
