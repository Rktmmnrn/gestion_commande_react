import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '@/hooks/useClients';
import { clientSchema, ClientPayload, Client } from '@/types';
import { Plus, Edit2, Trash2, Search, Mail, Phone, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function ClientsAdmin() {
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ClientPayload>({
    resolver: zodResolver(clientSchema),
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    reset({ nom: '', adresse: '', telephone: '', email: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setValue('nom', client.nom);
    setValue('adresse', client.adresse);
    setValue('telephone', client.telephone);
    setValue('email', client.email);
    setIsFormOpen(true);
  };

  const onSubmit = (data: ClientPayload) => {
    if (editingClient) {
      updateClient.mutate(
        { id: editingClient.id, ...data },
        {
          onSuccess: () => {
            toast.success('Client mis à jour');
            setIsFormOpen(false);
          },
          onError: () => toast.error('Erreur lors de la modification'),
        }
      );
    } else {
      createClient.mutate(data, {
        onSuccess: () => {
          toast.success('Client ajouté');
          setIsFormOpen(false);
        },
        onError: () => toast.error('Erreur lors de la création'),
      });
    }
  };

  const handleDelete = () => {
    if (!clientToDelete) return;
    deleteClient.mutate(clientToDelete.id, {
      onSuccess: () => {
        toast.success('Client supprimé');
        setClientToDelete(null);
      },
      onError: () => toast.error('Erreur lors de la suppression'),
    });
  };

  const filteredClients = clients.filter(c =>
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telephone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Clients</h1>
          <p className="text-sm text-slate-500">Consultez, modifiez et gérez la base de clients.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un client
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Chargement des clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucun client trouvé.</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <span>{client.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.telephone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{client.adresse}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleOpenEdit(client)}
                        className="h-8 w-8 hover:bg-amber-100 hover:text-amber-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => setClientToDelete(client)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Creation/Edition Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Modifier le client' : 'Ajouter un client'}</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour enregistrer le client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="nom">Nom complet</Label>
              <Input id="nom" {...register('nom')} placeholder="Ex: Jean Dupont" />
              {errors.nom && <p className="text-red-500 text-xs">{errors.nom.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="Ex: jean.dupont@email.com" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" {...register('telephone')} placeholder="Ex: +261 34 28 752 34" />
              {errors.telephone && <p className="text-red-500 text-xs">{errors.telephone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="adresse">Adresse</Label>
              <Input id="adresse" {...register('adresse')} placeholder="Ex: Jardin des mers, Tuléar" />
              {errors.adresse && <p className="text-red-500 text-xs">{errors.adresse.message}</p>}
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createClient.isPending || updateClient.isPending} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
                {editingClient ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le client <strong>{clientToDelete?.nom}</strong> ainsi que toutes ses données associées de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
