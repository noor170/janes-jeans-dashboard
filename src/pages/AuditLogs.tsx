import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  RefreshCw,
  User,
  ArrowRight,
  Calendar,
  Shield,
  UserPlus,
  UserMinus,
  Key,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { auditLogService } from '@/lib/auditLogService';
import { AuditAction, AuditLog } from '@/types/auditLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const actionIcons: Record<AuditAction, React.ComponentType<{ className?: string }>> = {
  USER_LOGIN: LogIn,
  USER_LOGOUT: LogOut,
  USER_CREATED: UserPlus,
  USER_UPDATED: Edit,
  USER_DELETED: Trash2,
  USER_ACTIVATED: CheckCircle,
  USER_DEACTIVATED: UserMinus,
  USER_ROLE_CHANGED: Shield,
  PASSWORD_RESET: Key,
  ADMIN_CREATED: Shield,
};

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', actionFilter, dateRange, page],
    queryFn: () => auditLogService.getAuditLogs({
      action: actionFilter === 'all' ? undefined : actionFilter,
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString(),
      page,
      limit: 20,
    }),
  });

  const filteredLogs = data?.logs.filter(log =>
    log.performedBy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetUser?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetUser?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getSeverityBadge = (action: AuditAction) => {
    const severity = auditLogService.getActionSeverity(action);
    const variants: Record<string, string> = {
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      warning: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      error: 'bg-red-500/10 text-red-500 border-red-500/30',
    };
    return (
      <Badge variant="outline" className={cn(variants[severity])}>
        {auditLogService.getActionLabel(action)}
      </Badge>
    );
  };

  const getActionIcon = (action: AuditAction) => {
    const IconComponent = actionIcons[action] || ClipboardList;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and monitor admin actions
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                {data?.total || 0} total events
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select 
                value={actionFilter} 
                onValueChange={(value) => setActionFilter(value as AuditAction | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="USER_LOGIN">Login</SelectItem>
                  <SelectItem value="USER_LOGOUT">Logout</SelectItem>
                  <SelectItem value="USER_CREATED">User Created</SelectItem>
                  <SelectItem value="USER_UPDATED">User Updated</SelectItem>
                  <SelectItem value="USER_DELETED">User Deleted</SelectItem>
                  <SelectItem value="USER_ACTIVATED">User Activated</SelectItem>
                  <SelectItem value="USER_DEACTIVATED">User Deactivated</SelectItem>
                  <SelectItem value="USER_ROLE_CHANGED">Role Changed</SelectItem>
                  <SelectItem value="PASSWORD_RESET">Password Reset</SelectItem>
                  <SelectItem value="ADMIN_CREATED">Admin Created</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                        </>
                      ) : (
                        format(dateRange.from, 'MMM d, yyyy')
                      )
                    ) : (
                      'Date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                  {(dateRange.from || dateRange.to) && (
                    <div className="p-2 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setDateRange({})}
                      >
                        Clear dates
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
              <p>No audit logs found</p>
              <p className="text-sm">Actions will appear here as they occur</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="p-2 rounded-full bg-muted">
                          {getActionIcon(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(log.action)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{log.performedBy.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.performedBy.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.targetUser ? (
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{log.targetUser.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {log.targetUser.email}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.details && Object.keys(log.details).length > 0 ? (
                          <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {Object.entries(log.details)
                              .filter(([key]) => key !== 'targetUser')
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(', ')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>{format(new Date(log.timestamp), 'MMM d, yyyy')}</div>
                        <div className="text-xs">{format(new Date(log.timestamp), 'h:mm a')}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
