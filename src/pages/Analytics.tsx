import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchDashboardStats, fetchSalesData, fetchCategoryDistribution, fetchOrders, fetchProducts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import { DateRange } from 'react-day-picker';
import DateRangeFilter from '@/components/DateRangeFilter';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
}

const KPICard = ({ title, value, change, changeLabel, icon: Icon, trend }: KPICardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-xs">
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3 text-success" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="h-3 w-3 text-destructive" />
              ) : null}
              <span className={trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  const { t, language } = useLanguage();
  const { genderFilter } = useGenderFilter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

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

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', genderFilter],
    queryFn: () => fetchProducts(genderFilter),
  });

  // Calculate order status distribution
  const orderStatusData = useMemo(() => {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: language === 'en' ? 'Pending' : 'মুলতুবি', value: statusCounts['Pending'] || 0, fill: 'hsl(var(--warning))' },
      { name: language === 'en' ? 'Processing' : 'প্রসেসিং', value: statusCounts['Processing'] || 0, fill: 'hsl(var(--info))' },
      { name: language === 'en' ? 'Shipped' : 'শিপড', value: statusCounts['Shipped'] || 0, fill: 'hsl(var(--primary))' },
      { name: language === 'en' ? 'Delivered' : 'ডেলিভার্ড', value: statusCounts['Delivered'] || 0, fill: 'hsl(var(--success))' },
    ].filter(item => item.value > 0);
  }, [orders, language]);

  // Calculate revenue trend data
  const revenueTrendData = useMemo(() => {
    return salesData.map((item, index) => ({
      ...item,
      growth: index > 0 ? ((item.total - salesData[index - 1].total) / salesData[index - 1].total * 100).toFixed(1) : 0,
    }));
  }, [salesData]);

  // Stock level distribution
  const stockLevelData = useMemo(() => {
    const criticalStock = products.filter(p => p.stockLevel < 5).length;
    const lowStock = products.filter(p => p.stockLevel >= 5 && p.stockLevel < 10).length;
    const normalStock = products.filter(p => p.stockLevel >= 10 && p.stockLevel < 30).length;
    const highStock = products.filter(p => p.stockLevel >= 30).length;

    return [
      { name: language === 'en' ? 'Critical (<5)' : 'জটিল (<৫)', value: criticalStock, fill: 'hsl(var(--destructive))' },
      { name: language === 'en' ? 'Low (5-9)' : 'কম (৫-৯)', value: lowStock, fill: 'hsl(var(--warning))' },
      { name: language === 'en' ? 'Normal (10-29)' : 'সাধারণ (১০-২৯)', value: normalStock, fill: 'hsl(var(--info))' },
      { name: language === 'en' ? 'High (30+)' : 'উচ্চ (৩০+)', value: highStock, fill: 'hsl(var(--success))' },
    ].filter(item => item.value > 0);
  }, [products, language]);

  // Average order value by month
  const avgOrderValueData = useMemo(() => {
    return salesData.map(item => ({
      month: item.month,
      avgValue: Math.round(item.total / (Math.random() * 10 + 5)), // Simulated avg order value
      orders: Math.floor(Math.random() * 50 + 20), // Simulated order count
    }));
  }, [salesData]);

  // Top performing products (simulated)
  const topProductsData = useMemo(() => {
    return products
      .slice(0, 5)
      .map(p => ({
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        revenue: Math.round(p.price * p.stockLevel * (Math.random() * 2 + 1)),
        units: Math.round(p.stockLevel * (Math.random() * 3 + 1)),
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [products]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const analyticsTitle = language === 'en' ? 'Analytics Dashboard' : 'বিশ্লেষণ ড্যাশবোর্ড';
  const kpiTitle = language === 'en' ? 'Key Performance Indicators' : 'প্রধান কর্মক্ষমতা সূচক';
  const vsLastMonth = language === 'en' ? 'vs last month' : 'গত মাসের তুলনায়';

  return (
    <div className="space-y-6">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{analyticsTitle}</h1>
          <p className="text-sm text-muted-foreground">{kpiTitle}</p>
        </div>
        <DateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('totalSales')}
          value={`$${(stats?.totalSales || 0).toLocaleString()}`}
          change={12.5}
          changeLabel={vsLastMonth}
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title={t('activeOrders')}
          value={stats?.activeOrders || 0}
          change={-3.2}
          changeLabel={vsLastMonth}
          icon={ShoppingCart}
          trend="down"
        />
        <KPICard
          title={language === 'en' ? 'Avg Order Value' : 'গড় অর্ডার মূল্য'}
          value={`$${orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : 0}`}
          change={8.1}
          changeLabel={vsLastMonth}
          icon={Target}
          trend="up"
        />
        <KPICard
          title={t('totalCustomers')}
          value={stats?.totalCustomers || 0}
          change={15.3}
          changeLabel={vsLastMonth}
          icon={Users}
          trend="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Trend with Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                {language === 'en' ? 'Revenue Trend' : 'রাজস্ব প্রবণতা'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Monthly revenue with growth rate' : 'বৃদ্ধির হার সহ মাসিক রাজস্ব'}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'total') return [`$${value.toLocaleString()}`, language === 'en' ? 'Revenue' : 'রাজস্ব'];
                      return [value, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              {language === 'en' ? 'Order Status' : 'অর্ডার স্থিতি'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Distribution by status' : 'স্থিতি অনুসারে বিতরণ'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales by Gender Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {language === 'en' ? 'Sales by Gender' : 'লিঙ্গ অনুসারে বিক্রয়'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Monthly comparison' : 'মাসিক তুলনা'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="men" name={t('men')} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="women" name={t('women')} fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="total" name="Total" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {language === 'en' ? 'Stock Levels' : 'স্টক স্তর'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'Inventory health overview' : 'ইনভেন্টরি স্বাস্থ্য ওভারভিউ'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockLevelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stockLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [value + ' products', name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t('categoryDistribution')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'By fit type' : 'ফিট টাইপ অনুসারে'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products by Revenue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {language === 'en' ? 'Top Products' : 'শীর্ষ পণ্য'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {language === 'en' ? 'By estimated revenue' : 'আনুমানিক রাজস্ব অনুসারে'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, language === 'en' ? 'Revenue' : 'রাজস্ব']}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
