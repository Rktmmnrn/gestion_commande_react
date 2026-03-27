import { useState, useCallback } from 'react';
import TableGrid from '@/components/TableGrid';
import MenuPanel from '@/components/MenuPanel';
import OrderSummary from '@/components/OrderSummary';
import type { Product } from '@/types';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddItem = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left: Tables sidebar */}
      <aside className="w-56 shrink-0 overflow-y-auto">
        <TableGrid selectedTable={selectedTable} onSelectTable={setSelectedTable} />
      </aside>

      {/* Center: Menu */}
      <main className="flex-1 min-w-0 overflow-hidden">
        <MenuPanel onAddItem={handleAddItem} />
      </main>

      {/* Right: Order summary */}
      <aside className="w-80 shrink-0 overflow-hidden">
        <OrderSummary selectedTable={selectedTable} cart={cart} onUpdateCart={setCart} />
      </aside>
    </div>
  );
}
