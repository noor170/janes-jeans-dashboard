import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CouponDTO } from '@/types';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/coupon.service';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Edit, Trash2, Ticket } from 'lucide-react';
import { toast } from 'sonner';

const Coupons = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDTO | null>(null);

  // Form state
  const [form, setForm] = useState({
    code: '', description: '', discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: '', minOrderAmount: '0', maxDiscountAmount: '',
    usageLimit: '', isActive: true, validFrom: '', validUntil: '',
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: fetchCoupons,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<CouponDTO>) => createCoupon(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast.success('Coupon created'); setIsFormOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponDTO> }) => updateCoupon(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast.success('Coupon updated'); setIsFormOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['coupons'] }); toast.success('Coupon deleted'); },
  });

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return coupons;
    const q = searchQuery.toLowerCase();
    return coupons.filter(c => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [coupons, searchQuery]);

  const openCreate = () => {
    setEditingCoupon(null);
    setForm({ code: '', description: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '0', maxDiscountAmount: '', usageLimit: '', isActive: true, validFrom: '', validUntil: '' });
    setIsFormOpen(true);
  };

  const openEdit = (c: CouponDTO) => {
    setEditingCoupon(c);
    setForm({
      code: c.code, description: c.description, discountType: c.discountType,
      discountValue: String(c.discountValue), minOrderAmount: String(c.minOrderAmount),
      maxDiscountAmount: c.maxDiscountAmount ? String(c.maxDiscountAmount) : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      isActive: c.isActive,
      validFrom: c.validFrom ? c.validFrom.slice(0, 16) : '',
      validUntil: c.validUntil ? c.validUntil.slice(0, 16) : '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const payload: any = {
      code: form.code, description: form.description, discountType: form.discountType,
      discountValue: parseFloat(form.discountValue), minOrderAmount: parseFloat(form.minOrderAmount || '0'),
      isActive: form.isActive, validFrom: form.validFrom, validUntil: form.validUntil,
    };
    if (form.maxDiscountAmount) payload.maxDiscountAmount = parseFloat(form.maxDiscountAmount);
    if (form.usageLimit) payload.usageLimit = parseInt(form.usageLimit);

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                {language === 'en' ? 'Coupons & Discounts' : 'কুপন ও ডিসকাউন্ট'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{filtered.length} coupons</p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search coupons..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Add Coupon</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Min Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No coupons found</TableCell></TableRow>
                  ) : (
                    filtered.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono font-bold">{c.code}</TableCell>
                        <TableCell className="max-w-48 truncate">{c.description}</TableCell>
                        <TableCell><Badge variant="outline">{c.discountType}</Badge></TableCell>
                        <TableCell className="text-right font-medium">
                          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `৳${c.discountValue}`}
                        </TableCell>
                        <TableCell className="text-right">৳{c.minOrderAmount}</TableCell>
                        <TableCell>{c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}</TableCell>
                        <TableCell>
                          <Badge variant={c.isActive ? 'default' : 'secondary'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
                        </TableCell>
                        <TableCell>{c.validUntil ? new Date(c.validUntil).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER25" />
              </div>
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Min Order ($)</Label>
                <Input type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Discount ($)</Label>
                <Input type="number" value={form.maxDiscountAmount} onChange={e => setForm({ ...form, maxDiscountAmount: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid From</Label>
                <Input type="datetime-local" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Valid Until</Label>
                <Input type="datetime-local" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.code || !form.discountValue}>
              {editingCoupon ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
