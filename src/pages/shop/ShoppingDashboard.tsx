import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, AlertTriangle, ShieldCheck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/shop/ProductCard';
import { CategoryNav } from '@/components/shop/CategoryNav';
import { DynamicFilterSidebar } from '@/components/shop/DynamicFilterSidebar';
import { ShopByConcern } from '@/components/shop/ShopByConcern';
import { ProductComparisonTool } from '@/components/shop/ProductComparisonTool';
import { CartIcon } from '@/components/shop/CartIcon';
import { ShopProduct } from '@/data/shopProducts';
import { fetchShopProducts } from '@/services/shop.service';
import { toast } from 'sonner';

export default function ShoppingDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [metadataFilters, setMetadataFilters] = useState<Record<string, any>>({});
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchShopProducts()
      .then(setProducts)
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        toast.error('Failed to load products!');
      })
      .finally(() => setLoading(false));
  }, []);

  // Reset sub-filters when category changes
  useEffect(() => {
    setSelectedSubcategory('all');
    setMetadataFilters({});
    setSelectedPriceRange('all');
  }, [selectedCategory]);

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
  };

  const handleShopByConcern = (concerns: string[]) => {
    setSelectedCategory('skincare');
    setMetadataFilters({ concern: concerns });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) return false;

      if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        if (product.price < min || product.price > max) return false;
      }

      // Metadata filters
      for (const [key, value] of Object.entries(metadataFilters)) {
        if (value === undefined) continue;
        const metaValue = product.metadata?.[key];

        if (typeof value === 'boolean') {
          if (metaValue !== value) return false;
        } else if (Array.isArray(value)) {
          // multiselect: product metadata field can be array (match any)
          const metaArr = Array.isArray(metaValue) ? metaValue : [metaValue];
          if (!value.some((v: string) => metaArr.includes(v))) return false;
        } else if (typeof value === 'string') {
          if (metaValue !== value) return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, selectedSubcategory, selectedPriceRange, metadataFilters]);

  const showBeautySection = selectedCategory === 'all' || selectedCategory === 'skincare' || selectedCategory === 'haircare';
  const showComparison = selectedCategory === 'skincare';

  // Check for undergarment items in filtered products
  const hasNonReturnable = filteredProducts.some(p => p.metadata?.non_returnable);

  // Check for expiring products (within 6 months)
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
        {/* Category Navigation */}
        <div className="mb-6">
          <CategoryNav selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Shop by Concern - shown for beauty categories */}
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
          {/* Sidebar - shown when a category is selected */}
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
                  {selectedCategory === 'all' ? 'Browse Our Collection' : filteredProducts.length + ' Products'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
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
