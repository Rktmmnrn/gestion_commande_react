import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import apiClient from '@/api/client';

// Types
interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'Order' | 'Product' | 'Category' | 'User';
  entityId: number;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
}

// 🔄 Récupérer les logs d'activité depuis l'API
const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  try {
    // Récupérer les commandes (avec timestamps et audit info)
    const { data: orders } = await apiClient.get<any[]>('orders/');
    
    // Construire les logs à partir de l'historique
    const logs: ActivityLog[] = [];
    let id = 1;
    
    // Ajouter changemènts de statut des commandes
    orders?.forEach((order: any) => {
      if (order.created_at) {
        logs.push({
          id: id++,
          timestamp: order.created_at,
          user: order.created_by_info?.username || 'N/A',
          action: 'CREATE',
          entity: 'Order',
          entityId: order.id,
          newValue: `Commande créée table ${order.table_number}`,
        });
      }
      
      if (order.updated_at && order.updated_at !== order.created_at) {
        logs.push({
          id: id++,
          timestamp: order.updated_at,
          user: order.updated_by_info?.username || 'N/A',
          action: 'UPDATE',
          entity: 'Order',
          entityId: order.id,
          newValue: `Statut: ${order.status}`,
        });
      }
    });
    
    // Récupérer les produits
    const { data: products } = await apiClient.get<any[]>('products/');
    
    products?.forEach((product: any) => {
      if (product.created_at) {
        logs.push({
          id: id++,
          timestamp: product.created_at,
          user: product.created_by_info?.username || 'N/A',
          action: 'CREATE',
          entity: 'Product',
          entityId: product.id,
          newValue: `Produit créé: ${product.name}`,
        });
      }
      
      if (product.updated_at && product.updated_at !== product.created_at) {
        logs.push({
          id: id++,
          timestamp: product.updated_at,
          user: product.updated_by_info?.username || 'N/A',
          action: 'UPDATE',
          entity: 'Product',
          entityId: product.id,
          newValue: `Produit modifié: ${product.name}`,
        });
      }
    });
    
    // Trier par date décroissante
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    return [];
  }
};

const getActionColor = (action: ActivityLog['action']) => {
  switch (action) {
    case 'CREATE': return 'bg-green-100 text-green-800';
    case 'UPDATE': return 'bg-blue-100 text-blue-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    case 'LOGIN': return 'bg-purple-100 text-purple-800';
    case 'LOGOUT': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getActionLabel = (action: ActivityLog['action']) => {
  switch (action) {
    case 'CREATE': return 'Création';
    case 'UPDATE': return 'Modification';
    case 'DELETE': return 'Suppression';
    case 'LOGIN': return 'Connexion';
    case 'LOGOUT': return 'Déconnexion';
    default: return action;
  }
};

export function ActivityLog() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: fetchActivityLogs,
  });

  const filteredLogs = logs?.filter(log =>
    (actionFilter === 'all' || log.action === actionFilter) &&
    (entityFilter === 'all' || log.entity === entityFilter)
  ) || [];

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Date/Heure',
      size: 150,
      cell: ({ row }) => (
        <span className="text-sm">
          {format(new Date(row.original.timestamp), 'dd/MM/yyyy HH:mm', { locale: fr })}
        </span>
      ),
    },
    {
      accessorKey: 'user',
      header: 'Utilisateur',
      size: 100,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 120,
      cell: ({ row }) => (
        <Badge className={getActionColor(row.original.action)}>
          {getActionLabel(row.original.action)}
        </Badge>
      ),
    },
    {
      accessorKey: 'entity',
      header: 'Entité',
      size: 100,
    },
    {
      accessorKey: 'entityId',
      header: 'ID Entité',
      size: 100,
    },
    {
      id: 'changes',
      header: 'Changements',
      size: 200,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.oldValue && (
            <div className="text-red-600 line-through">{row.original.oldValue}</div>
          )}
          {row.original.newValue && (
            <div className="text-green-600">{row.original.newValue}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      size: 120,
    },
  ];

  const table = useReactTable({
    data: filteredLogs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Journal d'Activité</h2>
          <p className="text-muted-foreground">Historique des actions des utilisateurs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Activités</CardTitle>
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
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
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-40">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucune activité trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} sur{' '}
              {table.getFilteredRowModel().rows.length} activités.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}