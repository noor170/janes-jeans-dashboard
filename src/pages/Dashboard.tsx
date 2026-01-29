import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchDashboardStats } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import StatsCard from '@/components/StatsCard';
import SalesChart from '@/components/SalesChart';
import CategoryChart from '@/components/CategoryChart';
import InventoryTable from '@/components/InventoryTable';
import { DollarSign, ShoppingCart, AlertTriangle, Users } from 'lucide-react';

const Dashboard = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', genderFilter],
    queryFn: () => fetchDashboardStats(genderFilter),
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('totalSales')}
          value={`$${(stats?.totalSales || 0).toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <StatsCard
          title={t('activeOrders')}
          value={stats?.activeOrders || 0}
          icon={ShoppingCart}
          variant="default"
        />
        <StatsCard
          title={t('lowStockAlerts')}
          value={stats?.lowStockAlerts || 0}
          icon={AlertTriangle}
          variant={stats?.lowStockAlerts ? 'warning' : 'default'}
        />
        <StatsCard
          title={t('totalCustomers')}
          value={stats?.totalCustomers || 0}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesChart />
        <CategoryChart />
      </div>

      {/* Inventory Preview */}
      <InventoryTable />
    </div>
  );
};

export default Dashboard;
