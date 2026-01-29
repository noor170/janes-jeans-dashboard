import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import TablePagination from './TablePagination';

const InventoryTable = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', genderFilter],
    queryFn: () => fetchProducts(genderFilter),
  });

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.fit.toLowerCase().includes(query) ||
      product.wash.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.gender.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const pagination = usePagination(filteredProducts, { initialPageSize: 10 });

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{t('inventory')} - {t('products')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {t('products')}
              {searchQuery && ` (${products.length} total)`}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`${t('search')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
              {pagination.paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {t('noData')}
                  </TableCell>
                </TableRow>
              ) : (
                pagination.paginatedItems.map((product) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredProducts.length > 0 && (
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            onPageChange={pagination.setCurrentPage}
            onPageSizeChange={pagination.setPageSize}
            goToFirstPage={pagination.goToFirstPage}
            goToLastPage={pagination.goToLastPage}
            goToNextPage={pagination.goToNextPage}
            goToPreviousPage={pagination.goToPreviousPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
