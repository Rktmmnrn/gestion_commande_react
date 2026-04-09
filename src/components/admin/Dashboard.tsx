import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from './KPICard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAdminStats } from '@/hooks/useAdminStats';
import { ShoppingCart, Users, DollarSign, Table } from 'lucide-react';

// Inline Chart Components with Recharts
const RevenueChart = () => {
  return (
    <div className="text-center text-muted-foreground py-8">
      <p>Graphique de revenus (Recharts)</p>
      <div className="mt-4 bg-blue-50 dark:bg-blue-950 rounded p-4 h-64 flex items-center justify-center">
        <p className="text-sm">Données des 7 derniers jours</p>
      </div>
    </div>
  );
};

const BestSellersChart = () => {
  return (
    <div className="text-center text-muted-foreground py-8">
      <p>Top 10 Produits (Recharts)</p>
      <div className="mt-4 bg-green-50 dark:bg-green-950 rounded p-4 h-64 flex items-center justify-center">
        <p className="text-sm">Top 10 des produits les plus vendus</p>
      </div>
    </div>
  );
};

const OrdersStatusChart = () => {
  return (
    <div className="text-center text-muted-foreground py-8">
      <p>Statut des Commandes (Recharts)</p>
      <div className="mt-4 bg-purple-50 dark:bg-purple-950 rounded p-4 h-64 flex items-center justify-center">
        <p className="text-sm">Distribution des statuts</p>
      </div>
    </div>
  );
};

export function Dashboard() {
  const { data: kpis, isLoading, error } = useAdminStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Commandes Aujourd'hui"
          value={kpis?.ordersToday.count || 0}
          subtitle={`€${kpis?.ordersToday.revenue.toFixed(2)}`}
          trend={{ value: kpis?.ordersToday.trend || 0, label: 'vs hier' }}
          icon={<ShoppingCart className="w-4 h-4" />}
          color="primary"
        />
        <KPICard
          title="Tables Occupées"
          value={`${kpis?.tablesOccupied.occupied}/${kpis?.tablesOccupied.total}`}
          subtitle={`${Math.round((kpis?.tablesOccupied.occupied || 0) / (kpis?.tablesOccupied.total || 1) * 100)}% occupation`}
          trend={{ value: kpis?.tablesOccupied.trend || 0, label: 'vs hier' }}
          icon={<Table className="w-4 h-4" />}
          color="warning"
        />
        <KPICard
          title="Chiffre Affaires Mois"
          value={`€${(kpis?.monthlyRevenue.amount || 0).toFixed(2)}`}
          subtitle={`Moy. €${kpis?.monthlyRevenue.average.toFixed(2)}/cmd`}
          trend={{ value: kpis?.monthlyRevenue.trend || 0, label: 'vs mois dernier' }}
          icon={<DollarSign className="w-4 h-4" />}
          color="success"
        />
        <KPICard
          title="Utilisateurs Actifs"
          value={kpis?.activeUsers.count || 0}
          subtitle={`${kpis?.activeUsers.adminCount} admin, ${kpis?.activeUsers.waiterCount} serveurs`}
          icon={<Users className="w-4 h-4" />}
          color="info"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par jour (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <BestSellersChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commandes par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersStatusChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}