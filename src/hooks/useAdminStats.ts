import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';

export interface AdminStats {
  ordersToday: {
    count: number;
    revenue: number;
    trend: number;
  };
  tablesOccupied: {
    occupied: number;
    total: number;
    trend: number;
  };
  monthlyRevenue: {
    amount: number;
    average: number;
    trend: number;
  };
  activeUsers: {
    count: number;
    lastActivity: string;
    adminCount: number;
    waiterCount: number;
  };
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  average: number;
}

export interface BestSellerData {
  name: string;
  quantity: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  preparing: 'En préparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'hsl(45, 93%, 58%)',
  preparing: 'hsl(217, 91%, 60%)',
  ready: 'hsl(142, 76%, 36%)',
  delivered: 'hsl(220, 10%, 60%)',
  cancelled: 'hsl(0, 84%, 60%)',
};

const fetchAdminStats = async (): Promise<AdminStats> => {
  const [ordersRes, usersRes] = await Promise.all([
    apiClient.get<any[]>('orders/'),
    apiClient.get<any[]>('users/').catch(() => ({ data: [] })),
  ]);

  const orders: any[] = ordersRes.data || [];
  const users: any[] = usersRes.data || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter((o) => {
    const created = new Date(o.created_at);
    return created >= today;
  });

  const todayRevenue = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const activeTables = new Set(
    orders
      .filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')
      .map((o) => o.table_number)
  );

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthOrders = orders.filter((o) => new Date(o.created_at) >= monthStart);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgPerOrder = monthOrders.length > 0 ? monthRevenue / monthOrders.length : 0;

  const adminCount = users.filter((u) => u.role === 'admin' || u.is_staff).length;
  const waiterCount = users.filter((u) => u.role === 'waiter' && !u.is_staff).length;

  return {
    ordersToday: {
      count: todaysOrders.length,
      revenue: todayRevenue,
      trend: 0,
    },
    tablesOccupied: {
      occupied: activeTables.size,
      total: 12,
      trend: 0,
    },
    monthlyRevenue: {
      amount: monthRevenue,
      average: avgPerOrder,
      trend: 0,
    },
    activeUsers: {
      count: users.length,
      lastActivity: 'maintenant',
      adminCount,
      waiterCount,
    },
  };
};

const fetchRevenueData = async (): Promise<RevenueData[]> => {
  const { data: orders } = await apiClient.get<any[]>('orders/');
  const result: Record<string, { revenue: number; orders: number }> = {};

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    result[key] = { revenue: 0, orders: 0 };
  }

  (orders || []).forEach((o) => {
    const d = new Date(o.created_at);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    if (d >= sevenDaysAgo) {
      const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      if (result[key]) {
        result[key].revenue += o.total || 0;
        result[key].orders += 1;
      }
    }
  });

  return Object.entries(result).map(([date, v]) => ({
    date,
    revenue: parseFloat(v.revenue.toFixed(2)),
    orders: v.orders,
    average: v.orders > 0 ? parseFloat((v.revenue / v.orders).toFixed(2)) : 0,
  }));
};

const fetchBestSellers = async (): Promise<BestSellerData[]> => {
  const { data: orders } = await apiClient.get<any[]>('orders/');
  const counts: Record<string, number> = {};

  (orders || []).forEach((o) => {
    (o.items || []).forEach((item: any) => {
      const name = item.product_name || 'Inconnu';
      counts[name] = (counts[name] || 0) + (item.quantity || 0);
    });
  });

  return Object.entries(counts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
};

const fetchOrderStatusData = async (): Promise<OrderStatusData[]> => {
  const { data: orders } = await apiClient.get<any[]>('orders/');
  const counts: Record<string, number> = {};

  (orders || []).forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });

  return Object.entries(counts)
    .filter(([status]) => STATUS_LABELS[status])
    .map(([status, value]) => ({
      name: STATUS_LABELS[status],
      value,
      color: STATUS_COLORS[status] || 'hsl(220, 10%, 60%)',
    }));
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

export const useRevenueData = (range: string = '7days') => {
  return useQuery({
    queryKey: ['revenue-data', range],
    queryFn: fetchRevenueData,
    staleTime: 30000,
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
    staleTime: 30000,
  });
};

export const useOrderStatusData = () => {
  return useQuery({
    queryKey: ['order-status-data'],
    queryFn: fetchOrderStatusData,
    staleTime: 30000,
  });
};