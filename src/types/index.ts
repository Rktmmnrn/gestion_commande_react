import { z } from 'zod';

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

export const orderItemSchema = z.object({
  product: z.number().positive('ID produit invalide'),
  quantity: z.number().int().positive('La quantité doit être supérieure à 0'),
});

export const createOrderSchema = z.object({
  table_number: z.number().int().min(1, 'Numéro de table invalide').max(99, 'Numéro de table trop élevé'),
  items: z.array(orderItemSchema).min(1, 'La commande doit contenir au moins un article'),
});

export const addItemSchema = z.object({
  product: z.number().positive('ID produit invalide'),
  quantity: z.number().int().positive('La quantité doit être supérieure à 0'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Nom d\'utilisateur requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nom de catégorie requis').max(100, 'Nom trop long'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Nom du produit requis').max(200, 'Nom trop long'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Format de prix invalide'),
  category: z.number().positive('Catégorie invalide'),
  available: z.boolean().default(true),
});

// Types infered from schemas
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type AddItemPayload = z.infer<typeof addItemSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type CategoryPayload = z.infer<typeof categorySchema>;
export type ProductPayload = z.infer<typeof productSchema>;

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