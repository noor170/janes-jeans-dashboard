import { ProductDTO } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Ruler, Droplets, Tag, DollarSign, Boxes, User } from 'lucide-react';

interface ProductQuickViewDialogProps {
  product: ProductDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickViewDialog = ({ product, open, onOpenChange }: ProductQuickViewDialogProps) => {
  const { t, language } = useLanguage();

  if (!product) return null;

  const isLowStock = product.stockLevel < 10;
  const isCriticalStock = product.stockLevel < 5;

  const getStockStatus = () => {
    if (isCriticalStock) return { label: language === 'en' ? 'Critical' : 'জটিল', variant: 'destructive' as const };
    if (isLowStock) return { label: t('lowStock'), variant: 'destructive' as const };
    return { label: t('inStock'), variant: 'default' as const };
  };

  const stockStatus = getStockStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Product Details' : 'পণ্যের বিবরণ'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Name & ID */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('gender')}</p>
                <p className="font-medium">
                  {product.gender === 'Men' ? t('men') : t('women')}
                </p>
              </div>
            </div>

            {/* Fit */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fit')}</p>
                <p className="font-medium">{product.fit}</p>
              </div>
            </div>

            {/* Size */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Ruler className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('size')}</p>
                <p className="font-medium">{product.size}</p>
              </div>
            </div>

            {/* Wash */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('wash')}</p>
                <p className="font-medium">{product.wash}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">{t('price')}</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-success">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Stock Level */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('stockLevel')}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <p className={`text-2xl font-bold ${isCriticalStock ? 'text-destructive' : isLowStock ? 'text-warning' : ''}`}>
                  {product.stockLevel}
                </p>
                <Badge variant={stockStatus.variant} className="text-xs">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <div className={`rounded-lg p-3 ${isCriticalStock ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
              <p className="text-sm font-medium">
                {isCriticalStock 
                  ? (language === 'en' ? '⚠️ Critical stock level! Reorder immediately.' : '⚠️ জটিল স্টক স্তর! অবিলম্বে পুনরায় অর্ডার করুন।')
                  : (language === 'en' ? '⚠️ Low stock warning. Consider restocking soon.' : '⚠️ কম স্টক সতর্কতা। শীঘ্রই পুনরায় স্টক করার কথা বিবেচনা করুন।')
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickViewDialog;
