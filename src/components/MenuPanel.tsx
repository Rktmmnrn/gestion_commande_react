import { useState } from 'react';
import type { Category, Product } from '@/types';

interface MenuPanelProps {
  categories: Category[] | undefined;
  products: Product[] | undefined;
  isLoading: boolean;
  onAddToOrder: (product: Product, quantity: number) => void;
}

export const MenuPanel = ({
  categories = [],
  products = [],
  isLoading,
  onAddToOrder,
}: MenuPanelProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories?.[0]?.id || null
  );
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const filteredProducts = products?.filter(
    (p) => p.category === selectedCategoryId && p.available
  );

  const handleQuantityChange = (productId: number, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const handleAddProduct = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    onAddToOrder(product, quantity);
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-amber-900 rounded"></div>
          <div className="h-40 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white">Menu</h2>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategoryId(cat.id);
              setQuantities({});
            }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedCategoryId === cat.id
                ? 'bg-amber-500 text-gray-900'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredProducts?.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Aucun plat disponible
          </div>
        ) : (
          filteredProducts?.map((product) => (
            <div
              key={product.id}
              className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{product.name}</h3>
                  <p className="text-amber-400 font-semibold text-sm">
                    {parseFloat(product.price).toFixed(2)} €
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1 bg-gray-800 rounded">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (quantities[product.id] || 1) - 1
                      )
                    }
                    className="px-2 py-1 text-gray-300 hover:text-white"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value))
                    }
                    className="w-10 text-center bg-gray-900 text-white text-sm"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        product.id,
                        (quantities[product.id] || 1) + 1
                      )
                    }
                    className="px-2 py-1 text-gray-300 hover:text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleAddProduct(product)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-1 px-2 rounded transition text-sm"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
