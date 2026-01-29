import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { CartIcon } from '@/components/shop/CartIcon';
import { shopProducts } from '@/data/shopProducts';

export default function ShoppingDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const filteredProducts = useMemo(() => {
    return shopProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange !== 'all') {
        const [min, max] = selectedPriceRange.split('-').map(Number);
        if (product.price < min || product.price > max) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedPriceRange]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-xl font-bold">Jane's Jeans Shop</h1>
            </div>
          </div>
          <CartIcon />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Browse Our Collection</h2>
          <p className="text-muted-foreground">
            Discover quality clothing for every style and occasion
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            onCategoryChange={setSelectedCategory}
            onPriceRangeChange={setSelectedPriceRange}
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to find what you're looking for
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
