import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, AlertTriangle, ShieldCheck, Package, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/shop/ProductCard';
import { CategoryNav } from '@/components/shop/CategoryNav';
import { DynamicFilterSidebar } from '@/components/shop/DynamicFilterSidebar';
import { ShopByConcern } from '@/components/shop/ShopByConcern';
import { ProductComparisonTool } from '@/components/shop/ProductComparisonTool';
import { CartIcon } from '@/components/shop/CartIcon';
import { ShopPagination } from '@/components/shop/ShopPagination';
import { ShopProduct } from '@/data/shopProducts';
import { searchCatalog, PaginatedCatalogResponse } from '@/services/shop.service';
import { toast } from 'sonner';

export default function ShoppingDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [metadataFilters, setMetadataFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Pagination state (0-based page)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  // Server response
  const [catalogResponse, setCatalogResponse] = useState<PaginatedCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 0 and sub-filters when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
    setMetadataFilters({});
    setSelectedPriceRange('all');
    setPage(0);
  }, [selectedCategory]);

  // Reset to page 0 when filters/search change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, selectedSubcategory, selectedPriceRange]);

  // Fetch catalog from backend/supabase
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const [minPrice, maxPrice] = selectedPriceRange !== 'all'
        ? selectedPriceRange.split('-').map(Number)
        : [undefined, undefined];

      const result = await searchCatalog({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        subcategory: selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
        search: debouncedSearch || undefined,
        minPrice,
        maxPrice,
        page,
        size: pageSize,
      });
      setCatalogResponse(result);
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
      toast.error('Failed to load products!');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, selectedPriceRange, debouncedSearch, page, pageSize]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Client-side metadata filtering (metadata filters aren't sent to backend)
  const filteredProducts = useMemo(() => {
    const products = catalogResponse?.content || [];
    if (Object.keys(metadataFilters).length === 0) return products;

    return products.filter((product) => {
      for (const [key, value] of Object.entries(metadataFilters)) {
        if (value === undefined) continue;
        const metaValue = product.metadata?.[key];
        if (typeof value === 'boolean') {
          if (metaValue !== value) return false;
        } else if (Array.isArray(value)) {
          const metaArr = Array.isArray(metaValue) ? metaValue : [metaValue];
          if (!value.some((v: string) => metaArr.includes(v))) return false;
        } else if (typeof value === 'string') {
          if (metaValue !== value) return false;
        }
      }
      return true;
    });
  }, [catalogResponse, metadataFilters]);

  const handleMetadataFilterChange = (key: string, value: any) => {
    setMetadataFilters(prev => {
      const next = { ...prev };
      if (value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedPriceRange('all');
    setSelectedSubcategory('all');
    setMetadataFilters({});
    setSearchQuery('');
  };

  const handleShopByConcern = (concerns: string[]) => {
    setSelectedCategory('skincare');
    setMetadataFilters({ concern: concerns });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const totalElements = catalogResponse?.totalElements ?? 0;
  const totalPages = catalogResponse?.totalPages ?? 0;
  const showBeautySection = selectedCategory === 'all' || selectedCategory === 'skincare' || selectedCategory === 'haircare';
  const showComparison = selectedCategory === 'skincare';
  const hasNonReturnable = filteredProducts.some(p => p.metadata?.non_returnable);

  const expiringProducts = filteredProducts.filter(p => {
    const expiry = p.metadata?.expiry_date;
    if (!expiry) return false;
    const diff = new Date(expiry).getTime() - Date.now();
    return diff > 0 && diff < 180 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Jane's Boutique</h1>
            </div>
          </div>
          <CartIcon />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Shop by Concern */}
        {showBeautySection && selectedCategory === 'all' && (
          <div className="mb-8">
            <ShopByConcern onSelectConcern={handleShopByConcern} />
          </div>
        )}

        {/* Alerts */}
        {expiringProducts.length > 0 && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-amber-700 dark:text-amber-300">
              {expiringProducts.length} product(s) expiring within 6 months — check expiry before purchase.
            </span>
          </div>
        )}

        {hasNonReturnable && selectedCategory === 'undergarments' && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm">
            <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-blue-700 dark:text-blue-300">
              All undergarments are non-returnable and ship in privacy packaging for your discretion.
            </span>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar */}
          {selectedCategory !== 'all' && (
            <aside className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-lg border p-4">
                <DynamicFilterSidebar
                  category={selectedCategory}
                  priceRange={selectedPriceRange}
                  subcategory={selectedSubcategory}
                  metadataFilters={metadataFilters}
                  onPriceRangeChange={setSelectedPriceRange}
                  onSubcategoryChange={setSelectedSubcategory}
                  onMetadataFilterChange={handleMetadataFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </aside>
          )}

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory === 'all' ? 'Browse Our Collection' : `${totalElements} Products`}
                </h2>
                {selectedCategory === 'all' && (
                  <p className="text-muted-foreground text-sm">Discover quality products for every style</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showComparison && <ProductComparisonTool products={filteredProducts} />}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading products...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <ShopPagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalElements}
                    onPageChange={setPage}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
                <Button variant="outline" onClick={handleClearAll}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
