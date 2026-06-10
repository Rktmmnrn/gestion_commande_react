import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import apiClient from '@/api/client';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}

interface Order {
  id: number;
  table: number | null;  // ID FK retourné par Django (pas table_number)
  status: OrderStatus;
  total: number;
  type_commande: 'on_site' | 'online' | 'take_away';
  created_at: string;
  items: OrderItem[];
}

const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('orders/');
  return data;
};

const updateOrderStatus = async (id: number, status: OrderStatus): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`orders/${id}/status/`, { status });
  return data;
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

export function OrdersList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders-admin'],
    queryFn: fetchOrders,
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-admin'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Statut mis à jour');
      setSelectedOrder(null);
      setNewStatus('');
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const filtered = useMemo(() => {
    if (!orders) return [];
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchSearch =
        !q ||
        String(o.id).includes(q) ||
        (o.table ? String(o.table).includes(q) : false) ||
        STATUS_LABEL[o.status].toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des commandes</h2>
        <p className="text-muted-foreground">Voir et gérer toutes les commandes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle>Commandes ({filtered.length})</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="preparing">En préparation</SelectItem>
                  <SelectItem value="ready">Prêt</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="N° commande, table, serveur..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° commande</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.table ? `Table ${order.table}` : '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {order.type_commande === 'on_site' ? 'Sur place'
                        : order.type_commande === 'take_away' ? 'À emporter'
                        : 'En ligne'}
                    </TableCell>
                    <TableCell>{order.items?.length ?? 0}</TableCell>
                    <TableCell className="font-medium">{order.total?.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLOR[order.status]}>
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.created_at
                        ? format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <span className="text-sm text-muted-foreground">
                Page {page + 1} / {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                Précédent
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Commande #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.table ? `Table ${selectedOrder.table}` : '—'}
              {' — '}
              {selectedOrder?.type_commande === 'on_site' ? 'Sur place'
                : selectedOrder?.type_commande === 'take_away' ? 'À emporter'
                : 'En ligne'}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Statut actuel</p>
                  <Badge className={STATUS_COLOR[selectedOrder.status]}>
                    {STATUS_LABEL[selectedOrder.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {selectedOrder.type_commande === 'on_site' ? 'Sur place'
                      : selectedOrder.type_commande === 'take_away' ? 'À emporter'
                      : 'En ligne'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Créée le</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold">{selectedOrder.total?.toFixed(2)} €</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Articles</h4>
                <div className="space-y-1">
                  {(selectedOrder.items || []).map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1.5 border-b text-sm">
                      <span>{item.quantity}× {item.product_name}</span>
                      <span className="font-medium">{(item.subtotal ?? 0).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="preparing">En préparation</SelectItem>
                    <SelectItem value="ready">Prêt</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    if (selectedOrder && newStatus && newStatus !== selectedOrder.status) {
                      updateMutation.mutate({ id: selectedOrder.id, status: newStatus as OrderStatus });
                    } else {
                      setSelectedOrder(null);
                    }
                  }}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Mise à jour...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}