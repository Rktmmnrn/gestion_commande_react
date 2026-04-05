import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsAsync } from '@/api/products';
import { getCategoriesAsync } from '@/api/categories';
import { createProductAsync, updateProductAsync, deleteProductAsync, patchProductAvailabilityAsync } from '@/api/admin';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil, Plus, Trash2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Prix invalide'),
  category: z.number({ required_error: 'Catégorie requise' }),
  available: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: '', category: 0, available: true },
  });

  // Queries
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProductsAsync(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      if (filterCategory !== 'all' && p.category !== Number(filterCategory)) return false;
      if (filterAvailable !== null && p.available !== filterAvailable) return false;
      return true;
    });
  }, [products, filterCategory, filterAvailable]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProductAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Succès', description: 'Produit créé', variant: 'default' });
      setOpenDialog(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de créer le produit', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) => 
      updateProductAsync(id, data as { name: string; price: string; category: number; available: boolean }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Succès', description: 'Produit mis à jour', variant: 'default' });
      setOpenDialog(false);
      setEditingId(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le produit', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Succès', description: 'Produit supprimé', variant: 'default' });
      setDeletingId(null);
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de supprimer le produit', variant: 'destructive' });
    },
  });

  const availabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: number; available: boolean }) =>
      patchProductAvailabilityAsync(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de modifier la disponibilité', variant: 'destructive' });
    },
  });

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    form.setValue('name', product.name);
    form.setValue('price', product.price);
    form.setValue('category', product.category);
    form.setValue('available', product.available);
    setOpenDialog(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    form.reset();
    setOpenDialog(true);
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingId) {
      updateMutation.mutate({ 
        id: editingId, 
        data: data as { name: string; price: string; category: number; available: boolean }
      });
    } else {
      createMutation.mutate(data as { name: string; price: string; category: number; available: boolean });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-600 mt-1">Gérez le catalogue de produits</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-base px-3 py-1">
            Total: {filteredProducts.length}
          </Badge>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-2">Catégorie</label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-64 flex items-end gap-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
            <Switch
              checked={filterAvailable === true}
              onCheckedChange={(checked) =>
                setFilterAvailable(checked ? true : null)
              }
            />
            <span>Disponibles seulement</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Nom</TableHead>
              <TableHead className="font-semibold">Prix</TableHead>
              <TableHead className="font-semibold">Catégorie</TableHead>
              <TableHead className="font-semibold">Disponibilité</TableHead>
              <TableHead className="font-semibold w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.category_name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.available}
                      onCheckedChange={(checked) =>
                        availabilityMutation.mutate({
                          id: product.id,
                          available: checked,
                        })
                      }
                      disabled={availabilityMutation.isPending}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <Pencil className="w-4 h-4" />
                        Éditer
                      </Button>
                      <Button
                        onClick={() => setDeletingId(product.id)}
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
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Éditer le produit' : 'Créer un produit'}</DialogTitle>
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
                      <Input placeholder="Ex: Burger Deluxe" {...field} disabled={createMutation.isPending || updateMutation.isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input placeholder="12.50" {...field} disabled={createMutation.isPending || updateMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(val) => field.onChange(Number(val))}
                        disabled={createMutation.isPending || updateMutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mb-0">Disponible</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={createMutation.isPending || updateMutation.isPending} />
                    </FormControl>
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
              Cette action est irréversible. Le produit sera supprimé définitivement.
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
