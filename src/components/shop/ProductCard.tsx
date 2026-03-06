import { Star, ShieldAlert, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShopProduct } from '@/data/shopProducts';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopProduct;
}

const categoryLabels: Record<string, string> = {
  jeans: 'Jeans',
  'leather-bags': 'Leather Bags',
  skincare: 'Skin Care',
  haircare: 'Hair Care',
  cosmetics: 'Cosmetics',
  jewelry: 'Jewelry',
  undergarments: 'Undergarments',
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0] || 'One Size',
      image: product.images[0],
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
  };

  const isNonReturnable = product.metadata?.non_returnable;
  const hasCertificate = product.metadata?.has_certificate;
  const expiryDate = product.metadata?.expiry_date;
  const isExpiringSoon = expiryDate && (new Date(expiryDate).getTime() - Date.now()) < 180 * 24 * 60 * 60 * 1000;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/shop/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <Badge className="absolute top-2 left-2 z-10" variant="secondary">
            {categoryLabels[product.category] || product.category}
          </Badge>
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
            {isNonReturnable && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                <ShieldAlert className="h-3 w-3 mr-0.5" />Non-returnable
              </Badge>
            )}
            {hasCertificate && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                <FileCheck className="h-3 w-3 mr-0.5" />Certified
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{product.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
        </div>
        {isExpiringSoon && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Expires: {new Date(expiryDate).toLocaleDateString()}
          </p>
        )}
        <p className="text-xl font-bold text-primary mt-2">৳{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAddToCart} className="flex-1">Add to Cart</Button>
        <Button variant="outline" asChild>
          <Link to={`/shop/product/${product.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
