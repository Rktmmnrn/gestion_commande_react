import { useState, useCallback } from 'react';
import TableGrid from '@/components/TableGrid';
import MenuPanel from '@/components/MenuPanel';
import OrderSummary from '@/components/OrderSummary';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import type { Product } from '@/types';
import { toast } from 'sonner'
import { WifiOff } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function POSPage() {
  const isOffline = useOfflineMode();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleAddItem = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ));
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`${product.name} ajouté au panier`);
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 z-50">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            Mode hors-ligne - Les modifications seront synchronisées automatiquement
          </span>
        </div>
      )}

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Left: Tables sidebar */}
        <aside className="w-56 shrink-0 overflow-y-auto">
          <TableGrid
          selectedTable={selectedTable}
          onSelectTable={setSelectedTable}
          />
        </aside>

        {/* Center: Menu */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <MenuPanel onAddItem={handleAddItem} />
        </main>

        {/* Right: Order summary */}
        <aside className="w-80 shrink-0 overflow-hidden">
          <OrderSummary
          selectedTable={selectedTable}
          cart={cart}
          onUpdateCart={setCart}
          onClearCart={handleClearCart}
          />
        </aside>
      </div>
    </>
  );
}
