import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchDashboardStats, fetchSalesData, fetchCategoryDistribution } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import StatsCard from '@/components/StatsCard';
import SalesChart from '@/components/SalesChart';
import CategoryChart from '@/components/CategoryChart';
import InventoryTable from '@/components/InventoryTable';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign, ShoppingCart, AlertTriangle, Users, Download, FileSpreadsheet, BarChart3, PieChart } from 'lucide-react';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { genderFilter } = useGenderFilter();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', genderFilter],
    queryFn: () => fetchDashboardStats(genderFilter),
  });

  const { data: salesData = [] } = useQuery({
    queryKey: ['salesData', genderFilter],
    queryFn: () => fetchSalesData(genderFilter),
  });

  const { data: categoryData = [] } = useQuery({
    queryKey: ['categoryData', genderFilter],
    queryFn: () => fetchCategoryDistribution(genderFilter),
  });

  const exportStats = () => {
    const headers = ['Metric', 'Value'];
    const data = [
      [t('totalSales'), `$${(stats?.totalSales || 0).toLocaleString()}`],
      [t('activeOrders'), stats?.activeOrders || 0],
      [t('lowStockAlerts'), stats?.lowStockAlerts || 0],
      [t('totalCustomers'), stats?.totalCustomers || 0],
    ];
    exportToCsv({ filename: `dashboard-stats-${new Date().toISOString().split('T')[0]}`, headers, data });
    toast.success(t('export') + ' - Stats');
  };

  const exportSalesData = () => {
    const headers = ['Month', 'Men Sales', 'Women Sales', 'Total'];
    const data = salesData.map(item => [item.month, item.men, item.women, item.total]);
    exportToCsv({ filename: `sales-data-${new Date().toISOString().split('T')[0]}`, headers, data });
    toast.success(t('export') + ' - Sales');
  };

  const exportCategoryData = () => {
    const headers = ['Category', 'Value'];
    const data = categoryData.map(item => [item.name, item.value]);
    exportToCsv({ filename: `category-data-${new Date().toISOString().split('T')[0]}`, headers, data });
    toast.success(t('export') + ' - Categories');
  };

  const exportAllDashboard = () => {
    exportStats();
    exportSalesData();
    exportCategoryData();
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t('export')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              {language === 'en' ? 'Export Data' : 'ডেটা রপ্তানি'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportAllDashboard}>
              <Download className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Export All' : 'সব রপ্তানি'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportStats}>
              <DollarSign className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Stats Cards' : 'স্ট্যাটস'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportSalesData}>
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('salesAnalytics')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportCategoryData}>
              <PieChart className="mr-2 h-4 w-4" />
              {t('categoryDistribution')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
