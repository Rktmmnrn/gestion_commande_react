import type { Order, Product } from '@/types';

interface DisplayItem {
  id: number;
  product?: number;
  product_name?: string;
  name?: string;
  quantity: number;
  price: string;
  subtotal?: number;
}

interface OrderSummaryProps {
  order: Order | undefined;
  tempItems: Array<Product & { quantity: number }>;
  isCreatingOrder: boolean;
  isUpdatingStatus: boolean;
  onCreate: (items: Array<{ product: number; quantity: number }>) => void;
  onAddItem: (items: Array<{ product: number; quantity: number }>) => void;
  onStatusChange: (status: string) => void;
  onRemoveItem: (itemId?: number) => void;
  tableNumber: number | null;
}

export const OrderSummary = ({
  order,
  tempItems = [],
  isCreatingOrder,
  isUpdatingStatus,
  onCreate,
  onAddItem,
  onStatusChange,
  onRemoveItem,
  tableNumber,
}: OrderSummaryProps) => {
  const displayItems: DisplayItem[] = (order?.items || []).map((item) => ({
    id: item.id,
    product: item.product,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.subtotal,
  }));

  const tempDisplayItems: DisplayItem[] = tempItems.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const allItems = [...displayItems, ...tempDisplayItems];

  const total = allItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'string'
      ? parseFloat(item.price)
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const hasChanges = tempItems.length > 0;
  const hasOrder = !!order?.id;

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'ready', label: 'Prêt' },
    { value: 'delivered', label: 'Livré' },
    { value: 'cancelled', label: 'Annulé' },
  ];

  const getItemName = (item: DisplayItem) => {
    return item.product_name || item.name || 'Article';
  };

  const getItemKey = (item: DisplayItem) => {
    return item.product ? `product-${item.product}` : `id-${item.id}`;
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white">
        {tableNumber
          ? `Commande - Table ${tableNumber}`
          : 'Sélectionnez une table'}
      </h2>

      {!tableNumber && (
        <div className="bg-gray-700 p-4 rounded-lg text-center text-gray-300">
          Aucune table sélectionnée
        </div>
      )}

      {tableNumber && (
        <>
          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 bg-gray-900 rounded-lg p-3">
            {allItems.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Aucun article
              </div>
            ) : (
              allItems.map((item, index) => (
                <div
                  key={`${getItemKey(item)}-${index}`}
                  className="flex justify-between items-center bg-gray-800 p-2 rounded"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm">{getItemName(item)}</p>
                    <p className="text-xs text-gray-400">
                      {item.quantity}x @{parseFloat(item.price).toFixed(2)} €
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-semibold text-sm">
                      {(
                        parseFloat(item.price) * item.quantity
                      ).toFixed(2)}{' '}
                      €
                    </p>
                    {tableNumber && (
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 mt-1"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          <div className="bg-gray-900 p-4 rounded-lg border-2 border-amber-500">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold text-lg">Total:</span>
              <span className="text-amber-400 font-bold text-2xl">
                {total.toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Status Section */}
          {hasOrder && (
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Statut</label>
              <select
                value={order?.status || 'pending'}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
                className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 hover:border-amber-500 disabled:opacity-50"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!hasOrder ? (
              <button
                onClick={() => {
                  const itemsToCreate = tempItems.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                  }));
                  onCreate(itemsToCreate);
                }}
                disabled={tempItems.length === 0 || isCreatingOrder}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
              >
                {isCreatingOrder ? 'Création...' : 'Créer la commande'}
              </button>
            ) : hasChanges ? (
              <button
                onClick={() => {
                  const itemsToAdd = tempItems.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                  }));
                  onAddItem(itemsToAdd);
                }}
                disabled={isCreatingOrder}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
              >
                {isCreatingOrder ? 'Ajout...' : 'Ajouter les articles'}
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};
