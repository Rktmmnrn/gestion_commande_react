import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReservations, useCreateReservation, useUpdateReservation, useDeleteReservation } from '@/hooks/useReservations';
import { useClients } from '@/hooks/useClients';
import { useTables } from '@/hooks/useTables';
import { reservationSchema, ReservationPayload, Reservation } from '@/types';
import { Plus, Trash2, Search, Calendar, User, Armchair, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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

export default function ReservationsAdmin() {
  const { data: reservations = [], isLoading: loadingReservations } = useReservations();
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: tables = [], isLoading: loadingTables } = useTables();

  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ReservationPayload & { client: string, table?: string }>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      type_commande: 'on_site',
      client: '',
      table: '',
    }
  });

  const handleOpenCreate = () => {
    reset({
      date_heure: '',
      nb_personnes: 2,
      type_commande: 'on_site',
      client: '',
      table: '',
    });
    setIsFormOpen(true);
  };

  const onSubmit = (data: ReservationPayload & { client: string, table?: string }) => {
    if (!data.client) {
      toast.error('Veuillez sélectionner un client');
      return;
    }

    const payload = {
      date_heure: data.date_heure,
      nb_personnes: data.nb_personnes,
      type_commande: data.type_commande,
      client: parseInt(data.client),
      table: data.table ? parseInt(data.table) : undefined,
    };

    createReservation.mutate(payload, {
      onSuccess: () => {
        toast.success('Réservation créée avec succès');
        setIsFormOpen(false);
      },
      onError: () => toast.error('Erreur lors de la création de la réservation'),
    });
  };

  const handleStatusChange = (reservationId: number, newStatus: 'waiting' | 'confirmed' | 'canceled') => {
    const payload: any = {
      id: reservationId,
      statut: newStatus
    };
    if (newStatus === 'confirmed') {
      payload.confirm_client = true;
    }
    updateReservation.mutate(payload, {
      onSuccess: () => toast.success(`Réservation mise à jour : ${newStatus}`),
      onError: () => toast.error('Erreur lors de la mise à jour'),
    });
  };

  const handleDelete = () => {
    if (!reservationToDelete) return;
    deleteReservation.mutate(reservationToDelete.id, {
      onSuccess: () => {
        toast.success('Réservation supprimée');
        setReservationToDelete(null);
      },
      onError: () => toast.error('Erreur lors de la suppression'),
    });
  };

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.nom : `Client #${clientId}`;
  };

  const getClientContact = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.telephone} | ${client.email}` : '';
  };

  const getTableNumber = (tableId: number | null) => {
    if (!tableId) return 'N/A';
    const table = tables.find(t => t.id === tableId);
    return table ? `Table ${table.number}` : `Table #${tableId}`;
  };

  const filteredReservations = reservations.filter(r => {
    const clientName = getClientName(r.client).toLowerCase();
    const tableNum = getTableNumber(r.table).toLowerCase();
    const typeCmd = r.type_commande.toLowerCase();
    const query = searchTerm.toLowerCase();

    return clientName.includes(query) || tableNum.includes(query) || typeCmd.includes(query);
  });

  const getStatusBadge = (status: string, confirmClient: boolean) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 gap-1 font-medium border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirmée
            </Badge>
            {confirmClient && (
              <span className="text-[10px] text-green-600 font-semibold">Validé par le client</span>
            )}
          </div>
        );
      case 'canceled':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100/80 gap-1 font-medium border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Annulée
          </Badge>
        );
      default:
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 gap-1 font-medium border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              En attente
            </Badge>
            {!confirmClient && (
              <span className="text-[10px] text-amber-600">En attente de confirmation client</span>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Réservations</h1>
          <p className="text-sm text-slate-500">Planifiez et gérez les réservations de tables.</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-2">
          <Plus className="w-4 h-4" />
          Créer une réservation
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par client, table, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loadingReservations || loadingClients || loadingTables ? (
          <div className="p-8 text-center text-slate-500">Chargement des réservations...</div>
        ) : filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucune réservation trouvée.</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Couverts</TableHead>
                <TableHead>Table assignée</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((res) => (
                <TableRow key={res.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span>{new Date(res.date_heure).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {getClientName(res.client)}
                      </span>
                      <span className="text-xs text-slate-400">{getClientContact(res.client)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">{res.nb_personnes} pers.</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                      <Armchair className="w-4 h-4 text-slate-400" />
                      {getTableNumber(res.table)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {res.type_commande === 'on_site' ? 'Sur place' : res.type_commande === 'take_away' ? 'À emporter' : 'En ligne'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(res.statut, res.confirm_client)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {res.statut === 'waiting' && (
                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleStatusChange(res.id, 'confirmed')}
                          className="h-8 border-green-200 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800 gap-1 font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmer
                        </Button>
                      )}
                      {res.statut !== 'canceled' && (
                        <Button
                          variant="outline" size="sm"
                          onClick={() => handleStatusChange(res.id, 'canceled')}
                          className="h-8 border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800 gap-1 font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Annuler
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => setReservationToDelete(res)}
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

      {/* Creation Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Créer une réservation</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle réservation de table pour un client.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Client *</Label>
              <Select onValueChange={(val) => setValue('client', val)} value={watch('client')}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Sélectionnez un client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nom} ({c.telephone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="date_heure">Date & Heure *</Label>
                <Input id="date_heure" type="datetime-local" {...register('date_heure')} />
                {errors.date_heure && <p className="text-red-500 text-xs">{errors.date_heure.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="nb_personnes">Nombre de personnes *</Label>
                <Input id="nb_personnes" type="number" min={1} {...register('nb_personnes')} />
                {errors.nb_personnes && <p className="text-red-500 text-xs">{errors.nb_personnes.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Type de commande</Label>
                <Select onValueChange={(val) => setValue('type_commande', val as any)} value={watch('type_commande')}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_site">Sur place</SelectItem>
                    <SelectItem value="take_away">À emporter</SelectItem>
                    <SelectItem value="online">En ligne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Assigner une Table (optionnel)</Label>
                <Select onValueChange={(val) => setValue('table', val)} value={watch('table')}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Aucune table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune table</SelectItem>
                    {tables.map(t => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        Table {t.number} ({t.capacity} pers) - {t.status === 'free' ? 'Libre' : 'Occupée'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createReservation.isPending} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
                {createReservation.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!reservationToDelete} onOpenChange={(open) => !open && setReservationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette réservation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la réservation du client <strong>{reservationToDelete ? getClientName(reservationToDelete.client) : ''}</strong>.
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
