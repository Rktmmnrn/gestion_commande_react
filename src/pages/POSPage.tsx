import { useMemo, useState } from 'react';
import { TableGrid } from '@/components/TableGrid';
import { MenuPanel } from '@/components/MenuPanel';
import { OrderSummary } from '@/components/OrderSummary';
import { useCategories, useProducts } from '@/hooks';
import {
  useOrders,
  useCreateOrder,
  useUpdateOrderStatus,
  useAddOrderItem,
} from '@/hooks/useOrders';
import type { Product, Order } from '@/types';

export const POSPage = () => {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(
    null
  );
  const [tempItems, setTempItems] = useState<
    Array<Product & { quantity: number }>
  >([]);

  // Queries
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders = [] } = useOrders();

  // Mutations
  const createOrderMutation = useCreateOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const addItemMutation = useAddOrderItem();

  // Get current order for selected table
  const currentOrder = useMemo(
    () => orders?.find((o: Order) => o.table_number === selectedTableNumber),
    [orders, selectedTableNumber]
  );

  // Handle adding product to temporary items
  const handleAddToOrder = (product: Product, quantity: number) => {
    setTempItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Handle removing item from order
  const handleRemoveItem = (itemId?: number) => {
    if (!itemId) return;

    if (currentOrder?.id) {
      // Remove from existing order (would need API support)
      console.log('Remove item from order:', itemId);
    } else {
      // Remove from temp items
      setTempItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  // Handle creating new order
  const handleCreateOrder = (
    items: Array<{ product: number; quantity: number }>
  ) => {
    if (!selectedTableNumber || items.length === 0) return;

    createOrderMutation.mutate(
      {
        table_number: selectedTableNumber,
        items,
      },
      {
        onSuccess: () => {
          setTempItems([]);
        },
      }
    );
  };

  // Handle adding items to existing order
  const handleAddItems = (
    items: Array<{ product: number; quantity: number }>
  ) => {
    if (!currentOrder?.id || items.length === 0) return;

    // Add items one by one or batch (depends on API)
    items.forEach((item) => {
      addItemMutation.mutate({
        orderId: currentOrder.id,
        payload: {
          product: item.product,
          quantity: item.quantity,
        },
      });
    });

    setTempItems([]);
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    if (!currentOrder?.id) return;

    updateStatusMutation.mutate({
      orderId: currentOrder.id,
      status,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-amber-500/30 p-4">
        <h1 className="text-3xl font-bold text-white">
          POS - Gestion Commandes
        </h1>
        <p className="text-gray-400 text-sm mt-1">Restaurant Management System</p>
      </div>

      {/* Main Layout - 3 Columns */}
      <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">
        {/* Left Panel - Table Grid (4 cols) */}
        <div className="col-span-4 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 overflow-y-auto">
          <TableGrid
            orders={orders}
            selectedTableId={selectedTableNumber}
            onTableSelect={setSelectedTableNumber}
          />
        </div>

        {/* Center Panel - Menu (4 cols) */}
        <div className="col-span-4 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 overflow-hidden flex flex-col">
          <MenuPanel
            categories={categories}
            products={products}
            isLoading={categoriesLoading || productsLoading}
            onAddToOrder={handleAddToOrder}
          />
        </div>

        {/* Right Panel - Order Summary (4 cols) */}
        <div className="col-span-4 bg-gray-800 rounded-lg p-4 shadow-xl border border-gray-700 overflow-hidden flex flex-col">
          <OrderSummary
            order={currentOrder}
            tempItems={tempItems}
            isCreatingOrder={
              createOrderMutation.isPending || addItemMutation.isPending
            }
            isUpdatingStatus={updateStatusMutation.isPending}
            onCreate={handleCreateOrder}
            onAddItem={handleAddItems}
            onStatusChange={handleStatusChange}
            onRemoveItem={handleRemoveItem}
            tableNumber={selectedTableNumber}
          />
        </div>
      </div>
    </div>
  );
};
