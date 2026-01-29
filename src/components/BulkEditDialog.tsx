import { useState } from 'react';
import { ProductDTO } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, DollarSign, Boxes, Package } from 'lucide-react';
import { toast } from 'sonner';

interface BulkEditDialogProps {
  selectedProducts: ProductDTO[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: { priceAdjustment?: number; stockAdjustment?: number; priceType: 'fixed' | 'percentage' | 'none'; stockType: 'fixed' | 'add' | 'none' }) => void;
}

const BulkEditDialog = ({ selectedProducts, open, onOpenChange, onUpdate }: BulkEditDialogProps) => {
  const { t, language } = useLanguage();
  const [priceValue, setPriceValue] = useState('');
  const [stockValue, setStockValue] = useState('');
  const [updatePrice, setUpdatePrice] = useState(false);
  const [updateStock, setUpdateStock] = useState(false);
  const [priceType, setPriceType] = useState<'fixed' | 'percentage'>('fixed');
  const [stockType, setStockType] = useState<'fixed' | 'add'>('add');

  const handleSubmit = () => {
    const priceNum = parseFloat(priceValue);
    const stockNum = parseInt(stockValue, 10);

    if (updatePrice && (isNaN(priceNum) || priceNum < 0)) {
      toast.error(language === 'en' ? 'Please enter a valid price' : 'একটি বৈধ মূল্য লিখুন');
      return;
    }

    if (updateStock && isNaN(stockNum)) {
      toast.error(language === 'en' ? 'Please enter a valid stock value' : 'একটি বৈধ স্টক মান লিখুন');
      return;
    }

    onUpdate({
      priceAdjustment: updatePrice ? priceNum : undefined,
      stockAdjustment: updateStock ? stockNum : undefined,
      priceType: updatePrice ? priceType : 'none',
      stockType: updateStock ? stockType : 'none',
    });

    // Reset form
    setPriceValue('');
    setStockValue('');
    setUpdatePrice(false);
    setUpdateStock(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setPriceValue('');
    setStockValue('');
    setUpdatePrice(false);
    setUpdateStock(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Bulk Edit Products' : 'বাল্ক এডিট পণ্য'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Products Summary */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {language === 'en' 
                  ? `${selectedProducts.length} products selected` 
                  : `${selectedProducts.length}টি পণ্য নির্বাচিত`}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedProducts.slice(0, 3).map(p => (
                <Badge key={p.id} variant="secondary" className="text-xs">
                  {p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name}
                </Badge>
              ))}
              {selectedProducts.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{selectedProducts.length - 3} {language === 'en' ? 'more' : 'আরও'}
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Price Update */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="updatePrice"
                checked={updatePrice}
                onCheckedChange={(checked) => setUpdatePrice(checked === true)}
              />
              <Label htmlFor="updatePrice" className="flex items-center gap-2 cursor-pointer">
                <DollarSign className="h-4 w-4 text-success" />
                {language === 'en' ? 'Update Price' : 'মূল্য আপডেট'}
              </Label>
            </div>
            
            {updatePrice && (
              <div className="ml-6 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={priceType === 'fixed' ? 'default' : 'outline'}
                    onClick={() => setPriceType('fixed')}
                  >
                    {language === 'en' ? 'Set Price' : 'মূল্য সেট'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={priceType === 'percentage' ? 'default' : 'outline'}
                    onClick={() => setPriceType('percentage')}
                  >
                    {language === 'en' ? 'Adjust %' : 'সামঞ্জস্য %'}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={priceValue}
                    onChange={(e) => setPriceValue(e.target.value)}
                    placeholder={priceType === 'fixed' ? '0.00' : '-10 or +15'}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    {priceType === 'fixed' ? 'USD' : '%'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {priceType === 'fixed' 
                    ? (language === 'en' ? 'Sets all selected products to this price' : 'সমস্ত নির্বাচিত পণ্যের মূল্য এটি সেট করে')
                    : (language === 'en' ? 'Use negative values for discount (e.g., -10 for 10% off)' : 'ছাড়ের জন্য নেতিবাচক মান ব্যবহার করুন')}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Stock Update */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="updateStock"
                checked={updateStock}
                onCheckedChange={(checked) => setUpdateStock(checked === true)}
              />
              <Label htmlFor="updateStock" className="flex items-center gap-2 cursor-pointer">
                <Boxes className="h-4 w-4 text-info" />
                {language === 'en' ? 'Update Stock' : 'স্টক আপডেট'}
              </Label>
            </div>
            
            {updateStock && (
              <div className="ml-6 space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={stockType === 'add' ? 'default' : 'outline'}
                    onClick={() => setStockType('add')}
                  >
                    {language === 'en' ? 'Add/Remove' : 'যোগ/বিয়োগ'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={stockType === 'fixed' ? 'default' : 'outline'}
                    onClick={() => setStockType('fixed')}
                  >
                    {language === 'en' ? 'Set Value' : 'মান সেট'}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                    placeholder={stockType === 'add' ? '-5 or +10' : '50'}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'units' : 'ইউনিট'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stockType === 'add'
                    ? (language === 'en' ? 'Use negative values to reduce stock' : 'স্টক কমাতে নেতিবাচক মান ব্যবহার করুন')
                    : (language === 'en' ? 'Sets all selected products to this stock level' : 'সমস্ত নির্বাচিত পণ্যের স্টক এটি সেট করে')}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!updatePrice && !updateStock}
          >
            {language === 'en' ? 'Apply Changes' : 'পরিবর্তন প্রয়োগ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkEditDialog;
