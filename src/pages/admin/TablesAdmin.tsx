import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from '@/hooks/useTables';
import { tableSchema } from '@/types';
import type { Table as RestaurantTable, TablePayload } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Plus, Trash2, Armchair } from 'lucide-react';

export default function TablesAdmin() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<TablePayload>({
    resolver: zodResolver(tableSchema),
    defaultValues: { number: 0, capacity: 0, status: 'free' },
  });

  // Queries & Mutations
  const { data: tables = [], isLoading, error } = useTables();
  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const handleEdit = (table: RestaurantTable) => {
    setEditingId(table.id);
    form.reset({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
    });
    setOpenDialog(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset({ number: tables.length > 0 ? Math.max(...tables.map((t) => t.number)) + 1 : 1, capacity: 4, status: 'free' });
    setOpenDialog(true);
  };

  const onSubmit = (data: TablePayload) => {
    const payload = data as Required<TablePayload>;
    if (editingId !== null) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success('Table mise à jour');
            setOpenDialog(false);
            setEditingId(null);
            form.reset();
          },
          onError: (err: any) => {
            const detail = err?.response?.data?.number?.[0] || 'Impossible de mettre à jour la table';
            toast.error(detail);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Table créée');
          setOpenDialog(false);
          form.reset();
        },
        onError: (err: any) => {
          const detail = err?.response?.data?.number?.[0] || 'Impossible de créer la table';
          toast.error(detail);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deletingId !== null) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          toast.success('Table supprimée');
          setDeletingId(null);
        },
        onError: () => {
          toast.error('Impossible de supprimer la table');
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Armchair className="w-6 h-6 text-amber-500" />
            Gestion des Tables
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gérez les tables physiques de votre établissement</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1 bg-amber-50/50 text-amber-700 border-amber-200">
            Total: {tables.length} tables
          </Badge>
          <Button onClick={handleOpenCreate} className="gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-sm">
            <Plus className="w-4 h-4" />
            Nouvelle table
          </Button>
        </div>
      </div>

      {/* Table grid / list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Numéro de Table</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Capacité (personnes)</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Statut</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-red-500">
                  Impossible de charger les tables.
                </TableCell>
              </TableRow>
            ) : tables.length > 0 ? (
              tables.map((table) => (
                <TableRow key={table.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                  <TableCell className="font-semibold text-slate-900 dark:text-white">Table {table.number}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{table.capacity} place{table.capacity > 1 ? 's' : ''}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        table.status === 'free'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                      }
                      variant="outline"
                    >
                      {table.status === 'free' ? 'Libre' : 'Occupée'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(table)}
                        variant="outline"
                        size="sm"
                        className="gap-1 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Éditer
                      </Button>
                      <Button
                        onClick={() => setDeletingId(table.id)}
                        variant="ghost"
                        size="sm"
                        disabled={table.status !== 'free'}
                        title={table.status !== 'free' ? 'Impossible de supprimer une table occupée' : undefined}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-400">
                  <Armchair className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Aucune table trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Éditer la table' : 'Créer une table'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Modifiez les informations de cette table.' : 'Ajoutez une nouvelle table à votre restaurant.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Table</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 5"
                        {...field}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité (personnes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ex: 4"
                        {...field}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Libre</SelectItem>
                        <SelectItem value="occuped">Occupée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La table sera définitivement retirée de la liste et ne sera plus disponible pour les nouvelles commandes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
