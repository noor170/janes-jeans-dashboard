import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchCategoryDistribution } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const CategoryChart = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();

  const { data: categoryData = [] } = useQuery({
    queryKey: ['categoryData', genderFilter],
    queryFn: () => fetchCategoryDistribution(genderFilter),
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-3))', 'hsl(var(--chart-5))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('categoryDistribution')}</CardTitle>
        <p className="text-sm text-muted-foreground">By Fit Type</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
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
                formatter={(value: number) => [value, 'Units']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
