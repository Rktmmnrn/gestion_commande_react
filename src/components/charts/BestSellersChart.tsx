import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Mock data - replace with actual API call
const fetchBestSellers = async () => {
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

export function BestSellersChart() {
  const { data: bestSellers, isLoading } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: fetchBestSellers,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bestSellers}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            type="number"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{label}</p>
                    <p className="text-primary">Quantité: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="quantity"
            fill="hsl(var(--primary))"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}