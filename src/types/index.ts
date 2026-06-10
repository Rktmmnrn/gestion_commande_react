import { z } from 'zod';

export interface Category {
  id: number;
  name: string;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'free' | 'occuped';
}

export interface Client {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Reservation {
  id: number;
  date_heure: string;
  nb_personnes: number;
  statut: 'waiting' | 'confirmed' | 'canceled';
  type_commande: 'on_site' | 'online' | 'take_away';
  confirm_client: boolean;
  token_confirmation: string;
  client: number;
  table: number | null;
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
  table: number | null;
  client: number | null;
  reservation: number | null;
  type_commande: 'on_site' | 'online' | 'take_away';
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
  table: z.number().optional(),
  client: z.number().optional(),
  reservation: z.number().optional(),
  type_commande: z.enum(['on_site', 'online', 'take_away']),
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

export const createClientSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  adresse: z.string().min(1, 'Adresse requise'),
  telephone: z.string().min(1, 'Téléphone requis'),
  email: z.string().email('Email invalide'),
});

export const createReservationSchema = z.object({
  date_heure: z.string(),
  nb_personnes: z.number().int().positive(),

  type_commande: z.enum([
    'on_site',
    'online',
    'take_away'
  ]),

  client: z.number(),

  table: z.number().optional(),
});

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

// Types infered from schemas
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type CreateClientPayload = z.infer<typeof createClientSchema>;
export type CreateReservationPayload = z.infer<typeof createReservationSchema>;
export type AddItemPayload = z.infer<typeof addItemSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type CategoryPayload = z.infer<typeof categorySchema>;
export type ProductPayload = z.infer<typeof productSchema>;

export const tableSchema = z.object({
  number: z.coerce.number().int().positive("Le numéro doit être un entier positif"),
  capacity: z.coerce.number().int().positive("La capacité doit être d'au moins 1 personne"),
  status: z.enum(['free', 'occuped']).default('free'),
});
export type TablePayload = z.infer<typeof tableSchema>;

export const clientSchema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  adresse: z.string().min(1, 'Adresse requise'),
  telephone: z.string().min(1, 'Téléphone requis'),
  email: z.string().email('Email invalide'),
});
export type ClientPayload = z.infer<typeof clientSchema>;

export const reservationSchema = z.object({
  date_heure: z.string().min(1, 'Date et heure requises'),
  nb_personnes: z.coerce.number().int().positive("Nombre de personnes invalide"),
  type_commande: z.enum(['on_site', 'online', 'take_away']).default('on_site'),
});
export type ReservationPayload = z.infer<typeof reservationSchema>;