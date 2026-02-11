import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CartIcon } from '@/components/shop/CartIcon';
import { ShopProduct } from '@/data/shopProducts';
import { fetchShopProductById } from '@/lib/shopApi';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchShopProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.images[0],
        category: product.category,
      },
      quantity
    );
    toast.success(`${quantity}x ${product.name} (${selectedSize}) added to cart`);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tshirts': return 'T-Shirt';
      case 'hoodies': return 'Hoodie';
      case 'jeans': return 'Jeans';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/shop')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Product Details</h1>
          </div>
          <CartIcon />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{getCategoryLabel(product.category)}</Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Size</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex h-10 w-12 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Available Colors</Label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="outline">{color}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-base font-semibold">Quantity</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/shop/cart">View Cart</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
