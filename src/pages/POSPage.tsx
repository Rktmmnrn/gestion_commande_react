import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableGrid from '@/components/TableGrid';
import MenuPanel from '@/components/MenuPanel';
import OrderSummary from '@/components/OrderSummary';
import AdminPasswordModal from '@/components/AdminPasswordModal';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';
import { toast } from 'sonner'
import { WifiOff, Settings } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'pos_cart';
const SELECTED_TABLE_KEY = 'pos_selected_table';

export default function POSPage() {
  const navigate = useNavigate();
  const { isOffline } = useOfflineMode();
  const [selectedTable, setSelectedTable] = useState<number | null>(() => {
    const stored = localStorage.getItem(SELECTED_TABLE_KEY);
    return stored ? parseInt(stored, 10) : null;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        return [];
      }
    }
    return [];
  });
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Save selected table to localStorage
  useEffect(() => {
    if (selectedTable !== null) {
      localStorage.setItem(SELECTED_TABLE_KEY, selectedTable.toString());
    } else {
      localStorage.removeItem(SELECTED_TABLE_KEY);
    }
  }, [selectedTable]);

  // Sync cart between tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue);
          setCart(newCart);
          toast.info('Panier synchronisé depuis un autre onglet');
        } catch (e) {
          console.error('Failed to sync cart:', e);
          toast.info('Erreur de synchonisation !!');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.info('Panier vidé');
  }, []);

  const handleTableSelect = useCallback((table: number) => {
    setSelectedTable(table);
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 z-50">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            Mode hors-ligne - Les commandes seront synchronisées automatiquement
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Commande</h1>
          <span className="text-sm text-muted-foreground">
            User
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin')}
          className="gap-2 border-slate-600 text-slate-300 hover:text-white hover:border-slate-400"
        >
          <Settings className="h-4 w-4" />
          Gestion
        </Button>
      </nav>

      <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-background">
        {/* Left: Tables sidebar */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-border">
          <TableGrid
            selectedTable={selectedTable}
            onSelectTable={handleTableSelect}
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