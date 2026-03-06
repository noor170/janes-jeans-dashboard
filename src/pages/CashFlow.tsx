import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { CashFlowTransactionDTO, CashFlowSummary } from '@/types';
import {
  fetchCashFlowTransactions, createCashFlowTransaction, updateCashFlowTransaction,
  deleteCashFlowTransaction, fetchCashFlowSummary,
} from '@/services/cashflow.service';
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
import { Search, Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const PIE_COLORS = [
  'hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)', 'hsl(262, 83%, 58%)', 'hsl(199, 89%, 48%)',
  'hsl(330, 81%, 60%)', 'hsl(24, 94%, 50%)', 'hsl(174, 72%, 40%)',
  'hsl(47, 100%, 50%)', 'hsl(291, 47%, 51%)', 'hsl(210, 79%, 46%)', 'hsl(0, 0%, 50%)',
];

const CATEGORIES = [
  'Sales', 'Refund Received', 'Investment', 'Other Income',
  'Inventory Purchase', 'Shipping', 'Salary', 'Rent', 'Marketing',
  'Utilities', 'Maintenance', 'Tax', 'Other Expense',
];

const CashFlow = () => {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<CashFlowTransactionDTO | null>(null);

  const [form, setForm] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: 'Sales',
    amount: '',
    description: '',
    paymentMethod: 'Card',
    status: 'COMPLETED',
    transactionDate: '',
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['cash-flow'],
    queryFn: fetchCashFlowTransactions,
  });

  const { data: summary } = useQuery({
    queryKey: ['cash-flow-summary'],
    queryFn: fetchCashFlowSummary,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<CashFlowTransactionDTO>) => createCashFlowTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-flow'] });
      queryClient.invalidateQueries({ queryKey: ['cash-flow-summary'] });
      toast.success('Transaction created');
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CashFlowTransactionDTO> }) => updateCashFlowTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-flow'] });
      queryClient.invalidateQueries({ queryKey: ['cash-flow-summary'] });
      toast.success('Transaction updated');
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCashFlowTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-flow'] });
      queryClient.invalidateQueries({ queryKey: ['cash-flow-summary'] });
      toast.success('Transaction deleted');
    },
  });

  const filtered = useMemo(() => {
    let items = transactions;
    if (typeFilter !== 'ALL') items = items.filter(t => t.type === typeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(t => t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return items;
  }, [transactions, typeFilter, searchQuery]);

  const openCreate = () => {
    setEditingTx(null);
    setForm({ type: 'INCOME', category: 'Sales', amount: '', description: '', paymentMethod: 'Card', status: 'COMPLETED', transactionDate: '' });
    setIsFormOpen(true);
  };

  const openEdit = (tx: CashFlowTransactionDTO) => {
    setEditingTx(tx);
    setForm({
      type: tx.type, category: tx.category, amount: String(tx.amount),
      description: tx.description, paymentMethod: tx.paymentMethod || 'Card',
      status: tx.status, transactionDate: tx.transactionDate ? tx.transactionDate.slice(0, 16) : '',
    });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    const payload: any = { ...form, amount: parseFloat(form.amount) };
    if (editingTx) {
      updateMutation.mutate({ id: editingTx.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Monthly bar chart data
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; income: number; expense: number }> = {};
    transactions.forEach(tx => {
      if (!tx.transactionDate) return;
      const d = new Date(tx.transactionDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (!months[key]) months[key] = { month: label, income: 0, expense: 0 };
      if (tx.type === 'INCOME') months[key].income += tx.amount;
      else months[key].expense += tx.amount;
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [transactions]);

  // Category pie chart data
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.forEach(tx => {
      cats[tx.category] = (cats[tx.category] || 0) + tx.amount;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const summaryCards = [
    { label: 'Total Income', value: summary?.totalIncome ?? 0, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Total Expense', value: summary?.totalExpense ?? 0, icon: TrendingDown, color: 'text-red-500' },
    { label: 'Net Cash Flow', value: summary?.netCashFlow ?? 0, icon: DollarSign, color: (summary?.netCashFlow ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`rounded-lg bg-muted p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>
                  ${Math.abs(s.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Income vs Expense Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'en' ? 'Monthly Income vs Expense' : 'মাসিক আয় বনাম ব্যয়'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))' }}
                    formatter={(value: number) => [`৳${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, undefined]}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {language === 'en' ? 'Spending by Category' : 'বিভাগ অনুসারে ব্যয়'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No data available</div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--popover-foreground))' }}
                      formatter={(value: number) => [`৳${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, undefined]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-2">
                  {categoryData.slice(0, 8).map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {language === 'en' ? 'Cash Flow Transactions' : 'ক্যাশ ফ্লো ট্রানজাকশন'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={typeFilter} onValueChange={v => setTypeFilter(v as any)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Add Entry</Button>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No transactions found</TableCell></TableRow>
                  ) : (
                    filtered.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'INCOME' ? 'default' : 'destructive'}>{tx.type}</Badge>
                        </TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell className="max-w-48 truncate">{tx.description}</TableCell>
                        <TableCell>{tx.paymentMethod || '-'}</TableCell>
                        <TableCell className={`text-right font-bold ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.status === 'COMPLETED' ? 'default' : 'secondary'}>{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(tx)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(tx.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editingTx ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount ($)</Label>
                <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={form.paymentMethod} onValueChange={v => setForm({ ...form, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Transaction Date</Label>
                <Input type="datetime-local" value={form.transactionDate} onChange={e => setForm({ ...form, transactionDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.amount || !form.transactionDate}>
              {editingTx ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashFlow;
