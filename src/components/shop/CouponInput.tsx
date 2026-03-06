import { useState } from 'react';
import { Tag, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart, AppliedCoupon } from '@/contexts/CartContext';
import { validateCoupon } from '@/services/coupon.service';
import { toast } from 'sonner';

interface CouponInputProps {
  orderTotal: number;
}

export function CouponInput({ orderTotal }: CouponInputProps) {
  const { appliedCoupon, setAppliedCoupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const result = await validateCoupon(code.trim().toUpperCase(), orderTotal);
      const coupon: AppliedCoupon = {
        code: result.couponCode,
        discount: result.discount,
        discountType: result.discountType,
        discountValue: result.discountValue,
      };
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied! You save $${coupon.discount.toFixed(2)}`);
      setCode('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid coupon code';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{appliedCoupon.code}</span>
          <span className="text-xs text-muted-foreground">
            {appliedCoupon.discountType === 'PERCENTAGE'
              ? `${appliedCoupon.discountValue}% off`
              : `$${appliedCoupon.discountValue} off`}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemove}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="pl-9 uppercase"
          disabled={loading}
        />
      </div>
      <Button variant="outline" onClick={handleApply} disabled={loading || !code.trim()}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
      </Button>
    </div>
  );
}
