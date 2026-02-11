import { Star } from 'lucide-react';
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

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes[0],
      image: product.images[0],
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
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
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/shop/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <Badge className="absolute top-2 left-2 z-10" variant="secondary">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/shop/product/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
        </div>
        <p className="text-xl font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button onClick={handleAddToCart} className="flex-1">
          Add to Cart
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/shop/product/${product.id}`}>Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
