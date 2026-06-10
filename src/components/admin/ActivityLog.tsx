import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import apiClient from '@/api/client';

interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'Order' | 'Product' | 'Category' | 'User';
  entityId: number;
  newValue?: string;
}

const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  try {
    const ordersRes = await apiClient.get<any[]>('orders/');

    const logs: ActivityLog[] = [];
    let id = 1;

    (ordersRes.data || []).forEach((order: any) => {
      if (order.created_at) {
        const tableInfo = order.table ? `table ${order.table}` : order.type_commande === 'take_away' ? 'à emporter' : 'en ligne';
        logs.push({
          id: id++,
          timestamp: order.created_at,
          user: 'N/A',
          action: 'CREATE',
          entity: 'Order',
          entityId: order.id,
          newValue: `Commande créée — ${tableInfo}`,
        });
      }
      if (order.updated_at && order.updated_at !== order.created_at) {
        logs.push({
          id: id++,
          timestamp: order.updated_at,
          user: 'N/A',
          action: 'UPDATE',
          entity: 'Order',
          entityId: order.id,
          newValue: `Statut: ${order.status}`,
        });
      }
    });

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  } catch {
    return [];
  }
};

const ACTION_COLOR: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  LOGIN: 'bg-purple-100 text-purple-800',
  LOGOUT: 'bg-gray-100 text-gray-800',
};

const ACTION_LABEL: Record<string, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  LOGIN: 'Connexion',
  LOGOUT: 'Déconnexion',
};

const PAGE_SIZE = 10;

export function ActivityLog() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [page, setPage] = useState(0);

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: fetchActivityLogs,
  });

  // Filtrage 100% côté JS — pas de react-table
  const filtered = useMemo(() => {
    if (!logs) return [];
    const q = search.toLowerCase().trim();
    return logs.filter((log) => {
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      const matchEntity = entityFilter === 'all' || log.entity === entityFilter;
      const matchSearch = !q || (
        String(log.entityId).includes(q) ||
        log.user.toLowerCase().includes(q) ||
        (log.newValue || '').toLowerCase().includes(q) ||
        ACTION_LABEL[log.action].toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q)
      );
      return matchAction && matchEntity && matchSearch;
    });
  }, [logs, search, actionFilter, entityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page quand les filtres changent
  const handleActionFilter = (val: string) => { setActionFilter(val); setPage(0); };
  const handleEntityFilter = (val: string) => { setEntityFilter(val); setPage(0); };
  const handleSearch = (val: string) => { setSearch(val); setPage(0); };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Journal d'Activité</h2>
        <p className="text-muted-foreground">Historique des actions des utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <CardTitle>Activités ({filtered.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={actionFilter} onValueChange={handleActionFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Toutes les actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="CREATE">Création</SelectItem>
                  <SelectItem value="UPDATE">Modification</SelectItem>
                  <SelectItem value="DELETE">Suppression</SelectItem>
                  <SelectItem value="LOGIN">Connexion</SelectItem>
                  <SelectItem value="LOGOUT">Déconnexion</SelectItem>
                </SelectContent>
              </Select>

              <Select value={entityFilter} onValueChange={handleEntityFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Toutes les entités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les entités</SelectItem>
                  <SelectItem value="Order">Commande</SelectItem>
                  <SelectItem value="Product">Produit</SelectItem>
                  <SelectItem value="Category">Catégorie</SelectItem>
                  <SelectItem value="User">Utilisateur</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-56"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entité</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Détail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Aucune activité trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-sm">{log.user}</TableCell>
                    <TableCell>
                      <Badge className={ACTION_COLOR[log.action]}>
                        {ACTION_LABEL[log.action]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.entity}</TableCell>
                    <TableCell className="text-sm">#{log.entityId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.newValue || '—'}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}