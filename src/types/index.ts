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

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  table_number: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  created_at: string;
  updated_at: string;
}

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return ['pending', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status);
};

export interface CreateOrderPayload {
  table_number: number;
  items: { product: number; quantity: number }[];
}

export interface AddItemPayload {
  product: number;
  quantity: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
}
