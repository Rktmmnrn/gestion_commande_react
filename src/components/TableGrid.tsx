import type { Order } from '@/types';

interface TableGridProps {
  orders: Order[] | undefined;
  selectedTableId: number | null;
  onTableSelect: (tableNumber: number) => void;
}

export const TableGrid = ({
  orders = [],
  selectedTableId,
  onTableSelect,
}: TableGridProps) => {
  // Generate table numbers 1-12
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  const getTableOrder = (tableNumber: number): Order | undefined => {
    return orders?.find((order) => order.table_number === tableNumber);
  };

  const getTableStatus = (tableNumber: number) => {
    const order = getTableOrder(tableNumber);
    if (!order) return 'free';
    return order.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free':
        return 'bg-green-600 hover:bg-green-700';
      case 'pending':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'preparing':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'ready':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'delivered':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      free: 'Libre',
      pending: 'Pending',
      preparing: 'En préparation',
      ready: 'Prêt',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Tables</h2>
      <div className="grid grid-cols-3 gap-3">
        {tables.map((tableNumber) => {
          const status = getTableStatus(tableNumber);
          const order = getTableOrder(tableNumber);
          const isSelected = selectedTableId === tableNumber;

          return (
            <button
              key={tableNumber}
              onClick={() => onTableSelect(tableNumber)}
              className={`p-4 rounded-lg font-semibold transition-all ${getStatusColor(
                status
              )} ${
                isSelected
                  ? 'ring-4 ring-amber-400 shadow-lg'
                  : 'shadow-md'
              } text-white`}
            >
              <div className="text-lg">Table {tableNumber}</div>
              <div className="text-xs mt-1 opacity-90">
                {getStatusLabel(status)}
              </div>
              {order && (
                <div className="text-xs mt-1 opacity-75">
                  {order.items.length} article(s)
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
