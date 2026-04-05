import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrdersAsync } from '@/api/orders';
import { updateOrderStatusAsync, deleteOrderAsync } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Clock, ChefHat, CheckCircle, Package, AlertCircle } from 'lucide-react';
import type { OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  preparing: <ChefHat className="w-4 h-4" />,
  ready: <CheckCircle className="w-4 h-4" />,
  delivered: <Package className="w-4 h-4" />,
  cancelled: <AlertCircle className="w-4 h-4" />,
};

export default function OrdersAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTable, setSearchTable] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Queries
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrdersAsync(),
  });

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (searchTable && !o.table_number.toString().includes(searchTable)) return false;
      return true;
    });
  }, [orders, filterStatus, searchTable]);

  // Metrics
  const metrics = useMemo(() => ({
    pending: orders.filter((o: any) => o.status === 'pending').length,
    preparing: orders.filter((o: any) => o.status === 'preparing').length,
    ready: orders.filter((o: any) => o.status === 'ready').length,
    delivered: orders.filter((o: any) => o.status === 'delivered').length,
  }), [orders]);

  // Mutations
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      updateOrderStatusAsync(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Succès', description: 'Statut mise à jour', variant: 'default' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrderAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Succès', description: 'Commande supprimée', variant: 'default' });
      setDeletingId(null);
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de supprimer la commande', variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
        <p className="text-sm text-gray-600 mt-1">Gérez et suivez l'état de toutes les commandes</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En préparation</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.preparing}</p>
            </div>
            <ChefHat className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Prêtes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.ready}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Livrées</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.delivered}</p>
            </div>
            <Package className="w-8 h-8 text-gray-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Statut</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="preparing">En préparation</SelectItem>
              <SelectItem value="ready">Prêtes</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Rechercher par table</label>
          <Input
            placeholder="Numéro de table..."
            value={searchTable}
            onChange={(e) => setSearchTable(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Table</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Articles</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Créée le</TableHead>
              <TableHead className="font-semibold w-48">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order: any) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell className="font-medium">Table {order.table_number}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${STATUS_COLORS[order.status as OrderStatus]} flex items-center gap-1 w-fit`}
                      variant="secondary"
                    >
                      {STATUS_ICONS[order.status as OrderStatus]}
                      {STATUS_LABELS[order.status as OrderStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items.length} article(s)</TableCell>
                  <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          statusMutation.mutate({
                            id: order.id,
                            status: val as OrderStatus,
                          })
                        }
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="preparing">En préparation</SelectItem>
                          <SelectItem value="ready">Prêt</SelectItem>
                          <SelectItem value="delivered">Livrée</SelectItem>
                          <SelectItem value="cancelled">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => setDeletingId(order.id)}
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La commande sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
