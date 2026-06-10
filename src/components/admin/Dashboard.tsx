import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from './KPICard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAdminStats, useRevenueData, useBestSellers, useOrderStatusData } from '@/hooks/useAdminStats';
import { ShoppingCart, DollarSign, Table } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function RevenueChart() {
  const { data, isLoading } = useRevenueData();
  if (isLoading) return <LoadingSpinner size="sm" />;
  if (!data || data.length === 0) return (
    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
      Aucune donnée disponible
    </div>
  );
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}€`} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-card border border-border p-3 rounded-lg shadow-lg text-xs">
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-primary">Revenus : {d.revenue.toFixed(2)} €</p>
                    <p className="text-muted-foreground">Commandes : {d.orders}</p>
                    {d.orders > 0 && <p className="text-muted-foreground">Moy. : {d.average.toFixed(2)} €</p>}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenus (€)"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function BestSellersChart() {
  const { data, isLoading } = useBestSellers();
  if (isLoading) return <LoadingSpinner size="sm" />;
  if (!data || data.length === 0) return (
    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
      Aucune vente enregistrée
    </div>
  );
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={110}
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border p-3 rounded-lg shadow-lg text-xs">
                    <p className="font-semibold">{payload[0].payload.name}</p>
                    <p className="text-primary">Vendus : {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="quantity" name="Quantité" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function OrdersStatusChart() {
  const { data, isLoading } = useOrderStatusData();
  if (isLoading) return <LoadingSpinner size="sm" />;
  if (!data || data.length === 0) return (
    <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
      Aucune commande enregistrée
    </div>
  );
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-card border border-border p-3 rounded-lg shadow-lg text-xs">
                    <p className="font-semibold">{d.name}</p>
                    <p style={{ color: d.color }}>{d.value} commandes</p>
                    <p className="text-muted-foreground">{((d.value / total) * 100).toFixed(1)} %</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color, fontSize: 12 }}>
                {value} ({entry.payload.value})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Dashboard() {
  const { data: kpis, isLoading, error } = useAdminStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Commandes aujourd'hui"
          value={kpis?.ordersToday.count ?? 0}
          subtitle={`${kpis?.ordersToday.revenue.toFixed(2) ?? '0.00'} € générés`}
          trend={{ value: kpis?.ordersToday.trend ?? 0, label: 'vs hier' }}
          icon={<ShoppingCart className="w-4 h-4" />}
          color="primary"
        />
        <KPICard
          title="Tables occupées"
          value={`${kpis?.tablesOccupied.occupied ?? 0}/${kpis?.tablesOccupied.total ?? 0}`}
          subtitle={`${kpis?.tablesOccupied.total ? Math.round(((kpis?.tablesOccupied.occupied ?? 0) / kpis.tablesOccupied.total) * 100) : 0} % d'occupation`}
          trend={{ value: kpis?.tablesOccupied.trend ?? 0, label: 'vs hier' }}
          icon={<Table className="w-4 h-4" />}
          color="warning"
        />
        <KPICard
          title="CA du mois"
          value={`${(kpis?.monthlyRevenue.amount ?? 0).toFixed(2)} €`}
          subtitle={`Moy. ${(kpis?.monthlyRevenue.average ?? 0).toFixed(2)} € / commande`}
          trend={{ value: kpis?.monthlyRevenue.trend ?? 0, label: 'vs mois dernier' }}
          icon={<DollarSign className="w-4 h-4" />}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus — 7 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top produits vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <BestSellersChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition des commandes par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersStatusChart />
        </CardContent>
      </Card>
    </div>
  );
}