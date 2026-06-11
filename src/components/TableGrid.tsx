import { useTables } from '@/hooks/useTables';
import { useReservations } from '@/hooks/useReservations';
import type { Table } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Utensils, Calendar } from 'lucide-react';

interface TableGridProps {
  selectedTable: Table | null;
  onSelectTable: (table: Table) => void;
}

const statusColor: Record<Table['status'], string> = {
  free: 'bg-transparent border-border text-white hover:border-primary',
  occuped: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
};

const isReservationToday = (dateStr: string) => {
  const resDate = new Date(dateStr);
  const today = new Date();
  return (
    resDate.getDate() === today.getDate() &&
    resDate.getMonth() === today.getMonth() &&
    resDate.getFullYear() === today.getFullYear()
  );
};

export default function TableGrid({ selectedTable, onSelectTable }: TableGridProps) {
  const { data: tables, isLoading: loadingTables, error: tablesError } = useTables();
  const { data: reservations = [], isLoading: loadingReservations } = useReservations();

  if (loadingTables || loadingReservations) {
    return (
      <div className="p-4 h-full flex flex-col" style={{ background: 'hsl(var(--pos-sidebar))' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>
          Tables
        </h2>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (tablesError) {
    return (
      <div className="p-4 h-full flex flex-col" style={{ background: 'hsl(var(--pos-sidebar))' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>
          Tables
        </h2>
        <ErrorMessage error={tablesError} />
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col" style={{ background: 'hsl(var(--pos-sidebar))' }}>
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>
        Tables
      </h2>
      <div className="grid grid-cols-3 gap-2 flex-1 content-start">
        {tables?.map((table) => {
          const isSelected = selectedTable?.id === table.id;
          
          // Vérifier s'il y a une réservation active aujourd'hui pour cette table
          const activeResToday = reservations.filter(
            r => r.table === table.id && 
                 r.statut !== 'canceled' && 
                 isReservationToday(r.date_heure)
          );

          return (
            <button
              key={table.id}
              onClick={() => onSelectTable(table)}
              aria-label={`Table ${table.number} - ${table.status}`}
              aria-pressed={isSelected}
              className={`relative flex flex-col items-center justify-center rounded-lg border p-3 transition-all text-xs font-medium
                ${statusColor[table.status]}
                ${isSelected ? 'ring-2 ring-primary scale-105' : ''}`}
            >
              {activeResToday.length > 0 && (
                <div 
                  className="absolute top-1 right-1 flex h-2 w-2"
                  title={`Réservée aujourd'hui (${activeResToday.length})`}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
              )}
              <Utensils className="h-4 w-4 mb-1 opacity-60" />
              <span className="font-bold text-sm">T{table.number}</span>
              <span className="text-[10px] mt-0.5 capitalize">{table.status}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

