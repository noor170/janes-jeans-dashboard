import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ProductReturnDTO } from '@/types';
import {
  fetchReturns, createReturn, updateReturn, approveReturn, rejectReturn, deleteReturn,
} from '@/services/returns.service';
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
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search, Plus, CheckCircle, XCircle, RotateCcw, Trash2, Eye, Package,
} from 'lucide-react';
import { toast } from 'sonner';
import TablePagination from '@/components/TablePagination';
import { usePagination } from '@/hooks/usePagination';

const RETURN_REASONS = [
  { value: 'DEFECTIVE', label: 'Defective Product' },
  { value: 'WRONG_SIZE', label: 'Wrong Size' },
  { value: 'NOT_AS_DESCRIBED', label: 'Not As Described' },
  { value: 'DAMAGED_IN_SHIPPING', label: 'Damaged in Shipping' },
  { value: 'CHANGED_MIND', label: 'Changed Mind' },
  { value: 'OTHER', label: 'Other' },
];

const ProductReturns = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState<ProductReturnDTO | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const [form, setForm] = useState({
    orderId: '', productId: '', productName: '', customerName: '', customerEmail: '',
    quantity: '1', reason: 'DEFECTIVE', description: '', refundAmount: '', restock: false,
  });

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ['product-returns'],
    queryFn: fetchReturns,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<ProductReturnDTO>) => createReturn(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product-returns'] }); toast.success('Return request created'); setIsFormOpen(false); },
  });

  const approveMutation = useMutation({
    mutationFn: approveReturn,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product-returns'] }); toast.success('Return approved & stock updated'); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => rejectReturn(id, notes),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product-returns'] }); toast.success('Return rejected'); setRejectDialogOpen(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReturn,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product-returns'] }); toast.success('Return deleted'); },
  });

  const filtered = useMemo(() => {
    let items = returns;
    if (statusFilter !== 'ALL') items = items.filter(r => r.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(r =>
        r.productName.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q)
      );
    }
    return items;
  }, [returns, statusFilter, searchQuery]);

  const pagination = usePagination(filtered, { initialPageSize: 10 });

  const statusCounts = useMemo(() => ({
    ALL: returns.length,
    PENDING: returns.filter(r => r.status === 'PENDING').length,
    RECEIVED: returns.filter(r => r.status === 'RECEIVED').length,
    APPROVED: returns.filter(r => r.status === 'APPROVED').length,
    REJECTED: returns.filter(r => r.status === 'REJECTED').length,
  }), [returns]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Approved</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      case 'RECEIVED': return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Received</Badge>;
      case 'COMPLETED': return <Badge className="bg-emerald-700/20 text-emerald-700 border-emerald-700/30">Completed</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getRefundBadge = (status: string) => {
    switch (status) {
      case 'PROCESSED': return <Badge className="bg-emerald-500/20 text-emerald-600">Refunded</Badge>;
      case 'PENDING': return <Badge variant="outline" className="text-amber-600">Pending</Badge>;
      case 'FAILED': return <Badge variant="destructive">Failed</Badge>;
      default: return <span className="text-muted-foreground text-sm">—</span>;
    }
  };

  const handleCreate = () => {
    createMutation.mutate({
      orderId: form.orderId, productId: form.productId, productName: form.productName,
      customerName: form.customerName, customerEmail: form.customerEmail,
      quantity: parseInt(form.quantity), reason: form.reason, description: form.description,
      refundAmount: form.refundAmount ? parseFloat(form.refundAmount) : undefined,
      restock: form.restock,
    } as any);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <RotateCcw className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">{language === 'en' ? 'Product Returns' : 'পণ্য ফেরত'}</h2>
            <p className="text-sm text-muted-foreground">{filtered.length} returns</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => { setForm({ orderId: '', productId: '', productName: '', customerName: '', customerEmail: '', quantity: '1', reason: 'DEFECTIVE', description: '', refundAmount: '', restock: false }); setIsFormOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />New Return
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(['ALL', 'PENDING', 'RECEIVED', 'APPROVED', 'REJECTED'] as const).map(s => (
          <Card key={s} className={`cursor-pointer transition-colors ${statusFilter === s ? 'ring-2 ring-primary' : ''}`} onClick={() => setStatusFilter(s)}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground uppercase">{s === 'ALL' ? 'Total' : s}</p>
              <p className="text-2xl font-bold">{statusCounts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">No returns found</TableCell></TableRow>
                  ) : (
                    pagination.paginatedItems.map(ret => (
                      <TableRow key={ret.id}>
                        <TableCell>
                          <div className="font-medium">{ret.productName}</div>
                          <div className="text-xs text-muted-foreground">{ret.productId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{ret.customerName}</div>
                          <div className="text-xs text-muted-foreground">{ret.customerEmail}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="font-mono text-xs">{ret.orderId}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{RETURN_REASONS.find(r => r.value === ret.reason)?.label || ret.reason}</Badge></TableCell>
                        <TableCell className="text-center">{ret.quantity}</TableCell>
                        <TableCell>{getStatusBadge(ret.status)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {ret.refundAmount != null && <span className="text-sm font-medium">${ret.refundAmount.toFixed(2)}</span>}
                            <div>{getRefundBadge(ret.refundStatus)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(ret.requestedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(ret)} title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {ret.status === 'PENDING' && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => approveMutation.mutate(ret.id)} title="Approve" className="text-emerald-600">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => { setRejectDialogOpen(ret.id); setRejectNotes(''); }} title="Reject" className="text-destructive">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(ret.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Pagination */}
      {filtered.length > 0 && (
        <TablePagination
          currentPage={pagination.currentPage} totalPages={pagination.totalPages}
          pageSize={pagination.pageSize} totalItems={pagination.totalItems}
          startIndex={pagination.startIndex} endIndex={pagination.endIndex}
          canGoNext={pagination.canGoNext} canGoPrevious={pagination.canGoPrevious}
          onPageChange={pagination.setCurrentPage} onPageSizeChange={pagination.setPageSize}
          goToFirstPage={pagination.goToFirstPage} goToLastPage={pagination.goToLastPage}
          goToNextPage={pagination.goToNextPage} goToPreviousPage={pagination.goToPreviousPage}
        />
      )}

      {/* Create Return Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Return Request</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Order ID *</Label><Input value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} /></div>
              <div className="space-y-2"><Label>Product ID *</Label><Input value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Product Name *</Label><Input value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Customer Name *</Label><Input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} /></div>
              <div className="space-y-2"><Label>Customer Email</Label><Input value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Select value={form.reason} onValueChange={v => setForm({ ...form, reason: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">{RETURN_REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Refund ($)</Label><Input type="number" step="0.01" value={form.refundAmount} onChange={e => setForm({ ...form, refundAmount: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.restock} onCheckedChange={v => setForm({ ...form, restock: v })} /><Label>Restock item(s) on approval</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.orderId || !form.productName || !form.customerName}>Create Return</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!detailsOpen} onOpenChange={() => setDetailsOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Return Details</DialogTitle></DialogHeader>
          {detailsOpen && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Product:</span><p className="font-medium">{detailsOpen.productName}</p></div>
                <div><span className="text-muted-foreground">Customer:</span><p className="font-medium">{detailsOpen.customerName}</p></div>
                <div><span className="text-muted-foreground">Order:</span><p className="font-mono">{detailsOpen.orderId}</p></div>
                <div><span className="text-muted-foreground">Quantity:</span><p>{detailsOpen.quantity}</p></div>
                <div><span className="text-muted-foreground">Reason:</span><p>{RETURN_REASONS.find(r => r.value === detailsOpen.reason)?.label}</p></div>
                <div><span className="text-muted-foreground">Status:</span>{getStatusBadge(detailsOpen.status)}</div>
                <div><span className="text-muted-foreground">Refund:</span><p>{detailsOpen.refundAmount ? `$${detailsOpen.refundAmount.toFixed(2)}` : '—'}</p></div>
                <div><span className="text-muted-foreground">Restock:</span><p>{detailsOpen.restock ? 'Yes' : 'No'}</p></div>
              </div>
              {detailsOpen.description && <div><span className="text-muted-foreground text-sm">Description:</span><p className="text-sm mt-1">{detailsOpen.description}</p></div>}
              {detailsOpen.notes && <div><span className="text-muted-foreground text-sm">Notes:</span><p className="text-sm mt-1">{detailsOpen.notes}</p></div>}
              <div className="text-xs text-muted-foreground">Requested: {new Date(detailsOpen.requestedAt).toLocaleString()}{detailsOpen.resolvedAt && ` • Resolved: ${new Date(detailsOpen.resolvedAt).toLocaleString()}`}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation */}
      <AlertDialog open={!!rejectDialogOpen} onOpenChange={() => setRejectDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Return</AlertDialogTitle>
            <AlertDialogDescription>Provide a reason for rejecting this return request.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} placeholder="Rejection reason..." />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => rejectDialogOpen && rejectMutation.mutate({ id: rejectDialogOpen, notes: rejectNotes })}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductReturns;
