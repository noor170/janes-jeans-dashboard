import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, Loader2, Expand, FileCheck, ShieldAlert, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { CartIcon } from '@/components/shop/CartIcon';
import { ImageLightbox } from '@/components/shop/ImageLightbox';
import { ShopProduct } from '@/data/shopProducts';
import { fetchShopProductById } from '@/lib/shopApi';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const categoryLabels: Record<string, string> = {
  jeans: 'Jeans',
  'leather-bags': 'Leather Bags',
  skincare: 'Skin Care',
  haircare: 'Hair Care',
  cosmetics: 'Cosmetics',
  jewelry: 'Jewelry',
  undergarments: 'Undergarments',
};

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchShopProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p && p.sizes.length > 0) setSelectedSize(p.sizes[0]);
      })
      .catch(() => toast.error('Failed to load product!'))
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
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize || 'One Size',
        image: product.images[0],
        category: product.category,
      },
      quantity
    );
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const meta = product.metadata || {};
  const isNonReturnable = meta.non_returnable;
  const privacyPackaging = meta.privacy_packaging;
  const hasCertificate = meta.has_certificate;
  const certificateUrl = meta.certificate_url;
  const ingredients: string[] = meta.ingredients || [];
  const expiryDate = meta.expiry_date;
  const isExpiringSoon = expiryDate && (new Date(expiryDate).getTime() - Date.now()) < 180 * 24 * 60 * 60 * 1000;

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
          {/* Image Gallery */}
          <div className="space-y-3">
            <div
              className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-150"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Expand className="h-6 w-6" />
                </div>
              </div>
            </div>
            {/* Thumbnail gallery for multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 shrink-0 ${
                      idx === selectedImageIdx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary">{categoryLabels[product.category] || product.category}</Badge>
                {product.subcategory && (
                  <Badge variant="outline" className="capitalize">{product.subcategory}</Badge>
                )}
                {isNonReturnable && (
                  <Badge variant="destructive" className="text-xs">
                    <ShieldAlert className="h-3 w-3 mr-1" />Non-Returnable
                  </Badge>
                )}
                {hasCertificate && (
                  <Badge className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                    <FileCheck className="h-3 w-3 mr-1" />Certified
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Expiry alert */}
            {expiryDate && (
              <div className={`flex items-center gap-2 p-2 rounded text-sm ${isExpiringSoon ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300' : 'bg-muted text-muted-foreground'}`}>
                {isExpiringSoon && <AlertTriangle className="h-4 w-4" />}
                <span>Expiry: {new Date(expiryDate).toLocaleDateString()}</span>
              </div>
            )}

            {/* Privacy packaging notice */}
            {privacyPackaging && (
              <div className="flex items-center gap-2 p-2 rounded bg-muted text-sm text-muted-foreground">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span>Ships in discreet privacy packaging</span>
              </div>
            )}

            {/* Ingredients list */}
            {ingredients.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">Key Ingredients</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {ingredients.map(ing => (
                      <Badge key={ing} variant="outline" className="text-xs">{ing}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Jewelry / Bag specific metadata */}
            {meta.metal && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Metal:</span> <span className="font-medium">{meta.metal}</span></div>
                {meta.metal_purity && <div><span className="text-muted-foreground">Purity:</span> <span className="font-medium">{meta.metal_purity}</span></div>}
                {meta.gemstone && <div><span className="text-muted-foreground">Gemstone:</span> <span className="font-medium">{meta.gemstone}</span></div>}
                {meta.carat && <div><span className="text-muted-foreground">Carat:</span> <span className="font-medium">{meta.carat}ct</span></div>}
              </div>
            )}

            {meta.material && !meta.metal && (
              <div className="text-sm">
                <span className="text-muted-foreground">Material:</span> <span className="font-medium">{meta.material}</span>
                {meta.dimensions && <> · <span className="text-muted-foreground">Size:</span> <span className="font-medium">{meta.dimensions}</span></>}
              </div>
            )}

            {/* Certificate download */}
            {hasCertificate && certificateUrl && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download Authenticity Certificate
                </a>
              </Button>
            )}

            <Separator />

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <div key={size}>
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex h-10 min-w-[3rem] px-3 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Available Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline">{color}</Badge>
                  ))}
                </div>
              </div>
            )}

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
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/shop/cart">View Cart</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-destructive'}`} />
              <span className="text-sm text-muted-foreground">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
        </div>
      </main>

      <ImageLightbox
        src={product.images[selectedImageIdx] || product.images[0]}
        alt={product.name}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
