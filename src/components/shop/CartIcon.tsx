import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

export function CartIcon() {
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Link to="/shop/cart">
      <Button variant="outline" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
