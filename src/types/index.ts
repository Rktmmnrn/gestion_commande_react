/* Categories */
export interface Category {
  id: number;
  name: string;
}

/* Products */
export interface Product {
  id: number;
  name: string;
  price: string;
  category: number;
  category_name: string;
  available: boolean;
}

/* Order Items */
export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
}

/* Orders */
export interface Order {
  id: number;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

/* Request / Mutation Payloads */
export interface CreateOrderPayload {
  table_number: number;
  items: {
    product: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusPayload {
  status: string;
}

export interface AddOrderItemPayload {
  product: number;
  quantity: number;
}

/* API Filter Options */
export interface ProductFilters {
  category?: number;
  available?: boolean;
}

export interface OrderFilters {
  status?: string;
  table_number?: number;
}
