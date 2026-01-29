import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Plus, Eye, Edit2, Truck, Package, ExternalLink, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { fetchShipments, fetchOrders, fetchShippingVendors, fetchCustomers } from '@/lib/api';
import { ShipmentDTO, ShipmentStatus } from '@/types';
import { exportToCsv } from '@/lib/exportCsv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TablePagination from '@/components/TablePagination';
import { usePagination } from '@/hooks/usePagination';
import ShipmentFormDialog from '@/components/ShipmentFormDialog';
import ShipmentDetailsDialog from '@/components/ShipmentDetailsDialog';

const Shipments = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDTO | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: shipments = [], isLoading, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: fetchShipments,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['shippingVendors'],
    queryFn: fetchShippingVendors,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  const getOrderDetails = (orderId: string) => orders.find(o => o.id === orderId);
  const getVendorDetails = (vendorId: string) => vendors.find(v => v.id === vendorId);

  const statusLabels: Record<ShipmentStatus, { en: string; bn: string }> = {
    pending: { en: 'Pending', bn: 'মুলতুবি' },
    picked_up: { en: 'Picked Up', bn: 'পিক আপ' },
    in_transit: { en: 'In Transit', bn: 'ট্রানজিটে' },
    out_for_delivery: { en: 'Out for Delivery', bn: 'ডেলিভারিতে' },
    delivered: { en: 'Delivered', bn: 'ডেলিভার্ড' },
    failed: { en: 'Failed', bn: 'ব্যর্থ' },
  };

  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    picked_up: shipments.filter(s => s.status === 'picked_up').length,
    in_transit: shipments.filter(s => s.status === 'in_transit').length,
    out_for_delivery: shipments.filter(s => s.status === 'out_for_delivery').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    failed: shipments.filter(s => s.status === 'failed').length,
  };

  const filteredShipments = shipments.filter(shipment => {
    const order = getOrderDetails(shipment.orderId);
    const vendor = getVendorDetails(shipment.vendorId);
    
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order?.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (vendor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pagination = usePagination(filteredShipments, { initialPageSize: 10 });

  const handleExport = () => {
    const headers = [
      language === 'en' ? 'Shipment ID' : 'শিপমেন্ট আইডি',
      language === 'en' ? 'Order ID' : 'অর্ডার আইডি',
      language === 'en' ? 'Customer' : 'গ্রাহক',
      language === 'en' ? 'Vendor' : 'ভেন্ডর',
      language === 'en' ? 'Tracking Number' : 'ট্র্যাকিং নম্বর',
      t('status'),
      language === 'en' ? 'Shipped At' : 'শিপ করা হয়েছে',
    ];

    const data = filteredShipments.map(shipment => {
      const order = getOrderDetails(shipment.orderId);
      const vendor = getVendorDetails(shipment.vendorId);
      return [
        shipment.id,
        shipment.orderId,
        order?.customerName || '-',
        vendor?.name || '-',
        shipment.trackingNumber,
        statusLabels[shipment.status][language === 'bn' ? 'bn' : 'en'],
        shipment.shippedAt ? new Date(shipment.shippedAt).toLocaleString() : '-',
      ];
    });

    exportToCsv({
      filename: `shipments-${new Date().toISOString().split('T')[0]}`,
      headers,
      data,
    });

    toast.success(t('export') + ' successful');
  };

  const handleViewDetails = (shipment: ShipmentDTO) => {
    setSelectedShipment(shipment);
    setIsDetailsOpen(true);
  };

  const handleEdit = (shipment: ShipmentDTO) => {
    setSelectedShipment(shipment);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedShipment(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    const label = statusLabels[status][language === 'bn' ? 'bn' : 'en'];
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-500 hover:bg-green-600">{label}</Badge>;
      case 'in_transit':
      case 'out_for_delivery':
        return <Badge className="bg-blue-500 hover:bg-blue-600">{label}</Badge>;
      case 'picked_up':
        return <Badge className="bg-cyan-500 hover:bg-cyan-600">{label}</Badge>;
      case 'failed':
        return <Badge variant="destructive">{label}</Badge>;
      default:
        return <Badge variant="secondary">{label}</Badge>;
    }
  };

  const pageTitle = language === 'en' ? 'Shipment Management' : 'শিপমেন্ট ব্যবস্থাপনা';
  const createShipmentText = language === 'en' ? 'Create Shipment' : 'শিপমেন্ট তৈরি';

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  // Stats cards data
  const activeShipments = shipments.filter(s => ['pending', 'picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length;
  const deliveredToday = shipments.filter(s => {
    if (s.status !== 'delivered' || !s.deliveredAt) return false;
    const today = new Date().toDateString();
    return new Date(s.deliveredAt).toDateString() === today;
  }).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{pageTitle}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            {createShipmentText}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'en' ? 'Total Shipments' : 'মোট শিপমেন্ট'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'en' ? 'Active Shipments' : 'সক্রিয় শিপমেন্ট'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{activeShipments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'en' ? 'Delivered Today' : 'আজ ডেলিভারি'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{deliveredToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {language === 'en' ? 'Failed' : 'ব্যর্থ'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{statusCounts.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="rounded-full"
        >
          {t('all')} ({statusCounts.all})
        </Button>
        {(Object.keys(statusLabels) as ShipmentStatus[]).map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="rounded-full"
          >
            {statusLabels[status][language === 'bn' ? 'bn' : 'en']} ({statusCounts[status]})
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === 'en' ? 'Order' : 'অর্ডার'}</TableHead>
              <TableHead>{language === 'en' ? 'Customer' : 'গ্রাহক'}</TableHead>
              <TableHead>{language === 'en' ? 'Shipping Address' : 'শিপিং ঠিকানা'}</TableHead>
              <TableHead>{language === 'en' ? 'Vendor' : 'ভেন্ডর'}</TableHead>
              <TableHead>{language === 'en' ? 'Tracking' : 'ট্র্যাকিং'}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t('noData')}
                </TableCell>
              </TableRow>
            ) : (
              pagination.paginatedItems.map((shipment) => {
                const order = getOrderDetails(shipment.orderId);
                const vendor = getVendorDetails(shipment.vendorId);
                
                return (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <div className="font-medium">{shipment.orderId}</div>
                      <div className="text-xs text-muted-foreground">
                        ${order?.totalAmount.toFixed(2) || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order?.customerName || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 max-w-[180px]">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate text-sm" title={shipment.shippingAddress}>
                          {shipment.shippingAddress || order?.shippingAddress || '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor?.name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shipment.trackingNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {t('actions')}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(shipment)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(shipment)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            {language === 'en' ? 'Update Status' : 'স্থিতি আপডেট'}
                          </DropdownMenuItem>
                          {vendor?.trackingUrlTemplate && (
                            <DropdownMenuItem 
                              onClick={() => {
                                const url = vendor.trackingUrlTemplate?.replace('{tracking_number}', shipment.trackingNumber);
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {language === 'en' ? 'Track Package' : 'প্যাকেজ ট্র্যাক'}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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

      {/* Form Dialog */}
      <ShipmentFormDialog
        shipment={isEditMode ? selectedShipment : null}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedShipment(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setSelectedShipment(null);
          refetch();
        }}
      />

      {/* Details Dialog */}
      <ShipmentDetailsDialog
        shipment={selectedShipment}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default Shipments;
