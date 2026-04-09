import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Mock data - replace with actual API call
const fetchOrdersStatus = async () => {
  return [
    { name: 'En attente', value: 12, color: 'hsl(45, 93%, 58%)' }, // amber
    { name: 'En préparation', value: 8, color: 'hsl(217, 91%, 60%)' }, // blue
    { name: 'Prêt', value: 15, color: 'hsl(142, 76%, 36%)' }, // green
    { name: 'Annulé', value: 3, color: 'hsl(0, 84%, 60%)' }, // red
  ];
};

export function OrdersStatusChart() {
  const { data: statusData, isLoading } = useQuery({
    queryKey: ['orders-status'],
    queryFn: fetchOrdersStatus,
  });

  if (isLoading) return <LoadingSpinner />;

  const total = statusData?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {statusData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const percentage = ((data.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-primary">{data.value} commandes</p>
                    <p className="text-muted-foreground">{percentage}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}