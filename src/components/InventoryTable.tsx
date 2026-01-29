import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchProducts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ProductDTO } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import TablePagination from './TablePagination';
import SortableHeader from './SortableHeader';
import ProductQuickViewDialog from './ProductQuickViewDialog';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

const InventoryTable = () => {
  const { t } = useLanguage();
  const { genderFilter } = useGenderFilter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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

  const { sortedItems, requestSort, getSortDirection } = useSorting<ProductDTO>(filteredProducts);
  const pagination = usePagination(sortedItems, { initialPageSize: 10 });

  const handleExportCsv = () => {
    const headers = ['ID', 'Product Name', 'Gender', 'Fit', 'Size', 'Wash', 'Price', 'Stock Level', 'Status'];
    const data = sortedItems.map(product => [
      product.id,
      product.name,
      product.gender,
      product.fit,
      product.size,
      product.wash,
      product.price.toFixed(2),
      product.stockLevel,
      product.stockLevel < 10 ? 'Low Stock' : 'In Stock'
    ]);

    exportToCsv({
      filename: `inventory-${new Date().toISOString().split('T')[0]}`,
      headers,
      data,
    });

    toast.success(t('export') + ' successful');
  };

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`${t('search')}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleExportCsv}
              disabled={filteredProducts.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {t('export')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader
                    sortDirection={getSortDirection('name')}
                    onClick={() => requestSort('name')}
                  >
                    {t('productName')}
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortDirection={getSortDirection('gender')}
                    onClick={() => requestSort('gender')}
                  >
                    {t('gender')}
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortDirection={getSortDirection('fit')}
                    onClick={() => requestSort('fit')}
                  >
                    {t('fit')}
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortDirection={getSortDirection('size')}
                    onClick={() => requestSort('size')}
                  >
                    {t('size')}
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader
                    sortDirection={getSortDirection('wash')}
                    onClick={() => requestSort('wash')}
                  >
                    {t('wash')}
                  </SortableHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    sortDirection={getSortDirection('price')}
                    onClick={() => requestSort('price')}
                    className="justify-end"
                  >
                    {t('price')}
                  </SortableHeader>
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    sortDirection={getSortDirection('stockLevel')}
                    onClick={() => requestSort('stockLevel')}
                    className="justify-end"
                  >
                    {t('stockLevel')}
                  </SortableHeader>
                </TableHead>
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
                  <TableRow 
                    key={product.id}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsQuickViewOpen(true);
                    }}
                  >
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

        {sortedItems.length > 0 && (
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

      {/* Product Quick View Dialog */}
      <ProductQuickViewDialog
        product={selectedProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </Card>
  );
};

export default InventoryTable;
