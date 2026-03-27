export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  category: number;
  category_name: string;
  available: boolean;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}

export interface Order {
  id: number;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  table_number: number;
  items: { product: number; quantity: number }[];
}

export interface AddItemPayload {
  product: number;
  quantity: number;
}
