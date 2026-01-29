import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGenderFilter } from '@/contexts/GenderFilterContext';
import { fetchProducts } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Download, Edit, X } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import TablePagination from './TablePagination';
import SortableHeader from './SortableHeader';
import ProductQuickViewDialog from './ProductQuickViewDialog';
import BulkEditDialog from './BulkEditDialog';
import { exportToCsv } from '@/lib/exportCsv';
import { toast } from 'sonner';

const InventoryTable = () => {
  const { t, language } = useLanguage();
  const { genderFilter } = useGenderFilter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);

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

  const selectedProducts = useMemo(() => 
    products.filter(p => selectedIds.has(p.id)),
    [products, selectedIds]
  );

  const allCurrentPageSelected = useMemo(() => 
    pagination.paginatedItems.length > 0 && 
    pagination.paginatedItems.every(p => selectedIds.has(p.id)),
    [pagination.paginatedItems, selectedIds]
  );

  const someCurrentPageSelected = useMemo(() =>
    pagination.paginatedItems.some(p => selectedIds.has(p.id)) && !allCurrentPageSelected,
    [pagination.paginatedItems, selectedIds, allCurrentPageSelected]
  );

  const toggleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all on current page
      const newSet = new Set(selectedIds);
      pagination.paginatedItems.forEach(p => newSet.delete(p.id));
      setSelectedIds(newSet);
    } else {
      // Select all on current page
      const newSet = new Set(selectedIds);
      pagination.paginatedItems.forEach(p => newSet.add(p.id));
      setSelectedIds(newSet);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkUpdate = (updates: { 
    priceAdjustment?: number; 
    stockAdjustment?: number; 
    priceType: 'fixed' | 'percentage' | 'none'; 
    stockType: 'fixed' | 'add' | 'none' 
  }) => {
    // In a real app, this would call an API. For now, we'll show a success message
    // and simulate the update by invalidating the query
    const updateCount = selectedIds.size;
    
    let message = language === 'en' 
      ? `Updated ${updateCount} products: ` 
      : `${updateCount}টি পণ্য আপডেট করা হয়েছে: `;
    
    const changes: string[] = [];
    
    if (updates.priceType !== 'none' && updates.priceAdjustment !== undefined) {
      if (updates.priceType === 'fixed') {
        changes.push(language === 'en' ? `Price set to $${updates.priceAdjustment}` : `মূল্য $${updates.priceAdjustment} সেট করা হয়েছে`);
      } else {
        changes.push(language === 'en' ? `Price adjusted by ${updates.priceAdjustment}%` : `মূল্য ${updates.priceAdjustment}% সামঞ্জস্য করা হয়েছে`);
      }
    }
    
    if (updates.stockType !== 'none' && updates.stockAdjustment !== undefined) {
      if (updates.stockType === 'fixed') {
        changes.push(language === 'en' ? `Stock set to ${updates.stockAdjustment}` : `স্টক ${updates.stockAdjustment} সেট করা হয়েছে`);
      } else {
        const sign = updates.stockAdjustment >= 0 ? '+' : '';
        changes.push(language === 'en' ? `Stock adjusted by ${sign}${updates.stockAdjustment}` : `স্টক ${sign}${updates.stockAdjustment} সামঞ্জস্য করা হয়েছে`);
      }
    }
    
    message += changes.join(', ');
    toast.success(message);
    
    // Clear selection after update
    clearSelection();
    
    // In a real app, you'd invalidate the query here
    // queryClient.invalidateQueries({ queryKey: ['products'] });
  };

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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
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

        {/* Bulk Selection Bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {selectedIds.size} {language === 'en' ? 'selected' : 'নির্বাচিত'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-7 px-2 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                {language === 'en' ? 'Clear' : 'মুছুন'}
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() => setIsBulkEditOpen(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {language === 'en' ? 'Bulk Edit' : 'বাল্ক এডিট'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allCurrentPageSelected}
                    ref={(el) => {
                      if (el) {
                        (el as any).indeterminate = someCurrentPageSelected;
                      }
                    }}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
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
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    {t('noData')}
                  </TableCell>
                </TableRow>
              ) : (
                pagination.paginatedItems.map((product) => (
                  <TableRow 
                    key={product.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedIds.has(product.id) ? 'bg-accent/30' : ''}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(product.id)}
                        onCheckedChange={() => toggleSelect(product.id)}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell 
                      className="font-medium"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      <Badge variant="outline">
                        {product.gender === 'Men' ? t('men') : t('women')}
                      </Badge>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      {product.fit}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      {product.size}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      {product.wash}
                    </TableCell>
                    <TableCell 
                      className="text-right font-medium"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell 
                      className="text-right"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsQuickViewOpen(true);
                      }}
                    >
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

      {/* Bulk Edit Dialog */}
      <BulkEditDialog
        selectedProducts={selectedProducts}
        open={isBulkEditOpen}
        onOpenChange={setIsBulkEditOpen}
        onUpdate={handleBulkUpdate}
      />
    </Card>
  );
};

export default InventoryTable;
