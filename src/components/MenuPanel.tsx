import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';
import { Plus } from 'lucide-react';

interface MenuPanelProps {
  onAddItem: (product: Product) => void;
}

export default function MenuPanel({ onAddItem }: MenuPanelProps) {
  const { data: categories } = useCategories();
  const [activeCat, setActiveCat] = useState<number | undefined>();
  const { data: products } = useProducts(activeCat ? { category: activeCat } : undefined);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Category tabs */}
      <div className="flex gap-1 p-3 border-b border-border overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveCat(undefined)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${!activeCat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
        >
          Tout
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${activeCat === c.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {products?.map((p) => (
            <button
              key={p.id}
              disabled={!p.available}
              onClick={() => onAddItem(p)}
              className={`relative flex flex-col items-start p-3 rounded-lg border transition-all text-left ${
                p.available
                  ? 'bg-card border-border hover:border-primary/50 hover:shadow-sm active:scale-[0.98]'
                  : 'bg-muted/50 border-border/50 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-sm font-medium text-card-foreground leading-tight">{p.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{p.category_name}</span>
              <div className="flex items-center justify-between w-full mt-2">
                <span className="text-sm font-bold text-primary">{parseFloat(p.price).toFixed(2)} €</span>
                {p.available && <Plus className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
