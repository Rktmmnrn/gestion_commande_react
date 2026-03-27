import { useState } from 'react';
import type { Order } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { Utensils } from 'lucide-react';

const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

interface TableGridProps {
  selectedTable: number | null;
  onSelectTable: (table: number) => void;
}

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
  preparing: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
  ready: 'bg-green-500/20 border-green-500/50 text-green-300',
  delivered: 'bg-muted/30 border-border text-muted-foreground',
  free: 'bg-card/60 border-border text-muted-foreground hover:border-primary/50',
};

export default function TableGrid({ selectedTable, onSelectTable }: TableGridProps) {
  const { data: orders } = useOrders();

  const tableOrders = new Map<number, Order>();
  orders?.forEach((o) => {
    if (o.status !== 'delivered' && o.status !== 'cancelled') {
      tableOrders.set(o.table_number, o);
    }
  });

  return (
    <div className="p-4 h-full flex flex-col" style={{ background: 'hsl(var(--pos-sidebar))' }}>
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'hsl(var(--pos-sidebar-foreground))' }}>
        Tables
      </h2>
      <div className="grid grid-cols-3 gap-2 flex-1 content-start">
        {TABLES.map((t) => {
          const order = tableOrders.get(t);
          const status = order?.status ?? 'free';
          const isSelected = selectedTable === t;
          return (
            <button
              key={t}
              onClick={() => onSelectTable(t)}
              className={`relative flex flex-col items-center justify-center rounded-lg border p-3 transition-all text-xs font-medium ${statusColor[status]} ${isSelected ? 'ring-2 ring-primary scale-105' : ''}`}
            >
              <Utensils className="h-4 w-4 mb-1 opacity-60" />
              <span className="font-bold text-sm">T{t}</span>
              {order && (
                <span className="text-[10px] mt-0.5 capitalize">{order.status}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
