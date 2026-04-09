import { useQuery } from '@tanstack/react-query';

// Types for admin stats
export interface AdminStats {
  ordersToday: {
    count: number;
    revenue: number;
    trend: number; // percentage change from yesterday
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

// API functions - replace with actual API calls
const fetchAdminStats = async (): Promise<AdminStats> => {
  // Mock data - replace with actual API call to GET /api/admin/stats/today
  return {
    ordersToday: {
      count: 45,
      revenue: 1250.50,
      trend: 12.5,
    },
    tablesOccupied: {
      occupied: 8,
      total: 12,
      trend: -5.2,
    },
    monthlyRevenue: {
      amount: 28500.75,
      average: 45.80,
      trend: 8.3,
    },
    activeUsers: {
      count: 12,
      lastActivity: '2 min ago',
      adminCount: 3,
      waiterCount: 9,
    },
  };
};

const fetchRevenueData = async (range: string = '7days'): Promise<RevenueData[]> => {
  // Mock data - replace with actual API call to GET /api/admin/stats/revenue?range=7days
  const data = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 500) + 200,
      orders: Math.floor(Math.random() * 20) + 5,
      average: Math.floor(Math.random() * 30) + 20,
    });
  }
  return data;
};

const fetchBestSellers = async (): Promise<BestSellerData[]> => {
  // Mock data - replace with actual API call
  return [
    { name: 'Pizza Margherita', quantity: 45 },
    { name: 'Burger Classic', quantity: 38 },
    { name: 'Pâtes Carbonara', quantity: 32 },
    { name: 'Salade César', quantity: 28 },
    { name: 'Tiramisu', quantity: 25 },
    { name: 'Coca-Cola', quantity: 22 },
    { name: 'Frites', quantity: 20 },
    { name: 'Pizza Pepperoni', quantity: 18 },
    { name: 'Café', quantity: 15 },
    { name: 'Dessert du jour', quantity: 12 },
  ];
};

const fetchOrderStatusData = async (): Promise<OrderStatusData[]> => {
  // Mock data - replace with actual API call
  return [
    { name: 'En attente', value: 12, color: 'hsl(45, 93%, 58%)' },
    { name: 'En préparation', value: 8, color: 'hsl(217, 91%, 60%)' },
    { name: 'Prêt', value: 15, color: 'hsl(142, 76%, 36%)' },
    { name: 'Annulé', value: 3, color: 'hsl(0, 84%, 60%)' },
  ];
};

// React Query hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
  });
};

export const useRevenueData = (range: string = '7days') => {
  return useQuery({
    queryKey: ['revenue-data', range],
    queryFn: () => fetchRevenueData(range),
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
  });
};

export const useOrderStatusData = () => {
  return useQuery({
    queryKey: ['order-status-data'],
    queryFn: fetchOrderStatusData,
  });
};