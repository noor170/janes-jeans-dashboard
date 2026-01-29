import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchProducts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InventoryTable = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', genderFilter],
    queryFn: () => fetchProducts(genderFilter),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('inventory')} - {t('products')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {products.length} {t('products')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('productName')}</TableHead>
                <TableHead>{t('gender')}</TableHead>
                <TableHead>{t('fit')}</TableHead>
                <TableHead>{t('size')}</TableHead>
                <TableHead>{t('wash')}</TableHead>
                <TableHead className="text-right">{t('price')}</TableHead>
                <TableHead className="text-right">{t('stockLevel')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.gender === 'Men' ? t('men') : t('women')}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.fit}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>{product.wash}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{product.stockLevel}</span>
                      {product.stockLevel < 10 && (
                        <Badge variant="destructive" className="text-xs">
                          {t('lowStock')}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
