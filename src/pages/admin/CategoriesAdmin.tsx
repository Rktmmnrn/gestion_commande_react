import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoriesAsync } from '@/api/categories';
import { createCategoryAsync, updateCategoryAsync, deleteCategoryAsync } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  // Queries
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategoryAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Succès', description: 'Catégorie créée', variant: 'default' });
      setOpenDialog(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de créer la catégorie', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) => 
      updateCategoryAsync(id, data as { name: string }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Succès', description: 'Catégorie mise à jour', variant: 'default' });
      setOpenDialog(false);
      setEditingId(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour la catégorie', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Succès', description: 'Catégorie supprimée', variant: 'default' });
      setDeletingId(null);
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de supprimer la catégorie', variant: 'destructive' });
    },
  });

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    form.setValue('name', category.name);
    setOpenDialog(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset();
    setOpenDialog(true);
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: data as { name: string } });
    } else {
      createMutation.mutate(data as { name: string });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-600 mt-1">Gérez les catégories de produits</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base px-3 py-1">
            Total: {categories.length}
          </Badge>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle catégorie
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nom</TableHead>
              <TableHead className="font-semibold w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length > 0 ? (
              categories.map((category: any) => (
                <TableRow key={category.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(category)}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Éditer
                      </Button>
                      <Button
                        onClick={() => setDeletingId(category.id)}
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
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Aucune catégorie trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Éditer la catégorie' : 'Créer une catégorie'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Plats chauds" {...field} disabled={createMutation.isPending || updateMutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending || updateMutation.isPending ? 'En cours...' : 'Enregistrer'}
              </Button>
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
              Cette action est irréversible. La catégorie sera supprimée définitivement.
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
