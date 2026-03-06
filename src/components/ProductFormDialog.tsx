import { useState, useEffect } from 'react';
import { ProductDTO } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ProductFormDialogProps {
  product: ProductDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<ProductDTO>) => void;
  isLoading?: boolean;
}

const ProductFormDialog = ({ product, open, onOpenChange, onSubmit, isLoading }: ProductFormDialogProps) => {
  const [form, setForm] = useState({
    name: '', gender: 'Men' as 'Men' | 'Women', fit: 'Slim',
    size: '', wash: '', price: '', stockLevel: '',
    discountPercent: '0', offerDiscountPercent: '0', offerName: '',
    description: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, gender: product.gender, fit: product.fit,
        size: product.size, wash: product.wash, price: String(product.price),
        stockLevel: String(product.stockLevel),
        discountPercent: String(product.discountPercent || 0),
        offerDiscountPercent: String(product.offerDiscountPercent || 0),
        offerName: product.offerName || '', description: '',
      });
    } else {
      setForm({
        name: '', gender: 'Men', fit: 'Slim', size: '', wash: '',
        price: '', stockLevel: '', discountPercent: '0',
        offerDiscountPercent: '0', offerName: '', description: '',
      });
    }
  }, [product, open]);

  const handleSubmit = () => {
    onSubmit({
      name: form.name,
      gender: form.gender,
      fit: form.fit as any,
      size: form.size,
      wash: form.wash,
      price: parseFloat(form.price),
      stockLevel: parseInt(form.stockLevel),
      discountPercent: parseFloat(form.discountPercent || '0'),
      offerDiscountPercent: parseFloat(form.offerDiscountPercent || '0'),
      offerName: form.offerName,
    });
  };

  const isValid = form.name && form.size && form.price && form.stockLevel;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Product Name *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Classic Indigo Slim" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fit *</Label>
              <Select value={form.fit} onValueChange={v => setForm({ ...form, fit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Slim">Slim</SelectItem>
                  <SelectItem value="Skinny">Skinny</SelectItem>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Size *</Label>
              <Input value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g. 32" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Wash</Label>
              <Input value={form.wash} onChange={e => setForm({ ...form, wash: e.target.value })} placeholder="e.g. Dark Indigo" />
            </div>
            <div className="space-y-2">
              <Label>Price ($) *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Stock Level *</Label>
              <Input type="number" value={form.stockLevel} onChange={e => setForm({ ...form, stockLevel: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Discount %</Label>
              <Input type="number" step="0.01" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Offer Discount %</Label>
              <Input type="number" step="0.01" value={form.offerDiscountPercent} onChange={e => setForm({ ...form, offerDiscountPercent: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Offer Name</Label>
            <Input value={form.offerName} onChange={e => setForm({ ...form, offerName: e.target.value })} placeholder="e.g. Summer Sale" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
