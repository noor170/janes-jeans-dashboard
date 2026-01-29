import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchSalesData } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const SalesChart = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();

  const { data: salesData = [] } = useQuery({
    queryKey: ['salesData', genderFilter],
    queryFn: () => fetchSalesData(genderFilter),
  });

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>{t('salesAnalytics')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('monthlySales')}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              {(genderFilter === 'All' || genderFilter === 'Men') && (
                <Bar 
                  dataKey="men" 
                  name={t('men')}
                  fill="hsl(var(--chart-1))" 
                  radius={[4, 4, 0, 0]}
                />
              )}
              {(genderFilter === 'All' || genderFilter === 'Women') && (
                <Bar 
                  dataKey="women" 
                  name={t('women')}
                  fill="hsl(var(--chart-3))" 
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
