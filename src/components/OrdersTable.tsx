import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchOrders, updateOrderStatus, deleteOrder } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrderDTO, OrderStatus } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Trash2, RefreshCw, Search, Filter, X, Download } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import OrderDetailsDialog from './OrderDetailsDialog';
import CreateOrderDialog from './CreateOrderDialog';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import TablePagination from './TablePagination';
import SortableHeader from './SortableHeader';
import { exportToCsv, formatDateForCsv } from '@/lib/exportCsv';
import DateRangeFilter from './DateRangeFilter';

const OrdersTable = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date range filter
    if (dateRange?.from) {
      result = result.filter(order => {
        const orderDate = new Date(order.orderDate);
        const from = startOfDay(dateRange.from!);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from!);
        return isWithinInterval(orderDate, { start: from, end: to });
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((order) =>
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerEmail.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query) ||
        order.shippingAddress.toLowerCase().includes(query) ||
        order.items.some(item => item.productName.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [orders, searchQuery, statusFilter, dateRange]);

  const { sortedItems, requestSort, getSortDirection } = useSorting<OrderDTO>(filteredOrders);
  const pagination = usePagination(sortedItems, { initialPageSize: 10 });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted');
      setOrderToDelete(null);
    },
  });

  const getStatusVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'Pending':
        return 'secondary';
      case 'Processing':
        return 'default';
      case 'Shipped':
        return 'outline';
      case 'Delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'Pending':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'Processing':
        return 'bg-info/20 text-info border-info/30';
      case 'Shipped':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Delivered':
        return 'bg-success/20 text-success border-success/30';
      default:
        return '';
    }
  };

  const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Items', 'Status', 'Order Date', 'Shipped Date', 'Delivered Date', 'Total Amount', 'Shipping Address'];
    const data = sortedItems.map(order => [
      order.id,
      order.customerName,
      order.customerEmail,
      order.items.map(item => `${item.productName} (x${item.quantity})`).join('; '),
      order.status,
      formatDateForCsv(order.orderDate),
      order.shippedDate ? formatDateForCsv(order.shippedDate) : '',
      order.deliveredDate ? formatDateForCsv(order.deliveredDate) : '',
      order.totalAmount.toFixed(2),
      order.shippingAddress
    ]);

    exportToCsv({
      filename: `orders-${new Date().toISOString().split('T')[0]}`,
      headers,
      data,
    });

    toast.success(t('export') + ' successful');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t('orders')}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} {t('orders').toLowerCase()}
                {(searchQuery || statusFilter !== 'All' || dateRange?.from) && ` (${orders.length} total)`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`${t('search')}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DateRangeFilter
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter === 'All' ? t('status') : t(statusFilter.toLowerCase() as any)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuLabel>{t('filter')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('All')}
                    className={statusFilter === 'All' ? 'bg-accent' : ''}
                  >
                    {t('all')}
                  </DropdownMenuItem>
                  {statusOptions.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-accent' : ''}
                    >
                      <Badge className={`mr-2 ${getStatusColor(status)}`}>
                        {t(status.toLowerCase() as any)}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={handleExportCsv}
                disabled={filteredOrders.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t('export')}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)}>
                {t('newOrder')}
              </Button>
            </div>
          </div>
          {statusFilter !== 'All' && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                {t('status')}: {t(statusFilter.toLowerCase() as any)}
                <button
                  onClick={() => setStatusFilter('All')}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader
                      sortDirection={getSortDirection('id')}
                      onClick={() => requestSort('id')}
                    >
                      {t('orderId')}
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      sortDirection={getSortDirection('customerName')}
                      onClick={() => requestSort('customerName')}
                    >
                      {t('customer')}
                    </SortableHeader>
                  </TableHead>
                  <TableHead>{t('items')}</TableHead>
                  <TableHead>
                    <SortableHeader
                      sortDirection={getSortDirection('status')}
                      onClick={() => requestSort('status')}
                    >
                      {t('status')}
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      sortDirection={getSortDirection('orderDate')}
                      onClick={() => requestSort('orderDate')}
                    >
                      {t('orderDate')}
                    </SortableHeader>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader
                      sortDirection={getSortDirection('totalAmount')}
                      onClick={() => requestSort('totalAmount')}
                      className="justify-end"
                    >
                      {t('total')}
                    </SortableHeader>
                  </TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagination.paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      {t('noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  pagination.paginatedItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {t(order.status.toLowerCase() as any)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>{t('updateStatus')}</DropdownMenuLabel>
                          {statusOptions.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              disabled={order.status === status}
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: order.id,
                                  status,
                                })
                              }
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              {t(status.toLowerCase() as any)}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setOrderToDelete(order.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('deleteOrder')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {sortedItems.length > 0 && (
            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              onPageChange={pagination.setCurrentPage}
              onPageSizeChange={pagination.setPageSize}
              goToFirstPage={pagination.goToFirstPage}
              goToLastPage={pagination.goToLastPage}
              goToNextPage={pagination.goToNextPage}
              goToPreviousPage={pagination.goToPreviousPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      {/* Create Order Dialog */}
      <CreateOrderDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteOrder')}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => orderToDelete && deleteMutation.mutate(orderToDelete)}
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdersTable;
